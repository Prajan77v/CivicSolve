import { NextRequest, NextResponse } from 'next/server'
import { saveUploadedFileBuffer, validateFile } from '@/lib/storage'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const singleFile = formData.get('file') as File | null

    const filesToProcess: File[] = []
    if (files && files.length > 0) {
      filesToProcess.push(...files)
    } else if (singleFile) {
      filesToProcess.push(singleFile)
    }

    if (filesToProcess.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No files provided for upload' },
        { status: 400 }
      )
    }

    const results = []
    const errors = []

    for (const file of filesToProcess) {
      try {
        const validation = validateFile(file.name, file.type, file.size)
        if (!validation.valid) {
          errors.push({ filename: file.name, error: validation.error })
          continue
        }

        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        const saved = await saveUploadedFileBuffer(buffer, file.name, file.type)
        results.push(saved)
      } catch (err: any) {
        errors.push({ filename: file.name, error: err.message || 'Save failed' })
      }
    }

    if (results.length === 0 && errors.length > 0) {
      return NextResponse.json(
        { success: false, error: errors[0].error, details: errors },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      data: results,
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (error: any) {
    console.error('Media upload API error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error during media upload' },
      { status: 500 }
    )
  }
}
