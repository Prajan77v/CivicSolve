// Client-safe constants and formatting utilities for evidence files

export type EvidenceMediaType = 'IMAGE' | 'VIDEO' | 'DOCUMENT'

// Sensible prototype upload limits
export const UPLOAD_LIMITS = {
  IMAGE: {
    maxSizeBytes: 10 * 1024 * 1024, // 10 MB
    maxFiles: 10,
    allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
  },
  VIDEO: {
    maxSizeBytes: 100 * 1024 * 1024, // 100 MB
    maxFiles: 3,
    allowedMimeTypes: ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-matroska', 'video/ogg'],
    allowedExtensions: ['.mp4', '.webm', '.mov', '.mkv', '.ogv'],
  },
  DOCUMENT: {
    maxSizeBytes: 25 * 1024 * 1024, // 25 MB
    maxFiles: 10,
    allowedMimeTypes: [
      'application/pdf',
      'text/plain',
      'text/csv',
      'application/json',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
    allowedExtensions: ['.pdf', '.txt', '.csv', '.json', '.doc', '.docx', '.xls', '.xlsx'],
  },
}

export function formatFileSize(bytes: number): string {
  if (!bytes || bytes <= 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}
