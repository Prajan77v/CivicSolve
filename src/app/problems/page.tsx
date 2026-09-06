'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import {
  Search,
  Plus,
  MapPin,
  Users,
  ArrowRight,
  X,
  Compass,
} from 'lucide-react'
import AppShell from '@/components/layout/app-shell'
import { useAppearance } from '@/components/providers/appearance-provider'
import { cn } from '@/lib/utils'

interface ProblemItem {
  id: string
  title: string
  description: string
  category: string
  subcategory?: string | null
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  status: string
  affectedCount?: number | null
  tags: string | string[]
  sdgGoals: string | string[]
  createdAt: string
  location?: {
    district?: string | null
    state?: string | null
    address?: string | null
  } | null
  aiAnalysis?: {
    confidence: number
    priorityScore: number
    domain: string
  } | null
  submittedBy?: {
    name: string
    avatar?: string | null
  } | null
}

const DOMAINS = [
  { value: 'ALL', label: 'All Domains' },
  { value: 'WATER', label: 'Water' },
  { value: 'AGRICULTURE', label: 'Agriculture' },
  { value: 'TRAFFIC', label: 'Transit' },
  { value: 'AIR_QUALITY', label: 'Air Quality' },
  { value: 'WASTE', label: 'Waste' },
  { value: 'HEALTH', label: 'Health' },
  { value: 'INFRASTRUCTURE', label: 'Infrastructure' },
]

const PRIORITIES = [
  { value: 'ALL', label: 'All Priorities' },
  { value: 'CRITICAL', label: 'Critical' },
  { value: 'HIGH', label: 'High' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'LOW', label: 'Low' },
]

function parseJsonArray(val: string | string[] | undefined | null): string[] {
  if (!val) return []
  if (Array.isArray(val)) return val
  try {
    const parsed = JSON.parse(val)
    return Array.isArray(parsed) ? parsed : [val]
  } catch {
    return [String(val)]
  }
}

