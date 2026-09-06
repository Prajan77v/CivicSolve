import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const [
      totalProblems,
      statusGroups,
      totalProjects,
      totalUniversities,
      totalTeams,
      totalOrganizations,
      studentAgg,
      leaderboardAgg,
      totalCertificates,
    ] = await Promise.all([
      prisma.problem.count(),
      prisma.problem.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
      prisma.project.count(),
      prisma.university.count(),
      prisma.team.count(),
      prisma.organization.count(),
      prisma.student.aggregate({
        _sum: { peopleImpacted: true },
      }),
      prisma.leaderboardScore.aggregate({
        _sum: { peopleImpacted: true },
      }),
      prisma.certificate.count(),
    ])

    const byStatus: Record<string, number> = {
      SUBMITTED: 0,
      AI_ANALYZED: 0,
      MATCHED: 0,
      TEAM_FORMED: 0,
      PROPOSAL: 0,
      PROTOTYPE: 0,
      PILOT: 0,
      DEPLOYED: 0,
      IMPACT_VERIFIED: 0,
      CERTIFIED: 0,
    }

    for (const group of statusGroups) {
      if (group.status) {
        byStatus[group.status] = group._count.status
      }
    }

    const totalPeopleImpacted = Math.max(
      studentAgg._sum.peopleImpacted || 0,
      leaderboardAgg._sum.peopleImpacted || 0
    )

    return NextResponse.json({
      data: {
        totalProblems,
        byStatus,
        totalProjects,
        totalUniversities,
        totalTeams,
        totalOrganizations,
        totalPeopleImpacted,
        totalCertificates,
      },
      success: true,
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch platform statistics', success: false },
      { status: 500 }
    )
  }
}
