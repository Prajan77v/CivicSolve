import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')
    const state = searchParams.get('state')

    const where: any = {}
    if (state) where.state = state
    if (q && q.trim()) {
      where.OR = [
        { name: { contains: q.trim() } },
        { shortName: { contains: q.trim() } },
        { city: { contains: q.trim() } },
        { expertise: { contains: q.trim() } },
      ]
    }

    const universities = await prisma.university.findMany({
      where,
      include: {
        departments: true,
        _count: {
          select: {
            faculty: true,
            teams: true,
            projects: true,
            students: true,
          },
        },
      },
      orderBy: [
        { ranking: 'asc' },
        { name: 'asc' },
      ],
    })

    return NextResponse.json({ data: universities, success: true })
  } catch (error) {
    console.error('Error fetching universities:', error)
    return NextResponse.json(
      { error: 'Failed to fetch universities', success: false },
      { status: 500 }
    )
  }
}
