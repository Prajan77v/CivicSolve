import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PATCH(
  request: Request,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const { id } = await Promise.resolve(context.params)
    const body = await request.json().catch(() => ({}))
    const { title, description, status, priority, assigneeId, dueDate } = body

    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (status !== undefined) updateData.status = status
    if (priority !== undefined) updateData.priority = priority
    if (assigneeId !== undefined) updateData.assigneeId = assigneeId
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null

    const task = await prisma.task.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ data: task, success: true })
  } catch (error) {
    console.error('Error updating task:', error)
    return NextResponse.json(
      { error: 'Failed to update task', success: false },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const { id } = await Promise.resolve(context.params)
    await prisma.task.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Task deleted successfully', success: true })
  } catch (error) {
    console.error('Error deleting task:', error)
    return NextResponse.json(
      { error: 'Failed to delete task', success: false },
      { status: 500 }
    )
  }
}
