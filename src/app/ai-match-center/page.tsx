'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import {
  Cpu,
  Search,
  ExternalLink,
  Check,
  Send,
  Building2,
  GraduationCap,
  Users,
  Compass
} from 'lucide-react'
import AppShell from '@/components/layout/app-shell'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface ProblemItem {
  id: string
  title: string
  description: string
  category: string
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  status: string
  affectedCount?: number | null
  location?: {
    district?: string | null
    state?: string | null
  } | null
  aiAnalysis?: {
    confidence: number
    priorityScore: number
    domain: string
    detectedTech?: string
    recommendedSkills?: string
  } | null
}

interface StudentTeam {
  id: string
  rank: string
  name: string
  type: string
  university: string
  score: number
  skills: { name: string; match: number }[]
  lead: string
}

interface FacultyMentor {
  id: string
  rank: string
  name: string
  designation: string
  university: string
  score: number
  specialization: string[]
}

interface IndustryPartner {
  id: string
  rank: string
  name: string
  type: string
  city: string
  score: number
  supportScope: string
}

const DEFAULT_STUDENT_TEAMS: StudentTeam[] = [
  {
    id: 'team-1',
    rank: '01',
    name: 'AquaTech Innovators',
    type: 'Student Team',
    university: 'IIT Bombay',
    score: 96,
    skills: [
      { name: 'IoT Sensors', match: 96 },
      { name: 'Water Chemistry', match: 94 },
      { name: 'LoRaWAN Edge', match: 91 },
    ],
    lead: 'Aarav Sharma (EE & EnvEng)',
  },
  {
    id: 'team-2',
    rank: '02',
    name: 'HydroGuard Solutions',
    type: 'Student Team',
    university: 'NIT Trichy',
    score: 91,
    skills: [
      { name: 'Civil Engineering', match: 92 },
      { name: 'GIS Mapping', match: 90 },
      { name: 'Edge AI', match: 89 },
    ],
    lead: 'Meera Venkat (Water Resources)',
  },
  {
    id: 'team-3',
    rank: '03',
    name: 'EcoHydra Labs',
    type: 'Student Team',
    university: 'BITS Pilani',
    score: 87,
    skills: [
      { name: 'Filtration Hardware', match: 88 },
      { name: 'Cloud Telemetry', match: 86 },
    ],
    lead: 'Kabir Sengupta (Biotech & CS)',
  },
]

const DEFAULT_FACULTY_MENTORS: FacultyMentor[] = [
  {
    id: 'fac-1',
    rank: '01',
    name: 'Prof. Anita Desai',
    designation: 'Chair of Environmental Engineering',
    university: 'IIT Bombay',
    score: 94,
    specialization: ['Groundwater Chemistry', 'Field Fluoride Filtration', 'Rural Sensor Networks'],
  },
  {
    id: 'fac-2',
    rank: '02',
    name: 'Dr. Ramesh Sundaram',
    designation: 'Associate Professor, Civil & Water Systems',
    university: 'NIT Trichy',
    score: 88,
    specialization: ['GIS Hydrological Modeling', 'Municipal Pipeline Diagnostics'],
  },
]

const DEFAULT_INDUSTRY_PARTNERS: IndustryPartner[] = [
  {
    id: 'ind-1',
    rank: '01',
    name: 'Wipro EcoEnergy Sustainability Foundation',
    type: 'Industry Research',
    city: 'Bengaluru, Karnataka',
    score: 96,
    supportScope: 'IoT Testing Sandbox & 50 Sensor Hardware Nodes',
  },
  {
    id: 'ind-2',
    rank: '02',
    name: 'Jal Jeevan Mission Technical Directorate',
    type: 'Govt Technical NGO',
    city: 'New Delhi',
    score: 93,
    supportScope: 'Municipal Field Handover & Gram Panchayat Integration',
  },
  {
    id: 'ind-3',
    rank: '03',
    name: 'TCS Civic Innovation Lab',
    type: 'Industry Research',
    city: 'Mumbai, Maharashtra',
    score: 89,
    supportScope: 'Edge Microcontrollers & Lab Sandbox Facilities',
  },
]