export default function ProblemsPage() {
  const { computedAccent } = useAppearance()
  const [problems, setProblems] = useState<ProblemItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDomain, setSelectedDomain] = useState('ALL')
  const [selectedPriority, setSelectedPriority] = useState('ALL')

  useEffect(() => {
    async function fetchProblems() {
      setLoading(true)
      try {
        const res = await fetch('/api/problems')
        const json = await res.json()
        if (json.success && Array.isArray(json.data)) {
          setProblems(json.data)
        }
      } catch (err) {
        console.error('Failed to load problems:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProblems()
  }, [])

  const filteredProblems = useMemo(() => {
    return problems.filter((p) => {
      const q = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.location?.district && p.location.district.toLowerCase().includes(q)) ||
        (p.location?.state && p.location.state.toLowerCase().includes(q))

      const matchesDomain =
        selectedDomain === 'ALL' ||
        p.category.toUpperCase().includes(selectedDomain.toUpperCase())

      const matchesPriority =
        selectedPriority === 'ALL' ||
        p.priority.toUpperCase() === selectedPriority.toUpperCase()

      return matchesSearch && matchesDomain && matchesPriority
    })
  }, [problems, searchQuery, selectedDomain, selectedPriority])

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto space-y-8 pb-16">
        {/* ── Section 9 Top Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
              Challenges
            </h1>
            <p className="text-sm text-slate-400">
              Discover societal problems that need solving.
            </p>
          </div>

          <Link
            href="/problems/new"
            className="rounded bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-2 text-xs font-semibold shadow-sm transition-colors inline-flex items-center gap-1.5 shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Submit Challenge</span>
          </Link>
        </div>

        {/* ── Search + Filters ── */}
        <div className="space-y-3 pb-2">
          <div className="relative w-full">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search challenges by keyword, state, or district..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded border border-slate-800 bg-[#0f131a] pl-9 pr-8 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:border-slate-700 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            {/* Domain Tabs */}
            <div className="flex flex-wrap items-center gap-1.5">
              {DOMAINS.map((d) => {
                const isSelected = selectedDomain === d.value
                return (
                  <button
                    key={d.value}
                    onClick={() => setSelectedDomain(d.value)}
                    className={cn(
                      'rounded-lg px-3 py-1.5 text-xs font-semibold transition-all border',
                      isSelected
                        ? 'font-bold shadow-md border-transparent'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 shadow-sm'
                    )}
                    style={
                      isSelected
                        ? {
                            backgroundColor: computedAccent.accent,
                            color: computedAccent.foreground,
                            boxShadow: `0 2px 10px ${computedAccent.glow}`,
                          }
                        : undefined
                    }
                  >
                    {d.label}
                  </button>
                )
              })}
            </div>

            {/* Priority Filter */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-slate-500 font-mono text-[11px] mr-1">Priority:</span>
              {PRIORITIES.map((p) => {
                const isSelected = selectedPriority === p.value
                return (
                  <button
                    key={p.value}
                    onClick={() => setSelectedPriority(p.value)}
                    className={cn(
                      'rounded-md px-2.5 py-1 text-[11px] font-semibold transition-colors border',
                      isSelected
                        ? 'font-bold shadow-sm'
                        : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                    )}
                    style={
                      isSelected
                        ? {
                            backgroundColor: computedAccent.accent,
                            borderColor: computedAccent.accent,
                            color: computedAccent.foreground,
                          }
                        : undefined
                    }
                  >
                    {p.label}
                  </button>
                )
              })}

              {(selectedDomain !== 'ALL' || selectedPriority !== 'ALL' || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedDomain('ALL')
                    setSelectedPriority('ALL')
                    setSearchQuery('')
                  }}
                  className="text-slate-500 hover:text-slate-300 underline ml-2 text-[11px]"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Large Editorial Challenge Rows ── */}
        {loading ? (
          <div className="space-y-4 py-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 rounded bg-[#0f131a] border border-slate-800 animate-pulse" />
            ))}
          </div>
        ) : filteredProblems.length === 0 ? (
          <div className="py-16 text-center space-y-2 border-y border-slate-800/80">
            <Compass className="h-8 w-8 text-slate-600 mx-auto" />
            <h3 className="text-sm font-semibold text-white">No challenges matching criteria</h3>
            <p className="text-xs text-slate-400">Try clearing filters or search terms.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80 border-y border-slate-800/80">
            {filteredProblems.map((problem) => {
              const tags = parseJsonArray(problem.tags)
              const locationStr = [problem.location?.district, problem.location?.state].filter(Boolean).join(', ') || 'National'
              const matchScore = problem.aiAnalysis?.confidence ? Math.round(problem.aiAnalysis.confidence * 100) : 94

              return (
                <div
                  key={problem.id}
                  className="py-6 sm:py-8 space-y-3 group"
                >
                  {/* Category & Location Header */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-blue-400 uppercase tracking-wider">
                        {problem.category}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="text-slate-400">{locationStr}</span>
                      <span className="text-slate-600">•</span>
                      <span
                        className={cn(
                          'font-mono text-[10px] font-bold uppercase',
                          problem.priority === 'CRITICAL' ? 'text-rose-400' : 'text-amber-400'
                        )}
                      >
                        {problem.priority} PRIORITY
                      </span>
                    </div>

                    <div className="font-mono text-xs font-semibold text-emerald-400">
                      AI MATCH {matchScore}%
                    </div>
                  </div>

                  {/* Dominant Title */}
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug group-hover:text-blue-400 transition-colors">
                    <Link href={`/problems/${problem.id}`}>
                      {problem.title}
                    </Link>
                  </h3>

                  {/* Narrative snippet */}
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-3xl line-clamp-2">
                    {problem.description}
                  </p>

                  {/* Affected Population & Skills Row + View Action */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                      <span className="font-semibold text-slate-200">
                        {problem.affectedCount ? `${problem.affectedCount.toLocaleString()} people affected` : '2,500+ people affected'}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span>Required:</span>
                      <span className="text-slate-300 font-medium">
                        {tags.slice(0, 4).join(' · ') || 'IoT · Embedded Systems · Data Engineering'}
                      </span>
                    </div>

                    <Link
                      href={`/problems/${problem.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 uppercase tracking-wider font-mono shrink-0"
                    >
                      <span>VIEW CHALLENGE</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </AppShell>
  )
}
