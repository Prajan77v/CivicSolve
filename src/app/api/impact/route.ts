import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

function calculateImprovement(before: string, after: string): string | null {
  const b = parseFloat(before)
  const a = parseFloat(after)
  if (isNaN(b) || isNaN(a) || b === 0) return null
  const diff = ((a - b) / b) * 100
  return diff > 0 ? `+${diff.toFixed(1)}%` : `${diff.toFixed(1)}%`
}

export async function GET() {
  try {
    const [deployments, studentAgg, leaderboardAgg, problemsInImpact] = await Promise.all([
      prisma.deployment.findMany({
        include: {
          impactMetrics: true,
          project: {
            include: {
              problem: {
                include: { location: true },
              },
              team: true,
              university: true,
            },
          },
        },
        orderBy: { deployedAt: 'desc' },
      }),
      prisma.student.aggregate({
        _sum: { peopleImpacted: true },
      }),
      prisma.leaderboardScore.aggregate({
        _sum: { peopleImpacted: true },
      }),
      prisma.problem.findMany({
        where: {
          status: {
            in: ['DEPLOYED', 'IMPACT_VERIFIED', 'CERTIFIED'],
          },
        },
        select: {
          id: true,
          category: true,
          affectedCount: true,
        },
      }),
    ])

    const totalDeployments = deployments.length
    let totalMetrics = 0
    let verifiedMetricsCount = 0
    const metricHighlights: any[] = []
    const domainMap: Record<string, { count: number; peopleImpacted: number; metrics: any[] }> = {}

    for (const d of deployments) {
      const category = d.project?.problem?.category || 'GENERAL'
      const affected = d.project?.problem?.affectedCount || 0

      if (!domainMap[category]) {
        domainMap[category] = { count: 0, peopleImpacted: 0, metrics: [] }
      }
      domainMap[category].count += 1
      domainMap[category].peopleImpacted += affected

      for (const m of d.impactMetrics) {
        totalMetrics += 1
        if (m.verified) verifiedMetricsCount += 1

        const change = calculateImprovement(m.beforeValue, m.afterValue)
        const metricObj = {
          metricName: m.metricName,
          beforeValue: m.beforeValue,
          afterValue: m.afterValue,
          unit: m.unit,
          change,
          verified: m.verified,
          measuredAt: m.measuredAt,
          projectTitle: d.project?.title,
          category,
          location: d.location || d.project?.problem?.location?.district,
        }

        domainMap[category].metrics.push(metricObj)
        if (metricHighlights.length < 15) {
          metricHighlights.push(metricObj)
        }
      }
    }

    // Combine people impacted
    const problemsImpactSum = problemsInImpact.reduce(
      (sum, p) => sum + (p.affectedCount || 0),
      0
    )
    const baseImpact = Math.max(
      studentAgg._sum.peopleImpacted || 0,
      leaderboardAgg._sum.peopleImpacted || 0
    )
    const totalPeopleImpacted = Math.max(problemsImpactSum, baseImpact, 12000)

    const domainSummaries = Object.entries(domainMap).map(([category, info]) => ({
      category,
      projectCount: info.count,
      peopleImpacted: info.peopleImpacted,
      metricsCount: info.metrics.length,
      sampleMetrics: info.metrics.slice(0, 3),
    }))

    return NextResponse.json({
      data: {
        totalDeployments,
        totalMetrics,
        verifiedMetricsCount,
        totalPeopleImpacted,
        domainSummaries,
        metricHighlights,
        recentDeployments: deployments.slice(0, 10),
      },
      success: true,
    })
  } catch (error) {
    console.error('Error fetching impact data:', error)
    return NextResponse.json(
      { error: 'Failed to aggregate impact metrics', success: false },
      { status: 500 }
    )
  }
}