export default function AiMatchCenterPage() {
  const [problems, setProblems] = useState<ProblemItem[]>([])
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  const [invitedTeams, setInvitedTeams] = useState<Record<string, boolean>>({})
  const [requestedMentors, setRequestedMentors] = useState<Record<string, boolean>>({})
  const [sentSandboxes, setSentSandboxes] = useState<Record<string, boolean>>({})

  useEffect(() => {
    async function loadProblems() {
      try {
        setLoading(true)
        const res = await fetch('/api/problems')
        const json = await res.json()
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setProblems(json.data)
          setSelectedProblemId(json.data[0].id)
        }
      } catch (err) {
        console.error('Failed to load problems:', err)
      } finally {
        setLoading(false)
      }
    }
    loadProblems()
  }, [])

  const selectedProblem = useMemo(() => {
    return problems.find((p) => p.id === selectedProblemId) || problems[0] || null
  }, [problems, selectedProblemId])

  const filteredProblems = useMemo(() => {
    if (!searchQuery.trim()) return problems
    const q = searchQuery.toLowerCase()
    return problems.filter((p) =>
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.location?.district?.toLowerCase().includes(q)
    )
  }, [problems, searchQuery])

  const handleInviteTeam = (team: StudentTeam) => {
    setInvitedTeams((prev) => ({ ...prev, [team.id]: true }))
    toast.success(`Formal challenge invitation dispatched to team "${team.name}"!`)
  }

  const handleRequestMentorship = (faculty: FacultyMentor) => {
    setRequestedMentors((prev) => ({ ...prev, [faculty.id]: true }))
    toast.success(`Mentorship proposal forwarded to ${faculty.name} (${faculty.university})!`)
  }

  const handleRequestSupport = (partner: IndustryPartner) => {
    setSentSandboxes((prev) => ({ ...prev, [partner.id]: true }))
    toast.success(`Support & sandbox request forwarded to ${partner.name}!`)
  }

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto space-y-8 pb-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold text-blue-400 uppercase tracking-wider">
                CIVIC INTELLIGENCE
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-[11px] font-mono text-slate-400">AUTONOMOUS SOLVER ROUTING</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
              AI Solver Matching Engine
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              Ranked cross-correlation of verified societal bottlenecks with NIRF-ranked university faculties, high-aptitude student teams, and testing sandboxes.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/problems"
              className="rounded border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors"
            >
              Explore Challenges
            </Link>
          </div>
        </div>

        {/* Two-Column Grid: Selector on Left, Ranked Solver Rows on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Challenges List (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                Select Active Challenge
              </h2>
              <span className="text-[11px] text-slate-500 font-mono">{problems.length} total</span>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search challenges..."
                className="w-full rounded border border-slate-800 bg-[#0f131a] pl-8 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-slate-700"
              />
            </div>

            <div className="divide-y divide-slate-800/80 border-y border-slate-800/80 max-h-[600px] overflow-y-auto scrollbar-thin">
              {loading ? (
                <div className="p-8 text-center text-xs text-slate-500">Loading challenges...</div>
              ) : (
                filteredProblems.map((p) => {
                  const isSelected = p.id === selectedProblem?.id
                  const matchPct = p.aiAnalysis?.confidence ? Math.round(p.aiAnalysis.confidence * 100) : 94

                  return (
                    <button
                      key={p.id}
                      onClick={() => setSelectedProblemId(p.id)}
                      className={cn(
                        'w-full text-left py-3.5 px-3 transition-colors space-y-1 block',
                        isSelected
                          ? 'bg-slate-800/90 border-l-2 border-blue-500 text-white'
                          : 'hover:bg-slate-900/60 text-slate-300'
                      )}
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-mono text-blue-400 font-bold uppercase">{p.category}</span>
                        <span className="font-mono text-emerald-400 font-semibold">{matchPct}% Match</span>
                      </div>
                      <div className="text-xs font-semibold text-white line-clamp-1">{p.title}</div>
                      <div className="text-[11px] text-slate-500">
                        {p.location?.district || 'India'} • {p.priority} PRIORITY
                      </div>
                    </button>
                  )
                })
              )}
            </div>
          </div>

          {/* Right Column: Ranked Solver Lists (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            {selectedProblem ? (
              <>
                {/* Active Case Summary Bar */}
                <div className="rounded border border-slate-800 bg-[#0f131a] p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] text-blue-400 font-bold uppercase">{selectedProblem.category}</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-slate-400">{selectedProblem.location?.district || 'National'}</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-rose-400 font-mono text-[11px] font-semibold uppercase">{selectedProblem.priority} PRIORITY</span>
                    </div>
                    <Link
                      href={`/problems/${selectedProblem.id}`}
                      className="text-xs text-blue-400 hover:underline inline-flex items-center gap-1 font-semibold"
                    >
                      <span>View Brief</span>
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>

                  <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                    {selectedProblem.title}
                  </h2>

                  <p className="text-xs text-slate-400 leading-relaxed max-w-3xl line-clamp-2">
                    {selectedProblem.description}
                  </p>
                </div>

                {/* 1. Recommended Student Teams (Ranked List as in Section #12) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-400" />
                      <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                        Recommended Student Teams
                      </h3>
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono">Ranked by Aptitude & Hackathon Track Record</span>
                  </div>

                  <div className="divide-y divide-slate-800/80 border-y border-slate-800/80">
                    {DEFAULT_STUDENT_TEAMS.map((team) => {
                      const isInvited = invitedTeams[team.id]

                      return (
                        <div key={team.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="space-y-1.5 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-slate-500">{team.rank}</span>
                              <h4 className="text-sm font-bold text-white">{team.name}</h4>
                              <span className="text-xs text-slate-400">({team.university})</span>
                              <span className="text-slate-600">•</span>
                              <span className="font-mono text-xs font-semibold text-emerald-400">{team.score}% match</span>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono">
                              {team.skills.map((s) => (
                                <span key={s.name} className="text-[11px]">
                                  {s.name} <span className="text-slate-300 font-semibold">{s.match}%</span>
                                </span>
                              ))}
                            </div>

                            <div className="text-[11px] text-slate-500">
                              Lead: {team.lead}
                            </div>
                          </div>

                          <div className="shrink-0 sm:self-center">
                            <button
                              onClick={() => handleInviteTeam(team)}
                              disabled={isInvited}
                              className={cn(
                                'rounded px-3 py-1.5 text-xs font-semibold transition-colors flex items-center gap-1.5',
                                isInvited
                                  ? 'bg-emerald-900/30 text-emerald-300 border border-emerald-500/40'
                                  : 'bg-blue-600 hover:bg-blue-500 text-white'
                              )}
                            >
                              {isInvited ? (
                                <>
                                  <Check className="h-3 w-3" />
                                  <span>Invited</span>
                                </>
                              ) : (
                                <span>Invite Team</span>
                              )}
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* 2. Accredited Faculty Mentors (Ranked List as in Section #12) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-purple-400" />
                      <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                        Accredited Faculty Mentors
                      </h3>
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono">Domain Specialists</span>
                  </div>

                  <div className="divide-y divide-slate-800/80 border-y border-slate-800/80">
                    {DEFAULT_FACULTY_MENTORS.map((fac) => {
                      const isRequested = requestedMentors[fac.id]

                      return (
                        <div key={fac.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-slate-500">{fac.rank}</span>
                              <h4 className="text-sm font-bold text-white">{fac.name}</h4>
                              <span className="text-xs text-slate-400">({fac.university})</span>
                              <span className="text-slate-600">•</span>
                              <span className="font-mono text-xs font-semibold text-emerald-400">{fac.score}% match</span>
                            </div>

                            <div className="text-xs text-slate-400">
                              {fac.designation}
                            </div>

                            <div className="text-[11px] text-slate-500">
                              Specialization: {fac.specialization.join(' · ')}
                            </div>
                          </div>

                          <div className="shrink-0 sm:self-center">
                            <button
                              onClick={() => handleRequestMentorship(fac)}
                              disabled={isRequested}
                              className={cn(
                                'rounded px-3 py-1.5 text-xs font-semibold transition-colors flex items-center gap-1.5',
                                isRequested
                                  ? 'bg-purple-900/30 text-purple-300 border border-purple-500/40'
                                  : 'rounded border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700'
                              )}
                            >
                              {isRequested ? (
                                <>
                                  <Check className="h-3 w-3" />
                                  <span>Requested</span>
                                </>
                              ) : (
                                <span>Request Mentorship</span>
                              )}
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* 3. Recommended Industry & NGO Partners (Ranked List as in Section #12) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-amber-400" />
                      <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                        Recommended Industry & NGO Partners
                      </h3>
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono">Equipment Sandbox & Pilot Support</span>
                  </div>

                  <div className="divide-y divide-slate-800/80 border-y border-slate-800/80">
                    {DEFAULT_INDUSTRY_PARTNERS.map((partner) => {
                      const isSent = sentSandboxes[partner.id]

                      return (
                        <div key={partner.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-slate-500">{partner.rank}</span>
                              <h4 className="text-sm font-bold text-white">{partner.name}</h4>
                              <span className="text-xs text-slate-400">({partner.city})</span>
                              <span className="text-slate-600">•</span>
                              <span className="font-mono text-xs font-semibold text-emerald-400">{partner.score}% match</span>
                            </div>

                            <div className="text-xs text-slate-400">
                              {partner.type}
                            </div>

                            <div className="text-[11px] text-amber-300/90 font-medium">
                              Support Scope: {partner.supportScope}
                            </div>
                          </div>

                          <div className="shrink-0 sm:self-center">
                            <button
                              onClick={() => handleRequestSupport(partner)}
                              disabled={isSent}
                              className={cn(
                                'rounded px-3 py-1.5 text-xs font-semibold transition-colors flex items-center gap-1.5',
                                isSent
                                  ? 'bg-amber-900/30 text-amber-300 border border-amber-500/40'
                                  : 'rounded border border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20'
                              )}
                            >
                              {isSent ? (
                                <>
                                  <Check className="h-3 w-3" />
                                  <span>Support Requested</span>
                                </>
                              ) : (
                                <span>Request Sandbox</span>
                              )}
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </>
            ) : (
              <div className="py-16 text-center space-y-2 border-y border-slate-800/80">
                <Compass className="h-8 w-8 text-slate-600 mx-auto" />
                <h3 className="text-sm font-semibold text-white">No Challenge Selected</h3>
                <p className="text-xs text-slate-400">Select an active challenge from the left panel.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
