import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PATCH(
  request: Request,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const { id } = await Promise.resolve(context.params)
    const body = await request.json().catch(() => ({}))
    const { status, reviewNotes, reviewedById } = body

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required (APPROVED, CHANGES_REQUESTED, REJECTED)', success: false },
        { status: 400 }
      )
    }

    const proposal = await prisma.proposal.findUnique({
      where: { id },
      include: {
        project: {
          include: { problem: true },
        },
      },
    })

    if (!proposal) {
      return NextResponse.json(
        { error: 'Proposal not found', success: false },
        { status: 404 }
      )
    }

    const updated = await prisma.proposal.update({
      where: { id },
      data: {
        status,
        reviewNotes: reviewNotes !== undefined ? reviewNotes : proposal.reviewNotes,
        reviewedById: reviewedById || null,
        reviewedAt: new Date(),
      },
      include: {
        project: {
          include: {
            problem: true,
            team: true,
          },
        },
      },
    })

    // If APPROVED, advance milestone and problem status
    if (status === 'APPROVED' && proposal.projectId) {
      // 1. Mark Proposal milestone completed
      const proposalMilestone = await prisma.milestone.findFirst({
        where: { projectId: proposal.projectId, type: 'PROPOSAL' },
      })
      if (proposalMilestone) {
        await prisma.milestone.update({
          where: { id: proposalMilestone.id },
          data: {
            status: 'COMPLETED',
            completionPct: 100,
            completedAt: new Date(),
            reviewNotes: reviewNotes || 'Proposal formally approved by reviewing committee',
          },
        })
      }

      // 2. Advance prototype milestone to IN_PROGRESS
      const prototypeMilestone = await prisma.milestone.findFirst({
        where: { projectId: proposal.projectId, type: 'PROTOTYPE' },
      })
      if (prototypeMilestone && prototypeMilestone.status === 'PENDING') {
        await prisma.milestone.update({
          where: { id: prototypeMilestone.id },
          data: { status: 'IN_PROGRESS', completionPct: 15 },
        })
      }

      // 3. Update problem status to PROTOTYPE
      if (proposal.project?.problemId) {
        await prisma.problem.update({
          where: { id: proposal.project.problemId },
          data: { status: 'PROTOTYPE' },
        })
      }

      // 4. Update project progress
      await prisma.project.update({
        where: { id: proposal.projectId },
        data: { progressPercent: 45 },
      })
    }

    return NextResponse.json({ data: updated, success: true })
  } catch (error) {
    console.error('Error reviewing proposal:', error)
    return NextResponse.json(
      { error: 'Failed to review proposal', success: false },
      { status: 500 }
    )
  }
}
