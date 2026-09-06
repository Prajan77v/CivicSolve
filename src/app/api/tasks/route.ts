import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    const status = searchParams.get('status')

    const where: any = {}
    if (projectId) where.projectId = projectId
    if (status) where.status = status

    const tasks = await prisma.task.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ data: tasks, success: true })
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tasks', success: false },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const { projectId, title, description, status = 'TODO', priority = 'MEDIUM', assigneeId, dueDate } = body

    if (!projectId || !title) {
      return NextResponse.json(
        { error: 'projectId and title are required', success: false },
        { status: 400 }
      )
    }

    const task = await prisma.task.create({
      data: {
        projectId,
        title: title.trim(),
        description: description ? description.trim() : null,
        status,
        priority,
        assigneeId: assigneeId || null,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    })

    return NextResponse.json({ data: task, success: true }, { status: 201 })
  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json(
      { error: 'Failed to create task', success: false },
      { status: 500 }
    )
  }
}
