import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    const status = searchParams.get('status')

    const where: any = {}
    if (projectId) where.projectId = projectId
    if (status) where.status = status

    const proposals = await prisma.proposal.findMany({
      where,
      include: {
        project: {
          include: {
            problem: { select: { id: true, title: true, category: true } },
            team: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ data: proposals, success: true })
  } catch (error) {
    console.error('Error fetching proposals:', error)
    return NextResponse.json(
      { error: 'Failed to fetch proposals', success: false },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const {
      projectId,
      title,
      understanding,
      solution,
      technology = '[]',
      implementationPlan = '',
      estimatedCost,
      expectedImpact = '',
      timeline = '',
      teamMembers = '[]',
      status = 'SUBMITTED',
    } = body

    if (!projectId || !title || !understanding || !solution) {
      return NextResponse.json(
        {
          error: 'projectId, title, understanding, and solution are required',
          success: false,
        },
        { status: 400 }
      )
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { problem: true },
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found', success: false },
        { status: 404 }
      )
    }

    const technologyStr = Array.isArray(technology)
      ? JSON.stringify(technology)
      : String(technology || '')

    const teamMembersStr = Array.isArray(teamMembers)
      ? JSON.stringify(teamMembers)
      : String(teamMembers || '')

    const parsedCost = estimatedCost !== undefined && estimatedCost !== null
      ? parseFloat(String(estimatedCost))
      : null

    const proposal = await prisma.proposal.create({
      data: {
        projectId,
        title,
        understanding,
        solution,
        technology: technologyStr,
        implementationPlan,
        estimatedCost: parsedCost,
        expectedImpact,
        timeline,
        teamMembers: teamMembersStr,
        status,
      },
      include: {
        project: {
          include: {
            problem: true,
            team: true,
          },
        },
      },
    })

    // Advance problem status to PROPOSAL if currently TEAM_FORMED
    if (project.problem && project.problem.status === 'TEAM_FORMED') {
      await prisma.problem.update({
        where: { id: project.problemId },
        data: { status: 'PROPOSAL' },
      })
    }

    // Advance Milestone for Proposal to IN_PROGRESS
    const proposalMilestone = await prisma.milestone.findFirst({
      where: {
        projectId,
        type: 'PROPOSAL',
      },
    })
    if (proposalMilestone && proposalMilestone.status === 'PENDING') {
      await prisma.milestone.update({
        where: { id: proposalMilestone.id },
        data: { status: 'IN_PROGRESS', completionPct: 50 },
      })
    }

    return NextResponse.json({ data: proposal, success: true }, { status: 201 })
  } catch (error) {
    console.error('Error creating proposal:', error)
    return NextResponse.json(
      { error: 'Failed to create proposal', success: false },
      { status: 500 }
    )
  }
}
