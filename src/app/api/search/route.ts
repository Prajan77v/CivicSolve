import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')?.trim()

    if (!q) {
      return NextResponse.json({
        data: {
          problems: [],
          projects: [],
          teams: [],
          universities: [],
          certificates: [],
          totalResults: 0,
          query: '',
        },
        success: true,
      })
    }

    const [problems, projects, teams, universities, certificates] = await Promise.all([
      prisma.problem.findMany({
        where: {
          OR: [
            { title: { contains: q } },
            { description: { contains: q } },
            { category: { contains: q } },
            { tags: { contains: q } },
          ],
        },
        take: 8,
        include: {
          location: true,
          submittedBy: {
            select: { id: true, name: true, avatar: true },
          },
        },
      }),

      prisma.project.findMany({
        where: {
          OR: [
            { title: { contains: q } },
          ],
        },
        take: 8,
        include: {
          problem: { select: { id: true, title: true, category: true } },
          team: { select: { id: true, name: true } },
          university: { select: { id: true, name: true, shortName: true } },
        },
      }),

      prisma.team.findMany({
        where: {
          OR: [
            { name: { contains: q } },
            { skills: { contains: q } },
          ],
        },
        take: 8,
        include: {
          university: { select: { id: true, name: true, shortName: true } },
          _count: { select: { members: true, projects: true } },
        },
      }),

      prisma.university.findMany({
        where: {
          OR: [
            { name: { contains: q } },
            { shortName: { contains: q } },
            { city: { contains: q } },
            { state: { contains: q } },
            { expertise: { contains: q } },
          ],
        },
        take: 8,
        include: {
          _count: { select: { teams: true, projects: true } },
        },
      }),

      prisma.certificate.findMany({
        where: {
          OR: [
            { certificateId: { contains: q } },
            { problemTitle: { contains: q } },
            { role: { contains: q } },
          ],
        },
        take: 8,
        include: {
          user: { select: { id: true, name: true, avatar: true } },
        },
      }),
    ])

    const totalResults =
      problems.length +
      projects.length +
      teams.length +
      universities.length +
      certificates.length

    return NextResponse.json({
      data: {
        problems,
        projects,
        teams,
        universities,
        certificates,
        totalResults,
        query: q,
      },
      success: true,
    })
  } catch (error) {
    console.error('Error in search:', error)
    return NextResponse.json(
      { error: 'Failed to perform search query', success: false },
      { status: 500 }
    )
  }
}
