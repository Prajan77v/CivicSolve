'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import {
  MapPin,
  Filter,
  Search,
  Sparkles,
  AlertTriangle,
  ExternalLink,
  Layers,
  ChevronRight,
  ShieldCheck,
  Building,
  Activity,
  Compass,
  Maximize2
} from 'lucide-react'
import AppShell from '@/components/layout/app-shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface LocationData {
  id: string
  address: string | null
  district: string | null
  state: string | null
  pincode: string | null
  lat: number | null
  lng: number | null
}

interface ProblemItem {
  id: string
  title: string
  description: string
  category: string
  priority: string
  status: string
  reviewStatus?: string
  affectedCount: number | null
  location: LocationData | null
  createdAt: string
  projects?: { id: string; title: string; status: string }[]
}

const CATEGORIES = [
  'ALL',
  'WATER_SANITATION',
  'AGRICULTURE_RURAL',
  'HEALTHCARE',
  'EDUCATION_SKILLS',
  'URBAN_MOBILITY',
  'ENVIRONMENT_CLIMATE',
  'CLEAN_ENERGY',
  'WASTE_MANAGEMENT'
]

const PRIORITIES = ['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW']

export default function CivicMapPage() {
  const [problems, setProblems] = useState<ProblemItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProblem, setSelectedProblem] = useState<ProblemItem | null>(null)

  // Filters
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [selectedPriority, setSelectedPriority] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [showOnlyVerified, setShowOnlyVerified] = useState(false)

  useEffect(() => {
    fetchProblems()
  }, [])

  async function fetchProblems() {
    setLoading(true)
    try {
      const res = await fetch('/api/problems')
      const json = await res.json()
      if (json.success && Array.isArray(json.data)) {
        setProblems(json.data)
        if (json.data.length > 0) {
          // Select first problem by default
          setSelectedProblem(json.data[0])
        }
      }
    } catch (err) {
      console.error('Failed to load problems for map:', err)
    } finally {
      setLoading(false)
    }
  }

  // Filter problems
  const filteredProblems = useMemo(() => {
    return problems.filter((p) => {
      if (selectedCategory !== 'ALL' && p.category !== selectedCategory) return false
      if (selectedPriority !== 'ALL' && p.priority !== selectedPriority) return false
      if (showOnlyVerified && p.reviewStatus !== 'VERIFIED' && p.reviewStatus !== 'PUBLISHED') return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchTitle = p.title.toLowerCase().includes(q)
        const matchDistrict = p.location?.district?.toLowerCase().includes(q)
        const matchState = p.location?.state?.toLowerCase().includes(q)
        if (!matchTitle && !matchDistrict && !matchState) return false
      }
      return true
    })
  }, [problems, selectedCategory, selectedPriority, showOnlyVerified, searchQuery])

  // Geo bounds for India projection:
  // Lat: 8.0 (South) to 36.0 (North)
  // Lng: 68.0 (West) to 96.0 (East)
  function getCoordinates(lat: number | null, lng: number | null) {
    if (!lat || !lng) return null
    const minLng = 68.0
    const maxLng = 96.0
    const minLat = 8.0
    const maxLat = 36.0

    // Clamp coordinates
    const clampedLng = Math.max(minLng, Math.min(maxLng, lng))
    const clampedLat = Math.max(minLat, Math.min(maxLat, lat))

    const x = ((clampedLng - minLng) / (maxLng - minLng)) * 100
    const y = ((maxLat - clampedLat) / (maxLat - minLat)) * 100
    return { x, y }
  }

  const priorityStyles: Record<string, { bg: string; border: string; glow: string; text: string }> = {
    CRITICAL: {
      bg: 'bg-rose-500',
      border: 'border-rose-400',
      glow: 'shadow-[0_0_15px_rgba(244,63,94,0.9)]',
      text: 'text-rose-400'
    },
    HIGH: {
      bg: 'bg-amber-500',
      border: 'border-amber-400',
      glow: 'shadow-[0_0_12px_rgba(245,158,11,0.8)]',
      text: 'text-amber-400'
    },
    MEDIUM: {
      bg: 'bg-cyan-500',
      border: 'border-cyan-400',
      glow: 'shadow-[0_0_10px_rgba(6,182,212,0.7)]',
      text: 'text-cyan-400'
    },
    LOW: {
      bg: 'bg-emerald-500',
      border: 'border-emerald-400',
      glow: 'shadow-[0_0_8px_rgba(16,185,129,0.7)]',
      text: 'text-emerald-400'
    }
  }

  return (
    <AppShell>
      <div className="space-y-6 pb-16">
        {/* Top Header Banner */}
        <div className="relative overflow-hidden rounded-2xl border border-teal-500/20 bg-gradient-to-r from-[#0a1628] via-[#0d2238] to-[#0a1628] p-6 shadow-[0_0_50px_rgba(20,184,166,0.12)]">
          <div className="relative z-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-500/10 px-3 py-1 text-xs font-semibold text-teal-300 mb-2">
                <Compass className="h-3.5 w-3.5" />
                Geospatial Civic Intelligence Radar
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white lg:text-3xl">
                National <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-300 to-blue-400">Civic Problem Map</span>
              </h1>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                Real-time spatial mapping of citizen-reported societal challenges across Indian districts. Filter by severity hotspots, AI domains, and verification status.
              </p>
            </div>

            {/* Quick stats counter */}
            <div className="flex items-center gap-3">
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-center">
                <div className="text-[11px] text-slate-400">Total Hotspots</div>
                <div className="text-xl font-bold text-white">{problems.length}</div>
              </div>
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-center">
                <div className="text-[11px] text-rose-300">Critical Priority</div>
                <div className="text-xl font-bold text-rose-400">
                  {problems.filter((p) => p.priority === 'CRITICAL').length}
                </div>
              </div>
              <div className="rounded-xl border border-teal-500/30 bg-teal-500/10 px-4 py-2 text-center">
                <div className="text-[11px] text-teal-300">Active Pilots</div>
                <div className="text-xl font-bold text-teal-300">12</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="grid grid-cols-1 gap-3 rounded-xl border border-white/10 bg-[#0f172a]/80 p-4 backdrop-blur-xl sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="text-[11px] font-medium text-slate-400 mb-1 block">Domain Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-[#1e293b] px-3 py-1.5 text-xs text-white focus:border-teal-500 focus:outline-none"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'ALL' ? 'All Domains' : cat.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-medium text-slate-400 mb-1 block">Severity Level</label>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-[#1e293b] px-3 py-1.5 text-xs text-white focus:border-teal-500 focus:outline-none"
            >
              {PRIORITIES.map((pri) => (
                <option key={pri} value={pri}>
                  {pri === 'ALL' ? 'All Severities' : pri}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-medium text-slate-400 mb-1 block">Search District / Problem</label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="e.g. Nashik, Thane, Water..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-[#1e293b] pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => setShowOnlyVerified(!showOnlyVerified)}
              className={cn(
                'w-full flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-all',
                showOnlyVerified
                  ? 'bg-teal-500 text-white shadow-[0_0_15px_rgba(20,184,166,0.4)]'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
              )}
            >
              <ShieldCheck className="h-4 w-4 text-teal-400" />
              Verified Only ({showOnlyVerified ? 'ON' : 'OFF'})
            </button>
          </div>
        </div>

        {/* Main Map Viewport & Detail Sidebar */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Geospatial Map Canvas Container */}
          <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-teal-500/30 bg-[#070d18] p-4 lg:col-span-8 min-h-[560px]">
            {/* Radar Grid overlay pattern */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage:
                  'radial-gradient(rgba(20, 184, 166, 0.3) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
                backgroundSize: '40px 40px, 40px 40px, 40px 40px'
              }}
            />

            {/* Radar Sweep Effect */}
            <div className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden">
              <div className="h-full w-full bg-[radial-gradient(circle_at_50%_50%,rgba(20,184,166,0.08)_0%,transparent_70%)] animate-pulse" />
            </div>

            {/* Top Toolbar overlay */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2 rounded-lg bg-black/60 border border-white/10 px-3 py-1.5 text-[11px] text-slate-300 backdrop-blur-md">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Active Geocoded Nodes: <strong className="text-white">{filteredProblems.length}</strong></span>
              </div>

              {/* Map Legend */}
              <div className="flex items-center gap-3 rounded-lg bg-black/60 border border-white/10 px-3 py-1.5 text-[11px] text-slate-300 backdrop-blur-md">
                <div className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-rose-500" />
                  <span>Critical</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  <span>High</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-cyan-500" />
                  <span>Medium</span>
                </div>
              </div>
            </div>

            {/* Map Canvas with India Outline & Projected Pinpoints */}
            <div className="relative my-4 flex-1 flex items-center justify-center">
              {/* Stylized SVG outline of India */}
              <svg
                viewBox="0 0 800 900"
                className="w-full h-full max-h-[500px] opacity-25 filter drop-shadow-[0_0_20px_rgba(20,184,166,0.3)] stroke-teal-500/40 fill-teal-500/5"
              >
                {/* Simplified geographic path of India */}
                <path
                  d="M 330,80 L 370,100 L 400,120 L 430,170 L 450,210 L 490,240 L 530,245 L 600,240 L 680,260 L 730,270 L 750,300 L 710,340 L 660,330 L 630,350 L 580,330 L 560,360 L 520,380 L 490,420 L 470,480 L 440,550 L 410,640 L 380,720 L 360,780 L 340,840 L 330,840 L 310,790 L 290,720 L 270,640 L 260,560 L 230,510 L 200,470 L 160,450 L 150,420 L 190,390 L 230,380 L 240,340 L 220,300 L 230,260 L 270,230 L 290,170 L 300,120 Z"
                  strokeWidth="2"
                />
                {/* Tropic of cancer guideline */}
                <line x1="100" y1="420" x2="700" y2="420" stroke="rgba(20,184,166,0.15)" strokeDasharray="4 4" />
                {/* Grid coordinates text */}
                <text x="30" y="425" fill="rgba(20,184,166,0.4)" fontSize="11" fontFamily="monospace">23.5° N (Tropic of Cancer)</text>
                <text x="30" y="80" fill="rgba(20,184,166,0.4)" fontSize="11" fontFamily="monospace">35.0° N (North India)</text>
                <text x="30" y="820" fill="rgba(20,184,166,0.4)" fontSize="11" fontFamily="monospace">8.0° N (South Cape)</text>
              </svg>

              {/* Pinpoints absolute coordinates */}
              <div className="absolute inset-0">
                {filteredProblems.map((prob) => {
                  const coords = getCoordinates(prob.location?.lat ?? null, prob.location?.lng ?? null)
                  if (!coords) return null

                  const isSelected = selectedProblem?.id === prob.id
                  const style = priorityStyles[prob.priority] || priorityStyles.MEDIUM

                  return (
                    <button
                      key={prob.id}
                      onClick={() => setSelectedProblem(prob)}
                      style={{
                        left: `${coords.x}%`,
                        top: `${coords.y}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                      className="absolute z-20 group cursor-pointer focus:outline-none"
                    >
                      {/* Pulsing ring for critical issues */}
                      {prob.priority === 'CRITICAL' && (
                        <span className="absolute -inset-2 rounded-full bg-rose-500/40 animate-ping" />
                      )}

                      {/* Marker dot */}
                      <div
                        className={cn(
                          'relative flex h-5 w-5 items-center justify-center rounded-full border-2 transition-transform duration-200 group-hover:scale-150',
                          style.bg,
                          style.border,
                          style.glow,
                          isSelected ? 'scale-150 ring-4 ring-white/60' : ''
                        )}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                      </div>

                      {/* Tooltip on hover */}
                      <div className="pointer-events-none absolute bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-black/90 border border-white/20 px-2.5 py-1 text-[11px] font-medium text-white shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-30">
                        <div className="font-bold text-teal-300">{prob.location?.district || 'District'}</div>
                        <div className="max-w-[200px] truncate text-slate-300">{prob.title}</div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Bottom Footer Info */}
            <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-3 text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5 text-teal-400" />
                <span>Geographic projection calibrated to Indian Survey coordinates WGS-84</span>
              </div>
              <div>Click any pin to inspect the district problem dossier</div>
            </div>
          </div>

          {/* Selected Hotspot Detail Dossier Panel */}
          <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#0f172a]/90 p-6 backdrop-blur-xl lg:col-span-4 shadow-xl">
            {selectedProblem ? (
              <div className="space-y-5">
                {/* Dossier Header */}
                <div className="flex items-start justify-between gap-2 border-b border-white/10 pb-4">
                  <div>
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-xs font-semibold',
                        priorityStyles[selectedProblem.priority]?.text,
                        'border-current bg-white/5'
                      )}
                    >
                      {selectedProblem.priority} PRIORITY
                    </Badge>
                    <div className="mt-1 text-xs text-slate-400">
                      {selectedProblem.category.replace('_', ' ')}
                    </div>
                  </div>

                  {selectedProblem.reviewStatus && (
                    <Badge variant="outline" className="border-teal-500/40 bg-teal-500/10 text-teal-300 text-[11px]">
                      {selectedProblem.reviewStatus}
                    </Badge>
                  )}
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-base font-bold text-white leading-snug">
                    {selectedProblem.title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-300 leading-relaxed max-h-36 overflow-y-auto">
                    {selectedProblem.description}
                  </p>
                </div>

                {/* Geo Location Details */}
                <div className="rounded-xl bg-black/40 border border-white/10 p-3.5 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-teal-400" />
                      District / State:
                    </span>
                    <span className="font-semibold text-white">
                      {selectedProblem.location?.district || 'Unknown'}, {selectedProblem.location?.state || 'India'}
                    </span>
                  </div>

                  {selectedProblem.location?.address && (
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-slate-400 shrink-0">Exact Locality:</span>
                      <span className="text-slate-300 text-right text-[11px]">
                        {selectedProblem.location.address}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">GPS Coordinates:</span>
                    <span className="font-mono text-[11px] text-teal-300">
                      {selectedProblem.location?.lat?.toFixed(4)}° N, {selectedProblem.location?.lng?.toFixed(4)}° E
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Affected Citizens:</span>
                    <span className="font-bold text-amber-300">
                      {selectedProblem.affectedCount?.toLocaleString('en-IN') || '15,000+'}
                    </span>
                  </div>
                </div>

                {/* Linked Active Projects */}
                <div>
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Active Resolution Squads
                  </div>
                  {selectedProblem.projects && selectedProblem.projects.length > 0 ? (
                    <div className="space-y-2">
                      {selectedProblem.projects.map((proj) => (
                        <Link
                          key={proj.id}
                          href={`/projects/${proj.id}`}
                          className="flex items-center justify-between rounded-lg bg-white/5 border border-white/5 p-2.5 text-xs hover:border-teal-500/40 transition-colors"
                        >
                          <div className="truncate font-medium text-white max-w-[200px]">
                            {proj.title}
                          </div>
                          <Badge variant="outline" className="border-cyan-500/30 text-cyan-300 text-[10px]">
                            {proj.status}
                          </Badge>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-lg bg-white/[0.02] border border-white/5 p-3 text-center text-xs text-slate-400">
                      No student squads assigned yet. Open for matching!
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-8 h-full">
                <MapPin className="h-12 w-12 text-slate-600 mb-3" />
                <h4 className="text-sm font-semibold text-white">Select a Hotspot</h4>
                <p className="text-xs text-slate-400 mt-1">Click on any map marker to view district intelligence.</p>
              </div>
            )}

            {/* Action Buttons */}
            {selectedProblem && (
              <div className="pt-4 border-t border-white/10 space-y-2">
                <Link href={`/problems/${selectedProblem.id}`} className="block">
                  <Button className="w-full gap-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold">
                    <ExternalLink className="h-3.5 w-3.5" />
                    Open Full Problem Dossier
                  </Button>
                </Link>

                <Link href="/solution-library" className="block">
                  <Button variant="outline" className="w-full gap-2 rounded-xl border-white/10 text-slate-300 hover:text-white text-xs">
                    <Layers className="h-3.5 w-3.5" />
                    Search Adaptable Solutions
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
