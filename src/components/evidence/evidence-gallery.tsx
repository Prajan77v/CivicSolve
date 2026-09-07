'use client'

import React, { useState, useEffect } from 'react'
import {
  Camera,
  Video,
  FileText,
  Download,
  Trash2,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  X,
  Plus,
  Play,
  CheckCircle2,
  FileCheck,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { formatFileSize } from '@/lib/evidence-shared'
import EvidenceUploadZone, { UploadedEvidenceItem } from './evidence-upload-zone'
import VideoPreviewModal, { VideoPreviewItem } from './video-preview-modal'

export interface EvidenceItem {
  id: string
  problemId?: string
  projectId?: string
  type: string // "IMAGE" | "VIDEO" | "DOCUMENT"
  url: string
  filename?: string
  originalName?: string
  mimeType?: string
  sizeBytes?: number
  uploadedBy?: string | null
  caption?: string | null
  stage?: string | null
  createdAt?: string | Date
}

interface EvidenceGalleryProps {
  evidence: EvidenceItem[]
  problemId?: string
  canEdit?: boolean
  onEvidenceChange?: () => void
  className?: string
}

export default function EvidenceGallery({
  evidence = [],
  problemId,
  canEdit = false,
  onEvidenceChange,
  className,
}: EvidenceGalleryProps) {
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'IMAGE' | 'VIDEO' | 'DOCUMENT'>('ALL')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [previewVideo, setPreviewVideo] = useState<EvidenceItem | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [stagedNewItems, setStagedNewItems] = useState<UploadedEvidenceItem[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Filter items
  const filtered =
    activeFilter === 'ALL'
      ? evidence
      : evidence.filter((ev) => ev.type === activeFilter)

  const imageItems = evidence.filter((ev) => ev.type === 'IMAGE')
  const videoItems = evidence.filter((ev) => ev.type === 'VIDEO')
  const docItems = evidence.filter((ev) => ev.type === 'DOCUMENT')

  // Lightbox keyboard navigation
  useEffect(() => {
    if (lightboxIndex === null) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxIndex(null)
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev !== null && prev < imageItems.length - 1 ? prev + 1 : 0))
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : imageItems.length - 1))
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxIndex, imageItems.length])

  // Delete evidence handler with confirmation
  const handleDelete = async (ev: EvidenceItem) => {
    if (!problemId) return
    const confirmed = window.confirm(`Remove this ${ev.type.toLowerCase()} evidence "${ev.originalName || ev.filename || 'item'}"?`)
    if (!confirmed) return

    setDeletingId(ev.id)
    try {
      const res = await fetch(`/api/problems/${problemId}/evidence?evidenceId=${ev.id}`, {
        method: 'DELETE',
      })
      const json = await res.json()
      if (json.success) {
        toast.success('Evidence removed successfully')
        if (onEvidenceChange) onEvidenceChange()
      } else {
        toast.error(json.error || 'Failed to delete evidence')
      }
    } catch {
      toast.error('Network error deleting evidence')
    } finally {
      setDeletingId(null)
    }
  }

  // Save newly staged items to existing problem
  const handleSaveStagedEvidence = async () => {
    if (!problemId || stagedNewItems.length === 0) return

    setIsSaving(true)
    try {
      const payload = stagedNewItems.map((item) => ({
        type: item.type,
        url: item.url,
        filename: item.filename,
        originalName: item.originalName,
        mimeType: item.mimeType,
        sizeBytes: item.sizeBytes,
        caption: item.caption,
        stage: 'PROBLEM',
      }))

      const res = await fetch(`/api/problems/${problemId}/evidence`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: payload }),
      })

      const json = await res.json()
      if (json.success) {
        toast.success(`Attached ${stagedNewItems.length} new evidence items!`)
        setIsAddModalOpen(false)
        setStagedNewItems([])
        if (onEvidenceChange) onEvidenceChange()
      } else {
        toast.error(json.error || 'Failed to save evidence')
      }
    } catch {
      toast.error('Network error saving evidence')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className={cn('space-y-6', className)} data-testid="evidence-gallery">
      {/* Evidence Controls & Category Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveFilter('ALL')}
            className={cn(
              'px-3 py-1 text-xs font-semibold rounded-lg border transition-all',
              activeFilter === 'ALL'
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow-sm'
                : 'bg-[#0d1117] text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
            )}
          >
            All Evidence ({evidence.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('IMAGE')}
            className={cn(
              'px-3 py-1 text-xs font-semibold rounded-lg border transition-all flex items-center gap-1.5',
              activeFilter === 'IMAGE'
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow-sm'
                : 'bg-[#0d1117] text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
            )}
          >
            <Camera className="h-3 w-3" />
            Photos ({imageItems.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('VIDEO')}
            className={cn(
              'px-3 py-1 text-xs font-semibold rounded-lg border transition-all flex items-center gap-1.5',
              activeFilter === 'VIDEO'
                ? 'bg-purple-500 text-slate-950 border-purple-400 font-bold shadow-sm'
                : 'bg-[#0d1117] text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
            )}
          >
            <Video className="h-3 w-3" />
            Videos ({videoItems.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('DOCUMENT')}
            className={cn(
              'px-3 py-1 text-xs font-semibold rounded-lg border transition-all flex items-center gap-1.5',
              activeFilter === 'DOCUMENT'
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold shadow-sm'
                : 'bg-[#0d1117] text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
            )}
          >
            <FileText className="h-3 w-3" />
            Documents ({docItems.length})
          </button>
        </div>

        {/* Add Evidence Button */}
        {canEdit && problemId && (
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all"
          >
            <Plus className="h-3.5 w-3.5 text-cyan-400" />
            Upload Evidence
          </button>
        )}
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="rounded-xl border border-slate-800 bg-[#0d1117] p-8 text-center space-y-2">
          <FileText className="mx-auto h-8 w-8 text-slate-600" />
          <h4 className="text-xs font-semibold text-slate-300">
            No {activeFilter !== 'ALL' ? activeFilter.toLowerCase() : ''} evidence records attached yet
          </h4>
          <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
            Photographic, video, and lab evidence establishes empirical ground-truth for municipal triage.
          </p>
        </div>
      )}

      {/* Gallery Grid */}
      {filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((ev) => {
            const isImage = ev.type === 'IMAGE'
            const isVideo = ev.type === 'VIDEO'
            const isDoc = ev.type === 'DOCUMENT'

            return (
              <div
                key={ev.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-slate-800 bg-[#0d1117] p-3 transition-all hover:border-slate-700 shadow-sm"
              >
                {/* Media Container */}
                <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-slate-950 border border-white/5 flex items-center justify-center">
                  {isImage ? (
                    <>
                      <img
                        src={ev.url}
                        alt={ev.originalName || 'Evidence Photo'}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const idx = imageItems.findIndex((img) => img.id === ev.id)
                          if (idx !== -1) setLightboxIndex(idx)
                        }}
                        title="Enlarge photo"
                        className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity text-white"
                      >
                        <div className="rounded-full bg-black/60 p-2 backdrop-blur-sm">
                          <Maximize2 className="h-5 w-5 text-cyan-300" />
                        </div>
                      </button>
                    </>
                  ) : isVideo ? (
                    <div className="relative h-full w-full bg-slate-950 flex items-center justify-center">
                      <video
                        src={ev.url}
                        playsInline
                        preload="metadata"
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setPreviewVideo(ev)}
                        title="Open Video Preview Cinema Player"
                        className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 hover:bg-black/60 transition-all text-white group/btn cursor-pointer"
                      >
                        <div className="rounded-full bg-purple-600/90 p-3 shadow-lg shadow-purple-600/50 backdrop-blur-sm transform group-hover/btn:scale-110 active:scale-95 transition-transform">
                          <Play className="h-5 w-5 fill-white text-white translate-x-0.5" />
                        </div>
                        <span className="mt-2 text-[10px] font-bold tracking-wider uppercase bg-black/70 px-2 py-0.5 rounded text-purple-300 border border-purple-500/30">
                          Video Preview
                        </span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-4 text-center">
                      <FileText className="h-10 w-10 text-emerald-400 mb-1" />
                      <span className="font-mono text-[10px] text-slate-400 uppercase">
                        Technical Document
                      </span>
                    </div>
                  )}

                  {/* Top badges */}
                  <span className="absolute top-2 left-2 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-black/70 border border-white/10 text-slate-200 backdrop-blur-sm uppercase">
                    {ev.type}
                  </span>
                </div>

                {/* Details / Metadata */}
                <div className="mt-3 space-y-1 text-xs">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-semibold text-slate-200 truncate" title={ev.originalName || ev.filename}>
                      {ev.originalName || ev.filename || 'Evidence Record'}
                    </span>
                    {ev.sizeBytes ? (
                      <span className="shrink-0 font-mono text-[10px] text-slate-500">
                        {formatFileSize(ev.sizeBytes)}
                      </span>
                    ) : null}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1.5 border-t border-slate-800/80">
                    <span className="truncate">
                      By {ev.uploadedBy || 'Field Reporter'}
                    </span>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Video Preview Action Button */}
                      {isVideo && (
                        <button
                          type="button"
                          onClick={() => setPreviewVideo(ev)}
                          title="Open Video Preview"
                          className="inline-flex items-center gap-1 rounded bg-purple-500/15 border border-purple-500/30 px-2 py-0.5 text-[10px] font-bold text-purple-300 hover:bg-purple-500 hover:text-white transition-colors"
                        >
                          <Play className="h-2.5 w-2.5 fill-current" /> Preview
                        </button>
                      )}

                      {/* Open / Download */}
                      <a
                        href={ev.url}
                        target="_blank"
                        rel="noreferrer"
                        download={ev.originalName}
                        title="Download or open original"
                        className="text-slate-400 hover:text-cyan-300 p-1 transition-colors"
                      >
                        <Download className="h-3.5 w-3.5" />
                      </a>

                      {/* Delete */}
                      {canEdit && (
                        <button
                          type="button"
                          onClick={() => handleDelete(ev)}
                          disabled={deletingId === ev.id}
                          title="Delete evidence"
                          className="text-slate-500 hover:text-rose-400 p-1 transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Video Preview Cinema Modal */}
      <VideoPreviewModal
        isOpen={previewVideo !== null}
        video={previewVideo}
        playlist={videoItems}
        onSelectVideo={(item) => setPreviewVideo(item as any)}
        onClose={() => setPreviewVideo(null)}
      />

      {/* Lightbox / Modal Image Viewer */}
      {lightboxIndex !== null && imageItems[lightboxIndex] && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            className="absolute top-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900/80 border border-slate-700 text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Prev button */}
          {imageItems.length > 1 && (
            <button
              type="button"
              onClick={() =>
                setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : imageItems.length - 1))
              }
              className="absolute left-4 top-1/2 -translate-y-1/2 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900/80 border border-slate-700 text-white hover:bg-slate-800 transition-colors"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}

          {/* Next button */}
          {imageItems.length > 1 && (
            <button
              type="button"
              onClick={() =>
                setLightboxIndex((prev) => (prev !== null && prev < imageItems.length - 1 ? prev + 1 : 0))
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900/80 border border-slate-700 text-white hover:bg-slate-800 transition-colors"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}

          {/* Centered Image Container */}
          <div className="flex flex-col items-center max-w-5xl max-h-[90vh] space-y-3">
            <img
              src={imageItems[lightboxIndex].url}
              alt={imageItems[lightboxIndex].originalName || 'Evidence Photo'}
              className="max-h-[75vh] w-auto rounded-lg object-contain shadow-2xl border border-white/10"
            />
            <div className="flex items-center justify-between w-full text-xs font-mono text-slate-300 px-2">
              <span className="truncate max-w-md font-semibold text-white">
                {imageItems[lightboxIndex].originalName || imageItems[lightboxIndex].filename}
              </span>
              <div className="flex items-center gap-3 shrink-0">
                <span>
                  Photo {lightboxIndex + 1} of {imageItems.length}
                </span>
                {imageItems[lightboxIndex].sizeBytes && (
                  <span>{formatFileSize(imageItems[lightboxIndex].sizeBytes!)}</span>
                )}
                <a
                  href={imageItems[lightboxIndex].url}
                  download={imageItems[lightboxIndex].originalName}
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-sans"
                >
                  <Download className="h-3.5 w-3.5" /> Download
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Evidence Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="h-4 w-4 text-cyan-400" />
                Upload New Evidence Record
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false)
                  setStagedNewItems([])
                }}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <EvidenceUploadZone
              items={stagedNewItems}
              onChange={(items) => setStagedNewItems(items)}
            />

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false)
                  setStagedNewItems([])
                }}
                className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-800 text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSaving || stagedNewItems.length === 0}
                onClick={handleSaveStagedEvidence}
                className="px-4 py-2 text-xs font-bold rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 disabled:opacity-50 shadow-sm"
              >
                {isSaving ? 'Attaching Evidence...' : `Attach ${stagedNewItems.length} Item${stagedNewItems.length === 1 ? '' : 's'}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
