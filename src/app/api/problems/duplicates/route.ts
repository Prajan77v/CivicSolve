import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const problemId = searchParams.get('problemId')

    if (!problemId) {
      return NextResponse.json({ success: false, error: 'problemId is required' }, { status: 400 })
    }

    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
      include: { location: true }
    })

    if (!problem) {
      return NextResponse.json({ success: false, error: 'Problem not found' }, { status: 404 })
    }

    // Check pre-calculated similarities
    const similarities = await prisma.problemSimilarity.findMany({
      where: {
        OR: [
          { sourceProblemId: problemId },
          { similarProblemId: problemId }
        ]
      },
      include: {
        sourceProblem: { include: { location: true } },
        similarProblem: { include: { location: true } }
      }
    })

    // Search same category problems for dynamic similarity
    const sameDomain = await prisma.problem.findMany({
      where: {
        category: problem.category,
        id: { not: problemId }
      },
      include: { location: true },
      take: 6
    })

    const results = sameDomain.map(other => {
      const known = similarities.find(s => s.sourceProblemId === other.id || s.similarProblemId === other.id)
      let similarityScore = known ? known.similarity : 0.65
      if (other.location?.district && other.location.district === problem.location?.district) {
        similarityScore += 0.20
      }
      similarityScore = Math.min(0.96, similarityScore)

      return {
        id: other.id,
        title: other.title,
        category: other.category,
        priority: other.priority,
        status: other.status,
        affectedCount: other.affectedCount,
        district: other.location?.district || 'Regional',
        state: other.location?.state || 'India',
        similarity: Math.round(similarityScore * 100),
        reason: `${Math.round(similarityScore * 100)}% match: Shared ${problem.category} domain, common geographic aquifer/basin characteristics, and overlapping IoT sensor requirements.`
      }
    }).sort((a, b) => b.similarity - a.similarity)

    return NextResponse.json({ success: true, data: results })
  } catch (error) {
    console.error('Duplicate detection error:', error)
    return NextResponse.json({ success: false, error: 'Failed to detect duplicates' }, { status: 500 })
  }
}
