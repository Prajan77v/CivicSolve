import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const messages = await prisma.message.findMany({
      where: { projectId: params.id },
      include: {
        sender: {
          select: { id: true, name: true, role: true, avatar: true, email: true }
        }
      },
      orderBy: { createdAt: 'asc' }
    })

    return NextResponse.json({ success: true, data: messages })
  } catch (error) {
    console.error('Fetch chat error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch project chat messages' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()
    const { content } = body

    if (!content || !content.trim()) {
      return NextResponse.json({ success: false, error: 'Message content cannot be empty' }, { status: 400 })
    }

    let senderId = session?.user ? (session.user as any).id : null
    if (!senderId) {
      const defaultUser = await prisma.user.findFirst({ where: { role: 'STUDENT' } })
      senderId = defaultUser?.id || null
    }

    if (!senderId) {
      return NextResponse.json({ success: false, error: 'Sender required' }, { status: 401 })
    }

    const message = await prisma.message.create({
      data: {
        projectId: params.id,
        senderId,
        content: content.trim()
      },
      include: {
        sender: {
          select: { id: true, name: true, role: true, avatar: true, email: true }
        }
      }
    })

    return NextResponse.json({ success: true, data: message })
  } catch (error) {
    console.error('Send message error:', error)
    return NextResponse.json({ success: false, error: 'Failed to send message' }, { status: 500 })
  }
}
