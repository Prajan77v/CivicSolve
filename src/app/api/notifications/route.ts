import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const unreadOnly = searchParams.get('unreadOnly') === 'true'

    const where: any = {}
    if (userId) {
      where.userId = userId
    }
    if (unreadOnly) {
      where.read = false
    }

    const [notifications, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),
      prisma.notification.count({
        where: {
          ...(userId ? { userId } : {}),
          read: false,
        },
      }),
    ])

    return NextResponse.json({
      data: {
        notifications,
        unreadCount,
      },
      success: true,
    })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notifications', success: false },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const { userId, title, message, type = 'INFO', link } = body

    if (!userId || !title || !message) {
      return NextResponse.json(
        { error: 'userId, title, and message are required', success: false },
        { status: 400 }
      )
    }

    const notification = await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
        link: link || null,
        read: false,
      },
    })

    return NextResponse.json({ data: notification, success: true }, { status: 201 })
  } catch (error) {
    console.error('Error creating notification:', error)
    return NextResponse.json(
      { error: 'Failed to create notification', success: false },
      { status: 500 }
    )
  }
}
