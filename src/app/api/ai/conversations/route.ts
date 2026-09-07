import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const userId = (session?.user as any)?.id

    const where: any = {}
    if (userId) {
      where.OR = [{ userId }, { userId: null }]
    }

    const conversations = await prisma.conversation.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      take: 20,
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        _count: { select: { messages: true } },
      },
    })

    return NextResponse.json({
      success: true,
      data: conversations.map((c) => ({
        id: c.id,
        title: c.title,
        contextType: c.contextType,
        contextId: c.contextId,
        messageCount: c._count.messages,
        lastMessage: c.messages[0]?.content || '',
        createdAt: c.createdAt.toISOString(),
        updatedAt: c.updatedAt.toISOString(),
      })),
    })
  } catch (error: any) {
    console.error('Failed to fetch conversations:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch conversations' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()
    const { title = 'New Conversation', contextType, contextId } = body

    const conversation = await prisma.conversation.create({
      data: {
        userId: (session?.user as any)?.id || null,
        title,
        contextType: contextType || 'GENERAL',
        contextId: contextId || null,
      },
    })

    return NextResponse.json({ success: true, data: conversation })
  } catch (error: any) {
    console.error('Failed to create conversation:', error)
    return NextResponse.json({ success: false, error: 'Failed to create conversation' }, { status: 500 })
  }
}
