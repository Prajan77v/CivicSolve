import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { aiProvider } from '@/lib/ai'

function safeJsonParse<T>(val: string | null | undefined, fallback: T): T {
  if (!val) return fallback
  try {
    return JSON.parse(val)
  } catch {
    return fallback
  }
}

export async function GET(
  request: Request,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const { id } = await Promise.resolve(context.params)

    let problem = await prisma.problem.findUnique({
      where: { id },
      include: {
        location: true,
        aiAnalysis: true,
      },
    })

    if (!problem) {
      return NextResponse.json(
        { error: 'Problem not found', success: false },
        { status: 404 }
      )
    }

    // If analysis does not exist yet, trigger it now
    if (!problem.aiAnalysis) {
      const aiResult = await aiProvider.analyzeProblem({
        title: problem.title,
        description: problem.description,
        category: problem.category,
        location: problem.location?.district || problem.location?.address || undefined,
        affectedCount: problem.affectedCount || undefined,
      })

      const newAnalysis = await prisma.problemAIAnalysis.create({
        data: {
          problemId: id,
          domain: aiResult.domain,
          subdomain: aiResult.subdomain || null,
          confidence: aiResult.confidence,
          priorityScore: aiResult.priorityScore,
          priorityReason: aiResult.priorityReason,
          affectedEstimate: aiResult.affectedEstimate || problem.affectedCount,
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

      problem = {
        ...problem,
        aiAnalysis: newAnalysis,
      }
    }

    const ai = problem.aiAnalysis!
    const matchedUniversities = safeJsonParse(ai.matchedUniversities, [])
    const matchedTeams = safeJsonParse(ai.matchedTeams, [])
    const matchedIndustry = safeJsonParse(ai.matchedIndustry, [])
    const recommendedSkills = safeJsonParse(ai.recommendedSkills, [])
    const detectedTech = safeJsonParse(ai.detectedTech, [])

    // Also enrich with actual database teams & universities if available
    const dbTeams = await prisma.team.findMany({
      take: 5,
      include: {
        university: { select: { id: true, name: true, city: true, state: true } },
      },
    })

    const dbUniversities = await prisma.university.findMany({
      take: 5,
      include: {
        departments: true,
      },
    })

    const dbOrganizations = await prisma.organization.findMany({
      take: 5,
    })

    return NextResponse.json({
      data: {
        problemId: id,
        domain: ai.domain,
        subdomain: ai.subdomain,
        confidence: ai.confidence,
        matchedUniversities,
        matchedTeams,
        matchedIndustry,
        recommendedSkills,
        detectedTech,
        availableDbTeams: dbTeams,
        availableDbUniversities: dbUniversities,
        availableDbOrganizations: dbOrganizations,
      },
      success: true,
    })
  } catch (error) {
    console.error('Error fetching problem matches:', error)
    return NextResponse.json(
      { error: 'Failed to fetch matches', success: false },
      { status: 500 }
    )
  }
}

export async function POST(
  request: Request,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const { id } = await Promise.resolve(context.params)
    const body = await request.json().catch(() => ({}))

    const problem = await prisma.problem.findUnique({
      where: { id },
      include: { location: true },
    })

    if (!problem) {
      return NextResponse.json(
        { error: 'Problem not found', success: false },
        { status: 404 }
      )
    }

    // Re-run AI analysis with any override context
    const aiResult = await aiProvider.analyzeProblem({
      title: body.title || problem.title,
      description: body.description || problem.description,
      category: body.category || problem.category,
      location: body.location || problem.location?.district || problem.location?.address || undefined,
      affectedCount: body.affectedCount || problem.affectedCount || undefined,
    })

    const updatedAnalysis = await prisma.problemAIAnalysis.upsert({
      where: { problemId: id },
      create: {
        problemId: id,
        domain: aiResult.domain,
        subdomain: aiResult.subdomain || null,
        confidence: aiResult.confidence,
        priorityScore: aiResult.priorityScore,
        priorityReason: aiResult.priorityReason,
        affectedEstimate: aiResult.affectedEstimate || problem.affectedCount,
        duplicateRisk: aiResult.duplicateRisk,
        detectedTech: JSON.stringify(aiResult.detectedTech || []),
        recommendedSkills: JSON.stringify(aiResult.recommendedSkills || []),
        sdgAlignment: JSON.stringify(aiResult.sdgAlignment || []),
        matchedUniversities: JSON.stringify(aiResult.matchedUniversities || []),
        matchedTeams: JSON.stringify(aiResult.matchedTeams || []),
        matchedIndustry: JSON.stringify(aiResult.matchedIndustry || []),
        nextSteps: JSON.stringify(aiResult.nextSteps || []),
      },
      update: {
        domain: aiResult.domain,
        subdomain: aiResult.subdomain || null,
        confidence: aiResult.confidence,
        priorityScore: aiResult.priorityScore,
        priorityReason: aiResult.priorityReason,
        affectedEstimate: aiResult.affectedEstimate || problem.affectedCount,
        duplicateRisk: aiResult.duplicateRisk,
        detectedTech: JSON.stringify(aiResult.detectedTech || []),
        recommendedSkills: JSON.stringify(aiResult.recommendedSkills || []),
        sdgAlignment: JSON.stringify(aiResult.sdgAlignment || []),
        matchedUniversities: JSON.stringify(aiResult.matchedUniversities || []),
        matchedTeams: JSON.stringify(aiResult.matchedTeams || []),
        matchedIndustry: JSON.stringify(aiResult.matchedIndustry || []),
        nextSteps: JSON.stringify(aiResult.nextSteps || []),
        processedAt: new Date(),
      },
    })

    return NextResponse.json({
      data: {
        matchedUniversities: aiResult.matchedUniversities,
        matchedTeams: aiResult.matchedTeams,
        matchedIndustry: aiResult.matchedIndustry,
        recommendedSkills: aiResult.recommendedSkills,
        detectedTech: aiResult.detectedTech,
        analysis: updatedAnalysis,
      },
      success: true,
    })
  } catch (error) {
    console.error('Error generating matches:', error)
    return NextResponse.json(
      { error: 'Failed to generate matches', success: false },
      { status: 500 }
    )
  }
}
