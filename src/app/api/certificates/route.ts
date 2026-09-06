import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const q = searchParams.get('q')

    const where: any = {}
    if (type && type !== 'ALL') {
      where.type = type
    }
    if (q && q.trim()) {
      where.OR = [
        { problemTitle: { contains: q.trim() } },
        { role: { contains: q.trim() } },
        { impactSummary: { contains: q.trim() } },
        { user: { name: { contains: q.trim() } } },
      ]
    }

    const certificates = await prisma.certificate.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
            studentProfile: {
              include: {
                university: {
                  select: { id: true, name: true, shortName: true },
                },
              },
            },
            facultyProfile: {
              include: {
                university: {
                  select: { id: true, name: true, shortName: true },
                },
              },
            },
          },
        },
        project: {
          select: {
            id: true,
            title: true,
            status: true,
            team: {
              select: {
                id: true,
                name: true,
              },
            },
            university: {
              select: {
                id: true,
                name: true,
                shortName: true,
              },
            },
          },
        },
        _count: {
          select: {
            verifications: true,
          },
        },
      },
      orderBy: { issuedAt: 'desc' },
    })

    return NextResponse.json({ data: certificates, success: true })
  } catch (error) {
    console.error('Error fetching certificates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch certificates', success: false },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, type, problemTitle, role, projectId, impactSummary, issuedBy } = body

    if (!userId || !problemTitle || !role) {
      return NextResponse.json(
        { error: 'userId, problemTitle, and role are required', success: false },
        { status: 400 }
      )
    }

    const cert = await prisma.certificate.create({
      data: {
        userId,
        type: type || 'OUTSTANDING_SOLVER',
        problemTitle,
        role,
        projectId: projectId || null,
        impactSummary: impactSummary || null,
        issuedBy: issuedBy || 'CivicSolve Platform & Ministry of Education',
        verified: true,
      },
      include: {
        user: true,
        project: true,
      },
    })

    return NextResponse.json({ data: cert, success: true }, { status: 201 })
  } catch (error) {
    console.error('Error creating certificate:', error)
    return NextResponse.json(
      { error: 'Failed to issue certificate', success: false },
      { status: 500 }
    )
  }
}
