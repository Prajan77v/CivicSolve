'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  BookOpen,
  Search,
  Building2,
  Globe,
  Sparkles,
  MapPin,
  Layers,
  ShieldCheck,
  Plus,
} from 'lucide-react'
import AppShell from '@/components/layout/app-shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useAppearance } from '@/components/providers/appearance-provider'

interface AdaptationItem {
  id: string
  adaptedRegion: string
  adaptedByTeam: string
  targetState: string
  targetDistrict: string
  adaptationStage: string
  status: string
}

interface SolutionItem {
  id: string
  title: string
  summary: string
  domain: string
  originalProblemTitle: string
  universityName: string
  teamName: string
  technologies: string
  implementationRequirements: string
  deploymentRequirements: string
  cost: number | null
  measuredImpact: string
  primaryRegion: string
  regionsDeployed: string
  adaptations: AdaptationItem[]
}

const DOMAIN_TABS = [
  { id: 'ALL', label: 'All Domains' },
  { id: 'WATER', label: 'Water Management' },
  { id: 'AGRICULTURE', label: 'Agriculture Tech' },
  { id: 'TRAFFIC', label: 'Urban Mobility' },
  { id: 'AIR_QUALITY', label: 'Air Quality' },
  { id: 'HEALTH', label: 'Healthcare Systems' },
]

