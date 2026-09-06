import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const domain = searchParams.get('domain')
    const query = searchParams.get('q')

    const where: any = { isPublished: true }
    if (domain && domain !== 'ALL') {
      where.domain = domain
    }
    if (query) {
      where.OR = [
        { title: { contains: query } },
        { summary: { contains: query } },
        { technologies: { contains: query } },
        { universityName: { contains: query } },
      ]
    }

    const solutions = await prisma.solution.findMany({
      where,
      include: {
        adaptations: true,
        project: {
          select: {
            id: true,
            status: true,
            deployments: {
              include: { impactMetrics: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ success: true, data: solutions })
  } catch (error) {
    console.error('Solutions error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch solutions' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title, summary, domain, projectId, originalProblemTitle,
      originalProblemId, universityName, teamName, technologies,
      implementationRequirements, deploymentRequirements, cost,
      measuredImpact, primaryRegion, regionsDeployed
    } = body

    const solution = await prisma.solution.create({
      data: {
        title,
        summary,
        domain: domain || 'GENERAL',
        projectId,
        originalProblemTitle: originalProblemTitle || 'Verified Civic Solution',
        originalProblemId,
        universityName: universityName || 'Premier Indian Institute',
        teamName: teamName || 'Solution Squad',
        technologies: typeof technologies === 'string' ? technologies : JSON.stringify(technologies || []),
        implementationRequirements: implementationRequirements || 'Standard field deployment guidelines.',
        deploymentRequirements: deploymentRequirements || 'Municipal clearance and site inspection.',
        cost: cost ? parseFloat(cost) : null,
        measuredImpact: measuredImpact || 'Verified civic improvement.',
        primaryRegion: primaryRegion || 'National',
        regionsDeployed: typeof regionsDeployed === 'string' ? regionsDeployed : JSON.stringify(regionsDeployed || [primaryRegion || 'National']),
        isPublished: true
      }
    })

    return NextResponse.json({ success: true, data: solution })
  } catch (error) {
    console.error('Create solution error:', error)
    return NextResponse.json({ success: false, error: 'Failed to create reusable solution' }, { status: 500 })
  }
}
