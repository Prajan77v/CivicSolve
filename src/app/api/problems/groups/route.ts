import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const groups = await prisma.challengeGroup.findMany({
      include: {
        problems: {
          select: {
            id: true,
            title: true,
            priority: true,
            status: true,
            affectedCount: true,
            location: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ success: true, data: groups })
  } catch (error) {
    console.error('Fetch groups error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch challenge groups' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, domain, problemIds, region, commonRequirements } = body

    let totalPopulation = 0
    if (problemIds && problemIds.length > 0) {
      const selectedProblems = await prisma.problem.findMany({
        where: { id: { in: problemIds } },
        select: { affectedCount: true }
      })
      totalPopulation = selectedProblems.reduce((sum, p) => sum + (p.affectedCount || 0), 0)
    }

    const group = await prisma.challengeGroup.create({
      data: {
        title,
        description,
        domain: domain || 'WATER',
        combinedPopulation: totalPopulation,
        combinedPriority: 'CRITICAL',
        region: region || 'Regional Multi-District Area',
        commonRequirements: typeof commonRequirements === 'string' ? commonRequirements : JSON.stringify(commonRequirements || []),
      }
    })

    if (problemIds && problemIds.length > 0) {
      await prisma.problem.updateMany({
        where: { id: { in: problemIds } },
        data: { challengeGroupId: group.id }
      })
    }

    const result = await prisma.challengeGroup.findUnique({
      where: { id: group.id },
      include: { problems: true }
    })

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error('Create group error:', error)
    return NextResponse.json({ success: false, error: 'Failed to create challenge group' }, { status: 500 })
  }
}
