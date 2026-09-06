import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const universityId = searchParams.get('universityId')
    const departmentId = searchParams.get('departmentId')
    const q = searchParams.get('q')

    const where: any = {}
    if (universityId) where.universityId = universityId
    if (departmentId) where.departmentId = departmentId
    if (q && q.trim()) {
      where.OR = [
        { name: { contains: q.trim() } },
        { skills: { contains: q.trim() } },
      ]
    }

    const teams = await prisma.team.findMany({
      where,
      include: {
        university: true,
        department: true,
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
        projects: {
          select: {
            id: true,
            title: true,
            status: true,
            progressPercent: true,
          },
        },
        _count: {
          select: {
            members: true,
            projects: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ data: teams, success: true })
  } catch (error) {
    console.error('Error fetching teams:', error)
    return NextResponse.json(
      { error: 'Failed to fetch teams', success: false },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const {
      name,
      universityId,
      departmentId,
      skills = [],
      size,
      creatorUserId,
    } = body

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Team name is required', success: false },
        { status: 400 }
      )
    }

    const skillsString = Array.isArray(skills)
      ? JSON.stringify(skills)
      : String(skills || '[]')

    // Find creator user if provided or fallback
    let leaderUserId = creatorUserId
    if (!leaderUserId) {
      const studentUser = await prisma.user.findFirst({
        where: { role: 'STUDENT' },
      }) || await prisma.user.findFirst()
      leaderUserId = studentUser?.id
    }

    const team = await prisma.team.create({
      data: {
        name: name.trim(),
        universityId: universityId || null,
        departmentId: departmentId || null,
        skills: skillsString,
        size: size ? parseInt(String(size), 10) : (leaderUserId ? 1 : 0),
        verified: true,
        ...(leaderUserId
          ? {
              members: {
                create: {
                  userId: leaderUserId,
                  role: 'LEADER',
                },
              },
            }
          : {}),
      },
      include: {
        university: true,
        department: true,
        members: {
          include: {
            user: {
              select: { id: true, name: true, avatar: true, email: true, role: true },
            },
          },
        },
      },
    })

    return NextResponse.json({ data: team, success: true }, { status: 201 })
  } catch (error) {
    console.error('Error creating team:', error)
    return NextResponse.json(
      { error: 'Failed to create team', success: false },
      { status: 500 }
    )
  }
}
