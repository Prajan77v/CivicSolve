import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PATCH(
  request: Request,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const { id } = await Promise.resolve(context.params)

    const notification = await prisma.notification.findUnique({
      where: { id },
    })

    if (!notification) {
      return NextResponse.json(
        { error: 'Notification not found', success: false },
        { status: 404 }
      )
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: { read: true },
    })

    return NextResponse.json({ data: updated, success: true })
  } catch (error) {
    console.error('Error marking notification as read:', error)
    return NextResponse.json(
      { error: 'Failed to update notification', success: false },
      { status: 500 }
    )
  }
}
