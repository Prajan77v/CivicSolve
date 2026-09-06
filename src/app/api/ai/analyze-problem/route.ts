import { NextRequest, NextResponse } from 'next/server'
import { aiProvider } from '@/lib/ai'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, category, district, state } = body

    const analysis = await aiProvider.analyzeProblem({
      title: title || 'Civic Problem',
      description: description || 'Civic issue description',
      category: category || 'GENERAL',
      district: district || 'Unknown',
      state: state || 'Unknown',
    })

    return NextResponse.json({ success: true, data: analysis })
  } catch (error) {
    console.error('AI analysis error:', error)
    return NextResponse.json({ success: false, error: 'AI analysis failed' }, { status: 500 })
  }
}
