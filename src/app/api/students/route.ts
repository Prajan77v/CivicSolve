import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')?.trim()
    const skill = searchParams.get('skill')?.trim()
    const university = searchParams.get('university')?.trim()

    const where: any = {}

    if (q) {
      where.OR = [
        { user: { name: { contains: q } } },
        { user: { bio: { contains: q } } },
        { skills: { contains: q } },
        { university: { name: { contains: q } } },
        { university: { shortName: { contains: q } } },
        { department: { name: { contains: q } } },
      ]
    }

    if (skill) {
      where.skills = { contains: skill }
    }

    if (university) {
      where.OR = [
        { university: { id: university } },
        { university: { shortName: { contains: university } } },
        { university: { name: { contains: university } } },
      ]
    }

    const students = await prisma.student.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            bio: true,
            verified: true,
            createdAt: true,
            certificates: {
              select: { id: true, problemTitle: true, type: true, issuedAt: true },
            },
            leaderboardScore: true,
            teamMemberships: {
              include: {
                team: {
                  select: { id: true, name: true },
                },
              },
            },
          },
        },
        university: {
          select: {
            id: true,
            name: true,
            shortName: true,
            city: true,
            state: true,
            ranking: true,
          },
        },
        department: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [
        { impactScore: 'desc' },
        { problemsSolved: 'desc' },
      ],
    })

    return NextResponse.json({ success: true, data: students })
  } catch (error) {
    console.error('Failed to fetch students:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch students' },
      { status: 500 }
    )
  }
}
