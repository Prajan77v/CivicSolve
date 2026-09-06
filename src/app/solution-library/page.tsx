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
        <div className="rounded-xl border border-slate-800 bg-[#111726] p-6 lg:p-8 shadow-sm">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 rounded border border-blue-500/20 bg-blue-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-blue-300">
              <Globe className="h-3 w-3" />
              Continuous Solution Reusability Engine
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white lg:text-3xl">
              National Civic Solution Library
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              Explore deployed, field-tested innovations developed by India&apos;s premier universities. Municipal collectors and regional squads can adapt proven blueprints directly to resolve identical civic challenges in new districts.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-6 grid grid-cols-2 gap-3 pt-6 border-t border-white/10 sm:grid-cols-4">
            <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3.5">
              <div className="text-xs text-slate-400">Published Solutions</div>
              <div className="text-2xl font-bold text-white">{solutions.length || 5}</div>
            </div>
            <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3.5">
              <div className="text-xs text-slate-400">Cross-Region Pilots</div>
              <div className="text-2xl font-bold text-teal-400">
                {solutions.reduce((acc, s) => acc + (s.adaptations?.length || 0), 0) || 3}
              </div>
            </div>
            <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3.5">
              <div className="text-xs text-slate-400">Verified Impact Rate</div>
              <div className="text-2xl font-bold text-emerald-400">87%</div>
            </div>
            <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3.5">
              <div className="text-xs text-slate-400">Frugal Cost Savings</div>
              <div className="text-2xl font-bold text-cyan-400">₹1.8 Cr+</div>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Domain Tabs */}
          <div className="flex flex-wrap gap-2">
            {DOMAIN_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveDomain(tab.id)}
                className={cn(
                  'rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all duration-200',
                  activeDomain === tab.id
                    ? 'bg-teal-500 text-white shadow-[0_0_15px_rgba(20,184,166,0.4)]'
                    : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/5'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search solutions, tech, institutes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#0f172a]/80 pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* Solution Grid */}
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-72 rounded-2xl bg-white/5 animate-pulse border border-white/5" />
            ))}
          </div>
        ) : filteredSolutions.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-[#0f172a]/60 p-12 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-slate-500 mb-3" />
            <h3 className="text-base font-semibold text-white">No solutions found</h3>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your domain filter or search query.</p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {filteredSolutions.map((sol) => {
              const techList = parseJSONList(sol.technologies)
              const regionList = parseJSONList(sol.regionsDeployed)

              return (
                <div
                  key={sol.id}
                  className="rounded-xl border border-slate-800 bg-[#111726] p-6 flex flex-col justify-between hover:border-slate-700 transition-colors"
                >
                  <div className="space-y-4">
                    {/* Header line */}
                    <div className="flex items-start justify-between gap-3">
                      <Badge variant="outline" className="border-teal-500/30 bg-teal-500/10 text-teal-300 text-[11px]">
                        {sol.domain}
                      </Badge>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Building2 className="h-3.5 w-3.5 text-slate-400" />
                        <span>{sol.universityName}</span>
                      </div>
                    </div>

                    {/* Title & Summary */}
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-teal-300 transition-colors">
                        {sol.title}
                      </h3>
                      <p className="text-xs text-slate-300 mt-1.5 leading-relaxed line-clamp-2">
                        {sol.summary}
                      </p>
                    </div>

                    {/* Original Problem Solved */}
                    <div className="rounded-xl bg-black/30 border border-white/5 p-3">
                      <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                        Original Problem Resolved:
                      </div>
                      <div className="text-xs text-slate-200 mt-0.5 font-medium">
                        {sol.originalProblemTitle}
                      </div>
                      <div className="text-[11px] text-teal-400 font-semibold mt-1">
                        ⚡ Measured Result: {sol.measuredImpact}
                      </div>
                    </div>

                    {/* Tech Chips */}
                    <div className="flex flex-wrap gap-1.5">
                      {techList.map((t, idx) => (
                        <span
                          key={idx}
                          className="rounded-md bg-white/[0.04] border border-white/10 px-2 py-0.5 text-[11px] font-medium text-slate-300"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Regions Deployed & Adaptations */}
                    <div className="space-y-1.5 pt-1 text-xs">
                      <div className="flex items-center gap-2 text-slate-400">
                        <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">Deployed in: {regionList.join(', ')}</span>
                      </div>
                      {sol.adaptations && sol.adaptations.length > 0 && (
                        <div className="flex items-center gap-2 text-teal-300 font-medium">
                          <Layers className="h-3.5 w-3.5 text-teal-400 shrink-0" />
                          <span>{sol.adaptations.length} Active Cross-Region Adaptation{sol.adaptations.length > 1 ? 's' : ''}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                    <div>
                      <div className="text-[11px] text-slate-400">Estimated Deployment Cost</div>
                      <div className="text-sm font-bold text-white">
                        {sol.cost ? `₹${sol.cost.toLocaleString('en-IN')}` : 'Frugal / Open Source'}
                      </div>
                    </div>

                    <Button
                      onClick={() => {
                        setSelectedSolution(sol)
                        setIsAdaptModalOpen(true)
                      }}
                      className="gap-1.5 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white text-xs font-semibold shadow-[0_0_15px_rgba(20,184,166,0.3)]"
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
              <div className="rounded-xl bg-teal-500/10 border border-teal-500/20 p-3.5 text-slate-300">
                <div className="font-semibold text-teal-300 text-sm mb-1">Cross-Regional Adaptation Pipeline</div>
                This action creates an official <span className="text-white font-medium">Adaptation Project</span> linked to the original blueprint by <span className="text-white font-medium">{selectedSolution.teamName} ({selectedSolution.universityName})</span>. Telemetry and milestone logs will be tracked through to civic pilot and deployment.
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Target State</label>
                  <select
                    value={targetState}
                    onChange={(e) => setTargetState(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#0f172a] px-3 py-2 text-white focus:border-teal-500 focus:outline-none"
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
                  <label className="block font-medium text-slate-300 mb-1">Target District / Taluka</label>
                  <input
                    type="text"
                    placeholder="e.g. Jalna, Nalgonda, Satara"
                    value={targetDistrict}
                    onChange={(e) => setTargetDistrict(e.target.value)}
                    required
                    className="w-full rounded-xl border border-white/10 bg-[#0f172a] px-3 py-2 text-white focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Adapting Student Team / Local Body</label>
                <input
                  type="text"
                  placeholder="e.g. Marathwada Water Solvers or Sinnar Municipal Corp"
                  value={adaptedByTeam}
                  onChange={(e) => setAdaptedByTeam(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#0f172a] px-3 py-2 text-white focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Regional Nuances & Calibration Notes</label>
                <textarea
                  rows={3}
                  placeholder="Describe localized conditions (e.g. higher salinity, black cotton soil, local power supply constraints)..."
                  value={adaptationNotes}
                  onChange={(e) => setAdaptationNotes(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#0f172a] px-3 py-2 text-white focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAdaptModalOpen(false)}
                  className="border-white/10 text-slate-300"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isAdapting}
                  className="bg-teal-600 hover:bg-teal-500 text-white font-medium"
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
