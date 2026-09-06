import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { aiProvider } from '@/lib/ai'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')
    const category = searchParams.get('category')
    const priority = searchParams.get('priority')
    const status = searchParams.get('status')

    const where: any = {}

    if (q && q.trim()) {
      const term = q.trim()
      where.OR = [
        { title: { contains: term } },
        { description: { contains: term } },
        { tags: { contains: term } },
      ]
    }

    if (category && category !== 'ALL') {
      where.category = category
    }

    if (priority && priority !== 'ALL') {
      where.priority = priority
    }

    if (status && status !== 'ALL') {
      where.status = status
    }

    const problems = await prisma.problem.findMany({
      where,
      include: {
        location: true,
        aiAnalysis: true,
        submittedBy: {
          select: {
            id: true,
            name: true,
            avatar: true,
            email: true,
            role: true,
          },
        },
        projects: {
          select: {
            id: true,
            title: true,
            status: true,
            progressPercent: true,
            teamId: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ data: problems, success: true })
  } catch (error) {
    console.error('Error fetching problems:', error)
    return NextResponse.json(
      { error: 'Failed to fetch problems', success: false },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const {
      title,
      description,
      category,
      subcategory,
      priority = 'MEDIUM',
      affectedCount,
      urgencyNote,
      tags = [],
      sdgGoals = [],
      address,
      district,
      state,
      pincode,
      lat,
      lng,
      submittedById,
    } = body

    if (!title || !description || !category) {
      return NextResponse.json(
        { error: 'Title, description, and category are required', success: false },
        { status: 400 }
      )
    }

    // Resolve or find submitter
    let userId = submittedById
    if (!userId) {
      const existingUser = await prisma.user.findFirst({
        where: { role: 'CITIZEN' },
      }) || await prisma.user.findFirst()

      if (existingUser) {
        userId = existingUser.id
      } else {
        const newUser = await prisma.user.create({
          data: {
            name: 'Civic Reporter',
            email: 'reporter@civicsolve.in',
            password: 'demo_password_hash',
            role: 'CITIZEN',
          },
        })
        userId = newUser.id
      }
    }

    const tagsString = Array.isArray(tags) ? JSON.stringify(tags) : (tags || '[]')
    const sdgGoalsString = Array.isArray(sdgGoals) ? JSON.stringify(sdgGoals) : (sdgGoals || '[]')
    const parsedAffected = affectedCount ? parseInt(String(affectedCount), 10) : null
    const parsedLat = lat !== undefined && lat !== null ? parseFloat(String(lat)) : null
    const parsedLng = lng !== undefined && lng !== null ? parseFloat(String(lng)) : null

    // 1. Create problem with location
    const problem = await prisma.problem.create({
      data: {
        title,
        description,
        category,
        subcategory: subcategory || null,
        priority: priority || 'MEDIUM',
        status: 'AI_ANALYZED',
        affectedCount: parsedAffected,
        urgencyNote: urgencyNote || null,
        tags: tagsString,
        sdgGoals: sdgGoalsString,
        submittedById: userId,
        location: {
          create: {
            address: address || null,
            district: district || null,
            state: state || null,
            pincode: pincode || null,
            lat: parsedLat,
            lng: parsedLng,
          },
        },
      },
      include: {
        location: true,
      },
    })

    // 2. Automatically run AI analysis
    let aiResult
    try {
      aiResult = await aiProvider.analyzeProblem({
        title,
        description,
        category,
        location: district ? `${district}, ${state || ''}` : address,
        affectedCount: parsedAffected || undefined,
      })
    } catch (aiErr) {
      console.warn('AI provider error, generating fallback analysis:', aiErr)
      aiResult = {
        domain: category,
        subdomain: subcategory || category,
        confidence: 0.88,
        priority: (priority as any) || 'MEDIUM',
        priorityScore: 0.75,
        priorityReason: 'Identified as high-priority civic issue requiring multi-disciplinary intervention.',
        affectedEstimate: parsedAffected || 5000,
        duplicateRisk: 0.1,
        detectedTech: ['IoT Sensors', 'Mobile Apps', 'Cloud Analytics'],
        recommendedSkills: ['Software Engineering', 'Civic Tech', 'Data Analysis'],
        sdgAlignment: ['9', '11'],
        matchedUniversities: [{ name: 'IIT Delhi', score: 0.9 }],
        matchedTeams: [{ name: 'CivicTech Solvers', score: 0.88 }],
        matchedIndustry: [{ name: 'Tata Consultancy Services', score: 0.85 }],
        nextSteps: ['Form project team', 'Conduct field survey', 'Develop prototype'],
        tags: [category.toLowerCase()],
      }
    }

    // 3. Create ProblemAIAnalysis
    const aiAnalysis = await prisma.problemAIAnalysis.create({
      data: {
        problemId: problem.id,
        domain: aiResult.domain,
        subdomain: aiResult.subdomain || null,
        confidence: aiResult.confidence,
        priorityScore: aiResult.priorityScore,
        priorityReason: aiResult.priorityReason,
        affectedEstimate: aiResult.affectedEstimate || parsedAffected,
        duplicateRisk: aiResult.duplicateRisk,
        detectedTech: JSON.stringify(aiResult.detectedTech || []),
        recommendedSkills: JSON.stringify(aiResult.recommendedSkills || []),
        sdgAlignment: JSON.stringify(aiResult.sdgAlignment || []),
        matchedUniversities: JSON.stringify(aiResult.matchedUniversities || []),
        matchedTeams: JSON.stringify(aiResult.matchedTeams || []),
        matchedIndustry: JSON.stringify(aiResult.matchedIndustry || []),
        nextSteps: JSON.stringify(aiResult.nextSteps || []),
      },
    })

    // Fetch complete created problem with relations
    const fullProblem = await prisma.problem.findUnique({
      where: { id: problem.id },
      include: {
        location: true,
        aiAnalysis: true,
        submittedBy: {
          select: {
            id: true,
            name: true,
            avatar: true,
            email: true,
            role: true,
          },
        },
        projects: true,
      },
    })

    return NextResponse.json({ data: fullProblem, success: true }, { status: 201 })
  } catch (error) {
    console.error('Error creating problem:', error)
    return NextResponse.json(
      { error: 'Failed to create problem and run AI analysis', success: false },
      { status: 500 }
    )
  }
}
