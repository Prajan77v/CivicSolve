'use client'

import React, { useState } from 'react'
import AppShell from '@/components/layout/app-shell'
import {
  ShieldAlert,
  AlertTriangle,
  Clock,
  Cpu,
  CheckCircle2,
  Users,
  Flame,
  Zap,
  Filter,
  ArrowUpRight,
  TrendingUp,
  RefreshCw,
  Building,
  MapPin,
  Sparkles,
  ArrowRight,
  AlertOctagon,
  ChevronRight,
  Check,
  Compass
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface Incident {
  id: string
  title: string
  category: string
  district: string
  state: string
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  status: string
  affectedCount: number
  matchedTeam?: string
  university?: string
  daysOpen: number
  expedited?: boolean
  coordinates?: { x: number; y: number } // Percentage on map
}

const initialIncidents: Incident[] = [
  {
    id: 'inc-01',
    title: 'Groundwater Arsenic & Fluoride Contamination in 6 Nashik Villages',
    category: 'Water',
    district: 'Nashik',
    state: 'Maharashtra',
    priority: 'CRITICAL',
    status: 'DEPLOYED',
    affectedCount: 2500,
    matchedTeam: 'AquaTech Innovators',
    university: 'IIT Bombay',
    daysOpen: 4,
    expedited: true,
    coordinates: { x: 38, y: 55 },
  },
  {
    id: 'inc-02',
    title: 'Severe Flash Flood Hazard in Coastal Kendrapara Villages',
    category: 'Infrastructure',
    district: 'Kendrapara',
    state: 'Odisha',
    priority: 'CRITICAL',
    status: 'MATCHED',
    affectedCount: 12000,
    matchedTeam: 'FloodShield Ops',
    university: 'NIT Trichy',
    daysOpen: 2,
    expedited: false,
    coordinates: { x: 68, y: 52 },
  },
  {
    id: 'inc-03',
    title: 'Untreated Industrial Chemical Effluent in Mula-Mutha River',
    category: 'Water',
    district: 'Pune',
    state: 'Maharashtra',
    priority: 'CRITICAL',
    status: 'AI_ANALYZED',
    affectedCount: 200000,
    daysOpen: 1,
    expedited: false,
    coordinates: { x: 40, y: 60 },
  },
  {
    id: 'inc-04',
    title: 'Chronic Cotton Crop Failure due to Drought & Pest Stress',
    category: 'Agriculture',
    district: 'Yavatmal',
    state: 'Maharashtra',
    priority: 'HIGH',
    status: 'PILOT',
    affectedCount: 3800,
    matchedTeam: 'FarmSense AI',
    university: 'IIIT Hyderabad',
    daysOpen: 6,
    expedited: true,
    coordinates: { x: 48, y: 56 },
  },
  {
    id: 'inc-05',
    title: 'Overwhelming OPD Hospital Backlog at District Civil Hospital',
    category: 'Health',
    district: 'Amravati',
    state: 'Maharashtra',
    priority: 'HIGH',
    status: 'PROPOSAL',
    affectedCount: 8000,
    matchedTeam: 'HealthBridge Team',
    university: 'BITS Pilani',
    daysOpen: 5,
    expedited: false,
    coordinates: { x: 46, y: 53 },
  },
  {
    id: 'inc-06',
    title: 'Hazardous PM2.5 Industrial Air Quality Spikes in Industrial Cluster',
    category: 'Air Quality',
    district: 'South Delhi',
    state: 'Delhi',
    priority: 'HIGH',
    status: 'PILOT',
    affectedCount: 120000,
    matchedTeam: 'AirGuard Lab',
    university: 'IIT Delhi',
    daysOpen: 7,
    expedited: false,
    coordinates: { x: 42, y: 32 },
  },
  {
    id: 'inc-07',
    title: 'Uncollected Municipal Solid Waste Blocking Drainage Corridors',
    category: 'Waste',
    district: 'Aurangabad',
    state: 'Maharashtra',
    priority: 'HIGH',
    status: 'TEAM_FORMED',
    affectedCount: 38000,
    matchedTeam: 'WasteWise Core',
    university: 'IIT Bombay',
    daysOpen: 8,
    expedited: false,
    coordinates: { x: 42, y: 57 },
  },
]

const domainDistribution = [
  { domain: 'Water & Sanitation', count: 48, percentage: 32 },
  { domain: 'Air Quality & Emissions', count: 26, percentage: 18 },
  { domain: 'Agriculture & Irrigation', count: 24, percentage: 16 },
  { domain: 'Waste Management', count: 18, percentage: 12 },
  { domain: 'Health & Diagnostics', count: 15, percentage: 10 },
  { domain: 'Civic Infrastructure', count: 11, percentage: 8 },
]

const bottleneckAlerts = [
  {
    id: 'b-1',
    title: 'Nashik Water Filtration Pilot',
    district: 'Nashik, Maharashtra',
    stalledDays: 14,
    stage: 'Membrane Validation',
    issue: 'Awaiting District Health Officer bacteriological sign-off',
  },
  {
    id: 'b-2',
    title: 'Kendrapara Coastal Surge Barrier',
    district: 'Kendrapara, Odisha',
    stalledDays: 9,
    stage: 'Pilot Deployment',
    issue: 'Pending District Collector coastal clearance permit',
  },
  {
    id: 'b-3',
    title: 'Amravati District Hospital Triage',
    district: 'Amravati, Maharashtra',
    stalledDays: 6,
    stage: 'Faculty Mentorship',
    issue: 'Requires NIRF Tier-1 biomedical faculty co-advisor',
  },
]

const lifecycleFunnel = [
  { stage: 'Reported', count: 142, pct: 100 },
  { stage: 'Matched', count: 89, pct: 63 },
  { stage: 'In Progress', count: 54, pct: 38 },
  { stage: 'Pilot Testing', count: 23, pct: 16 },
  { stage: 'Deployed', count: 12, pct: 8 },
]

export default function CommandCenterPage() {
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents)
  const [selectedState, setSelectedState] = useState('ALL')
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [selectedPriority, setSelectedPriority] = useState('ALL')
  const [activeDistrictPin, setActiveDistrictPin] = useState<string | null>('Nashik')
  const [interveningId, setInterveningId] = useState<string | null>(null)

  const states = ['ALL', 'Maharashtra', 'Odisha', 'Delhi', 'Tamil Nadu', 'Telangana']
  const categories = ['ALL', 'Water', 'Agriculture', 'Air Quality', 'Waste', 'Health', 'Infrastructure']
  const priorities = ['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW']

  const handleIntervene = (incidentId: string, title: string) => {
    setInterveningId(incidentId)
    setTimeout(() => {
      setIncidents((prev) =>
        prev.map((item) => (item.id === incidentId ? { ...item, expedited: true } : item))
      )
      setInterveningId(null)
      toast.success('Direct Government Directive Issued', {
        description: `Fast-track authority dispatched for "${title.slice(0, 45)}...". DM notified.`,
      })
    }, 450)
  }

  const handleExpediteFunding = (incidentId: string, title: string) => {
    setIncidents((prev) =>
      prev.map((item) => (item.id === incidentId ? { ...item, expedited: true } : item))
    )
    toast.info('Fast-Track Equipment Sandbox Allocated', {
      description: `Disbursed 50 testing sensor nodes and lab sandbox for "${title.slice(0, 40)}...".`,
    })
  }

  const filteredIncidents = incidents.filter((inc) => {
    if (selectedState !== 'ALL' && inc.state !== selectedState) return false
    if (selectedCategory !== 'ALL' && inc.category !== selectedCategory) return false
    if (selectedPriority !== 'ALL' && inc.priority !== selectedPriority) return false
    return true
  })

  return (
    <AppShell>
      <div className="space-y-8 pb-20 max-w-7xl mx-auto">
        {/* Operational Header Bar */}
        <div className="border-b border-slate-800 pb-6 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              <span className="font-semibold text-slate-200">OPERATIONAL INTELLIGENCE //</span>
              <span className="text-cyan-400">GOVERNMENT COMMAND CENTER</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                SECURE FEED v4.2
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-500 uppercase">JURISDICTION:</span>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="rounded border border-slate-800 bg-[#0d1117] px-2.5 py-1 text-slate-200 focus:border-slate-600 focus:outline-none"
              >
                {states.map((s) => (
                  <option key={s} value={s}>{s === 'ALL' ? 'All States (National)' : s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
                National Societal Distress & Intervention Console
              </h1>
              <p className="text-sm text-slate-400 mt-1 max-w-3xl">
                Real-time operational intelligence connecting district collectorates, municipal commissioners, and university engineering squads.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.success('Sensors & telemetry streams synchronized')}
                className="border-slate-800 bg-[#0d1117] text-slate-300 hover:text-white font-mono text-xs h-8"
              >
                <RefreshCw className="h-3 w-3 mr-1.5 text-slate-400" />
                Sync Telemetry
              </Button>
            </div>
          </div>
        </div>

        {/* Active Emergencies Ticker */}
        <div className="rounded border border-red-500/30 bg-[#160c0d] p-3 flex items-center gap-3 text-xs font-mono">
          <span className="inline-flex items-center gap-1.5 font-bold text-red-400 uppercase tracking-wider shrink-0">
            <Flame className="h-3.5 w-3.5 animate-pulse" />
            CRITICAL TICKER:
          </span>
          <div className="overflow-hidden whitespace-nowrap text-slate-300 text-xs">
            <span className="inline-block animate-marquee">
              [NASHIK] Fluoride contamination 4.2 mg/L in 6 villages — AquaTech pilot deployed • [KENDRAPARA] Flash flood surge warning issued — barrier team alerted • [PUNE] River effluent spike detected by edge sensor #402 • [YAVATMAL] Drought stress triage active
            </span>
          </div>
        </div>

        {/* 4 Operational Metric Badges */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
          <div className="p-4 rounded-lg border border-slate-800 bg-[#0d1117] space-y-1">
            <span className="text-[10px] text-slate-500 uppercase block font-semibold">Unassigned Critical</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-red-400">47</span>
              <span className="text-[11px] text-red-300/80">Require DM Directive</span>
            </div>
          </div>

          <div className="p-4 rounded-lg border border-slate-800 bg-[#0d1117] space-y-1">
            <span className="text-[10px] text-slate-500 uppercase block font-semibold">In-Flight Solutions</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-100">128</span>
              <span className="text-[11px] text-slate-400">Active Lab Squads</span>
            </div>
          </div>

          <div className="p-4 rounded-lg border border-slate-800 bg-[#0d1117] space-y-1">
            <span className="text-[10px] text-slate-500 uppercase block font-semibold">Municipal Deployments</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-emerald-400">64</span>
              <span className="text-[11px] text-emerald-300/80">Across 19 States</span>
            </div>
          </div>

          <div className="p-4 rounded-lg border border-slate-800 bg-[#0d1117] space-y-1">
            <span className="text-[10px] text-slate-500 uppercase block font-semibold">Citizens Impacted</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-cyan-300">415,000+</span>
              <span className="text-[11px] text-cyan-400/80">Empirically Verified</span>
            </div>
          </div>
        </div>

        {/* Two-Column Operational Layout: 65% Map & Live Queue, 35% Funnel & Bottlenecks */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* LEFT 65%: Map Density & Live Priority Queue */}
          <div className="lg:col-span-8 space-y-8">

            {/* STYLED OPERATIONAL MAP VIEW */}
            <div className="border border-slate-800 rounded-lg bg-[#0d1117] p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Compass className="h-4 w-4 text-cyan-400" />
                  <h3 className="text-sm font-mono font-bold text-slate-200 uppercase tracking-wider">
                    Geographic Problem Density & Sensor Clusters
                  </h3>
                </div>
                <span className="font-mono text-xs text-slate-400">
                  Active Focus: <strong className="text-white">{activeDistrictPin || 'National Matrix'}</strong>
                </span>
              </div>

              {/* Styled SVG Map Canvas */}
              <div className="relative h-64 sm:h-80 w-full rounded border border-slate-800/80 bg-[#08090c] overflow-hidden flex items-center justify-center">
                {/* Subtle Grid Lines */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px]" />

                {/* Stylized Vector Boundary Outline */}
                <svg className="h-full w-full max-h-72 opacity-40 text-slate-700 stroke-current" viewBox="0 0 500 500" fill="none">
                  {/* Stylized geometric India contour */}
                  <polygon points="210,50 250,90 280,110 320,130 350,160 380,190 320,230 360,280 340,330 300,380 260,430 240,460 230,420 200,370 170,320 150,260 170,210 140,160 180,120 200,80" strokeWidth="1.5" fill="#0f172a" fillOpacity="0.4" />
                  {/* Grid latitude lines */}
                  <line x1="100" y1="150" x2="400" y2="150" strokeDasharray="4 4" strokeWidth="0.5" />
                  <line x1="100" y1="250" x2="400" y2="250" strokeDasharray="4 4" strokeWidth="0.5" />
                  <line x1="100" y1="350" x2="400" y2="350" strokeDasharray="4 4" strokeWidth="0.5" />
                </svg>

                {/* Interactive Hotspot Pins */}
                {initialIncidents.map((inc) => {
                  const isSelected = activeDistrictPin === inc.district
                  const isCritical = inc.priority === 'CRITICAL'

                  return (
                    <button
                      key={inc.id}
                      onClick={() => {
                        setActiveDistrictPin(inc.district)
                        toast.info(`District Focused: ${inc.district}`, {
                          description: `${inc.title.slice(0, 45)}...`,
                        })
                      }}
                      style={{
                        left: `${inc.coordinates?.x || 50}%`,
                        top: `${inc.coordinates?.y || 50}%`,
                      }}
                      className={cn(
                        'absolute -translate-x-1/2 -translate-y-1/2 group transition-all z-10',
                        isSelected ? 'scale-125 z-20' : 'hover:scale-110'
                      )}
                    >
                      <div className="relative flex items-center justify-center">
                        <div
                          className={cn(
                            'h-3.5 w-3.5 rounded-full border flex items-center justify-center',
                            isCritical
                              ? 'bg-red-500 border-red-300 shadow-[0_0_8px_#ef4444]'
                              : 'bg-amber-400 border-amber-200'
                          )}
                        />
                        {isCritical && (
                          <div className="absolute h-6 w-6 rounded-full bg-red-500/30 animate-ping" />
                        )}
                      </div>

                      {/* Tooltip Tag */}
                      <span
                        className={cn(
                          'absolute top-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded px-1.5 py-0.5 text-[10px] font-mono font-bold transition-all',
                          isSelected
                            ? 'bg-white text-slate-950 shadow-md'
                            : 'bg-slate-900/90 text-slate-300 border border-slate-700 hidden group-hover:block'
                        )}
                      >
                        {inc.district} ({inc.affectedCount.toLocaleString('en-IN')})
                      </span>
                    </button>
                  )
                })}

                {/* Map Legend */}
                <div className="absolute bottom-3 left-3 flex items-center gap-3 font-mono text-[10px] text-slate-400 bg-slate-950/80 px-2.5 py-1 rounded border border-slate-800">
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-red-500" /> Critical Severity
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-amber-400" /> High Urgency
                  </span>
                </div>
              </div>
            </div>

            {/* LIVE OPERATIONAL PRIORITY QUEUE */}
            <div className="border border-slate-800 rounded-lg bg-[#0d1117] overflow-hidden">
              <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
                <div>
                  <h3 className="font-bold text-slate-100 uppercase tracking-wider">
                    Live Priority Queue & Administrative Actions
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    1-click directive dispatch for District Magistrates and Municipal Commissioners
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="rounded border border-slate-800 bg-[#08090c] px-2 py-1 text-slate-300 text-xs focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c === 'ALL' ? 'All Domains' : c}</option>
                    ))}
                  </select>

                  <select
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value)}
                    className="rounded border border-slate-800 bg-[#08090c] px-2 py-1 text-slate-300 text-xs focus:outline-none"
                  >
                    {priorities.map((p) => (
                      <option key={p} value={p}>{p === 'ALL' ? 'All Priorities' : p}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Table of Incidents */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="border-b border-slate-800 bg-[#08090c] uppercase text-[10px] text-slate-500 tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Urgency</th>
                      <th className="px-4 py-3">Distress Report</th>
                      <th className="px-4 py-3">District</th>
                      <th className="px-4 py-3">Squad / Lab</th>
                      <th className="px-4 py-3 text-right">Direct Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {filteredIncidents.map((incident) => {
                      const isCritical = incident.priority === 'CRITICAL'

                      return (
                        <tr key={incident.id} className="hover:bg-slate-900/40 transition-colors">
                          {/* Priority */}
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span
                              className={cn(
                                'px-1.5 py-0.5 rounded border text-[10px] font-bold uppercase',
                                isCritical
                                  ? 'border-red-500/30 bg-red-500/15 text-red-400'
                                  : 'border-amber-500/30 bg-amber-500/15 text-amber-400'
                              )}
                            >
                              {incident.priority}
                            </span>
                          </td>

                          {/* Distress Report */}
                          <td className="px-4 py-3 max-w-xs sm:max-w-sm">
                            <div className="font-sans font-semibold text-slate-200 line-clamp-1">
                              {incident.title}
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5 font-mono">
                              <span className="text-cyan-400">{incident.category}</span>
                              <span>•</span>
                              <span>{incident.affectedCount.toLocaleString('en-IN')} Affected</span>
                              {incident.expedited && (
                                <>
                                  <span>•</span>
                                  <span className="text-emerald-400 font-bold">DIRECTIVE ACTIVE</span>
                                </>
                              )}
                            </div>
                          </td>

                          {/* District */}
                          <td className="px-4 py-3 whitespace-nowrap text-slate-300">
                            {incident.district}, {incident.state}
                          </td>

                          {/* Squad / Lab */}
                          <td className="px-4 py-3 whitespace-nowrap">
                            {incident.matchedTeam ? (
                              <div>
                                <span className="font-semibold text-slate-200 block">{incident.matchedTeam}</span>
                                <span className="text-[10px] text-slate-500 block">{incident.university}</span>
                              </div>
                            ) : (
                              <span className="text-amber-400 text-[11px] italic">AI Routing...</span>
                            )}
                          </td>

                          {/* Direct Actions */}
                          <td className="px-4 py-3 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {incident.expedited ? (
                                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20">
                                  <Check className="h-3 w-3" /> Dispatched
                                </span>
                              ) : (
                                <>
                                  <Button
                                    size="sm"
                                    onClick={() => handleIntervene(incident.id, incident.title)}
                                    disabled={interveningId === incident.id}
                                    className="bg-red-600 hover:bg-red-500 text-white font-bold text-[10px] h-7 px-2"
                                  >
                                    <ShieldAlert className="h-3 w-3 mr-1" />
                                    Directive
                                  </Button>

                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleExpediteFunding(incident.id, incident.title)}
                                    className="border-slate-800 text-slate-300 hover:text-white text-[10px] h-7 px-2"
                                  >
                                    <Zap className="h-3 w-3 mr-1 text-amber-400" />
                                    Grant
                                  </Button>
                                </>
                              )}

                              <Link
                                href="/problems"
                                className="p-1.5 rounded text-slate-400 hover:text-white"
                                title="Inspect Case Dossier"
                              >
                                <ArrowUpRight className="h-3.5 w-3.5" />
                              </Link>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* RIGHT 35%: Bottleneck Alerts & Lifecycle Funnel */}
          <div className="lg:col-span-4 space-y-8">

            {/* BOTTLENECK ALERTS */}
            <div className="border border-slate-800 rounded-lg bg-[#0d1117] p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="font-mono text-[10px] uppercase text-slate-500 block">SLA Breaches</span>
                  <h3 className="text-sm font-mono font-bold text-slate-200 uppercase tracking-wider">
                    Bottleneck Alerts
                  </h3>
                </div>
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold">
                  3 Stalled
                </span>
              </div>

              <div className="space-y-3">
                {bottleneckAlerts.map((b) => (
                  <div key={b.id} className="p-3 rounded border border-amber-500/20 bg-[#16120b] space-y-1.5 text-xs font-mono">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200">{b.title}</span>
                      <span className="text-[10px] text-amber-400 font-bold">Stalled {b.stalledDays}d</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{b.district} • {b.stage}</p>
                    <p className="text-[11px] text-amber-200/90 font-sans leading-tight pt-1 border-t border-amber-500/10">
                      <strong>Root cause:</strong> {b.issue}
                    </p>
                    <div className="pt-1 flex justify-end">
                      <button
                        onClick={() => toast.success(`Collector Notice Dispatched for ${b.title}`)}
                        className="text-[10px] text-amber-300 hover:text-white underline"
                      >
                        Dispatch Collector Notice →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* LIFECYCLE CONVERSION FUNNEL */}
            <div className="border border-slate-800 rounded-lg bg-[#0d1117] p-5 space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <span className="font-mono text-[10px] uppercase text-slate-500 block">Throughput Metrics</span>
                <h3 className="text-sm font-mono font-bold text-slate-200 uppercase tracking-wider">
                  Lifecycle Funnel Conversion
                </h3>
              </div>

              <div className="space-y-3 font-mono text-xs">
                {lifecycleFunnel.map((step, idx) => (
                  <div key={step.stage} className="space-y-1">
                    <div className="flex justify-between text-slate-300">
                      <span>{step.stage}</span>
                      <span className="text-slate-400 font-bold">
                        {step.count} ({step.pct}%)
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-slate-300 transition-all duration-500"
                        style={{ width: `${step.pct}%` }}
                      />
                    </div>
                  </div>
                ))}

                <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 leading-snug font-sans">
                  <strong>Conversion Insight:</strong> 63% of reported distress cases successfully match to university squads within 4 hours. Highest attrition occurs at municipal testing permit sign-off.
                </div>
              </div>
            </div>

            {/* DOMAIN DISTRIBUTION */}
            <div className="border border-slate-800 rounded-lg bg-[#0d1117] p-5 space-y-3">
              <div className="border-b border-slate-800 pb-2">
                <span className="font-mono text-[10px] uppercase text-slate-500 block">Sector Spread</span>
                <h3 className="text-sm font-mono font-bold text-slate-200 uppercase tracking-wider">
                  Incidents by Domain
                </h3>
              </div>

              <div className="space-y-2 font-mono text-xs">
                {domainDistribution.map((d) => (
                  <div key={d.domain} className="flex justify-between items-center py-1 border-b border-slate-800/50">
                    <span className="text-slate-300">{d.domain}</span>
                    <span className="text-slate-400 font-bold">{d.count} ({d.percentage}%)</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </AppShell>
  )
}
