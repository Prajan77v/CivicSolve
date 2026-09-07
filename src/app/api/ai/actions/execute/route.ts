import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { civicAITools } from '@/lib/ai'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { actionType, params, messageId } = body

    if (!actionType || !params) {
      return NextResponse.json({ success: false, error: 'Action type and params are required' }, { status: 400 })
    }

    if (actionType === 'CREATE_TASK') {
      const result = await civicAITools.executeCreateTask({
        projectId: params.projectId,
        title: params.title,
        description: params.description,
        priority: params.priority,
        assigneeId: params.assigneeId,
      })

      if (!result.success) {
        return NextResponse.json({ success: false, error: result.error }, { status: 500 })
      }

      // If messageId provided, update metadata in conversationMessage to status: 'EXECUTED'
      if (messageId) {
        try {
          const msg = await prisma.conversationMessage.findUnique({ where: { id: messageId } })
          if (msg && msg.metadata) {
            const meta = JSON.parse(msg.metadata)
            if (meta.action) {
              meta.action.status = 'EXECUTED'
              meta.action.executedResult = `Task created successfully with ID #${result.task.id.slice(0, 8)}.`
              await prisma.conversationMessage.update({
                where: { id: messageId },
                data: { metadata: JSON.stringify(meta) },
              })
            }
          }
        } catch (e) {
          console.warn('Failed to update message metadata with executed status:', e)
        }
      }

      return NextResponse.json({
        success: true,
        data: {
          message: 'Task created successfully and added to project workspace.',
          task: result.task,
        },
      })
    }

    return NextResponse.json({ success: false, error: `Unsupported action type: ${actionType}` }, { status: 400 })
  } catch (error: any) {
    console.error('Failed to execute AI action:', error)
    return NextResponse.json({ success: false, error: error.message || 'Action execution failed' }, { status: 500 })
  }
}
