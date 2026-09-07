import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { aiProvider, CivicAIChatMessage, CivicAIContext } from '@/lib/ai'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()
    const { messages = [], context, conversationId, stream = false } = body

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ success: false, error: 'Messages array is required' }, { status: 400 })
    }

    const lastUserMessage = [...messages].reverse().find((m: any) => m.role === 'user')

    // Find or create conversation in Prisma
    let activeConversationId = conversationId
    if (!activeConversationId) {
      const conv = await prisma.conversation.create({
        data: {
          userId: (session?.user as any)?.id || null,
          title: (lastUserMessage?.content || 'New Conversation').slice(0, 40),
          contextType: context?.pageType || 'GENERAL',
          contextId: context?.entityId || null,
        },
      })
      activeConversationId = conv.id
    }

    // Persist the user message
    if (lastUserMessage) {
      await prisma.conversationMessage.create({
        data: {
          conversationId: activeConversationId,
          sender: 'USER',
          content: lastUserMessage.content,
          context: context ? JSON.stringify(context) : null,
        },
      })
    }

    // Execute chat with provider
    const aiResult = await aiProvider.chat(messages, context)

    // Persist assistant message
    const savedMsg = await prisma.conversationMessage.create({
      data: {
        conversationId: activeConversationId,
        sender: 'ASSISTANT',
        content: aiResult.content,
        metadata: JSON.stringify(aiResult.metadata),
      },
    })

    // Update conversation updatedAt
    await prisma.conversation.update({
      where: { id: activeConversationId },
      data: { updatedAt: new Date() },
    })

    return NextResponse.json({
      success: true,
      data: {
        message: {
          id: savedMsg.id,
          role: 'assistant',
          content: aiResult.content,
          metadata: aiResult.metadata,
          createdAt: savedMsg.createdAt.toISOString(),
        },
        conversationId: activeConversationId,
      },
    })
  } catch (error: any) {
    console.error('AI chat endpoint error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Civic AI is temporarily unavailable. Please retry.',
      },
      { status: 500 }
    )
  }
}
