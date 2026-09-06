import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const teamId = searchParams.get('teamId')
    const universityId = searchParams.get('universityId')
    const problemId = searchParams.get('problemId')
    const q = searchParams.get('q')

    const where: any = {}

    const stage = searchParams.get('stage') || status

    if (stage && stage.toUpperCase() !== 'ALL') {
      const upperStage = stage.toUpperCase()
      if (upperStage === 'ACTIVE') {
        where.status = { not: 'COMPLETED' }
      } else {
        where.status = upperStage
      }
    }

    if (teamId) {
      where.teamId = teamId
    }
    if (universityId) {
      where.universityId = universityId
    }
    if (problemId) {
      where.problemId = problemId
    }
    if (q && q.trim()) {
      where.OR = [
        { title: { contains: q.trim() } },
        { problem: { title: { contains: q.trim() } } },
      ]
    }

    const projects = await prisma.project.findMany({
      where,
      include: {
        problem: {
          include: {
            location: true,
          },
        },
        team: {
          include: {
            _count: {
              select: { members: true },
            },
          },
        },
        university: true,
        industryPartner: true,
        fundingSupport: {
          include: {
            organization: true,
          },
        },
        _count: {
          select: {
            milestones: true,
            tasks: true,
            deployments: true,
            updates: true,
          },
        },
        milestones: {
          select: {
            id: true,
            title: true,
            status: true,
            completionPct: true,
            order: true,
          },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ data: projects, success: true })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects', success: false },
      { status: 500 }
    )
  }
}
