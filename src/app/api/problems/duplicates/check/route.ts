import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { checkDuplicates } from '@/lib/duplicate-detector'

/**
 * POST /api/problems/duplicates/check
 * Pre-submission duplicate detection.
 * Body: { title, description, category, district?, state?, affectedCount? }
 * Returns: { isDuplicate, isRelated, score, topMatches }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const { title, description, category, district, state, affectedCount } = body

    if (!title || !description || !category) {
      return NextResponse.json(
        { error: 'title, description, and category are required', success: false },
        { status: 400 }
      )
    }

    // Fetch only canonical problems from the same or similar category
    const existingProblems = await prisma.problem.findMany({
      where: {
        isCanonical: true,
      },
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        affectedCount: true,
        location: {
          select: { district: true, state: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 200, // Cap for performance
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

    const result = checkDuplicates(
      { title, description, category, district, state, affectedCount },
      flattened
    )

    return NextResponse.json({
      success: true,
      isDuplicate: result.label === 'DUPLICATE',
      isRelated: result.label === 'RELATED',
      score: result.score,
      label: result.label,
      topMatches: result.topMatches,
    })
  } catch (error) {
    console.error('Duplicate check error:', error)
    return NextResponse.json(
      { error: 'Failed to run duplicate check', success: false },
      { status: 500 }
    )
  }
}
