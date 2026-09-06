import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const sector = searchParams.get('sector')
    const q = searchParams.get('q')

    const where: any = {}
    if (type && type !== 'ALL') where.type = type
    if (sector && sector !== 'ALL') where.sector = sector
    if (q && q.trim()) {
      where.OR = [
        { name: { contains: q.trim() } },
        { sector: { contains: q.trim() } },
        { expertise: { contains: q.trim() } },
        { city: { contains: q.trim() } },
      ]
    }

    const organizations = await prisma.organization.findMany({
      where,
      include: {
        _count: {
          select: {
            projects: true,
            fundingSupport: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json({ data: organizations, success: true })
  } catch (error) {
    console.error('Error fetching partners/organizations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch organizations', success: false },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const {
      projectId,
      organizationId,
      type = 'CSR_FUNDING',
      amount,
      description,
      status = 'CONFIRMED',
    } = body

    if (!projectId || !organizationId) {
      return NextResponse.json(
        { error: 'projectId and organizationId are required', success: false },
        { status: 400 }
      )
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found', success: false },
        { status: 404 }
      )
    }

    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
    })

    if (!organization) {
      return NextResponse.json(
        { error: 'Organization not found', success: false },
        { status: 404 }
      )
    }

    const parsedAmount = amount !== undefined && amount !== null
      ? parseFloat(String(amount))
      : null

    const fundingSupport = await prisma.fundingSupport.create({
      data: {
        projectId,
        organizationId,
        type,
        amount: parsedAmount,
        description: description || null,
        status,
      },
      include: {
        organization: true,
        project: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
      },
    })

    // If project does not have an industry partner assigned yet, link this organization
    if (!project.industryPartnerId) {
      await prisma.project.update({
        where: { id: projectId },
        data: { industryPartnerId: organizationId },
      })
    }

    return NextResponse.json(
      {
        data: fundingSupport,
        message: 'Partnership support successfully recorded',
        success: true,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating partner funding support:', error)
    return NextResponse.json(
      { error: 'Failed to create partner support', success: false },
      { status: 500 }
    )
  }
}
