'use client'

import React from 'react'
import { Sparkles, ArrowRight } from 'lucide-react'
import { useLayout } from '@/components/layout/layout-context'

interface ProjectCopilotButtonProps {
  title?: string
  subtitle?: string
  className?: string
  mode?: 'button' | 'card' | 'banner'
}

export function ProjectCopilotButton({
  title = 'Ask Civic AI Copilot',
  subtitle = 'Get recommendations on next steps, audit milestones, or create tasks',
  className = '',
  mode = 'button',
}: ProjectCopilotButtonProps) {
  const { setAiOpen } = useLayout()

  if (mode === 'card') {
    return (
      <div
        onClick={() => setAiOpen(true)}
        className={`p-4 rounded-xl bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-cyan-950/40 border border-cyan-500/30 hover:border-cyan-500/60 shadow-lg cursor-pointer transition-all hover:scale-[1.01] group ${className}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-2">
                {title}
                <span className="rounded bg-cyan-500/20 border border-cyan-500/40 px-1.5 py-0.2 text-[10px] font-semibold text-cyan-300">
                  AI Active
                </span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-cyan-400 group-hover:translate-x-0.5 transition-transform">
            <span>Launch Copilot</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setAiOpen(true)}
      className={`inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:from-blue-500 hover:to-cyan-500 transition-all hover:shadow-cyan-500/25 ${className}`}
    >
      <Sparkles className="h-4 w-4 text-cyan-200" />
      <span>{title}</span>
    </button>
  )
}
