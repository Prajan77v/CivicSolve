import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { adaptedRegion, adaptedByTeam, targetState, targetDistrict } = body

    const solution = await prisma.solution.findUnique({
      where: { id: params.id }
    })

    if (!solution) {
      return NextResponse.json({ success: false, error: 'Solution not found' }, { status: 404 })
    }

    const adaptation = await prisma.solutionAdaptation.create({
      data: {
        solutionId: params.id,
        adaptedRegion: adaptedRegion || `${targetDistrict || 'District'}, ${targetState || 'State'}`,
        adaptedByTeam: adaptedByTeam || 'Regional Adaptation Squad',
        targetState: targetState || 'India',
        targetDistrict: targetDistrict || 'District',
        adaptationStage: 'PILOT',
        status: 'ACTIVE'
      }
    })

    // Update regions deployed list in solution
    let regions: string[] = []
    try {
      regions = JSON.parse(solution.regionsDeployed)
    } catch {
      regions = [solution.primaryRegion]
    }
    const newRegionTag = `${targetDistrict || 'Region'} (${targetState || 'State'})`
    if (!regions.includes(newRegionTag)) {
      regions.push(newRegionTag)
      await prisma.solution.update({
        where: { id: params.id },
        data: { regionsDeployed: JSON.stringify(regions) }
      })
    }

    return NextResponse.json({ success: true, data: adaptation })
  } catch (error) {
    console.error('Adapt solution error:', error)
    return NextResponse.json({ success: false, error: 'Failed to adapt solution' }, { status: 500 })
  }
}
