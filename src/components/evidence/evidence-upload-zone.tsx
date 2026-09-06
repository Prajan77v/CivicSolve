'use client'

import React, { useState, useRef } from 'react'
import {
  Upload,
  Camera,
  Video,
  FileText,
  X,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Film,
  Paperclip,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { formatFileSize, UPLOAD_LIMITS, EvidenceMediaType } from '@/lib/evidence-shared'

export interface UploadedEvidenceItem {
  id?: string
  url: string
  filename: string
  originalName: string
  mimeType: string
  sizeBytes: number
  type: EvidenceMediaType
  caption?: string
  previewUrl?: string
  uploading?: boolean
  progress?: number
  error?: string
}

interface EvidenceUploadZoneProps {
  items: UploadedEvidenceItem[]
  onChange: (items: UploadedEvidenceItem[]) => void
  disabled?: boolean
  className?: string
}

export default function EvidenceUploadZone({
  items,
  onChange,
  disabled = false,
  className,
}: EvidenceUploadZoneProps) {
  const [activeTypeTab, setActiveTypeTab] = useState<'ALL' | 'IMAGE' | 'VIDEO' | 'DOCUMENT'>('ALL')
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [currentAccept, setCurrentAccept] = useState<string>('*/*')

  // Keep a ref to the latest items to avoid stale closures during async uploads
  const itemsRef = useRef(items)
  itemsRef.current = items

  // Count existing items by type
  const photoCount = items.filter((i) => i.type === 'IMAGE').length
  const videoCount = items.filter((i) => i.type === 'VIDEO').length
  const docCount = items.filter((i) => i.type === 'DOCUMENT').length

  const handleOpenFileDialog = (category?: 'IMAGE' | 'VIDEO' | 'DOCUMENT') => {
    if (disabled) return

    let accept = '*/*'
    if (category === 'IMAGE') {
      accept = 'image/jpeg,image/jpg,image/png,image/webp'
    } else if (category === 'VIDEO') {
      accept = 'video/mp4,video/webm,video/quicktime'
    } else if (category === 'DOCUMENT') {
      accept = '.pdf,.doc,.docx,.txt,.csv'
    }
    setCurrentAccept(accept)

    if (fileInputRef.current) {
      fileInputRef.current.accept = accept
      fileInputRef.current.click()
    }
  }

  const validateAndUploadFiles = async (filesList: FileList | File[]) => {
    const rawFiles = Array.from(filesList)
    if (rawFiles.length === 0) return

    for (const file of rawFiles) {
      // 1. Detect type
      let type: EvidenceMediaType = 'DOCUMENT'
      if (file.type.startsWith('image/')) type = 'IMAGE'
      else if (file.type.startsWith('video/')) type = 'VIDEO'

      // 2. Enforce limits
      const limits = UPLOAD_LIMITS[type]
      const currentCount = items.filter((i) => i.type === type).length

      if (currentCount >= limits.maxFiles) {
        toast.error(`Maximum limit reached: You can upload up to ${limits.maxFiles} ${type === 'IMAGE' ? 'photos' : type === 'VIDEO' ? 'videos' : 'documents'}.`)
        continue
      }

      if (file.size > limits.maxSizeBytes) {
        const maxMb = Math.round(limits.maxSizeBytes / (1024 * 1024))
        toast.error(`${type === 'VIDEO' ? 'Video' : type === 'IMAGE' ? 'Photo' : 'Document'} "${file.name}" is too large. Maximum size is ${maxMb} MB.`)
        continue
      }

      if (file.size <= 0) {
        toast.error(`File "${file.name}" is empty (0 bytes).`)
        continue
      }

      // Create local preview URL
      const localPreview = URL.createObjectURL(file)
      const tempId = `temp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`

      const tempItem: UploadedEvidenceItem = {
        id: tempId,
        url: localPreview,
        previewUrl: localPreview,
        filename: file.name,
        originalName: file.name,
        mimeType: file.type || 'application/octet-stream',
        sizeBytes: file.size,
        type,
        uploading: true,
        progress: 25,
      }

      // Add to list with uploading state
      const nextList = [...itemsRef.current, tempItem]
      itemsRef.current = nextList
      onChange(nextList)

      // Upload in background to /api/media/upload
      try {
        const formData = new FormData()
        formData.append('file', file)

        const res = await fetch('/api/media/upload', {
          method: 'POST',
          body: formData,
        })

        const json = await res.json()
        if (json.success && json.data && json.data.length > 0) {
          const uploadedMeta = json.data[0]
          // Replace temp item with persisted file metadata
          const updated = itemsRef.current.map((item) =>
            item.id === tempId
              ? {
                  ...item,
                  url: uploadedMeta.url,
                  filename: uploadedMeta.filename,
                  originalName: uploadedMeta.originalName,
                  mimeType: uploadedMeta.mimeType,
                  sizeBytes: uploadedMeta.sizeBytes,
                  type: uploadedMeta.type,
                  uploading: false,
                  progress: 100,
                }
              : item
          )
          itemsRef.current = updated
          onChange(updated)
          toast.success(`Uploaded ${file.name}`)
        } else {
          throw new Error(json.error || 'Upload failed')
        }
      } catch (err: any) {
        console.error('Upload failed:', err)
        toast.error(`Failed to upload ${file.name}: ${err.message}`)
        // Mark error or remove
        const updated = itemsRef.current.map((item) =>
          item.id === tempId
            ? { ...item, uploading: false, error: err.message || 'Upload failed' }
            : item
        )
        itemsRef.current = updated
        onChange(updated)
      }
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    if (disabled) return
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndUploadFiles(e.dataTransfer.files)
    }
  }

  const handleRemove = (itemToRemove: UploadedEvidenceItem) => {
    if (disabled) return
    const currentList = itemsRef.current
    if (itemToRemove.previewUrl) {
      URL.revokeObjectURL(itemToRemove.previewUrl)
    }
    const filtered = currentList.filter((i) => {
      if (itemToRemove.id && i.id) return i.id !== itemToRemove.id
      if (itemToRemove.filename && i.filename) return i.filename !== itemToRemove.filename
      return i !== itemToRemove
    })
    itemsRef.current = filtered
    onChange(filtered)
  }

  // Filtered view based on tab
  const displayedItems =
    activeTypeTab === 'ALL'
      ? items
      : items.filter((i) => i.type === activeTypeTab)

  return (
    <div className={cn('space-y-4', className)}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        accept={currentAccept}
        disabled={disabled}
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            validateAndUploadFiles(e.target.files)
            e.target.value = '' // reset input
          }
        }}
      />

      {/* Action Header & Type Pickers */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handleOpenFileDialog('IMAGE')}
            disabled={disabled || photoCount >= UPLOAD_LIMITS.IMAGE.maxFiles}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-slate-200 shadow-sm transition-all hover:border-cyan-500/50 hover:bg-slate-800 hover:text-white disabled:opacity-50"
          >
            <Camera className="h-3.5 w-3.5 text-cyan-400" />
            Add Photos ({photoCount}/{UPLOAD_LIMITS.IMAGE.maxFiles})
          </button>

          <button
            type="button"
            onClick={() => handleOpenFileDialog('VIDEO')}
            disabled={disabled || videoCount >= UPLOAD_LIMITS.VIDEO.maxFiles}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-slate-200 shadow-sm transition-all hover:border-purple-500/50 hover:bg-slate-800 hover:text-white disabled:opacity-50"
          >
            <Video className="h-3.5 w-3.5 text-purple-400" />
            Add Videos ({videoCount}/{UPLOAD_LIMITS.VIDEO.maxFiles})
          </button>

          <button
            type="button"
            onClick={() => handleOpenFileDialog('DOCUMENT')}
            disabled={disabled || docCount >= UPLOAD_LIMITS.DOCUMENT.maxFiles}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-slate-200 shadow-sm transition-all hover:border-emerald-500/50 hover:bg-slate-800 hover:text-white disabled:opacity-50"
          >
            <FileText className="h-3.5 w-3.5 text-emerald-400" />
            Add Documents ({docCount}/{UPLOAD_LIMITS.DOCUMENT.maxFiles})
          </button>
        </div>

        {/* View Filter Tabs if there are items */}
        {items.length > 0 && (
          <div className="flex items-center rounded-lg border border-slate-800 bg-[#0d1117] p-0.5 text-xs font-medium">
            <button
              type="button"
              onClick={() => setActiveTypeTab('ALL')}
              className={cn(
                'rounded px-2.5 py-1 transition-colors',
                activeTypeTab === 'ALL'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              )}
            >
              All ({items.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTypeTab('IMAGE')}
              className={cn(
                'rounded px-2.5 py-1 transition-colors',
                activeTypeTab === 'IMAGE'
                  ? 'bg-slate-800 text-cyan-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              )}
            >
              Photos ({photoCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTypeTab('VIDEO')}
              className={cn(
                'rounded px-2.5 py-1 transition-colors',
                activeTypeTab === 'VIDEO'
                  ? 'bg-slate-800 text-purple-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              )}
            >
              Videos ({videoCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTypeTab('DOCUMENT')}
              className={cn(
                'rounded px-2.5 py-1 transition-colors',
                activeTypeTab === 'DOCUMENT'
                  ? 'bg-slate-800 text-emerald-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              )}
            >
              Docs ({docCount})
            </button>
          </div>
        )}
      </div>

      {/* Drag & Drop Surface */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all duration-200',
          isDragging
            ? 'border-cyan-400 bg-cyan-500/10 scale-[1.01]'
            : 'border-slate-800/90 bg-slate-950/40 hover:border-slate-700/80 hover:bg-slate-900/30',
          disabled && 'opacity-60 cursor-not-allowed'
        )}
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-900/90 border border-slate-800 text-slate-300 shadow-inner">
          <Upload className="h-6 w-6 text-cyan-400 animate-pulse" />
        </div>

        <h4 className="mt-3 text-sm font-bold text-slate-200">
          Drop evidence here
        </h4>
        <p className="mt-1 text-xs text-slate-400 max-w-md">
          Drag & drop photos (JPG, PNG, WEBP), videos (MP4, WebM, MOV), or technical reports (PDF, DOC).
        </p>

        <div className="mt-3 flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleOpenFileDialog()}
            disabled={disabled}
            className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-slate-700 hover:border-slate-600 active:scale-95"
          >
            Browse Files
          </button>
          <span className="text-[11px] text-slate-500 font-mono">
            Photos ≤ 10MB • Videos ≤ 100MB
          </span>
        </div>
      </div>

      {/* Previews Grid */}
      {displayedItems.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <span>Staged Evidence Items:</span>
            <span className="text-cyan-400 font-mono">({displayedItems.length})</span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            {displayedItems.map((item, index) => {
              const actualIdx = items.indexOf(item)

              return (
                <div
                  key={item.id || index}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-slate-800 bg-[#0d1117] p-3 shadow-md transition-all hover:border-slate-700"
                >
                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => handleRemove(item)}
                    title="Remove evidence file"
                    className="absolute right-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-slate-300 backdrop-blur-sm transition-colors hover:bg-rose-600 hover:text-white"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>

                  {/* Media Content Preview */}
                  <div className="overflow-hidden rounded-lg bg-black/40 border border-white/5">
                    {item.type === 'IMAGE' ? (
                      <div className="relative aspect-video w-full overflow-hidden bg-slate-950 flex items-center justify-center">
                        <img
                          src={item.url}
                          alt={item.originalName}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                    ) : item.type === 'VIDEO' ? (
                      <div className="relative aspect-video w-full bg-slate-950">
                        <video
                          src={item.url}
                          controls
                          playsInline
                          preload="metadata"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex aspect-video w-full flex-col items-center justify-center bg-slate-900/60 p-4 text-center">
                        <FileText className="h-8 w-8 text-emerald-400 mb-1" />
                        <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">
                          Document Attachment
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Metadata and progress */}
                  <div className="mt-2.5 space-y-1 text-xs">
                    <div className="flex items-center justify-between gap-1">
                      <span
                        data-testid="evidence-filename"
                        className="font-semibold text-slate-200 truncate"
                        title={item.originalName}
                      >
                        {item.originalName}
                      </span>
                      <span className="shrink-0 font-mono text-[10px] text-slate-400">
                        {formatFileSize(item.sizeBytes)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
                        {item.type}
                      </span>

                      {item.uploading ? (
                        <span className="flex items-center gap-1 text-cyan-400 text-[10px]">
                          <Loader2 className="h-3 w-3 animate-spin" /> Uploading...
                        </span>
                      ) : item.error ? (
                        <span className="flex items-center gap-1 text-rose-400 text-[10px]" title={item.error}>
                          <AlertCircle className="h-3 w-3" /> Failed
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-emerald-400 text-[10px]">
                          <CheckCircle2 className="h-3 w-3" /> Ready
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
