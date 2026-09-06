import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: Request,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const { id } = await Promise.resolve(context.params)

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        problem: {
          include: {
            location: true,
            aiAnalysis: true,
            submittedBy: {
              select: {
                id: true,
                name: true,
                avatar: true,
                email: true,
                role: true,
              },
            },
          },
        },
        team: {
          include: {
            members: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    avatar: true,
                    email: true,
                    role: true,
                  },
                },
              },
            },
            university: true,
            department: true,
          },
        },
        university: true,
        industryPartner: true,
        milestones: {
          orderBy: { order: 'asc' },
        },
        tasks: {
          orderBy: { createdAt: 'desc' },
        },
        deployments: {
          include: {
            impactMetrics: true,
          },
          orderBy: { deployedAt: 'desc' },
        },
        updates: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        mentorships: {
          include: {
            faculty: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    avatar: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
        fundingSupport: {
          include: {
            organization: true,
          },
        },
        proposals: {
          orderBy: { createdAt: 'desc' },
        },
        certificates: {
          include: {
            user: {
              select: { id: true, name: true, avatar: true },
            },
          },
        },
      },
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found', success: false },
        { status: 404 }
      )
    }

    return NextResponse.json({ data: project, success: true })
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json(
      { error: 'Failed to fetch project details', success: false },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const { id } = await Promise.resolve(context.params)
    const body = await request.json().catch(() => ({}))
    const {
      status,
      progressPercent,
      targetDate,
      completedAt,
      title,
      teamId,
      industryPartnerId,
    } = body

    const updateData: any = {}
    if (status !== undefined) updateData.status = status
    if (title !== undefined) updateData.title = title
    if (teamId !== undefined) updateData.teamId = teamId
    if (industryPartnerId !== undefined) updateData.industryPartnerId = industryPartnerId
    if (targetDate !== undefined) {
      updateData.targetDate = targetDate ? new Date(targetDate) : null
    }

    if (progressPercent !== undefined) {
      const pct = Math.max(0, Math.min(100, parseInt(String(progressPercent), 10)))
      updateData.progressPercent = pct
      if (pct === 100 && !completedAt) {
        updateData.completedAt = new Date()
        updateData.status = 'COMPLETED'
      }
    }

    if (completedAt !== undefined) {
      updateData.completedAt = completedAt ? new Date(completedAt) : null
    }

    const updated = await prisma.project.update({
      where: { id },
      data: updateData,
      include: {
        problem: { include: { location: true } },
        team: true,
        university: true,
        industryPartner: true,
        milestones: { orderBy: { order: 'asc' } },
      },
    })

    return NextResponse.json({ data: updated, success: true })
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json(
      { error: 'Failed to update project', success: false },
      { status: 500 }
    )
  }
}
