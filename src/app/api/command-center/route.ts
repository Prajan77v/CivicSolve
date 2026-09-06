import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const [allProblems, categoryGroups, priorityGroups, allProjects, allDeployments, allChallengeGroups] = await Promise.all([
      prisma.problem.findMany({
        include: {
          location: true,
          aiAnalysis: true,
          challengeGroup: true,
          projects: {
            select: { id: true, title: true, status: true, progressPercent: true },
          },
          submittedBy: {
            select: { id: true, name: true, avatar: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.problem.groupBy({
        by: ['category'],
        _count: { category: true },
      }),
      prisma.problem.groupBy({
        by: ['priority'],
        _count: { priority: true },
      }),
      prisma.project.findMany({
        include: {
          problem: {
            include: { location: true },
          },
          team: true,
          university: true,
        },
      }),
      prisma.deployment.findMany({
        include: {
          project: {
            include: {
              problem: {
                include: { location: true },
              },
            },
          },
          impactMetrics: true,
        },
      }),
      prisma.challengeGroup.findMany({
        include: {
          problems: {
            include: { location: true },
          },
        },
      }),
    ])

    // Priority breakdown
    const priorityBreakdown: Record<string, number> = {
      CRITICAL: 0,
      HIGH: 0,
      MEDIUM: 0,
      LOW: 0,
    }
    for (const g of priorityGroups) {
      if (g.priority) priorityBreakdown[g.priority] = g._count.priority
    }

    // Category breakdown with resolution tracking
    const categoryStats: Record<string, { total: number; resolved: number; active: number }> = {}
    for (const p of allProblems) {
      const cat = p.category || 'OTHER'
      if (!categoryStats[cat]) {
        categoryStats[cat] = { total: 0, resolved: 0, active: 0 }
      }
      categoryStats[cat].total += 1
      if (['DEPLOYED', 'IMPACT_VERIFIED', 'CERTIFIED'].includes(p.status)) {
        categoryStats[cat].resolved += 1
      } else {
        categoryStats[cat].active += 1
      }
    }

    const categoryBreakdown = Object.entries(categoryStats).map(([category, stats]) => ({
      category,
      total: stats.total,
      resolved: stats.resolved,
      active: stats.active,
    }))

    // District points for map visualization
    const districtMap: Record<
      string,
      {
        district: string
        state: string
        lat: number
        lng: number
        totalProblems: number
        criticalProblems: number
        activeProblems: number
        resolvedProblems: number
        peopleImpacted: number
        categories: Set<string>
      }
    > = {}

    // Fallback coordinates for key Indian districts if missing in database
    const DEFAULT_COORDS: Record<string, [number, number]> = {
      'New Delhi': [28.6139, 77.2090],
      Delhi: [28.7041, 77.1025],
      Bengaluru: [12.9716, 77.5946],
      Mumbai: [19.0760, 72.8777],
      Chennai: [13.0827, 80.2707],
      Hyderabad: [17.3850, 78.4867],
      Pune: [18.5204, 73.8567],
      Jaipur: [26.9124, 75.7873],
      Kolkata: [22.5726, 88.3639],
      Ahmedabad: [23.0225, 72.5714],
      Varanasi: [25.3176, 82.9739],
      Lucknow: [26.8467, 80.9462],
      Patna: [25.5941, 85.1376],
      Bhopal: [23.2599, 77.4126],
      Coimbatore: [11.0168, 76.9558],
      Thiruvananthapuram: [8.5241, 76.9366],
    }

    for (const p of allProblems) {
      const loc = p.location
      const district = loc?.district || 'Central'
      const state = loc?.state || 'India'
      const key = `${district}_${state}`

      let lat = loc?.lat
      let lng = loc?.lng

      if (!lat || !lng) {
        if (DEFAULT_COORDS[district]) {
          lat = DEFAULT_COORDS[district][0]
          lng = DEFAULT_COORDS[district][1]
        } else {
          // Stable fallback coordinate based on name hash
          lat = 20.5937 + ((district.charCodeAt(0) % 10) - 5) * 1.2
          lng = 78.9629 + ((district.charCodeAt(district.length - 1) % 10) - 5) * 1.2
        }
      }

      if (!districtMap[key]) {
        districtMap[key] = {
          district,
          state,
          lat,
          lng,
          totalProblems: 0,
          criticalProblems: 0,
          activeProblems: 0,
          resolvedProblems: 0,
          peopleImpacted: 0,
          categories: new Set<string>(),
        }
      }

      districtMap[key].totalProblems += 1
      districtMap[key].peopleImpacted += p.affectedCount || 0
      districtMap[key].categories.add(p.category)

      if (p.priority === 'CRITICAL') {
        districtMap[key].criticalProblems += 1
      }

      if (['DEPLOYED', 'IMPACT_VERIFIED', 'CERTIFIED'].includes(p.status)) {
        districtMap[key].resolvedProblems += 1
      } else {
        districtMap[key].activeProblems += 1
      }
    }

    const districtPoints = Object.values(districtMap).map((d) => ({
      ...d,
      categories: Array.from(d.categories),
    }))

    // Critical problems list
    const criticalProblems = allProblems
      .filter((p) => p.priority === 'CRITICAL' || p.priority === 'HIGH')
      .slice(0, 15)

    // Overall summary metrics
    const totalProblems = allProblems.length
    const resolvedProblems = allProblems.filter((p) =>
      ['DEPLOYED', 'IMPACT_VERIFIED', 'CERTIFIED'].includes(p.status)
    ).length
    const activeProblems = totalProblems - resolvedProblems
    const totalCitizensAffected = allProblems.reduce((sum, p) => sum + (p.affectedCount || 0), 0)
    const resolutionRate = totalProblems > 0 ? Math.round((resolvedProblems / totalProblems) * 100) : 0

    // Map items mapping
    const mapProblems = allProblems.map((p) => {
      const loc = p.location
      const district = loc?.district || 'Central'
      let lat = loc?.lat
      let lng = loc?.lng
      if (!lat || !lng) {
        if (DEFAULT_COORDS[district]) {
          lat = DEFAULT_COORDS[district][0]
          lng = DEFAULT_COORDS[district][1]
        } else {
          lat = 20.5937 + ((district.charCodeAt(0) % 10) - 5) * 1.2
          lng = 78.9629 + ((district.charCodeAt(district.length - 1) % 10) - 5) * 1.2
        }
      }
      return {
        id: p.id,
        title: p.title,
        description: p.description,
        category: p.category,
        priority: p.priority,
        status: p.status,
        affectedCount: p.affectedCount || 0,
        district: loc?.district || 'Nashik',
        state: loc?.state || 'Maharashtra',
        lat,
        lng,
        submittedByName: p.submittedBy?.name || 'Citizen Reporter',
        challengeGroupId: p.challengeGroupId,
      }
    })

    const mapProjects = allProjects.map((proj) => {
      const p = proj.problem
      const loc = p?.location
      const district = loc?.district || 'Nashik'
      let lat = loc?.lat || DEFAULT_COORDS[district]?.[0] || 19.8488
      let lng = loc?.lng || DEFAULT_COORDS[district]?.[1] || 74.0025
      return {
        id: proj.id,
        title: proj.title,
        status: proj.status,
        progressPercent: proj.progressPercent,
        teamName: proj.team?.name || 'Assigned Innovation Lab',
        universityName: proj.university?.name || 'Partner University',
        problemId: proj.problemId,
        problemTitle: p?.title || 'Civic Problem',
        category: p?.category || 'Civic Tech',
        district,
        state: loc?.state || 'Maharashtra',
        lat,
        lng,
      }
    })

    const mapDeployments = allDeployments.map((dep) => {
      const proj = dep.project
      const p = proj?.problem
      const loc = p?.location
      const district = loc?.district || 'Nashik'
      let lat = loc?.lat || DEFAULT_COORDS[district]?.[0] || 19.8488
      let lng = loc?.lng || DEFAULT_COORDS[district]?.[1] || 74.0025
      const primaryMetric = dep.impactMetrics[0]
      return {
        id: dep.id,
        projectId: dep.projectId,
        title: proj?.title || 'Deployed Solution',
        description: dep.description,
        location: dep.location || `${district}, ${loc?.state || 'Maharashtra'}`,
        status: dep.status,
        deployedAt: dep.deployedAt,
        district,
        state: loc?.state || 'Maharashtra',
        lat,
        lng,
        peopleImpacted: p?.affectedCount || 2350,
        metric: primaryMetric ? `${primaryMetric.metricName}: ${primaryMetric.beforeValue} → ${primaryMetric.afterValue}` : null,
      }
    })

    const mapChallengeGroups = allChallengeGroups.map((cg) => {
      const probs = cg.problems
      const firstWithLoc = probs.find((pr) => pr.location?.lat && pr.location?.lng)
      const lat = firstWithLoc?.location?.lat || 19.8488
      const lng = firstWithLoc?.location?.lng || 74.0025
      return {
        id: cg.id,
        title: cg.title,
        description: cg.description,
        domain: cg.domain,
        combinedPopulation: cg.combinedPopulation,
        combinedPriority: cg.combinedPriority,
        region: cg.region,
        status: cg.status,
        lat,
        lng,
        problemCount: probs.length,
        problems: probs.map((pr) => ({ id: pr.id, title: pr.title, priority: pr.priority, district: pr.location?.district })),
      }
    })

    return NextResponse.json({
      data: {
        categoryBreakdown,
        priorityBreakdown,
        districtPoints,
        criticalProblems,
        mapProblems,
        mapProjects,
        mapDeployments,
        mapChallengeGroups,
        summaryStats: {
          totalProblems,
          activeProblems,
          resolvedProblems,
          criticalCount: priorityBreakdown.CRITICAL || 0,
          highCount: priorityBreakdown.HIGH || 0,
          districtsCovered: districtPoints.length,
          totalCitizensAffected,
          resolutionRate,
        },
      },
      success: true,
    })
  } catch (error) {
    console.error('Error fetching command center data:', error)
    return NextResponse.json(
      { error: 'Failed to aggregate command center data', success: false },
      { status: 500 }
    )
  }
}
