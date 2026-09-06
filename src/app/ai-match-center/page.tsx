'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import {
  Cpu,
  Search,
  Sparkles,
  Users,
  GraduationCap,
  Building2,
  MapPin,
  CheckCircle2,
  Send,
  Eye,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Check,
  ExternalLink,
  Filter,
  RefreshCw,
  Award,
  Layers,
  ChevronRight,
} from 'lucide-react'
import AppShell from '@/components/layout/app-shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Modal } from '@/components/ui/modal'
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
  name: string
  university: string
  score: number
  size: number
  skills: string[]
  trackRecord: string
  lead: string
}

interface FacultyMentor {
  id: string
  name: string
  designation: string
  department: string
  university: string
  score: number
  specialization: string[]
  publications: number
}

interface IndustryPartner {
  id: string
  name: string
  type: string
  sector: string
  city: string
  score: number
  supportScope: string
  focusAreas: string[]
}

interface SkillAlignment {
  skill: string
  matchPct: number
  color: 'blue' | 'cyan' | 'emerald' | 'purple'
}

// Rich realistic mock pool of mentors, teams, and sponsors tailored to civic domains
const DEFAULT_STUDENT_TEAMS: Record<string, StudentTeam[]> = {
  WATER: [
    {
      id: 'team-1',
      name: 'AquaTech Innovators',
      university: 'IIT Bombay',
      score: 96,
      size: 4,
      skills: ['IoT Sensors', 'Water Chemistry', 'Embedded C', 'LoRaWAN'],
      trackRecord: '1st Place, National Jal Jeevan Hackathon 2024; 2 prototypes deployed in Nashik.',
      lead: 'Aarav Sharma (Final Year Dual Degree, EE & EnvEng)',
    },
    {
      id: 'team-2',
      name: 'HydroGuard Solutions',
      university: 'NIT Trichy',
      score: 91,
      size: 5,
      skills: ['Civil Engineering', 'GIS Mapping', 'Mobile App', 'Edge AI'],
      trackRecord: 'Finalists, SIH 2023; Patented solar-assisted filtration unit.',
      lead: 'Meera Venkat (M.Tech Water Resources)',
    },
    {
      id: 'team-3',
      name: 'EcoHydra Labs',
      university: 'BITS Pilani',
      score: 87,
      size: 4,
      skills: ['Electrochemical Adsorption', 'Data Analytics', 'Cloud Telemetry'],
      trackRecord: 'Published IEEE paper on rural arsenic sensors.',
      lead: 'Kabir Sengupta (Biotech & CS)',
    },
  ],
  DEFAULT: [
    {
      id: 'team-def-1',
      name: 'CivicForge Systems',
      university: 'IIT Delhi',
      score: 94,
      size: 4,
      skills: ['Computer Vision', 'IoT Edge', 'Urban Planning', 'Full-Stack'],
      trackRecord: 'Winners, Smart Cities Urban Challenge; 3 municipal deployments.',
      lead: 'Rohan Gupta (CSE & Public Systems)',
    },
    {
      id: 'team-def-2',
      name: 'Pratibha Innovators',
      university: 'IIIT Hyderabad',
      score: 90,
      size: 5,
      skills: ['ML Modeling', 'Embedded Hardware', 'Field Telemetry'],
      trackRecord: 'SIH 2023 Top 5 in Sustainable Mobility track.',
      lead: 'Ananya Reddy (AI Research Fellow)',
    },
    {
      id: 'team-def-3',
      name: 'GreenMatrix Core',
      university: 'NIT Surathkal',
      score: 86,
      size: 4,
      skills: ['Remote Sensing', 'Environmental Analytics', 'Mobile Dev'],
      trackRecord: 'Piloted agricultural monitoring system in Karnataka.',
      lead: 'Devika Nair (Electronics & Communication)',
    },
  ],
}

