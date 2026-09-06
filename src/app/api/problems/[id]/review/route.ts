import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()
    const { action, feedback } = body // 'verify' | 'publish' | 'reject' | 'request_changes' | 'unpublish'

    const problem = await prisma.problem.findUnique({
      where: { id: params.id },
      include: { location: true }
    })

    if (!problem) {
      return NextResponse.json({ success: false, error: 'Problem not found' }, { status: 404 })
    }

    let nextReviewStatus = problem.reviewStatus
    let nextProblemStatus = problem.status

    if (action === 'verify') {
      nextReviewStatus = 'VERIFIED'
    } else if (action === 'publish') {
      nextReviewStatus = 'PUBLISHED'
      if (nextProblemStatus === 'SUBMITTED') {
        nextProblemStatus = 'VERIFIED'
      }
    } else if (action === 'reject') {
      nextReviewStatus = 'REJECTED'
    } else if (action === 'request_changes') {
      nextReviewStatus = 'UNDER_REVIEW'
    } else if (action === 'unpublish') {
      nextReviewStatus = 'UNDER_REVIEW'
    }

    const updated = await prisma.problem.update({
      where: { id: params.id },
      data: {
        reviewStatus: nextReviewStatus,
        status: nextProblemStatus,
        adminFeedback: feedback || problem.adminFeedback,
      }
    })

    // Log action in audit trail
    await prisma.auditLog.create({
      data: {
        userId: session?.user ? (session.user as any).id : null,
        action: `CHALLENGE_${(action || 'REVIEW').toUpperCase()}`,
        entity: 'Problem',
        entityId: params.id,
        details: JSON.stringify({ previousStatus: problem.reviewStatus, newStatus: nextReviewStatus, feedback })
      }
    })

    // Notify submitter of review decision
    if (problem.submittedById) {
      await prisma.notification.create({
        data: {
          userId: problem.submittedById,
          title: `Challenge Status Updated: ${nextReviewStatus}`,
          message: `Your challenge "${problem.title}" status is now ${nextReviewStatus}.${feedback ? ` Feedback: ${feedback}` : ''}`,
          type: nextReviewStatus === 'PUBLISHED' || nextReviewStatus === 'VERIFIED' ? 'SUCCESS' : 'INFO',
          link: `/problems/${params.id}`,
        }
      }).catch((e) => console.warn('Notification create error:', e))
    }

    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    console.error('Review error:', error)
    return NextResponse.json({ success: false, error: 'Failed to update problem review status' }, { status: 500 })
  }
}