export default function SolutionLibraryPage() {
  const { computedAccent } = useAppearance()
  const [solutions, setSolutions] = useState<SolutionItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeDomain, setActiveDomain] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSolution, setSelectedSolution] = useState<SolutionItem | null>(null)
  const [isAdaptModalOpen, setIsAdaptModalOpen] = useState(false)
  const [isAdapting, setIsAdapting] = useState(false)

  // Adaptation form fields
  const [targetState, setTargetState] = useState('Maharashtra')
  const [targetDistrict, setTargetDistrict] = useState('')
  const [adaptedByTeam, setAdaptedByTeam] = useState('')
  const [adaptationNotes, setAdaptationNotes] = useState('')

  useEffect(() => {
    fetchSolutions()
  }, [])

  async function fetchSolutions() {
    setLoading(true)
    try {
      const res = await fetch('/api/solutions')
      const json = await res.json()
      if (json.success && Array.isArray(json.data)) {
        setSolutions(json.data)
      }
    } catch (err) {
      console.error('Failed to load solutions:', err)
      toast.error('Failed to load solutions library')
    } finally {
      setLoading(false)
    }
  }

  async function handleAdaptSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedSolution || !targetDistrict) {
      toast.error('Please specify target district')
      return
    }

    setIsAdapting(true)
    try {
      const res = await fetch(`/api/solutions/${selectedSolution.id}/adapt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetState,
          targetDistrict,
          adaptedByTeam: adaptedByTeam || 'Regional Adaptation Squad',
          adaptedRegion: `${targetDistrict}, ${targetState}`,
        }),
      })

      const json = await res.json()
      if (json.success) {
        toast.success(`Solution successfully adapted for ${targetDistrict}! Pilot project initiated.`)
        setIsAdaptModalOpen(false)
        fetchSolutions()
      } else {
        toast.error(json.error || 'Failed to adapt solution')
      }
    } catch {
      toast.error('Network error adapting solution')
    } finally {
      setIsAdapting(false)
    }
  }

  const filteredSolutions = solutions.filter((sol) => {
    const matchesDomain = activeDomain === 'ALL' || sol.domain === activeDomain
    const q = searchQuery.toLowerCase()
    const matchesSearch =
      !q ||
      sol.title.toLowerCase().includes(q) ||
      sol.summary.toLowerCase().includes(q) ||
      sol.universityName.toLowerCase().includes(q) ||
      sol.technologies.toLowerCase().includes(q)
    return matchesDomain && matchesSearch
  })

  function parseJSONList(raw: string): string[] {
    try {
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed : [raw]
    } catch {
      return [raw]
    }
  }

  return (
    <AppShell>
      <div className="space-y-8 pb-16">
        {/* Header Hero Banner */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-[#111726] lg:p-8">
          <div className="space-y-3 max-w-3xl">
            <div
              className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-0.5 text-[11px] font-semibold transition-colors"
              style={{
                backgroundColor: computedAccent.light,
                color: computedAccent.accent,
                borderColor: computedAccent.border,
                borderWidth: '1px',
              }}
            >
              <Globe className="h-3 w-3" />
              Continuous Solution Reusability Engine
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 transition-colors dark:text-white lg:text-3xl">
              National Civic Solution Library
            </h1>
            <p className="text-xs leading-relaxed text-slate-600 transition-colors dark:text-slate-400">
              Explore deployed, field-tested innovations developed by India&apos;s premier universities. Municipal collectors and regional squads can adapt proven blueprints directly to resolve identical civic challenges in new districts.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-6 grid grid-cols-2 gap-3 pt-6 border-t border-slate-100 transition-colors dark:border-white/10 sm:grid-cols-4">
            <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5 transition-colors dark:border-white/5 dark:bg-white/[0.03]">
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Published Solutions</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">{solutions.length || 5}</div>
            </div>
            <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5 transition-colors dark:border-white/5 dark:bg-white/[0.03]">
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Cross-Region Pilots</div>
              <div
                className="text-2xl font-bold transition-colors"
                style={{ color: computedAccent.accent }}
              >
                {solutions.reduce((acc, s) => acc + (s.adaptations?.length || 0), 0) || 3}
              </div>
            </div>
            <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5 transition-colors dark:border-white/5 dark:bg-white/[0.03]">
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Verified Impact Rate</div>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">87%</div>
            </div>
            <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5 transition-colors dark:border-white/5 dark:bg-white/[0.03]">
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Frugal Cost Savings</div>
              <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">₹1.8 Cr+</div>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Domain Tabs */}
          <div className="flex flex-wrap gap-2">
            {DOMAIN_TABS.map((tab) => {
              const isSelected = activeDomain === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveDomain(tab.id)}
                  className={cn(
                    'rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all duration-200',
                    isSelected
                      ? 'shadow-sm'
                      : 'border border-slate-200/80 bg-white text-slate-700 shadow-sm hover:border-slate-300 hover:bg-slate-100 hover:text-slate-950 dark:border-white/5 dark:bg-white/5 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white'
                  )}
                  style={
                    isSelected
                      ? {
                          backgroundColor: computedAccent.accent,
                          color: computedAccent.foreground,
                          borderColor: computedAccent.accent,
                          boxShadow: `0 2px 10px ${computedAccent.glow}`,
                        }
                      : undefined
                  }
                >
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search solutions, tech, institutes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200/80 bg-white pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 shadow-sm transition-colors focus:outline-none dark:border-white/10 dark:bg-[#0f172a]/80 dark:text-white dark:placeholder-slate-500"
              style={{
                outlineColor: computedAccent.accent,
              }}
            />
          </div>
        </div>

        {/* Solution Grid */}
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-72 rounded-2xl bg-slate-100 dark:bg-white/5 animate-pulse border border-slate-200 dark:border-white/5" />
            ))}
          </div>
        ) : filteredSolutions.length === 0 ? (
          <div className="rounded-2xl border border-slate-200/80 bg-white p-12 text-center shadow-sm dark:border-white/10 dark:bg-[#0f172a]/60">
            <BookOpen className="mx-auto h-12 w-12 text-slate-400 mb-3" />
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">No solutions found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Try adjusting your domain filter or search query.</p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {filteredSolutions.map((sol) => {
              const techList = parseJSONList(sol.technologies)
              const regionList = parseJSONList(sol.regionsDeployed)

              return (
                <div
                  key={sol.id}
                  data-testid="solution-card"
                  className="group rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm flex flex-col justify-between hover:border-slate-300 hover:shadow-md transition-all dark:border-slate-800 dark:bg-[#111726] dark:hover:border-slate-700"
                >
                  <div className="space-y-4">
                    {/* Header line */}
                    <div className="flex items-start justify-between gap-3">
                      <span
                        className="inline-flex items-center rounded-md px-2.5 py-0.5 text-[11px] font-semibold transition-colors"
                        style={{
                          backgroundColor: computedAccent.light,
                          color: computedAccent.accent,
                          borderColor: computedAccent.border,
                          borderWidth: '1px',
                        }}
                      >
                        {sol.domain}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                        <Building2 className="h-3.5 w-3.5 text-slate-400" />
                        <span>{sol.universityName}</span>
                      </div>
                    </div>

                    {/* Title & Summary */}
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 transition-colors group-hover:text-slate-950 dark:text-white dark:group-hover:text-slate-100">
                        {sol.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed line-clamp-2">
                        {sol.summary}
                      </p>
                    </div>

                    {/* Original Problem Solved - High contrast container */}
                    <div className="rounded-xl p-3.5 border transition-colors bg-slate-50 border-slate-200/90 dark:bg-black/40 dark:border-white/10">
                      <div className="text-[11px] font-semibold flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                        Original Problem Resolved:
                      </div>
                      <div className="text-xs mt-1 font-bold text-slate-900 dark:text-slate-100 leading-snug">
                        {sol.originalProblemTitle}
                      </div>
                      <div className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold">
                        <span className="inline-flex items-center rounded px-2 py-0.5 text-[11px] font-semibold bg-emerald-100/70 text-emerald-800 border border-emerald-300/60 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
                          ⚡ Measured Result: {sol.measuredImpact}
                        </span>
                      </div>
                    </div>

                    {/* Tech Chips */}
                    <div className="flex flex-wrap gap-1.5">
                      {techList.map((t, idx) => (
                        <span
                          key={idx}
                          className="rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Regions Deployed & Adaptations */}
                    <div className="space-y-1.5 pt-1 text-xs">
                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">Deployed in: {regionList.join(', ')}</span>
                      </div>
                      {sol.adaptations && sol.adaptations.length > 0 && (
                        <div
                          className="flex items-center gap-2 font-medium transition-colors"
                          style={{ color: computedAccent.accent }}
                        >
                          <Layers className="h-3.5 w-3.5 shrink-0" />
                          <span>{sol.adaptations.length} Active Cross-Region Adaptation{sol.adaptations.length > 1 ? 's' : ''}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-white/10">
                    <div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">Estimated Deployment Cost</div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">
                        {sol.cost ? `₹${sol.cost.toLocaleString('en-IN')}` : 'Frugal / Open Source'}
                      </div>
                    </div>

                    <Button
                      onClick={() => {
                        setSelectedSolution(sol)
                        setIsAdaptModalOpen(true)
                      }}
                      className="gap-1.5 rounded-xl text-xs font-semibold shadow-sm transition-all hover:opacity-95 active:scale-[0.98]"
                      style={{
                        backgroundColor: computedAccent.accent,
                        color: computedAccent.foreground,
                        boxShadow: `0 2px 10px ${computedAccent.glow}`,
                      }}
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Adapt to Your Region
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Adapt Solution Modal */}
        {selectedSolution && (
          <Modal
            isOpen={isAdaptModalOpen}
            onClose={() => setIsAdaptModalOpen(false)}
            title={`Adapt Solution: ${selectedSolution.title}`}
          >
            <form onSubmit={handleAdaptSubmit} className="space-y-4 text-xs">
              <div
                className="rounded-xl p-3.5 text-slate-700 transition-colors dark:text-slate-300"
                style={{
                  backgroundColor: computedAccent.light,
                  borderColor: computedAccent.border,
                  borderWidth: '1px',
                }}
              >
                <div
                  className="font-semibold text-sm mb-1"
                  style={{ color: computedAccent.accent }}
                >
                  Cross-Regional Adaptation Pipeline
                </div>
                This action creates an official <span className="font-semibold text-slate-900 dark:text-white">Adaptation Project</span> linked to the original blueprint by <span className="font-semibold text-slate-900 dark:text-white">{selectedSolution.teamName} ({selectedSolution.universityName})</span>. Telemetry and milestone logs will be tracked through to civic pilot and deployment.
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Target State</label>
                  <select
                    value={targetState}
                    onChange={(e) => setTargetState(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 transition-colors focus:outline-none dark:border-white/10 dark:bg-[#0f172a] dark:text-white"
                  >
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Telangana">Telangana</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Odisha">Odisha</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Kerala">Kerala</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Target District / Taluka</label>
                  <input
                    type="text"
                    placeholder="e.g. Jalna, Nalgonda, Satara"
                    value={targetDistrict}
                    onChange={(e) => setTargetDistrict(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 transition-colors focus:outline-none dark:border-white/10 dark:bg-[#0f172a] dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Adapting Student Team / Local Body</label>
                <input
                  type="text"
                  placeholder="e.g. Marathwada Water Solvers or Sinnar Municipal Corp"
                  value={adaptedByTeam}
                  onChange={(e) => setAdaptedByTeam(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 transition-colors focus:outline-none dark:border-white/10 dark:bg-[#0f172a] dark:text-white"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Regional Nuances & Calibration Notes</label>
                <textarea
                  rows={3}
                  placeholder="Describe localized conditions (e.g. higher salinity, black cotton soil, local power supply constraints)..."
                  value={adaptationNotes}
                  onChange={(e) => setAdaptationNotes(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 transition-colors focus:outline-none dark:border-white/10 dark:bg-[#0f172a] dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAdaptModalOpen(false)}
                  className="border-slate-200 text-slate-700 dark:border-white/10 dark:text-slate-300"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isAdapting}
                  className="font-medium text-white transition-opacity hover:opacity-90"
                  style={{
                    backgroundColor: computedAccent.accent,
                    color: computedAccent.foreground,
                  }}
                >
                  {isAdapting ? 'Initiating Adaptation...' : 'Initiate Regional Adaptation'}
                </Button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    </AppShell>
  )
}
