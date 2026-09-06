import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')?.trim()
    const specialization = searchParams.get('specialization')?.trim()
    const domain = searchParams.get('domain')?.trim()

    const where: any = {}

    if (q) {
      where.OR = [
        { user: { name: { contains: q } } },
        { user: { bio: { contains: q } } },
        { specializations: { contains: q } },
        { designation: { contains: q } },
        { university: { name: { contains: q } } },
        { university: { shortName: { contains: q } } },
        { department: { name: { contains: q } } },
      ]
    }

    if (specialization) {
      where.specializations = { contains: specialization }
    }

    const faculty = await prisma.faculty.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            bio: true,
            verified: true,
            createdAt: true,
            role: true,
          },
        },
        university: {
          select: {
            id: true,
            name: true,
            shortName: true,
            city: true,
            state: true,
          },
        },
        department: {
          select: {
            id: true,
            name: true,
          },
        },
        mentorships: {
          select: {
            id: true,
            status: true,
          },
        },
      },
      orderBy: [
        { designation: 'asc' },
      ],
    })

    return NextResponse.json({ success: true, data: faculty })
  } catch (error) {
    console.error('Failed to fetch professionals:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch professionals' },
      { status: 500 }
    )
  }
}
