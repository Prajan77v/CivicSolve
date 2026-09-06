import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

function safeParseBadges(val: string | null | undefined): string[] {
  if (!val) return []
  try {
    const parsed = JSON.parse(val)
    return Array.isArray(parsed) ? parsed : [String(val)]
  } catch {
    return val.split(',').map((s) => s.trim()).filter(Boolean)
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit')
    const take = limit ? parseInt(limit, 10) : 50

    const scores = await prisma.leaderboardScore.findMany({
      take,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            role: true,
            studentProfile: {
              include: {
                university: {
                  select: { id: true, name: true, shortName: true },
                },
                department: {
                  select: { id: true, name: true },
                },
              },
            },
          },
        },
      },
      orderBy: [
        { totalScore: 'desc' },
        { peopleImpacted: 'desc' },
        { deployments: 'desc' },
      ],
    })

    const data = scores.map((item, index) => ({
      ...item,
      rank: index + 1,
      badges: safeParseBadges(item.badges),
    }))

    return NextResponse.json({ data, success: true })
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard scores', success: false },
      { status: 500 }
    )
  }
}
