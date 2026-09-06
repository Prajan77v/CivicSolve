import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { aiProvider } from '@/lib/ai'

export async function POST(
  request: Request,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const { id } = await Promise.resolve(context.params)

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

    const aiResult = await aiProvider.analyzeProblem({
      title: problem.title,
      description: problem.description,
      category: problem.category,
      location: problem.location?.district
        ? `${problem.location.district}, ${problem.location.state || ''}`
        : problem.location?.address || undefined,
      affectedCount: problem.affectedCount || undefined,
    })

    const analysis = await prisma.problemAIAnalysis.upsert({
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

    // Update problem status to AI_ANALYZED if it was SUBMITTED
    const updatedProblem = await prisma.problem.update({
      where: { id },
      data: {
        status: problem.status === 'SUBMITTED' ? 'AI_ANALYZED' : problem.status,
      },
      include: {
        location: true,
        aiAnalysis: true,
        submittedBy: {
          select: { id: true, name: true, avatar: true },
        },
      },
    })

    return NextResponse.json({
      data: {
        problem: updatedProblem,
        analysis,
      },
      success: true,
    })
  } catch (error) {
    console.error('Error running AI analysis on problem:', error)
    return NextResponse.json(
      { error: 'Failed to run AI analysis', success: false },
      { status: 500 }
    )
  }
}
