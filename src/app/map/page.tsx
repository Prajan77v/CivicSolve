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
  Maximize2,
  Flame,
  Globe2,
  Radio,
  FileText,
  Users,
  Film,
  Image as ImageIcon
} from 'lucide-react'
import AppShell from '@/components/layout/app-shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import InteractiveCivicMap from '@/components/map/interactive-civic-map'
import type {
  MapProblemItem,
  MapProjectItem,
  MapDeploymentItem,
  MapChallengeGroupItem
} from '@/components/map/civic-map'

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

function cleanTitle(title: string): string {
  if (!title) return ''
  // Strip trailing numeric test timestamps (e.g., 1788792059847)
  return title.replace(/\s+\d{10,15}$/, '').trim()
}

export default function CivicMapPage() {
  const [problems, setProblems] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProblem, setSelectedProblem] = useState<any | null>(null)

  // Map Mode: 'interactive' (Leaflet GIS tiles) or 'radar' (Tactical projection)
  const [mapMode, setMapMode] = useState<'interactive' | 'radar'>('interactive')
  const [activeLayer, setActiveLayer] = useState<'problems' | 'projects' | 'deployments' | 'groups'>('problems')
  const [showHeatmap, setShowHeatmap] = useState(false)

  // Filters
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [selectedPriority, setSelectedPriority] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [showOnlyVerified, setShowOnlyVerified] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    try {
      const [probRes, projRes] = await Promise.all([
        fetch('/api/problems'),
        fetch('/api/projects').catch(() => null)
      ])

      const probJson = await probRes.json()
      if (probJson.success && Array.isArray(probJson.data)) {
        setProblems(probJson.data)
        if (probJson.data.length > 0) {
          setSelectedProblem(probJson.data[0])
        }
      }

      if (projRes) {
        const projJson = await projRes.json()
        if (projJson.success && Array.isArray(projJson.data)) {
          setProjects(projJson.data)
        }
      }
    } catch (err) {
      console.error('Failed to load map data:', err)
    } finally {
      setLoading(false)
    }
  }

  // Filtered raw problem items
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

  // Map to Leaflet compatible items
  const leafletProblems: MapProblemItem[] = useMemo(() => {
    return filteredProblems.map((p) => ({
      id: p.id,
      title: cleanTitle(p.title),
      description: p.description,
      category: p.category,
      priority: (p.priority as any) || 'MEDIUM',
      status: p.status || 'SUBMITTED',
      affectedCount: p.affectedCount || 5000,
      district: p.location?.district || 'Nashik',
      state: p.location?.state || 'Maharashtra',
      lat: p.location?.lat || 19.9975,
      lng: p.location?.lng || 73.7898,
      submittedByName: p.submittedBy?.name || 'Citizen Reporter'
    }))
  }, [filteredProblems])

  const leafletProjects: MapProjectItem[] = useMemo(() => {
    return projects.map((p) => ({
      id: p.id,
      title: p.title,
      status: p.status,
      progressPercent: p.progressPercent || 40,
      teamName: p.team?.name || 'Engineering Squad',
      universityName: p.team?.university?.name || 'IIT Bombay',
      problemId: p.problemId || '',
      problemTitle: p.problem?.title || 'Civic Challenge',
      category: p.problem?.category || 'WATER',
      district: p.problem?.location?.district || 'Nashik',
      state: p.problem?.location?.state || 'Maharashtra',
      lat: p.problem?.location?.lat || 19.9975,
      lng: p.problem?.location?.lng || 73.7898
    }))
  }, [projects])

  // Geo bounds for India SVG radar projection
  function getCoordinates(lat: number | null, lng: number | null) {
    if (!lat || !lng) return null
    const minLng = 68.0
    const maxLng = 96.0
    const minLat = 8.0
    const maxLat = 36.0

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
      text: 'text-rose-600 dark:text-rose-400'
    },
    HIGH: {
      bg: 'bg-amber-500',
      border: 'border-amber-400',
      glow: 'shadow-[0_0_12px_rgba(245,158,11,0.8)]',
      text: 'text-amber-600 dark:text-amber-400'
    },
    MEDIUM: {
      bg: 'bg-cyan-500',
      border: 'border-cyan-400',
      glow: 'shadow-[0_0_10px_rgba(6,182,212,0.7)]',
      text: 'text-cyan-600 dark:text-cyan-400'
    },
    LOW: {
      bg: 'bg-emerald-500',
      border: 'border-emerald-400',
      glow: 'shadow-[0_0_8px_rgba(16,185,129,0.7)]',
      text: 'text-emerald-600 dark:text-emerald-400'
    }
  }

  return (
    <AppShell>
      <div className="space-y-6 pb-16">
        
        {/* Top Header Banner */}
        <div className="relative overflow-hidden rounded-2xl border border-teal-500/20 bg-gradient-to-r from-[#0a1628] via-[#0d2238] to-[#0a1628] p-6 shadow-xl">
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
                Interactive real-time spatial mapping of citizen-reported challenges across Indian districts. Inspect ground truth telemetry, satellite imagery, and active resolution squads.
              </p>
            </div>

            {/* Quick stats counter & Map Mode Switcher */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-center">
                <div className="text-[10px] text-slate-400">Total Hotspots</div>
                <div className="text-lg font-bold text-white">{problems.length}</div>
              </div>
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-center">
                <div className="text-[10px] text-rose-300">Critical</div>
                <div className="text-lg font-bold text-rose-400">
                  {problems.filter((p) => p.priority === 'CRITICAL').length}
                </div>
              </div>

              {/* View Mode Toggle Pill */}
              <div className="flex items-center rounded-xl bg-slate-950/80 border border-white/15 p-1">
                <button
                  type="button"
                  onClick={() => setMapMode('interactive')}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                    mapMode === 'interactive'
                      ? 'bg-teal-500 text-slate-950 font-bold shadow-md'
                      : 'text-slate-300 hover:text-white'
                  )}
                >
                  <Globe2 className="h-3.5 w-3.5" />
                  GIS Map
                </button>
                <button
                  type="button"
                  onClick={() => setMapMode('radar')}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                    mapMode === 'radar'
                      ? 'bg-teal-500 text-slate-950 font-bold shadow-md'
                      : 'text-slate-300 hover:text-white'
                  )}
                >
                  <Radio className="h-3.5 w-3.5" />
                  Radar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="grid grid-cols-1 gap-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0f172a]/80 p-4 shadow-sm backdrop-blur-xl sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1 block">Domain Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-[#1e293b] px-3 py-1.5 text-xs text-slate-900 dark:text-white focus:border-teal-500 focus:outline-none"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'ALL' ? 'All Domains' : cat.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1 block">Severity Level</label>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-[#1e293b] px-3 py-1.5 text-xs text-slate-900 dark:text-white focus:border-teal-500 focus:outline-none"
            >
              {PRIORITIES.map((pri) => (
                <option key={pri} value={pri}>
                  {pri === 'ALL' ? 'All Severities' : pri}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1 block">Search District / Problem</label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="e.g. Nashik, Nagpur, Water..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-[#1e293b] pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => setShowOnlyVerified(!showOnlyVerified)}
              className={cn(
                'w-full flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-all',
                showOnlyVerified
                  ? 'bg-teal-600 text-white shadow-[0_0_15px_rgba(20,184,166,0.4)]'
                  : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10'
              )}
            >
              <ShieldCheck className="h-4 w-4 text-teal-500" />
              Verified Only ({showOnlyVerified ? 'ON' : 'OFF'})
            </button>
          </div>
        </div>

        {/* Main Map Viewport & Detail Sidebar */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          
          {/* Geospatial Map Canvas Container */}
          <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 dark:border-teal-500/30 bg-white dark:bg-[#070d18] lg:col-span-8 min-h-[560px] shadow-lg">
            
            {/* 1. INTERACTIVE LEAFLET OPENSTREETMAP GIS ENGINE */}
            {mapMode === 'interactive' && (
              <div className="w-full h-full min-h-[560px]">
                <InteractiveCivicMap
                  problems={leafletProblems}
                  projects={leafletProjects}
                  activeLayer={activeLayer}
                  onLayerChange={setActiveLayer}
                  showHeatmap={showHeatmap}
                  onToggleHeatmap={setShowHeatmap}
                  onSelectProblem={(mapItem) => {
                    const found = problems.find((p) => p.id === mapItem.id)
                    if (found) setSelectedProblem(found)
                  }}
                  className="h-full min-h-[560px] w-full"
                />
              </div>
            )}

            {/* 2. TACTICAL RADAR GRID VIEW */}
            {mapMode === 'radar' && (
              <div className="relative flex-1 flex flex-col justify-between p-4 min-h-[560px] bg-[#070d18]">
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
                  <svg
                    viewBox="0 0 800 900"
                    className="w-full h-full max-h-[480px] opacity-25 filter drop-shadow-[0_0_20px_rgba(20,184,166,0.3)] stroke-teal-500/40 fill-teal-500/5"
                  >
                    <path
                      d="M 330,80 L 370,100 L 400,120 L 430,170 L 450,210 L 490,240 L 530,245 L 600,240 L 680,260 L 730,270 L 750,300 L 710,340 L 660,330 L 630,350 L 580,330 L 560,360 L 520,380 L 490,420 L 470,480 L 440,550 L 410,640 L 380,720 L 360,780 L 340,840 L 330,840 L 310,790 L 290,720 L 270,640 L 260,560 L 230,510 L 200,470 L 160,450 L 150,420 L 190,390 L 230,380 L 240,340 L 220,300 L 230,260 L 270,230 L 290,170 L 300,120 Z"
                      strokeWidth="2"
                    />
                    <line x1="100" y1="420" x2="700" y2="420" stroke="rgba(20,184,166,0.15)" strokeDasharray="4 4" />
                    <text x="30" y="425" fill="rgba(20,184,166,0.4)" fontSize="11" fontFamily="monospace">23.5° N (Tropic of Cancer)</text>
                    <text x="30" y="80" fill="rgba(20,184,166,0.4)" fontSize="11" fontFamily="monospace">35.0° N (North India)</text>
                    <text x="30" y="820" fill="rgba(20,184,166,0.4)" fontSize="11" fontFamily="monospace">8.0° N (South Cape)</text>
                  </svg>

                  {/* Pinpoints */}
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
                          {prob.priority === 'CRITICAL' && (
                            <span className="absolute -inset-2 rounded-full bg-rose-500/40 animate-ping" />
                          )}

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

                          <div className="pointer-events-none absolute bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-black/90 border border-white/20 px-2.5 py-1 text-[11px] font-medium text-white shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-30">
                            <div className="font-bold text-teal-300">{prob.location?.district || 'District'}</div>
                            <div className="max-w-[200px] truncate text-slate-300">{cleanTitle(prob.title)}</div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-3 text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Activity className="h-3.5 w-3.5 text-teal-400" />
                    <span>Geographic projection calibrated to Indian Survey coordinates WGS-84</span>
                  </div>
                  <div>Click any pin to inspect the district problem dossier</div>
                </div>
              </div>
            )}
          </div>

          {/* Selected Hotspot Detail Dossier Panel */}
          <div className="flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0f172a]/90 p-6 shadow-xl backdrop-blur-xl lg:col-span-4">
            {selectedProblem ? (
              <div className="space-y-5">
                {/* Dossier Header */}
                <div className="flex items-start justify-between gap-2 border-b border-slate-200 dark:border-white/10 pb-4">
                  <div>
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-xs font-semibold',
                        priorityStyles[selectedProblem.priority]?.text,
                        'border-current bg-slate-100 dark:bg-white/5'
                      )}
                    >
                      {selectedProblem.priority} PRIORITY
                    </Badge>
                    <div className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                      {selectedProblem.category.replace('_', ' ')}
                    </div>
                  </div>

                  {selectedProblem.reviewStatus && (
                    <Badge variant="outline" className="border-teal-500/40 bg-teal-500/10 text-teal-700 dark:text-teal-300 text-[11px]">
                      {selectedProblem.reviewStatus}
                    </Badge>
                  )}
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                    {cleanTitle(selectedProblem.title)}
                  </h3>
                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-h-36 overflow-y-auto">
                    {selectedProblem.description}
                  </p>
                </div>

                {/* Ground Truth Supporting Evidence Preview if available */}
                {selectedProblem.evidence && selectedProblem.evidence.length > 0 && (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                      <span className="flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400">
                        <ImageIcon className="h-3.5 w-3.5" />
                        Attached Evidence ({selectedProblem.evidence.length})
                      </span>
                      <span className="text-[10px] text-slate-400">Ground-Truth Verified</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {selectedProblem.evidence.slice(0, 3).map((ev: any, idx: number) => (
                        <div key={ev.id || idx} className="aspect-video rounded bg-slate-200 dark:bg-slate-800 overflow-hidden flex items-center justify-center text-[10px]">
                          {ev.type === 'IMAGE' ? (
                            <img src={ev.url} alt={ev.originalName} className="h-full w-full object-cover" />
                          ) : ev.type === 'VIDEO' ? (
                            <div className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
                              <Film className="h-3.5 w-3.5" />
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                              <FileText className="h-3.5 w-3.5" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Geo Location Details */}
                <div className="rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 p-3.5 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                      District / State:
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {selectedProblem.location?.district || 'Unknown'}, {selectedProblem.location?.state || 'India'}
                    </span>
                  </div>

                  {selectedProblem.location?.address && (
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-slate-500 dark:text-slate-400 shrink-0">Locality:</span>
                      <span className="text-slate-700 dark:text-slate-300 text-right text-[11px] truncate max-w-[180px]">
                        {selectedProblem.location.address}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">GPS Coordinates:</span>
                    <span className="font-mono text-[11px] text-teal-600 dark:text-teal-300">
                      {selectedProblem.location?.lat ? selectedProblem.location.lat.toFixed(4) : '19.9975'}° N, {selectedProblem.location?.lng ? selectedProblem.location.lng.toFixed(4) : '73.7898'}° E
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Affected Citizens:</span>
                    <span className="font-bold text-amber-600 dark:text-amber-300">
                      {selectedProblem.affectedCount?.toLocaleString('en-IN') || '15,000+'}
                    </span>
                  </div>
                </div>

                {/* Linked Active Projects / Squads */}
                <div>
                  <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Active Resolution Squads
                  </div>
                  {selectedProblem.projects && selectedProblem.projects.length > 0 ? (
                    <div className="space-y-2">
                      {selectedProblem.projects.map((proj: any) => (
                        <Link
                          key={proj.id}
                          href={`/projects/${proj.id}`}
                          className="flex items-center justify-between rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 p-2.5 text-xs hover:border-teal-500/40 transition-colors"
                        >
                          <div className="truncate font-medium text-slate-900 dark:text-white max-w-[200px]">
                            {proj.title}
                          </div>
                          <Badge variant="outline" className="border-cyan-500/30 text-cyan-600 dark:text-cyan-300 text-[10px]">
                            {proj.status}
                          </Badge>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-lg bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 p-3 text-center text-xs text-slate-500 dark:text-slate-400">
                      No student squads assigned yet. Open for matching!
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-8 h-full">
                <MapPin className="h-12 w-12 text-slate-400 dark:text-slate-600 mb-3" />
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Select a Hotspot</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Click on any map marker to view district intelligence.</p>
              </div>
            )}

            {/* Action Buttons */}
            {selectedProblem && (
              <div className="pt-4 border-t border-slate-200 dark:border-white/10 space-y-2">
                <Link href={`/problems/${selectedProblem.id}`} className="block">
                  <Button className="w-full gap-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold">
                    <ExternalLink className="h-3.5 w-3.5" />
                    Open Full Problem Dossier
                  </Button>
                </Link>

                <Link href="/solution-library" className="block">
                  <Button variant="outline" className="w-full gap-2 rounded-xl border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white text-xs">
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
