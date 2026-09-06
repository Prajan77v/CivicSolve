import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import crypto from 'crypto'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const certificate = await prisma.certificate.findFirst({
      where: {
        OR: [
          { certificateId: id },
          { id: id },
        ],
      },
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
                university: true,
                department: true,
              },
            },
            facultyProfile: {
              include: {
                university: true,
                department: true,
              },
            },
          },
        },
        project: {
          include: {
            team: true,
            university: true,
            industryPartner: true,
            deployments: {
              include: {
                impactMetrics: true,
              },
            },
          },
        },
        verifications: {
          orderBy: { verifiedAt: 'desc' },
          take: 5,
        },
      },
    })

    if (!certificate) {
      return NextResponse.json(
        { error: 'Certificate not found', success: false },
        { status: 404 }
      )
    }

    const payload = `${certificate.certificateId}:${certificate.userId}:${certificate.problemTitle}:${certificate.issuedAt.toISOString()}`
    const verificationHash = crypto.createHash('sha256').update(payload).digest('hex').toUpperCase()

    return NextResponse.json({
      data: {
        ...certificate,
        verificationHash,
      },
      success: true,
    })
  } catch (error) {
    console.error('Error fetching certificate:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve certificate', success: false },
      { status: 500 }
    )
  }
}
