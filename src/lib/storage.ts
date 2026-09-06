import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import {
  EvidenceMediaType,
  UPLOAD_LIMITS,
  formatFileSize,
} from './evidence-shared'

export type { EvidenceMediaType }
export { UPLOAD_LIMITS, formatFileSize }

// Upload directory paths
export const UPLOAD_DIR = path.join(process.cwd(), 'prisma', 'uploads')

// Ensure upload directory exists
export function ensureUploadDir(): string {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true })
  }
  return UPLOAD_DIR
}

// Dangerous executable extensions to block
const BLOCKED_EXTENSIONS = [
  '.exe', '.bat', '.cmd', '.sh', '.bash', '.vbs', '.js', '.jsx', '.ts', '.tsx',
  '.msi', '.com', '.pif', '.scr', '.jar', '.php', '.py', '.rb', '.pl', '.cgi',
]

export interface ValidatedFileMeta {
  type: EvidenceMediaType
  filename: string
  originalName: string
  mimeType: string
  sizeBytes: number
  storagePath: string
  url: string
}

export function detectMediaType(filename: string, mimeType: string): EvidenceMediaType | null {
  const ext = path.extname(filename).toLowerCase()
  const lowerMime = mimeType.toLowerCase()

  if (
    UPLOAD_LIMITS.IMAGE.allowedExtensions.includes(ext) ||
    UPLOAD_LIMITS.IMAGE.allowedMimeTypes.includes(lowerMime) ||
    lowerMime.startsWith('image/')
  ) {
    return 'IMAGE'
  }

  if (
    UPLOAD_LIMITS.VIDEO.allowedExtensions.includes(ext) ||
    UPLOAD_LIMITS.VIDEO.allowedMimeTypes.includes(lowerMime) ||
    lowerMime.startsWith('video/')
  ) {
    return 'VIDEO'
  }

  if (
    UPLOAD_LIMITS.DOCUMENT.allowedExtensions.includes(ext) ||
    UPLOAD_LIMITS.DOCUMENT.allowedMimeTypes.includes(lowerMime) ||
    lowerMime.includes('pdf') ||
    lowerMime.includes('document') ||
    lowerMime.includes('sheet') ||
    lowerMime.startsWith('text/')
  ) {
    return 'DOCUMENT'
  }

  return null
}

export function validateFile(
  originalName: string,
  mimeType: string,
  sizeBytes: number
): { valid: boolean; error?: string; type?: EvidenceMediaType } {
  const ext = path.extname(originalName).toLowerCase()

  // 1. Check dangerous extension
  if (BLOCKED_EXTENSIONS.includes(ext)) {
    return { valid: false, error: `Executable or script files like ${ext} are blocked for security.` }
  }

  // 2. Detect category
  const mediaType = detectMediaType(originalName, mimeType)
  if (!mediaType) {
    return {
      valid: false,
      error: `File type "${ext || mimeType}" is not supported. Supported: JPG, PNG, WEBP, MP4, WEBM, MOV, PDF, TXT, DOC.`,
    }
  }

  const limits = UPLOAD_LIMITS[mediaType]

  // 3. Validate size
  if (sizeBytes > limits.maxSizeBytes) {
    const maxMb = Math.round(limits.maxSizeBytes / (1024 * 1024))
    return {
      valid: false,
      error: `${mediaType === 'VIDEO' ? 'Video' : mediaType === 'IMAGE' ? 'Photo' : 'Document'} is too large. Maximum size is ${maxMb} MB.`,
    }
  }

  if (sizeBytes <= 0) {
    return { valid: false, error: 'File is empty (0 bytes).' }
  }

  return { valid: true, type: mediaType }
}

export async function saveUploadedFileBuffer(
  buffer: Buffer,
  originalName: string,
  mimeType: string
): Promise<ValidatedFileMeta> {
  const validation = validateFile(originalName, mimeType, buffer.length)
  if (!validation.valid || !validation.type) {
    throw new Error(validation.error || 'Invalid file')
  }

  const dir = ensureUploadDir()
  const ext = path.extname(originalName).toLowerCase() || (validation.type === 'IMAGE' ? '.jpg' : validation.type === 'VIDEO' ? '.mp4' : '.pdf')
  
  // Create collision-safe filename: ev_<timestamp>_<randomHex><ext>
  const uniqueId = `ev_${Date.now()}_${crypto.randomBytes(6).toString('hex')}${ext}`
  const filePath = path.join(dir, uniqueId)

  await fs.promises.writeFile(filePath, buffer)

  return {
    type: validation.type,
    filename: uniqueId,
    originalName: originalName || uniqueId,
    mimeType: mimeType || 'application/octet-stream',
    sizeBytes: buffer.length,
    storagePath: filePath,
    url: `/api/media/${uniqueId}`,
  }
}

export async function deleteUploadedFile(filename: string): Promise<boolean> {
  try {
    // Sanitize filename to prevent directory traversal
    const safeFilename = path.basename(filename)
    const filePath = path.join(ensureUploadDir(), safeFilename)
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath)
      return true
    }
  } catch (err) {
    console.warn(`Failed to delete disk file ${filename}:`, err)
  }
  return false
}

