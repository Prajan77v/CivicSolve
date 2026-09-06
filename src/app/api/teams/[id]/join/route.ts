import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(
  request: Request,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const { id } = await Promise.resolve(context.params)
    const body = await request.json().catch(() => ({}))
    const { role = 'MEMBER' } = body

    // 1. Verify team exists
    const team = await prisma.team.findUnique({
      where: { id },
      include: { members: true },
    })

    if (!team) {
      return NextResponse.json(
        { error: 'Team not found', success: false },
        { status: 404 }
      )
    }

    // 2. Resolve user
    let userId = body.userId
    if (!userId) {
      // Find a user who is not already a member of this team
      const existingMemberIds = team.members.map((m) => m.userId)
      const candidateUser = await prisma.user.findFirst({
        where: {
          id: { notIn: existingMemberIds },
        },
      })
      if (candidateUser) {
        userId = candidateUser.id
      } else {
        return NextResponse.json(
          { error: 'userId is required or all users are already members', success: false },
          { status: 400 }
        )
      }
    }

    // 3. Check duplicate membership
    const existingMembership = await prisma.teamMember.findFirst({
      where: {
        teamId: id,
        userId,
      },
    })

    if (existingMembership) {
      return NextResponse.json(
        { error: 'User is already a member of this team', success: false },
        { status: 400 }
      )
    }

    // 4. Create membership and increment team size
    const [membership, updatedTeam] = await prisma.$transaction([
      prisma.teamMember.create({
        data: {
          teamId: id,
          userId,
          role,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
              role: true,
            },
          },
        },
      }),
      prisma.team.update({
        where: { id },
        data: {
          size: { increment: 1 },
        },
        include: {
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  avatar: true,
                  role: true,
                },
              },
            },
          },
        },
      }),
    ])

    return NextResponse.json(
      {
        data: {
          membership,
          team: updatedTeam,
        },
        message: 'Successfully joined team',
        success: true,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error joining team:', error)
    return NextResponse.json(
      { error: 'Failed to join team', success: false },
      { status: 500 }
    )
  }
}
