import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const files = await prisma.projectFile.findMany({
      where: { projectId: params.id },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ success: true, data: files })
  } catch (error) {
    console.error('Fetch files error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch files' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()
    const { name, url, fileType, sizeBytes } = body

    const file = await prisma.projectFile.create({
      data: {
        projectId: params.id,
        name: name || 'Document.pdf',
        url: url || '/files/' + (name || 'doc.pdf'),
        fileType: fileType || 'DOCUMENT',
        sizeBytes: sizeBytes || 1048576,
        uploadedBy: session?.user?.name || 'Project Contributor'
      }
    })

    return NextResponse.json({ success: true, data: file })
  } catch (error) {
    console.error('Upload file error:', error)
    return NextResponse.json({ success: false, error: 'Failed to save project file' }, { status: 500 })
  }
}
