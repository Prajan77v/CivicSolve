import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

const STANDARD_MILESTONES = [
  {
    title: 'Problem Discovery & Stakeholder Mapping',
    description: 'Field visit, citizen interviews, baseline data collection, and scope definition.',
    type: 'DISCOVERY',
    order: 1,
    status: 'IN_PROGRESS',
    completionPct: 10,
  },
  {
    title: 'Technical Research & Feasibility Analysis',
    description: 'Literature review, architecture evaluation, cost analysis, and regulatory assessment.',
    type: 'RESEARCH',
    order: 2,
    status: 'PENDING',
    completionPct: 0,
  },
  {
    title: 'Solution Architecture & Civic Proposal',
    description: 'Detailed technical specification, implementation timeline, and stakeholder sign-off.',
    type: 'PROPOSAL',
    order: 3,
    status: 'PENDING',
    completionPct: 0,
  },
  {
    title: 'Functional Prototype Development',
    description: 'Core hardware/software prototype development, lab benchmarks, and unit testing.',
    type: 'PROTOTYPE',
    order: 4,
    status: 'PENDING',
    completionPct: 0,
  },
  {
    title: 'Community Pilot & Field Testing',
    description: 'Controlled on-ground trial with affected citizens, data collection, and UX refinement.',
    type: 'PILOT',
    order: 5,
    status: 'PENDING',
    completionPct: 0,
  },
  {
    title: 'Full Deployment & Municipal Handover',
    description: 'Civic infrastructure deployment, municipal team onboarding, and SLA setup.',
    type: 'DEPLOYMENT',
    order: 6,
    status: 'PENDING',
    completionPct: 0,
  },
  {
    title: 'Impact Verification & Certification Audit',
    description: 'Quantitative metric verification, audit report, before/after analysis, and certification.',
    type: 'IMPACT',
    order: 7,
    status: 'PENDING',
    completionPct: 0,
  },
]

export async function POST(
  request: Request,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const { id } = await Promise.resolve(context.params)
    const body = await request.json().catch(() => ({}))

    const problem = await prisma.problem.findUnique({
      where: { id },
      include: {
        location: true,
        projects: true,
      },
    })

    if (!problem) {
      return NextResponse.json(
        { error: 'Problem not found', success: false },
        { status: 404 }
      )
    }

    // Check if problem already has a project
    if (problem.projects && problem.projects.length > 0 && !body.forceNew) {
      const existingProject = await prisma.project.findUnique({
        where: { id: problem.projects[0].id },
        include: {
          team: true,
          milestones: { orderBy: { order: 'asc' } },
        },
      })
      return NextResponse.json({
        data: existingProject,
        message: 'Problem already has an active project',
        success: true,
      })
    }

    // 1. Resolve team
    let teamId = body.teamId
    let universityId = body.universityId

    if (!teamId) {
      const firstTeam = await prisma.team.findFirst()
      if (firstTeam) {
        teamId = firstTeam.id
        universityId = universityId || firstTeam.universityId
      } else {
        // Find or create university first
        let univ = await prisma.university.findFirst()
        if (!univ) {
          univ = await prisma.university.create({
            data: {
              name: 'Indian Institute of Technology Delhi',
              shortName: 'IIT Delhi',
              city: 'New Delhi',
              state: 'Delhi',
              expertise: 'IoT, AI, Civil Systems',
              ranking: 2,
            },
          })
        }
        universityId = univ.id

        // Create fallback team
        const newTeam = await prisma.team.create({
          data: {
            name: 'Civic Innovation Taskforce',
            skills: JSON.stringify(['IoT', 'Full-Stack', 'Data Science']),
            size: 4,
            verified: true,
            universityId: univ.id,
          },
        })
        teamId = newTeam.id
      }
    } else if (!universityId) {
      const team = await prisma.team.findUnique({ where: { id: teamId } })
      if (team?.universityId) {
        universityId = team.universityId
      }
    }

    const projectTitle = body.title || `Project: ${problem.title}`

    // 2. Create Project with milestones
    const project = await prisma.project.create({
      data: {
        problemId: id,
        title: projectTitle,
        teamId,
        universityId: universityId || null,
        industryPartnerId: body.industryPartnerId || null,
        status: 'ACTIVE',
        progressPercent: 5,
        milestones: {
          create: STANDARD_MILESTONES.map((m) => ({
            title: m.title,
            description: m.description,
            type: m.type,
            order: m.order,
            status: m.status,
            completionPct: m.completionPct,
          })),
        },
      },
      include: {
        problem: {
          include: { location: true },
        },
        team: {
          include: {
            members: {
              include: {
                user: { select: { id: true, name: true, avatar: true } },
              },
            },
          },
        },
        university: true,
        industryPartner: true,
        milestones: {
          orderBy: { order: 'asc' },
        },
      },
    })

    // 3. Update problem status to TEAM_FORMED
    await prisma.problem.update({
      where: { id },
      data: { status: 'TEAM_FORMED' },
    })

    return NextResponse.json(
      {
        data: project,
        message: 'Problem accepted and project initialized with standard milestones',
        success: true,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error accepting problem into project:', error)
    return NextResponse.json(
      { error: 'Failed to accept problem and create project', success: false },
      { status: 500 }
    )
  }
}