const DEFAULT_FACULTY_MENTORS: FacultyMentor[] = [
  {
    id: 'fac-1',
    name: 'Prof. S. R. Sitaraman',
    designation: 'Chair Professor, Environmental Engineering',
    department: 'Civil & Environmental Engineering',
    university: 'IIT Bombay',
    score: 95,
    specialization: ['Groundwater Remediation', 'Heavy Metal Adsorption', 'Civic Hydrology'],
    publications: 48,
  },
  {
    id: 'fac-2',
    name: 'Dr. Anamika Swaminathan',
    designation: 'Associate Professor, Embedded Systems & IoT',
    department: 'Computer Science & Engineering',
    university: 'IIT Delhi',
    score: 91,
    specialization: ['Low-Power Sensor Networks', 'Edge AI', 'Smart City Telemetry'],
    publications: 32,
  },
  {
    id: 'fac-3',
    name: 'Dr. G. Balachandran',
    designation: 'Head of Centre for Urban Informatics',
    department: 'Civil Engineering',
    university: 'NIT Trichy',
    score: 88,
    specialization: ['GIS Hydrological Modeling', 'Municipal Water Infrastructure'],
    publications: 27,
  },
]

const DEFAULT_INDUSTRY_PARTNERS: IndustryPartner[] = [
  {
    id: 'ind-1',
    name: 'Wipro EcoEnergy Sustainability Foundation',
    type: 'Industry Research',
    sector: 'CleanTech & Water',
    city: 'Bengaluru, Karnataka',
    score: 96,
    supportScope: 'IoT Testing Sandbox & Sensor Hardware Units',
    focusAreas: ['Decentralized Water Purification', 'IoT Telemetry', 'Rural Deployment'],
  },
  {
    id: 'ind-2',
    name: 'Jal Jeevan Mission NGO Directorate',
    type: 'Govt Technical NGO',
    sector: 'Public Sanitation',
    city: 'New Delhi',
    score: 93,
    supportScope: 'Municipal Field Handover & Gram Panchayat Integration',
    focusAreas: ['Groundwater Safety', 'Community Training', 'Panchayat Integration'],
  },
  {
    id: 'ind-3',
    name: 'Tata Consultancy Services — Civic Tech Lab',
    type: 'Industry Research',
    sector: 'Smart Urban Systems',
    city: 'Mumbai, Maharashtra',
    score: 89,
    supportScope: 'Edge Microcontrollers & Lab Sandbox Facilities',
    focusAreas: ['Edge Computing', 'Scalable Civic Dashboards', 'Citizen Engagement'],
  },
]

