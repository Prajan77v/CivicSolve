import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { deleteUploadedFile } from '@/lib/storage'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const { id: problemId } = await Promise.resolve(context.params)

    const evidence = await prisma.problemEvidence.findMany({
      where: { problemId },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, data: evidence })
  } catch (error: any) {
    console.error('Fetch evidence error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch problem evidence' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const { id: problemId } = await Promise.resolve(context.params)
    const session = await getServerSession(authOptions)
    const body = await request.json().catch(() => ({}))
    const { items, item } = body

    const evidenceList: any[] = items || (item ? [item] : [])
    if (evidenceList.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No evidence items provided' },
        { status: 400 }
      )
    }

    const created = []
    for (const ev of evidenceList) {
      const record = await prisma.problemEvidence.create({
        data: {
          problemId,
          type: ev.type || 'DOCUMENT',
          url: ev.url,
          filename: ev.filename || 'evidence_file',
          originalName: ev.originalName || ev.filename || 'evidence_file',
          mimeType: ev.mimeType || 'application/octet-stream',
          sizeBytes: ev.sizeBytes || 0,
          uploadedBy: ev.uploadedBy || session?.user?.name || 'Citizen Reporter',
          caption: ev.caption || null,
          stage: ev.stage || 'PROBLEM',
        },
      })
      created.push(record)
    }

    return NextResponse.json({ success: true, data: created }, { status: 201 })
  } catch (error: any) {
    console.error('Create evidence error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to attach evidence' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const { id: problemId } = await Promise.resolve(context.params)
    const { searchParams } = new URL(request.url)
    const evidenceId = searchParams.get('evidenceId')

    if (!evidenceId) {
      return NextResponse.json(
        { success: false, error: 'evidenceId is required' },
        { status: 400 }
      )
    }

    const evidence = await prisma.problemEvidence.findUnique({
      where: { id: evidenceId },
    })

    if (!evidence || evidence.problemId !== problemId) {
      return NextResponse.json(
        { success: false, error: 'Evidence record not found' },
        { status: 404 }
      )
    }

    // Delete record from DB
    await prisma.problemEvidence.delete({
      where: { id: evidenceId },
    })

    // Delete disk file
    if (evidence.filename) {
      await deleteUploadedFile(evidence.filename)
    }

    return NextResponse.json({ success: true, message: 'Evidence deleted successfully' })
  } catch (error: any) {
    console.error('Delete evidence error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete evidence' },
      { status: 500 }
    )
  }
}
