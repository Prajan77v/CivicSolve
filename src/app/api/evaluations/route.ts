import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')

    const where = projectId ? { projectId } : {}
    const evaluations = await prisma.evaluation.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ success: true, data: evaluations })
  } catch (error) {
    console.error('Fetch evaluations error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch evaluations' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()
    const {
      projectId,
      innovation, feasibility, cost, scalability, socialImpact,
      evaluatorName, evaluatorRole, comments, recommendation
    } = body

    if (!projectId) {
      return NextResponse.json({ success: false, error: 'projectId is required' }, { status: 400 })
    }

    const inn = parseFloat(innovation || '8')
    const fea = parseFloat(feasibility || '8')
    const cst = parseFloat(cost || '8')
    const sca = parseFloat(scalability || '8')
    const soc = parseFloat(socialImpact || '8')

    // Weighted overall score out of 100
    const overallScore = Math.round((inn * 2.0 + fea * 2.0 + cst * 1.5 + sca * 2.0 + soc * 2.5) * 10) / 10

    const evaluation = await prisma.evaluation.create({
      data: {
        projectId,
        evaluatorId: session?.user ? (session.user as any).id : null,
        evaluatorName: evaluatorName || session?.user?.name || 'Accredited SIH Evaluator',
        evaluatorRole: evaluatorRole || (session?.user as any)?.role || 'FACULTY_EXPERT',
        innovation: inn,
        feasibility: fea,
        cost: cst,
        scalability: sca,
        socialImpact: soc,
        overallScore,
        recommendation: recommendation || (overallScore >= 80 ? 'RECOMMENDED_FOR_PILOT' : 'APPROVED'),
        comments: comments || 'Evaluation completed based on official 5-criteria framework.'
      }
    })

    return NextResponse.json({ success: true, data: evaluation })
  } catch (error) {
    console.error('Submit evaluation error:', error)
    return NextResponse.json({ success: false, error: 'Failed to submit evaluation' }, { status: 500 })
  }
}
