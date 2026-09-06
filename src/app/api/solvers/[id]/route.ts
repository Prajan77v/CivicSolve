import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { id: params.id },
          { email: params.id }
        ]
      },
      include: {
        studentProfile: {
          include: { university: true, department: true }
        },
        facultyProfile: {
          include: { university: true, department: true }
        },
        teamMemberships: {
          include: {
            team: {
              include: {
                projects: {
                  include: {
                    problem: true,
                    deployments: { include: { impactMetrics: true } }
                  }
                }
              }
            }
          }
        },
        certificates: true,
        leaderboardScore: true
      }
    })

    if (!user) {
      return NextResponse.json({ success: false, error: 'Problem solver not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: user })
  } catch (error) {
    console.error('Solver profile error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch solver profile' }, { status: 500 })
  }
}
