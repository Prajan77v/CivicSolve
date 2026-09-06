import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: Request,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const { id } = await Promise.resolve(context.params)

    const milestones = await prisma.milestone.findMany({
      where: { projectId: id },
      orderBy: { order: 'asc' },
    })

    return NextResponse.json({ data: milestones, success: true })
  } catch (error) {
    console.error('Error fetching milestones:', error)
    return NextResponse.json(
      { error: 'Failed to fetch milestones', success: false },
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
    const {
      title,
      description,
      type = 'CUSTOM',
      dueDate,
      order,
      status = 'PENDING',
      completionPct = 0,
      evidence,
      reviewNotes,
    } = body

    if (!title) {
      return NextResponse.json(
        { error: 'Milestone title is required', success: false },
        { status: 400 }
      )
    }

    // Verify project exists
    const project = await prisma.project.findUnique({ where: { id } })
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found', success: false },
        { status: 404 }
      )
    }

    // Determine milestone order
    let milestoneOrder = order !== undefined ? parseInt(String(order), 10) : undefined
    if (milestoneOrder === undefined || isNaN(milestoneOrder)) {
      const maxOrder = await prisma.milestone.findFirst({
        where: { projectId: id },
        orderBy: { order: 'desc' },
        select: { order: true },
      })
      milestoneOrder = (maxOrder?.order || 0) + 1
    }

    const milestone = await prisma.milestone.create({
      data: {
        projectId: id,
        title,
        description: description || null,
        type,
        status,
        completionPct: Math.max(0, Math.min(100, parseInt(String(completionPct), 10) || 0)),
        order: milestoneOrder,
        dueDate: dueDate ? new Date(dueDate) : null,
        evidence: evidence || null,
        reviewNotes: reviewNotes || null,
      },
    })

    return NextResponse.json({ data: milestone, success: true }, { status: 201 })
  } catch (error) {
    console.error('Error creating milestone:', error)
    return NextResponse.json(
      { error: 'Failed to create milestone', success: false },
      { status: 500 }
    )
  }
}