export default function AiMatchCenterPage() {
  const [problems, setProblems] = useState<ProblemItem[]>([])
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  // Interactive Invitation & Pitch state tracking
  const [invitedTeams, setInvitedTeams] = useState<Record<string, boolean>>({})
  const [requestedMentors, setRequestedMentors] = useState<Record<string, boolean>>({})
  const [sentPitches, setSentPitches] = useState<Record<string, boolean>>({})

  // Team Modal state
  const [viewingTeam, setViewingTeam] = useState<StudentTeam | null>(null)

  // Fetch problems on mount
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
        console.error('Failed to load problems for match center:', err)
      } finally {
        setLoading(false)
      }
    }
    loadProblems()
  }, [])

  // Currently selected problem
  const selectedProblem = useMemo(() => {
    return problems.find((p) => p.id === selectedProblemId) || problems[0] || null
  }, [problems, selectedProblemId])

  // Filtered problems list in left panel
  const filteredProblems = useMemo(() => {
    if (!searchQuery.trim()) return problems
    const q = searchQuery.toLowerCase().trim()
    return problems.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.location?.district?.toLowerCase() || '').includes(q)
    )
  }, [problems, searchQuery])

  // Dynamic Skill Alignment Breakdown based on selected domain
  const skillAlignments: SkillAlignment[] = useMemo(() => {
    const domain = selectedProblem?.category?.toUpperCase() || 'WATER'
    if (domain === 'WATER') {
      return [
        { skill: 'IoT Sensor Telemetry', matchPct: 98, color: 'blue' },
        { skill: 'Water Chemistry & Adsorption', matchPct: 92, color: 'cyan' },
        { skill: 'GIS Hydrological Mapping', matchPct: 85, color: 'emerald' },
        { skill: 'Low-Power LoRaWAN Mesh', matchPct: 80, color: 'purple' },
      ]
    } else if (domain === 'TRAFFIC') {
      return [
        { skill: 'Computer Vision & YOLO', matchPct: 97, color: 'cyan' },
        { skill: 'Edge TPU Compute', matchPct: 94, color: 'blue' },
        { skill: 'Traffic Signal Optimization', matchPct: 89, color: 'emerald' },
        { skill: 'Municipal Transport GIS', matchPct: 82, color: 'purple' },
      ]
    } else if (domain === 'AIR_QUALITY') {
      return [
        { skill: 'Particulate Matter IoT Sensors', matchPct: 96, color: 'cyan' },
        { skill: 'Atmospheric Modeling & ML', matchPct: 91, color: 'blue' },
        { skill: 'Urban Microclimate Mapping', matchPct: 86, color: 'emerald' },
        { skill: 'Public Health Telemetry', matchPct: 83, color: 'purple' },
      ]
    } else {
      return [
        { skill: 'IoT & Field Sensors', matchPct: 94, color: 'blue' },
        { skill: 'Data Analytics & ML', matchPct: 89, color: 'cyan' },
        { skill: 'Systems Engineering', matchPct: 85, color: 'emerald' },
        { skill: 'Civic Handover Operations', matchPct: 79, color: 'purple' },
      ]
    }
  }, [selectedProblem])

  // Dynamic Student Teams for selected domain
  const studentTeams = useMemo(() => {
    const domain = selectedProblem?.category?.toUpperCase() || 'DEFAULT'
    return DEFAULT_STUDENT_TEAMS[domain] || DEFAULT_STUDENT_TEAMS.DEFAULT
  }, [selectedProblem])

  // Overall compatibility score
  const overallScore = useMemo(() => {
    if (selectedProblem?.aiAnalysis?.confidence) {
      return Math.round(selectedProblem.aiAnalysis.confidence * 100)
    }
    return 94
  }, [selectedProblem])

  // Action handlers
  const handleInviteTeam = (team: StudentTeam) => {
    setInvitedTeams((prev) => ({ ...prev, [team.id]: true }))
    toast.success(`Formal challenge invitation dispatched to team "${team.name}"!`)
  }

  const handleRequestMentorship = (faculty: FacultyMentor) => {
    setRequestedMentors((prev) => ({ ...prev, [faculty.id]: true }))
    toast.success(`Mentorship proposal forwarded to ${faculty.name} (${faculty.university})!`)
  }

  const handleRequestSupport = (partner: IndustryPartner) => {
    setSentPitches((prev) => ({ ...prev, [partner.id]: true }))
    toast.success(`Support & sandbox request forwarded to ${partner.name}!`)
  }

  return (
    <AppShell>
      <div className="space-y-6 pb-16 max-w-7xl mx-auto">
        {/* Page Title & Status Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/20 flex items-center gap-1">
                <Cpu className="h-3 w-3" />
                AI Match Center
              </span>
              <span className="text-xs text-slate-400">Autonomous Ecosystem Harmonization</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Real-Time AI Solver Matching Engine
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Cross-correlate verified societal bottlenecks with NIRF-ranked university faculties, high-aptitude student teams, and CSR corporate grant sponsors.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button asChild variant="outline" size="md">
              <Link href="/problems">Explore Challenges</Link>
            </Button>
            <Button
              asChild
              size="md"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-purple-500/20"
            >
              <Link href="/problems/new">Post New Problem</Link>
            </Button>
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Societal Challenges Selector List (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="glass-card rounded-2xl border border-white/10 bg-slate-900/80 p-4 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Select Active Challenge
                </span>
                <span className="text-xs text-cyan-400 font-medium">
                  {filteredProblems.length} available
                </span>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter challenges..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950/70 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              {/* Problems Scrollable List */}
              <div className="space-y-2.5 max-h-[680px] overflow-y-auto pr-1 scrollbar-thin">
                {loading && (
                  <div className="space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="p-3.5 rounded-xl bg-slate-950/40 border border-white/5 animate-pulse space-y-2"
                      >
                        <div className="h-4 w-3/4 bg-slate-800 rounded" />
                        <div className="h-3 w-1/2 bg-slate-800/60 rounded" />
                      </div>
                    ))}
                  </div>
                )}

                {!loading && filteredProblems.length === 0 && (
                  <p className="text-xs text-slate-500 text-center py-6">
                    No challenges match your search.
                  </p>
                )}

                {!loading &&
                  filteredProblems.map((p) => {
                    const isSelected = p.id === selectedProblem?.id
                    const matchScore = p.aiAnalysis?.confidence
                      ? Math.round(p.aiAnalysis.confidence * 100)
                      : 94
                    const loc = [p.location?.district, p.location?.state].filter(Boolean).join(', ')

                    return (
                      <div
                        key={p.id}
                        onClick={() => setSelectedProblemId(p.id)}
                        className={cn(
                          'p-3.5 rounded-xl border transition-all cursor-pointer text-left relative overflow-hidden group',
                          isSelected
                            ? 'bg-purple-600/15 border-purple-500/50 shadow-lg shadow-purple-500/10 ring-1 ring-purple-500/30'
                            : 'bg-slate-950/50 border-white/5 hover:border-white/20 hover:bg-slate-950/80'
                        )}
                      >
                        {/* Active indicator border */}
                        {isSelected && (
                          <div className="absolute top-0 left-0 bottom-0 w-1 bg-purple-500" />
                        )}

                        <div className="flex items-center justify-between gap-1 mb-1.5">
                          <Badge category={p.category} size="sm" />
                          <div className="flex items-center gap-1 text-[11px] font-bold text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20">
                            <Sparkles className="h-2.5 w-2.5" />
                            <span>{matchScore}%</span>
                          </div>
                        </div>

                        <h3 className="text-xs font-semibold text-white line-clamp-2 leading-snug group-hover:text-purple-200 transition-colors">
                          {p.title}
                        </h3>

                        <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                          <span className="truncate max-w-[120px]">{loc || 'India'}</span>
                          <span>
                            {p.affectedCount
                              ? `${p.affectedCount.toLocaleString('en-IN')} affected`
                              : 'Community scale'}
                          </span>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Real-Time AI Matching Engine Interface (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {selectedProblem ? (
              <>
                {/* Active Challenge Header Card */}
                <div className="glass-card rounded-2xl border border-white/10 bg-slate-900/80 p-6 shadow-xl space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Badge category={selectedProblem.category} size="sm" />
                      <Badge priority={selectedProblem.priority} dot size="sm" />
                      <Badge status={selectedProblem.status} dot size="sm" />
                    </div>

                    <Button asChild variant="ghost" size="sm" className="text-xs text-cyan-400 hover:text-cyan-300">
                      <Link href={`/problems/${selectedProblem.id}`}>
                        View Full Brief <ExternalLink className="h-3 w-3 ml-1" />
                      </Link>
                    </Button>
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-white tracking-tight leading-snug">
                      {selectedProblem.title}
                    </h2>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {selectedProblem.description}
                    </p>
                  </div>

                  {/* Compatibility Score & Dial Summary Bar */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
                    {/* Overall Score Dial */}
                    <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5 flex items-center gap-4">
                      <div className="relative h-14 w-14 shrink-0 flex items-center justify-center">
                        <svg className="h-14 w-14 -rotate-90" viewBox="0 0 36 36">
                          <path
                            className="text-slate-800"
                            strokeWidth="3.5"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path
                            className="text-cyan-400"
                            strokeDasharray={`${overallScore}, 100`}
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        </svg>
                        <span className="absolute text-sm font-extrabold text-white">
                          {overallScore}%
                        </span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">Overall Compatibility</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Multi-factor academic and domain alignment
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5">
                      <p className="text-xs font-medium text-slate-400">NIRF University Affinity</p>
                      <p className="text-2xl font-bold text-purple-400 mt-1">Tier-1 Ready</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">IITs & NITs with active lab facilities</p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5">
                      <p className="text-xs font-medium text-slate-400">CSR Grant Feasibility</p>
                      <p className="text-2xl font-bold text-emerald-400 mt-1">High (96%)</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Matches corporate environmental charter</p>
                    </div>
                  </div>
                </div>

                {/* Skill Alignment Breakdown Section */}
                <div className="glass-card rounded-2xl border border-white/10 bg-slate-900/80 p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Layers className="h-4 w-4 text-cyan-400" />
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                        Disciplinary Skill Alignment Breakdown
                      </h3>
                    </div>
                    <span className="text-xs text-slate-400">Weighted NLP matrix</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {skillAlignments.map((sa) => (
                      <div
                        key={sa.skill}
                        className="p-3.5 rounded-xl bg-slate-950/50 border border-white/5 space-y-2"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-200">{sa.skill}</span>
                          <span className="font-bold text-cyan-400">{sa.matchPct}%</span>
                        </div>
                        <Progress value={sa.matchPct} color={sa.color} size="sm" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ranked Student Teams */}
                <div className="glass-card rounded-2xl border border-white/10 bg-slate-900/80 p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-400" />
                      <h3 className="text-base font-bold text-white">
                        Ranked Student Innovator Teams
                      </h3>
                    </div>
                    <span className="text-xs text-slate-400">
                      Ranked by verified hackathon & lab records
                    </span>
                  </div>

                  <div className="space-y-3">
                    {studentTeams.map((team, idx) => {
                      const isInvited = invitedTeams[team.id]

                      return (
                        <div
                          key={team.id}
                          className="p-4 rounded-xl bg-slate-950/60 border border-white/5 hover:border-blue-500/25 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              <span className="h-5 w-5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold flex items-center justify-center">
                                #{idx + 1}
                              </span>
                              <h4 className="text-sm font-bold text-white">{team.name}</h4>
                              <span className="text-xs text-slate-400">({team.university})</span>
                              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                {team.score}% Match
                              </span>
                            </div>

                            <p className="text-xs text-slate-400">
                              <strong>Lead:</strong> {team.lead} • {team.size} Members
                            </p>

                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {team.skills.map((s) => (
                                <span
                                  key={s}
                                  className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700"
                                >
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => setViewingTeam(team)}
                              leftIcon={<Eye className="h-3.5 w-3.5" />}
                            >
                              View Team
                            </Button>

                            <Button
                              size="sm"
                              disabled={isInvited}
                              onClick={() => handleInviteTeam(team)}
                              className={cn(
                                isInvited
                                  ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
                                  : 'bg-blue-600 hover:bg-blue-500 text-white'
                              )}
                              leftIcon={
                                isInvited ? (
                                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                                ) : (
                                  <Send className="h-3.5 w-3.5" />
                                )
                              }
                            >
                              {isInvited ? 'Invited' : 'Invite to Solve'}
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Recommended Faculty Mentors */}
                <div className="glass-card rounded-2xl border border-white/10 bg-slate-900/80 p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-purple-400" />
                      <h3 className="text-base font-bold text-white">
                        Recommended Academic Faculty Mentors
                      </h3>
                    </div>
                    <span className="text-xs text-slate-400">
                      Subject matter experts & lab directors
                    </span>
                  </div>

                  <div className="space-y-3">
                    {DEFAULT_FACULTY_MENTORS.map((faculty) => {
                      const isRequested = requestedMentors[faculty.id]

                      return (
                        <div
                          key={faculty.id}
                          className="p-4 rounded-xl bg-slate-950/60 border border-white/5 hover:border-purple-500/25 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-white">{faculty.name}</h4>
                              <span className="text-xs text-slate-400">
                                • {faculty.university}
                              </span>
                              <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                                {faculty.score}% Affinity
                              </span>
                            </div>

                            <p className="text-xs text-slate-400">
                              {faculty.designation}, {faculty.department}
                            </p>

                            <p className="text-xs text-slate-300">
                              <strong>Specialization:</strong> {faculty.specialization.join(', ')} •{' '}
                              <span className="text-slate-400">
                                {faculty.publications} indexed papers
                              </span>
                            </p>
                          </div>

                          <div className="shrink-0 self-end sm:self-auto">
                            <Button
                              size="sm"
                              disabled={isRequested}
                              onClick={() => handleRequestMentorship(faculty)}
                              className={cn(
                                isRequested
                                  ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
                                  : 'bg-purple-600 hover:bg-purple-500 text-white'
                              )}
                              leftIcon={
                                isRequested ? (
                                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                                ) : (
                                  <Send className="h-3.5 w-3.5" />
                                )
                              }
                            >
                              {isRequested ? 'Requested' : 'Request Mentorship'}
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Recommended Industry & NGO Partners */}
                <div className="glass-card rounded-2xl border border-white/10 bg-slate-900/80 p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-amber-400" />
                      <h3 className="text-base font-bold text-white">
                        Recommended Industry & NGO Partners
                      </h3>
                    </div>
                    <span className="text-xs text-slate-400">
                      Mentorship, equipment sandboxes & municipal pilot support
                    </span>
                  </div>

                  <div className="space-y-3">
                    {DEFAULT_INDUSTRY_PARTNERS.map((partner) => {
                      const isSent = sentPitches[partner.id]

                      return (
                        <div
                          key={partner.id}
                          className="p-4 rounded-xl bg-slate-950/60 border border-white/5 hover:border-amber-500/25 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-white">{partner.name}</h4>
                              <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                                {partner.score}% Alignment Match
                              </span>
                            </div>

                            <p className="text-xs text-slate-400">
                              {partner.type} • {partner.sector} • {partner.city}
                            </p>

                            <p className="text-xs text-amber-300 font-semibold">
                              Support Scope: {partner.supportScope}
                            </p>
                          </div>

                          <div className="shrink-0 self-end sm:self-auto">
                            <Button
                              size="sm"
                              disabled={isSent}
                              onClick={() => handleRequestSupport(partner)}
                              className={cn(
                                isSent
                                  ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
                                  : 'bg-amber-600 hover:bg-amber-500 text-white'
                              )}
                              leftIcon={
                                isSent ? (
                                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                                ) : (
                                  <Send className="h-3.5 w-3.5" />
                                )
                              }
                            >
                              {isSent ? 'Support Requested' : 'Request Sandbox'}
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </>
            ) : (
              <div className="glass-card rounded-2xl border border-white/10 bg-slate-900/60 p-12 text-center space-y-3">
                <Cpu className="h-10 w-10 text-slate-500 mx-auto" />
                <h3 className="text-lg font-bold text-white">No Challenge Selected</h3>
                <p className="text-xs text-slate-400">
                  Select a challenge from the left explorer panel to initialize the real-time AI Matching Engine.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Team Details Modal */}
      <Modal
        isOpen={!!viewingTeam}
        onClose={() => setViewingTeam(null)}
        title={
          viewingTeam && (
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-400" />
              <span>{viewingTeam.name}</span>
            </div>
          )
        }
        description={viewingTeam ? `${viewingTeam.university} • ${viewingTeam.size} Members` : ''}
        footer={
          viewingTeam && (
            <>
              <Button variant="secondary" size="sm" onClick={() => setViewingTeam(null)}>
                Close
              </Button>
              <Button
                size="sm"
                disabled={invitedTeams[viewingTeam.id]}
                onClick={() => {
                  handleInviteTeam(viewingTeam)
                  setViewingTeam(null)
                }}
              >
                {invitedTeams[viewingTeam.id] ? 'Already Invited' : 'Invite Team to Solve'}
              </Button>
            </>
          )
        }
      >
        {viewingTeam && (
          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5 space-y-1">
              <span className="text-slate-400 font-semibold block uppercase tracking-wider text-[10px]">
                Team Leader
              </span>
              <p className="text-white font-medium text-sm">{viewingTeam.lead}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5 space-y-1">
              <span className="text-slate-400 font-semibold block uppercase tracking-wider text-[10px]">
                Civic & Hackathon Track Record
              </span>
              <p className="text-slate-300 leading-relaxed">{viewingTeam.trackRecord}</p>
            </div>

            <div className="space-y-1.5">
              <span className="text-slate-400 font-semibold block uppercase tracking-wider text-[10px]">
                Verified Technical Proficiencies
              </span>
              <div className="flex flex-wrap gap-1.5">
                {viewingTeam.skills.map((sk) => (
                  <span
                    key={sk}
                    className="bg-blue-500/15 border border-blue-500/30 text-blue-300 px-2.5 py-1 rounded-lg font-medium"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </AppShell>
  )
}
