'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import {
  FolderKanban,
  Search,
  Filter,
  ArrowRight,
  Building2,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  TrendingUp,
  Target,
  RefreshCw,
  Award,
  Layers,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  Coins,
} from 'lucide-react'
import AppShell from '@/components/layout/app-shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { useAppearance } from '@/components/providers/appearance-provider'
import { cn } from '@/lib/utils'

interface MilestoneSummary {
  id: string
  title: string
  status: string
  completionPct: number
  order: number
}

interface ProjectItem {
  id: string
  title: string
  status: string
  progressPercent: number
  startDate: string
  targetDate?: string | null
  completedAt?: string | null
  problem: {
    id: string
    title: string
    category: string
    priority: string
    affectedCount?: number | null
    location?: {
      district?: string | null
      state?: string | null
    } | null
  }
  team?: {
    id: string
    name: string
    size: number
    skills: string
    _count?: {
      members: number
    }
  } | null
  university?: {
    id: string
    name: string
    shortName: string
    city: string
    state: string
  } | null
  industryPartner?: {
    id: string
    name: string
    type: string
    sector: string
  } | null
  fundingSupport?: Array<{
    id: string
    amount?: number | null
    type: string
    status: string
    organization?: {
      name: string
    } | null
  }>
  milestones?: MilestoneSummary[]
  _count?: {
    milestones: number
    tasks: number
    deployments: number
    updates: number
  }
}

const STAGE_FILTERS = [
  { id: 'ALL', label: 'All Stages' },
  { id: 'ACTIVE', label: 'Active' },
  { id: 'PROPOSAL', label: 'Proposal' },
  { id: 'PROTOTYPE', label: 'Prototype' },
  { id: 'PILOT', label: 'Pilot' },
  { id: 'DEPLOYED', label: 'Deployed' },
  { id: 'COMPLETED', label: 'Completed' },
] as const

type StageFilterId = typeof STAGE_FILTERS[number]['id']

function formatCurrency(num?: number | null): string {
  if (!num) return ''
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)} Cr`
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)} Lakh`
  return `₹${num.toLocaleString('en-IN')}`
}

