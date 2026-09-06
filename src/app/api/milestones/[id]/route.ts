import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PATCH(
  request: Request,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const { id } = await Promise.resolve(context.params)
    const body = await request.json().catch(() => ({}))
    const { status, completionPct, reviewNotes, evidence, completedAt, title, description } = body

    const existing = await prisma.milestone.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Milestone not found', success: false },
        { status: 404 }
      )
    }

    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (reviewNotes !== undefined) updateData.reviewNotes = reviewNotes
    if (evidence !== undefined) updateData.evidence = evidence

    if (status !== undefined) {
      updateData.status = status
      if (status === 'COMPLETED' && completionPct === undefined) {
        updateData.completionPct = 100
        updateData.completedAt = new Date()
      }
    }

    if (completionPct !== undefined) {
      const pct = Math.max(0, Math.min(100, parseInt(String(completionPct), 10)))
      updateData.completionPct = pct
      if (pct === 100) {
        updateData.status = 'COMPLETED'
        updateData.completedAt = new Date()
      }
    }

    if (completedAt !== undefined) {
      updateData.completedAt = completedAt ? new Date(completedAt) : null
    }

    const updatedMilestone = await prisma.milestone.update({
      where: { id },
      data: updateData,
    })

    // Automatically re-compute project progressPercent
    const allMilestones = await prisma.milestone.findMany({
      where: { projectId: existing.projectId },
    })

    if (allMilestones.length > 0) {
      const totalPct = allMilestones.reduce((sum, m) => sum + (m.completionPct || 0), 0)
      const avgPct = Math.round(totalPct / allMilestones.length)
      await prisma.project.update({
        where: { id: existing.projectId },
        data: {
          progressPercent: avgPct,
          ...(avgPct === 100 ? { status: 'COMPLETED', completedAt: new Date() } : {}),
        },
      })
    }

    return NextResponse.json({ data: updatedMilestone, success: true })
  } catch (error) {
    console.error('Error updating milestone:', error)
    return NextResponse.json(
      { error: 'Failed to update milestone', success: false },
      { status: 500 }
    )
  }
}
