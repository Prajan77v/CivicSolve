'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import {
  Zap,
  PlusCircle,
  FileCode,
  Rocket,
  Users,
  UploadCloud,
  Award,
  X,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppearance } from '@/components/providers/appearance-provider'

interface QuickInsertModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function QuickInsertModal({ isOpen, onClose }: QuickInsertModalProps) {
  const router = useRouter()
  const { computedAccent } = useAppearance()

  if (!isOpen) return null

  const quickActions = [
    {
      id: 'challenge',
      title: 'Propose Civic Challenge',
      description: 'Submit an urban, rural, or environmental issue with AI severity triage.',
      icon: PlusCircle,
      href: '/problems/new',
      badge: 'AI Triaged',
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    },
    {
      id: 'solution',
      title: 'Insert Engineering Blueprint',
      description: 'Publish open-source tech specs, CAD diagrams, or software modules.',
      icon: FileCode,
      href: '/solution-library',
      badge: 'Sovereign Spec',
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30',
    },
    {
      id: 'project',
      title: 'Create Agile Project',
      description: 'Spin up a ground execution project with target milestones & budget.',
      icon: Rocket,
      href: '/projects/new',
      badge: 'Implementation',
      color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
    },
    {
      id: 'team',
      title: 'Form Innovation Team',
      description: 'Gather engineers, domain experts, and local leaders for a mission.',
      icon: Users,
      href: '/teams/new',
      badge: 'Collaborate',
      color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30',
    },
    {
      id: 'evidence',
      title: 'Upload Media & Proofs',
      description: 'Attach geo-tagged images, sensor logs, or video verification files.',
      icon: UploadCloud,
      href: '/problems/new',
      badge: 'Verified Proof',
      color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30',
    },
    {
      id: 'certificate',
      title: 'Generate Sovereign Certificate',
      description: 'Claim verifiable civic action badge or impact proof certificate.',
      icon: Award,
      href: '/certificates',
      badge: 'Verifiable',
      color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30',
    },
  ]

  const handleSelect = (href: string) => {
    onClose()
    router.push(href)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] shadow-2xl p-6 overflow-hidden">
        {/* Header background glow */}
        <div
          className="absolute -top-24 -right-24 h-48 w-48 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: computedAccent.accent }}
        />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl font-bold shadow-md"
              style={{
                backgroundColor: computedAccent.accent,
                color: computedAccent.foreground,
              }}
            >
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Quick Insert Menu
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-500">
                  Universal Action
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Instantly insert challenges, blueprints, projects, evidence, or team workflows.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Quick actions grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-5 pb-2">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <button
                key={action.id}
                onClick={() => handleSelect(action.href)}
                className="group relative flex items-start gap-3 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 transition-all text-left shadow-sm hover:shadow-md active:scale-[0.99]"
              >
                <div
                  className={cn(
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-transform group-hover:scale-110',
                    action.color
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors truncate">
                      {action.title}
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400 shrink-0">
                      {action.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {action.description}
                  </p>
                </div>
              </button>
            )
          })}
        </div>

        {/* Footer tip */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>Shortcut: Press <strong>⌘K</strong> anywhere to search or insert items</span>
          </div>
          <button
            onClick={onClose}
            className="text-xs font-medium text-slate-400 hover:text-slate-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
