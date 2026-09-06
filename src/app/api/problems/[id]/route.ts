import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: Request,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const { id } = await Promise.resolve(context.params)

    const problem = await prisma.problem.findUnique({
      where: { id },
      include: {
        location: true,
        evidence: true,
        aiAnalysis: true,
        challengeGroup: true,
        projects: {
          include: {
            team: true,
            milestones: {
              orderBy: { order: 'asc' },
            },
          },
        },
        feedback: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        submittedBy: {
          select: {
            id: true,
            name: true,
            avatar: true,
            email: true,
            role: true,
          },
        },
      },
    })

    if (!problem) {
      return NextResponse.json(
        { error: 'Problem not found', success: false },
        { status: 404 }
      )
    }

    return NextResponse.json({ data: problem, success: true })
  } catch (error) {
    console.error('Error fetching problem details:', error)
    return NextResponse.json(
      { error: 'Failed to fetch problem', success: false },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const { id } = await Promise.resolve(context.params)
    const body = await request.json().catch(() => ({}))
    const {
      status,
      priority,
      title,
      description,
      category,
      subcategory,
      affectedCount,
      urgencyNote,
      tags,
      sdgGoals,
    } = body

    const updateData: any = {}
    if (status !== undefined) updateData.status = status
    if (priority !== undefined) updateData.priority = priority
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (category !== undefined) updateData.category = category
    if (subcategory !== undefined) updateData.subcategory = subcategory
    if (affectedCount !== undefined) {
      updateData.affectedCount = affectedCount ? parseInt(String(affectedCount), 10) : null
    }
    if (urgencyNote !== undefined) updateData.urgencyNote = urgencyNote
    if (tags !== undefined) {
      updateData.tags = Array.isArray(tags) ? JSON.stringify(tags) : String(tags)
    }
    if (sdgGoals !== undefined) {
      updateData.sdgGoals = Array.isArray(sdgGoals) ? JSON.stringify(sdgGoals) : String(sdgGoals)
    }

    const updated = await prisma.problem.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json({ data: updated, success: true })
  } catch (error) {
    console.error('Error updating problem:', error)
    return NextResponse.json(
      { error: 'Failed to update problem', success: false },
      { status: 500 }
    )
  }
}
