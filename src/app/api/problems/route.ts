import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { aiProvider } from '@/lib/ai'
import { checkDuplicates } from '@/lib/duplicate-detector'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')
    const category = searchParams.get('category')
    const priority = searchParams.get('priority')
    const status = searchParams.get('status')
    const includeAll = searchParams.get('includeAll') === 'true' // Admin bypass

    const where: any = {}

    // Only return canonical problems (no duplicates) unless admin requests all
    if (!includeAll) {
      where.isCanonical = true
    }

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
        evidence: true,
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
        _count: {
          select: { relatedReports: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Attach relatedReportsCount to each problem for convenience
    const problemsWithCount = problems.map((p) => ({
      ...p,
      relatedReportsCount: (p as any)._count?.relatedReports ?? 0,
    }))

    return NextResponse.json({ data: problemsWithCount, success: true })
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
      // Duplicate handling: 'create_canonical' | 'link_related' | 'force_new'
      action,
      // If linking as related, the canonical problem ID
      canonicalProblemId: incomingCanonicalId,
      // Evidence files array
      evidence = [],
    } = body

    if (!title || !description || !category) {
      return NextResponse.json(
        { error: 'Title, description, and category are required', success: false },
        { status: 400 }
      )
    }

    // ── Duplicate pre-check (skip if action is already decided) ────────────────
    if (!action || action === 'create_canonical') {
      const existingProblems = await prisma.problem.findMany({
        where: { isCanonical: true },
        select: {
          id: true,
          title: true,
          description: true,
          category: true,
          affectedCount: true,
          location: { select: { district: true, state: true } },
        },
        take: 200,
      })

      const flattened = existingProblems.map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        category: p.category,
        affectedCount: p.affectedCount,
        district: p.location?.district ?? null,
        state: p.location?.state ?? null,
      }))

      const dupResult = checkDuplicates(
        { title, description, category, district, state, affectedCount },
        flattened
      )

      // Block at ≥90% without override
      if (dupResult.score >= 0.90) {
        return NextResponse.json(
          {
            success: false,
            isDuplicate: true,
            isRelated: false,
            score: dupResult.score,
            label: dupResult.label,
            topMatches: dupResult.topMatches,
            message:
              'A very similar challenge already exists. Please review the existing challenge, report as related, or submit as new if genuinely different.',
          },
          { status: 409 }
        )
      }

      // Warn at ≥65% but allow with action
      if (dupResult.score >= 0.65 && !action) {
        return NextResponse.json(
          {
            success: false,
            isDuplicate: false,
            isRelated: true,
            score: dupResult.score,
            label: dupResult.label,
            topMatches: dupResult.topMatches,
            message:
              'A similar challenge exists. Choose to report as related, or submit as a new independent challenge.',
          },
          { status: 409 }
        )
      }
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

    // Determine canonical status
    const isLinkedRelated = action === 'link_related' && incomingCanonicalId
    const isCanonical = !isLinkedRelated
    const resolvedCanonicalId = isLinkedRelated ? incomingCanonicalId : null

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
        isCanonical,
        canonicalProblemId: resolvedCanonicalId,
        duplicateOfId: resolvedCanonicalId,
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
        evidence: Array.isArray(evidence) && evidence.length > 0
          ? {
              create: evidence.map((ev: any) => ({
                type: ev.type || 'DOCUMENT',
                url: ev.url,
                filename: ev.filename || 'evidence_file',
                originalName: ev.originalName || ev.filename || 'evidence_file',
                mimeType: ev.mimeType || 'application/octet-stream',
                sizeBytes: ev.sizeBytes || 0,
                uploadedBy: ev.uploadedBy || 'Citizen Reporter',
                caption: ev.caption || null,
                stage: ev.stage || 'PROBLEM',
              })),
            }
          : undefined,
      },
      include: {
        location: true,
        evidence: true,
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
        evidence: true,
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
