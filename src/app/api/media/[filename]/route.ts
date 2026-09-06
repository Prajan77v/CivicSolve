import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { UPLOAD_DIR } from '@/lib/storage'

export const dynamic = 'force-dynamic'

const MIME_MAP: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mov': 'video/quicktime',
  '.mkv': 'video/x-matroska',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain',
  '.csv': 'text/csv',
  '.json': 'application/json',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
}

export async function GET(
  request: NextRequest,
  context: { params: { filename: string } | Promise<{ filename: string }> }
) {
  try {
    const { filename } = await Promise.resolve(context.params)
    
    // Sanitize filename to prevent path traversal
    const safeFilename = path.basename(filename)
    const filePath = path.join(UPLOAD_DIR, safeFilename)

    if (!fs.existsSync(filePath)) {
      return new NextResponse('File Not Found', { status: 404 })
    }

    const stat = await fs.promises.stat(filePath)
    const fileSize = stat.size
    const ext = path.extname(safeFilename).toLowerCase()
    const contentType = MIME_MAP[ext] || 'application/octet-stream'

    // Check for HTTP Range header (crucial for video streaming & seeking)
    const range = request.headers.get('range')

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-')
      const start = parseInt(parts[0], 10)
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1

      if (start >= fileSize || end >= fileSize) {
        return new NextResponse(null, {
          status: 416,
          headers: {
            'Content-Range': `bytes */${fileSize}`,
          },
        })
      }

      const chunkSize = end - start + 1
      const stream = fs.createReadStream(filePath, { start, end })

      return new NextResponse(stream as any, {
        status: 206,
        headers: {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': String(chunkSize),
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      })
    }

    // Normal full file response
    const stream = fs.createReadStream(filePath)
    return new NextResponse(stream as any, {
      status: 200,
      headers: {
        'Content-Length': String(fileSize),
        'Content-Type': contentType,
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=86400',
      },
    })
  } catch (error: any) {
    console.error('Media streaming error:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
