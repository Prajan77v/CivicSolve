import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(
  request: Request,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const { id: problemId } = await Promise.resolve(context.params)
    const body = await request.json().catch(() => ({}))
    const { rating, comment, userName } = body

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Valid rating between 1 and 5 is required', success: false },
        { status: 400 }
      )
    }

    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
    })

    if (!problem) {
      return NextResponse.json(
        { error: 'Problem not found', success: false },
        { status: 404 }
      )
    }

    // Find default citizen user if not provided
    const user = await prisma.user.findFirst({
      where: { role: 'CITIZEN' },
    })

    const feedback = await prisma.communityFeedback.create({
      data: {
        problemId,
        rating: Number(rating),
        comment: comment?.trim() || null,
        userId: user?.id || null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    })

    return NextResponse.json({ data: feedback, success: true }, { status: 201 })
  } catch (error) {
    console.error('Error submitting feedback:', error)
    return NextResponse.json(
      { error: 'Failed to record feedback', success: false },
      { status: 500 }
    )
  }
}
