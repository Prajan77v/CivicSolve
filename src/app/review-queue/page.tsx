'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import AppShell from '@/components/layout/app-shell'
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Sparkles,
  ExternalLink,
  MessageSquare,
  FileCheck,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Send
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface ProblemItem {
  id: string
  title: string
  description: string
  category: string
  priority: string
  status: string
  reviewStatus: string
  adminFeedback?: string | null
  affectedCount?: number | null
  createdAt: string
  location?: {
    district?: string | null
    state?: string | null
  } | null
  aiAnalysis?: {
    confidence: number
    priorityScore: number
    domain: string
    detectedTech?: string
  } | null
  evidence?: Array<{
    id: string
    title: string
    fileUrl: string
  }>
}

const TABS = [
  { id: 'ALL', label: 'All Cases' },
  { id: 'SUBMITTED', label: 'Submitted (Pending Review)' },
  { id: 'UNDER_REVIEW', label: 'Under Review' },
  { id: 'VERIFIED', label: 'Verified Truth' },
  { id: 'PUBLISHED', label: 'Published to Registry' },
]

export default function ReviewQueuePage() {
  const [problems, setProblems] = useState<ProblemItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProblem, setSelectedProblem] = useState<ProblemItem | null>(null)
  const [feedbackText, setFeedbackText] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  const loadCases = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/problems')
      const json = await res.json()
      if (json.success && Array.isArray(json.data)) {
        setProblems(json.data)
      }
    } catch (err) {
      toast.error('Failed to load review queue')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCases()
  }, [])

  const handleReviewAction = async (problemId: string, action: 'verify' | 'publish' | 'reject' | 'request_changes') => {
    try {
      setActionLoading(true)
      const res = await fetch(`/api/problems/${problemId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          feedback: feedbackText.trim() || undefined,
        }),
      })
      const json = await res.json()
      if (json.success) {
        toast.success(`Action "${action.toUpperCase()}" applied successfully!`)
        setFeedbackText('')
        await loadCases()
        if (selectedProblem?.id === problemId) {
          setSelectedProblem(prev => prev ? { ...prev, reviewStatus: action === 'verify' ? 'VERIFIED' : action === 'publish' ? 'PUBLISHED' : action === 'reject' ? 'REJECTED' : 'UNDER_REVIEW' } : null)
        }
      } else {
        toast.error(json.error || 'Failed to apply action')
      }
    } catch (err) {
      toast.error('Review action failed')
    } finally {
      setActionLoading(false)
    }
  }

  const filteredProblems = problems.filter((item) => {
    if (activeTab !== 'ALL' && item.reviewStatus !== activeTab) {
      return false
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      return (
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.location?.district?.toLowerCase().includes(q) ||
        item.location?.state?.toLowerCase().includes(q)
      )
    }
    return true
  })

  return (
    <AppShell>
      <div className="space-y-6 max-w-7xl mx-auto pb-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono uppercase text-blue-400 font-semibold tracking-wider">
                GOVERNANCE & TRUST
              </span>
              <span className="text-xs text-slate-500">• Official Collectorate Review</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Administrative Review Queue
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Audit citizen-submitted societal challenges, verify on-ground telemetry evidence, run AI duplicate cross-referencing, and publish to academic engineering solver network.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadCases}
              disabled={loading}
              className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-md flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className={cn('h-3.5 w-3.5', loading && 'animate-spin')} />
              Refresh
            </button>
            <Link
              href="/command-center"
              className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-md transition-colors"
            >
              Open Command Center →
            </Link>
          </div>
        </div>

        {/* Status Tab Filters & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-thin border-b border-slate-800/80 w-full sm:w-auto">
            {TABS.map((tab) => {
              const active = activeTab === tab.id
              const count = tab.id === 'ALL'
                ? problems.length
                : problems.filter((p) => p.reviewStatus === tab.id).length

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'px-3 py-2 text-xs font-medium border-b-2 whitespace-nowrap transition-colors flex items-center gap-2',
                    active
                      ? 'border-blue-500 text-white font-semibold'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  )}
                >
                  <span>{tab.label}</span>
                  <span className={cn(
                    'px-1.5 py-0.2 rounded text-[10px] font-mono',
                    active ? 'bg-blue-600/30 text-blue-300' : 'bg-slate-800 text-slate-400'
                  )}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cases, districts..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-900/80 border border-slate-800 rounded-md text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Cases Table / Editorial Rows */}
        <div className="space-y-3">
          {loading ? (
            <div className="p-12 text-center text-xs text-slate-500 border border-slate-800 rounded-lg">
              Loading administrative review queue...
            </div>
          ) : filteredProblems.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500 border border-slate-800 rounded-lg">
              No cases found in this category.
            </div>
          ) : (
            filteredProblems.map((prob) => {
              const statusColor =
                prob.reviewStatus === 'PUBLISHED'
                  ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                  : prob.reviewStatus === 'VERIFIED'
                  ? 'text-blue-400 bg-blue-500/10 border-blue-500/20'
                  : prob.reviewStatus === 'REJECTED'
                  ? 'text-red-400 bg-red-500/10 border-red-500/20'
                  : 'text-amber-400 bg-amber-500/10 border-amber-500/20'

              return (
                <div
                  key={prob.id}
                  className="p-5 bg-slate-900/60 border border-slate-800 hover:border-slate-700 rounded-lg transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={cn('px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border', statusColor)}>
                          {prob.reviewStatus || 'SUBMITTED'}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">
                          {prob.category}
                        </span>
                        <span className="text-slate-600">•</span>
                        <span className="text-[11px] text-slate-400">
                          {prob.location?.district || 'District'}, {prob.location?.state || 'State'}
                        </span>
                        {prob.affectedCount && (
                          <>
                            <span className="text-slate-600">•</span>
                            <span className="text-[11px] text-amber-400 font-semibold font-mono">
                              {prob.affectedCount.toLocaleString()} citizens affected
                            </span>
                          </>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-white hover:text-blue-400 transition-colors">
                        <Link href={`/problems/${prob.id}`}>{prob.title}</Link>
                      </h3>

                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {prob.description}
                      </p>
                    </div>

                    {/* AI Priority & Confidence pill */}
                    {prob.aiAnalysis && (
                      <div className="shrink-0 text-right p-2.5 rounded bg-slate-950/60 border border-slate-800 text-xs space-y-0.5">
                        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">AI Urgency</div>
                        <div className="text-sm font-bold text-blue-400 font-mono">
                          {Math.round(prob.aiAnalysis.priorityScore * 100)} / 100
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {Math.round(prob.aiAnalysis.confidence * 100)}% Confidence
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Feedback line if present */}
                  {prob.adminFeedback && (
                    <div className="p-2.5 rounded bg-slate-950/40 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2">
                      <MessageSquare className="h-3.5 w-3.5 text-blue-400 mt-0.5 shrink-0" />
                      <div>
                        <span className="text-slate-400 font-semibold">Reviewer Directive: </span>
                        <span>{prob.adminFeedback}</span>
                      </div>
                    </div>
                  )}

                  {/* Review Actions Toolbar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/60">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/problems/${prob.id}`}
                        className="px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/60 rounded border border-slate-700/60 flex items-center gap-1 transition-colors"
                      >
                        <Eye className="h-3 w-3" />
                        Inspect Dossier
                      </Link>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => handleReviewAction(prob.id, 'request_changes')}
                        disabled={actionLoading}
                        className="px-2.5 py-1 text-xs font-medium text-amber-300 hover:bg-amber-500/10 border border-amber-500/30 rounded transition-colors"
                      >
                        Request Changes
                      </button>

                      <button
                        onClick={() => handleReviewAction(prob.id, 'reject')}
                        disabled={actionLoading}
                        className="px-2.5 py-1 text-xs font-medium text-red-400 hover:bg-red-500/10 border border-red-500/30 rounded transition-colors"
                      >
                        Reject
                      </button>

                      <button
                        onClick={() => handleReviewAction(prob.id, 'verify')}
                        disabled={actionLoading || prob.reviewStatus === 'VERIFIED'}
                        className="px-3 py-1 text-xs font-semibold text-blue-300 bg-blue-900/30 hover:bg-blue-800/50 border border-blue-500/40 rounded transition-colors flex items-center gap-1"
                      >
                        <ShieldCheck className="h-3 w-3" />
                        Verify Truth
                      </button>

                      <button
                        onClick={() => handleReviewAction(prob.id, 'publish')}
                        disabled={actionLoading || prob.reviewStatus === 'PUBLISHED'}
                        className="px-3 py-1 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded transition-colors flex items-center gap-1"
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        Publish to Registry
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </AppShell>
  )
}
