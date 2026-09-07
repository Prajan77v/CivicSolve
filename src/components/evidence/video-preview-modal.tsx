'use client'

import React, { useState, useRef, useEffect } from 'react'
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Download,
  Film,
  Layers,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { formatFileSize } from '@/lib/evidence-shared'

export interface VideoPreviewItem {
  url: string
  title?: string
  filename?: string
  originalName?: string
  mimeType?: string
  sizeBytes?: number
  uploadedBy?: string | null
  caption?: string | null
  stage?: string | null
  createdAt?: string | Date
}

interface VideoPreviewModalProps {
  isOpen: boolean
  video: VideoPreviewItem | null
  onClose: () => void
  playlist?: VideoPreviewItem[]
  onSelectVideo?: (video: VideoPreviewItem) => void
}

export default function VideoPreviewModal({
  isOpen,
  video,
  onClose,
  playlist = [],
  onSelectVideo,
}: VideoPreviewModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [showControls, setShowControls] = useState(true)
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Reset states when video changes
  useEffect(() => {
    if (isOpen && video) {
      setIsPlaying(true)
      setCurrentTime(0)
      if (videoRef.current) {
        videoRef.current.currentTime = 0
        videoRef.current.play().catch(() => {
          setIsPlaying(false)
        })
      }
    } else {
      setIsPlaying(false)
    }
  }, [isOpen, video?.url])

  // Keyboard shortcut handler
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {})
        } else {
          onClose()
        }
      } else if (e.key === ' ' || e.key === 'k') {
        e.preventDefault()
        togglePlay()
      } else if (e.key === 'm') {
        e.preventDefault()
        toggleMute()
      } else if (e.key === 'f') {
        e.preventDefault()
        toggleFullscreen()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        seekForward(5)
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        seekBackward(5)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, isPlaying, isMuted])

  // Track Fullscreen changes
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFsChange)
    return () => document.removeEventListener('fullscreenchange', handleFsChange)
  }, [])

  const togglePlay = () => {
    if (!videoRef.current) return
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {})
    } else {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }

  const toggleMute = () => {
    if (!videoRef.current) return
    const nextMute = !isMuted
    videoRef.current.muted = nextMute
    setIsMuted(nextMute)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value)
    setVolume(val)
    if (videoRef.current) {
      videoRef.current.volume = val
      videoRef.current.muted = val === 0
      setIsMuted(val === 0)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value)
    setCurrentTime(time)
    if (videoRef.current) {
      videoRef.current.currentTime = time
    }
  }

  const seekForward = (seconds: number) => {
    if (!videoRef.current) return
    const next = Math.min(videoRef.current.currentTime + seconds, duration)
    videoRef.current.currentTime = next
    setCurrentTime(next)
  }

  const seekBackward = (seconds: number) => {
    if (!videoRef.current) return
    const next = Math.max(videoRef.current.currentTime - seconds, 0)
    videoRef.current.currentTime = next
    setCurrentTime(next)
  }

  const changeSpeed = (rate: number) => {
    setPlaybackRate(rate)
    if (videoRef.current) {
      videoRef.current.playbackRate = rate
    }
  }

  const toggleFullscreen = () => {
    if (!containerRef.current) return
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {})
    } else {
      document.exitFullscreen().catch(() => {})
    }
  }

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  const handleMouseMove = () => {
    setShowControls(true)
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current)
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false)
      }, 2800)
    }
  }

  if (!isOpen || !video) return null

  const displayName = video.originalName || video.title || video.filename || 'Civic Evidence Video'

  return (
    <AnimatePresence>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Video Preview Modal"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-4 md:p-6"
      >
        {/* Modal Outer Shell */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          transition={{ type: 'spring', damping: 26, stiffness: 280 }}
          ref={containerRef}
          onMouseMove={handleMouseMove}
          className="relative flex flex-col w-full max-w-5xl max-h-[96vh] rounded-2xl border border-slate-700/80 bg-slate-950 text-slate-100 shadow-2xl overflow-hidden"
        >
          {/* Top Bar Header */}
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 bg-slate-900/90 backdrop-blur-md z-20">
            <div className="flex items-center gap-2.5 truncate max-w-[80%]">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30">
                <Film className="h-4 w-4" />
              </div>
              <div className="truncate">
                <h3 className="text-sm font-bold text-white truncate" title={displayName}>
                  {displayName}
                </h3>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                  <span className="text-purple-400 font-bold uppercase">{video.mimeType || 'VIDEO'}</span>
                  {video.sizeBytes ? <span>• {formatFileSize(video.sizeBytes)}</span> : null}
                  {video.uploadedBy && <span>• Uploaded by {video.uploadedBy}</span>}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href={video.url}
                download={video.originalName || 'video'}
                target="_blank"
                rel="noreferrer"
                title="Download original video"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
              >
                <Download className="h-3.5 w-3.5 text-cyan-400" />
                Download
              </a>

              <button
                type="button"
                onClick={onClose}
                title="Close video preview (Esc)"
                aria-label="Close video preview"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Main Video Viewport */}
          <div className="relative flex-1 bg-black flex items-center justify-center min-h-[300px] sm:min-h-[420px] max-h-[70vh] overflow-hidden group">
            <video
              ref={videoRef}
              src={video.url}
              playsInline
              preload="auto"
              onClick={togglePlay}
              onTimeUpdate={() => {
                if (videoRef.current) setCurrentTime(videoRef.current.currentTime)
              }}
              onLoadedMetadata={() => {
                if (videoRef.current) setDuration(videoRef.current.duration)
              }}
              onEnded={() => setIsPlaying(false)}
              className="h-full w-full object-contain cursor-pointer"
            />

            {/* Big Play/Pause Overlay Indicator on Click */}
            {!isPlaying && (
              <button
                type="button"
                onClick={togglePlay}
                title="Play Video"
                className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] transition-all group-hover:bg-black/50"
              >
                <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-purple-600/90 text-white shadow-2xl shadow-purple-500/40 transition-transform transform hover:scale-110 active:scale-95">
                  <Play className="h-8 w-8 fill-white translate-x-0.5" />
                </div>
              </button>
            )}

            {/* Custom On-Screen Player Controls Bar */}
            <div
              className={cn(
                'absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-3 sm:p-4 space-y-2 transition-opacity duration-200 z-10',
                showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
              )}
            >
              {/* Progress Scrubber */}
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  step={0.1}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1.5 bg-slate-700/80 rounded-lg appearance-none cursor-pointer accent-purple-400 hover:h-2 transition-all"
                  aria-label="Seek video progress"
                />
              </div>

              {/* Bottom Control Buttons */}
              <div className="flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 sm:gap-3">
                  {/* Play/Pause */}
                  <button
                    type="button"
                    onClick={togglePlay}
                    title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                  >
                    {isPlaying ? <Pause className="h-4 w-4 fill-white" /> : <Play className="h-4 w-4 fill-white translate-x-0.5" />}
                  </button>

                  {/* 5s Backward / Forward */}
                  <button
                    type="button"
                    onClick={() => seekBackward(5)}
                    title="Rewind 5s (Left Arrow)"
                    className="hidden sm:flex h-7 px-2 items-center justify-center rounded bg-white/5 hover:bg-white/15 text-slate-300 font-mono text-[11px]"
                  >
                    -5s
                  </button>
                  <button
                    type="button"
                    onClick={() => seekForward(5)}
                    title="Forward 5s (Right Arrow)"
                    className="hidden sm:flex h-7 px-2 items-center justify-center rounded bg-white/5 hover:bg-white/15 text-slate-300 font-mono text-[11px]"
                  >
                    +5s
                  </button>

                  {/* Volume / Mute */}
                  <div className="flex items-center gap-1.5 group/vol">
                    <button
                      type="button"
                      onClick={toggleMute}
                      title={isMuted ? 'Unmute (M)' : 'Mute (M)'}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 hover:text-white transition-colors"
                    >
                      {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </button>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-16 h-1 bg-slate-700 rounded appearance-none cursor-pointer accent-purple-400 hidden sm:block"
                      aria-label="Volume slider"
                    />
                  </div>

                  {/* Time Counter */}
                  <span className="font-mono text-[11px] text-slate-300">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                {/* Right controls: Speed selector & Fullscreen */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {/* Speed Picker */}
                  <div className="flex items-center rounded-lg bg-white/10 p-0.5 text-[10px] font-mono">
                    {[0.75, 1, 1.25, 1.5, 2].map((rate) => (
                      <button
                        key={rate}
                        type="button"
                        onClick={() => changeSpeed(rate)}
                        className={cn(
                          'px-1.5 py-0.5 rounded transition-colors',
                          playbackRate === rate ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                        )}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>

                  {/* Fullscreen Button */}
                  <button
                    type="button"
                    onClick={toggleFullscreen}
                    title={isFullscreen ? 'Exit Fullscreen (F)' : 'Fullscreen (F)'}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                  >
                    {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Optional Playlist / Related Videos Drawer */}
          {playlist.length > 1 && (
            <div className="border-t border-white/10 bg-slate-900/90 px-4 py-2.5">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
                <span className="flex items-center gap-1">
                  <Layers className="h-3.5 w-3.5 text-purple-400" /> Evidence Video Playlist ({playlist.length})
                </span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                {playlist.map((item, idx) => {
                  const isCurrent = item.url === video.url
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => onSelectVideo && onSelectVideo(item)}
                      className={cn(
                        'flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all shrink-0 text-left',
                        isCurrent
                          ? 'border-purple-500 bg-purple-500/20 text-purple-200'
                          : 'border-white/10 bg-slate-800/80 text-slate-400 hover:border-slate-600 hover:text-white'
                      )}
                    >
                      <Play className="h-3 w-3 fill-current" />
                      <span className="truncate max-w-[140px]">{item.originalName || item.filename || `Video ${idx + 1}`}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
