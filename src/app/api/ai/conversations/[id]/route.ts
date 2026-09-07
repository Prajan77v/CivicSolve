import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    if (!conversation) {
      return NextResponse.json({ success: false, error: 'Conversation not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: {
        id: conversation.id,
        title: conversation.title,
        contextType: conversation.contextType,
        contextId: conversation.contextId,
        messages: conversation.messages.map((m) => {
          let metadata = null
          if (m.metadata) {
            try {
              metadata = JSON.parse(m.metadata)
            } catch {}
          }
          return {
            id: m.id,
            role: m.sender.toLowerCase(),
            content: m.content,
            metadata,
            createdAt: m.createdAt.toISOString(),
          }
        }),
      },
    })
  } catch (error: any) {
    console.error('Failed to fetch conversation messages:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch messages' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    await prisma.conversation.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Failed to delete conversation:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete conversation' }, { status: 500 })
  }
}
