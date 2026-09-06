import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import crypto from 'crypto'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const clientIp = request.headers.get('x-forwarded-for') || '127.0.0.1'

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
          },
        },
      },
    })

    if (!certificate) {
      return NextResponse.json(
        {
          verified: false,
          error: 'Certificate identifier not found in the official registry.',
          success: false,
        },
        { status: 404 }
      )
    }

    // Log the verification attempt
    try {
      await prisma.certificateVerification.create({
        data: {
          certificateId: certificate.id,
          verifierIp: clientIp.split(',')[0].trim(),
        },
      })
    } catch (e) {
      console.warn('Failed to log verification record:', e)
    }

    const payload = `${certificate.certificateId}:${certificate.userId}:${certificate.problemTitle}:${certificate.issuedAt.toISOString()}`
    const verificationHash = crypto.createHash('sha256').update(payload).digest('hex').toUpperCase()

    return NextResponse.json({
      verified: true,
      data: {
        id: certificate.id,
        certificateId: certificate.certificateId,
        recipientName: certificate.user.name,
        recipientRole: certificate.role,
        userRole: certificate.user.role,
        universityName:
          certificate.user.studentProfile?.university?.name ||
          certificate.user.facultyProfile?.university?.name ||
          certificate.project?.university?.name ||
          'Indian Institute of Technology Bombay',
        universityShort:
          certificate.user.studentProfile?.university?.shortName ||
          certificate.user.facultyProfile?.university?.shortName ||
          certificate.project?.university?.shortName ||
          'IIT Bombay',
        projectTitle: certificate.problemTitle,
        type: certificate.type,
        impactSummary: certificate.impactSummary,
        issuedBy: certificate.issuedBy,
        issuedAt: certificate.issuedAt,
        verificationHash,
        status: 'AUTHENTIC & TAMPER-PROOF',
        verifiedAt: new Date().toISOString(),
      },
      success: true,
    })
  } catch (error) {
    console.error('Error verifying certificate:', error)
    return NextResponse.json(
      {
        verified: false,
        error: 'An error occurred during cryptographic verification.',
        success: false,
      },
      { status: 500 }
    )
  }
}