export default function ProjectsPage() {
  const { computedAccent } = useAppearance()
  const [projects, setProjects] = useState<ProjectItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeStage, setActiveStage] = useState<StageFilterId>('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchProjects = async () => {
    try {
      setError(null)
      const res = await fetch('/api/projects')
      if (!res.ok) throw new Error('Failed to load projects')
      const json = await res.json()
      if (json.success && Array.isArray(json.data)) {
        setProjects(json.data)
      } else {
        throw new Error('Unexpected API response format')
      }
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to fetch projects')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleRefresh = () => {
    setIsRefreshing(true)
    fetchProjects()
  }

  // Filter projects by stage and search query
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      // 1. Stage filter
      if (activeStage !== 'ALL') {
        const pStatus = (p.status || '').toUpperCase()
        if (activeStage === 'ACTIVE') {
          if (pStatus === 'COMPLETED') return false
        } else if (pStatus !== activeStage) {
          return false
        }
      }

      // 2. Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const projectTitle = (p.title || '').toLowerCase()
        const problemTitle = (p.problem?.title || '').toLowerCase()
        const teamName = (p.team?.name || '').toLowerCase()
        const uniName = (p.university?.shortName || p.university?.name || '').toLowerCase()
        const partnerName = (p.industryPartner?.name || '').toLowerCase()

        return (
          projectTitle.includes(q) ||
          problemTitle.includes(q) ||
          teamName.includes(q) ||
          uniName.includes(q) ||
          partnerName.includes(q)
        )
      }

      return true
    })
  }, [projects, activeStage, searchQuery])

  // Aggregate stats
  const stats = useMemo(() => {
    const total = projects.length
    const active = projects.filter((p) => p.status !== 'COMPLETED').length
    const prototypes = projects.filter((p) => p.status === 'PROTOTYPE').length
    const pilots = projects.filter((p) => p.status === 'PILOT').length
    const deployed = projects.filter((p) => p.status === 'DEPLOYED' || p.status === 'COMPLETED').length
    const avgProgress =
      total > 0 ? Math.round(projects.reduce((sum, p) => sum + (p.progressPercent || 0), 0) / total) : 0

    return { total, active, prototypes, pilots, deployed, avgProgress }
  }, [projects])

  return (
    <AppShell>
      <div className="space-y-8 pb-12">
        {/* Top Header Banner */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 p-6 md:p-8 backdrop-blur-xl shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-cyan-400 border border-blue-500/20">
                <FolderKanban className="h-3.5 w-3.5" />
                <span>Civic Innovation Engine</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
                Projects Collaboration Workspace
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Track active engineering deployments, milestone progression, and interdisciplinary university teams turning societal challenges into verified public solutions.
              </p>
            </div>

            {/* Quick Actions & Refresh */}
            <div className="flex items-center gap-3 shrink-0">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleRefresh}
                isLoading={isRefreshing}
                leftIcon={<RefreshCw className={cn('h-4 w-4', isRefreshing && 'animate-spin')} />}
              >
                Sync Data
              </Button>
              <Link href="/problems">
                <Button size="sm" leftIcon={<Sparkles className="h-4 w-4 text-cyan-300" />}>
                  Explore Challenges
                </Button>
              </Link>
            </div>
          </div>

          {/* Key Metrics Strip */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 border-t border-white/10 pt-6">
            <div className="rounded-xl border border-white/5 bg-slate-900/60 p-3.5 backdrop-blur-md">
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-blue-400" />
                Total Projects
              </span>
              <p className="text-xl font-bold text-white mt-1">{stats.total}</p>
              <span className="text-[11px] text-slate-500">Across 5 universities</span>
            </div>

            <div className="rounded-xl border border-white/5 bg-slate-900/60 p-3.5 backdrop-blur-md">
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-cyan-400" />
                Active Cohort
              </span>
              <p className="text-xl font-bold text-cyan-300 mt-1">{stats.active}</p>
              <span className="text-[11px] text-cyan-500/80">In pipeline stages</span>
            </div>

            <div className="rounded-xl border border-white/5 bg-slate-900/60 p-3.5 backdrop-blur-md">
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-purple-400" />
                Pilots in Field
              </span>
              <p className="text-xl font-bold text-purple-300 mt-1">{stats.pilots}</p>
              <span className="text-[11px] text-purple-500/80">Community trials</span>
            </div>

            <div className="rounded-xl border border-white/5 bg-slate-900/60 p-3.5 backdrop-blur-md">
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                Deployments
              </span>
              <p className="text-xl font-bold text-emerald-300 mt-1">{stats.deployed}</p>
              <span className="text-[11px] text-emerald-500/80">Live municipal impact</span>
            </div>

            <div className="rounded-xl border border-white/5 bg-slate-900/60 p-3.5 backdrop-blur-md col-span-2 sm:col-span-1">
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                <Target className="h-3.5 w-3.5 text-amber-400" />
                Average Velocity
              </span>
              <p className="text-xl font-bold text-amber-300 mt-1">{stats.avgProgress}%</p>
              <span className="text-[11px] text-amber-500/80">Milestone completion</span>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Stage Filters Pills */}
          <div className="flex items-center overflow-x-auto pb-2 md:pb-0 gap-1.5 scrollbar-thin">
            {STAGE_FILTERS.map((filter) => {
              const isActive = activeStage === filter.id
              const count =
                filter.id === 'ALL'
                  ? projects.length
                  : filter.id === 'ACTIVE'
                  ? projects.filter((p) => p.status !== 'COMPLETED').length
                  : projects.filter((p) => p.status === filter.id).length

              return (
                <button
                  key={filter.id}
                  onClick={() => setActiveStage(filter.id)}
                  className={cn(
                    'px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-2 border',
                    isActive
                      ? 'font-bold shadow-md border-transparent'
                      : 'bg-white dark:bg-slate-900/70 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 shadow-sm'
                  )}
                  style={
                    isActive
                      ? {
                          backgroundColor: computedAccent.accent,
                          borderColor: computedAccent.accent,
                          color: computedAccent.foreground,
                          boxShadow: `0 4px 14px ${computedAccent.glow}`,
                        }
                      : undefined
                  }
                >
                  <span style={isActive ? { color: computedAccent.foreground } : undefined}>
                    {filter.label}
                  </span>
                  <span
                    className={cn(
                      'px-1.5 py-0.5 rounded-full text-[10px] font-bold transition-colors',
                      !isActive && 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    )}
                    style={
                      isActive
                        ? {
                            backgroundColor:
                              computedAccent.foreground === '#ffffff'
                                ? 'rgba(255, 255, 255, 0.25)'
                                : 'rgba(0, 0, 0, 0.15)',
                            color: computedAccent.foreground,
                          }
                        : undefined
                    }
                  >
                    {count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[280px] max-w-md w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by project, problem, team, or partner..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 shadow-sm transition-colors"
              style={{
                outlineColor: computedAccent.accent,
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-400" />
            <span>{error}</span>
            <Button size="sm" variant="ghost" className="ml-auto" onClick={handleRefresh}>
              Retry
            </Button>
          </div>
        )}

        {/* Projects Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-5 w-24 rounded-full" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <Skeleton className="h-6 w-4/5 rounded-md" />
                <Skeleton className="h-4 w-3/5 rounded-md" />
                <Skeleton className="h-2 w-full rounded-full" />
                <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                  <Skeleton className="h-4 w-32 rounded-md" />
                  <Skeleton className="h-8 w-28 rounded-lg" />
                </div>
              </Card>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-12 text-center space-y-4">
            <div className="h-16 w-16 mx-auto rounded-2xl bg-slate-800/80 flex items-center justify-center text-slate-400">
              <FolderKanban className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-white">No projects found</h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                {searchQuery || activeStage !== 'ALL'
                  ? 'No projects match your active search filter or stage selection.'
                  : 'There are currently no projects in the workspace.'}
              </p>
            </div>
            {(searchQuery || activeStage !== 'ALL') && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setActiveStage('ALL')
                  setSearchQuery('')
                }}
              >
                Reset Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => {
              // Calculate completed milestones
              const milestones = project.milestones || []
              const totalMilestones = 7
              const completedMilestones = milestones.filter((m) => m.status === 'COMPLETED').length

              // Partner / funding info
              const partner = project.industryPartner?.name
              const firstFunding = project.fundingSupport?.[0]
              const fundingAmount = firstFunding?.amount ? formatCurrency(firstFunding.amount) : null
              const fundingOrg = firstFunding?.organization?.name || partner

              return (
                <Card
                  key={project.id}
                  hoverEffect
                  className="flex flex-col justify-between border-white/10 bg-slate-900/80 backdrop-blur-xl group relative overflow-hidden"
                >
                  {/* Subtle top stage color accent */}
                  <div
                    className={cn(
                      'absolute top-0 left-0 right-0 h-1',
                      project.status === 'COMPLETED' && 'bg-emerald-500',
                      project.status === 'DEPLOYED' && 'bg-cyan-500',
                      project.status === 'PILOT' && 'bg-teal-500',
                      project.status === 'PROTOTYPE' && 'bg-pink-500',
                      project.status === 'PROPOSAL' && 'bg-purple-500',
                      project.status === 'ACTIVE' && 'bg-blue-500'
                    )}
                  />

                  <div className="space-y-4">
                    {/* Header: Stage badge & Problem Category */}
                    <div className="flex items-center justify-between gap-2">
                      <Badge status={project.status} size="sm" dot>
                        {project.status}
                      </Badge>

                      {project.problem?.category && (
                        <Badge variant="outline" size="sm" className="text-[11px] text-slate-400">
                          {project.problem.category}
                        </Badge>
                      )}
                    </div>

                    {/* Titles */}
                    <div className="space-y-1.5">
                      <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2 leading-snug">
                        {project.title}
                      </h3>

                      {project.problem && (
                        <div className="flex items-start gap-1.5 text-xs text-slate-400">
                          <span className="text-slate-500 shrink-0 font-medium">Problem:</span>
                          <span className="line-clamp-1 italic text-slate-300">
                            {project.problem.title}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Team & University Attribution */}
                    <div className="rounded-xl bg-slate-800/50 p-3 border border-white/5 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 text-slate-200 font-medium">
                          <Users className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                          <span className="truncate max-w-[150px]">
                            {project.team?.name || 'Unassigned Team'}
                          </span>
                        </div>

                        {project.team?.size && (
                          <span className="text-[11px] text-slate-400">
                            {project.team.size} members
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Building2 className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                        <span className="truncate">
                          {project.university?.shortName ||
                            project.university?.name ||
                            'Autonomous Academic Partner'}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar & Milestone Count */}
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between text-xs font-medium">
                        <span className="text-slate-300">Milestone Progress</span>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400 text-[11px]">
                            {completedMilestones}/{totalMilestones} Completed
                          </span>
                          <span className="text-cyan-400 font-bold">
                            {project.progressPercent}%
                          </span>
                        </div>
                      </div>

                      <Progress
                        value={project.progressPercent}
                        color={
                          project.status === 'COMPLETED'
                            ? 'emerald'
                            : project.progressPercent > 60
                            ? 'cyan'
                            : 'blue'
                        }
                        size="md"
                      />
                    </div>

                    {/* Industry Partner & Funding Indicator */}
                    {(fundingOrg || fundingAmount) && (
                      <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-emerald-500/5 border border-emerald-500/15 text-xs text-emerald-300">
                        <div className="flex items-center gap-1.5 truncate">
                          <Coins className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                          <span className="truncate font-medium">
                            {fundingOrg ? `Partner: ${fundingOrg}` : 'Industry Funded'}
                          </span>
                        </div>
                        {fundingAmount && (
                          <span className="font-bold shrink-0 bg-emerald-500/20 px-1.5 py-0.5 rounded text-[11px] text-emerald-200">
                            {fundingAmount}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Card Action Footer */}
                  <div className="pt-5 mt-5 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">
                      {project.targetDate
                        ? `Target: ${new Date(project.targetDate).toLocaleDateString('en-IN', {
                            month: 'short',
                            year: 'numeric',
                          })}`
                        : 'Active Project'}
                    </span>

                    <Link href={`/projects/${project.id}`}>
                      <Button
                        size="sm"
                        variant="default"
                        className="group-hover:shadow-cyan-500/20"
                        rightIcon={
                          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                        }
                      >
                        Open Workspace
                      </Button>
                    </Link>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </AppShell>
  )
}
