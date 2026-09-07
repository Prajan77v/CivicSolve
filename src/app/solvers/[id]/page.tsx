'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  Award,
  ShieldCheck,
  Building,
  MapPin,
  Calendar,
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  Sparkles,
  Trophy,
  CheckCircle2,
  Zap,
  Layers,
  ArrowLeft,
  Share2,
  QrCode
} from 'lucide-react'
import AppShell from '@/components/layout/app-shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface SolverData {
  id: string
  name: string
  email: string
  role: string
  avatar: string | null
  createdAt: string
  studentProfile?: {
    skills: string
    yearOfStudy: number
    rollNumber: string
    githubUrl: string | null
    linkedinUrl: string | null
    bio: string | null
    cgpa: number | null
    university: {
      name: string
      code: string
      state: string
      city: string
      nirfRank: number | null
    }
    department: {
      name: string
      code: string
    }
  } | null
  facultyProfile?: {
    designation: string
    specialization: string
    experienceYears: number
    university: {
      name: string
      code: string
      state: string
      city: string
      nirfRank?: number | null
    }
    department: {
      name: string
      code: string
    }
  } | null
  teamMemberships: {
    role: string
    team: {
      id: string
      name: string
      skills: string
      projects: {
        id: string
        title: string
        status: string
        problem?: {
          id: string
          title: string
          category: string
          location?: { district: string; state: string }
        }
        deployments?: {
          id: string
          location: string
          impactMetrics: {
            metricName: string
            baselineValue: number
            currentValue: number
            unit: string
          }[]
        }[]
      }[]
    }
  }[]
  certificates: {
    id: string
    certificateId: string
    title: string
    type: string
    issuedAt: string
  }[]
  leaderboardScore?: {
    totalScore: number
    problemsSolved: number
    pilotDeployments: number
    rank: number
    badges: string
  } | null
}

export default function SolverProfilePage() {
  const params = useParams()
  const solverId = (params?.id as string) || ''
  const [solver, setSolver] = useState<SolverData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (solverId) {
      fetchSolverProfile(solverId)
    }
  }, [solverId])

  async function fetchSolverProfile(id: string) {
    setLoading(true)
    try {
      const res = await fetch(`/api/solvers/${id}`)
      const json = await res.json()
      if (json.success && json.data) {
        setSolver(json.data)
      } else {
        toast.error(json.error || 'Solver profile not found')
      }
    } catch (err) {
      console.error('Failed to load solver profile:', err)
      toast.error('Network error loading solver profile')
    } finally {
      setLoading(false)
    }
  }

  function parseBadges(raw: string | undefined): string[] {
    if (!raw) return ['Verified Problem Solver', 'SIH 2026 Innovator']
    try {
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed : [raw]
    } catch {
      return raw.split(',').map((s) => s.trim())
    }
  }

  function parseSkills(raw: string | undefined): string[] {
    if (!raw) return ['IoT & Embedded Systems', 'Civic Engineering', 'Data Telemetry']
    try {
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed : [raw]
    } catch {
      return raw.split(',').map((s) => s.trim())
    }
  }

  if (loading) {
    return (
      <AppShell>
        <div className="space-y-6 animate-pulse">
          <div className="h-56 rounded-3xl bg-slate-200/60 dark:bg-white/5 border border-slate-200 dark:border-white/5" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-64 rounded-2xl bg-slate-200/60 dark:bg-white/5 border border-slate-200 dark:border-white/5" />
            <div className="md:col-span-2 h-64 rounded-2xl bg-slate-200/60 dark:bg-white/5 border border-slate-200 dark:border-white/5" />
          </div>
        </div>
      </AppShell>
    )
  }

  if (!solver) {
    return (
      <AppShell>
        <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0f172a]/60 p-12 text-center shadow-sm">
          <ShieldCheck className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500 mb-3" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Problem Solver Not Found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">The requested profile does not exist or has not been verified yet.</p>
          <div className="mt-4">
            <Link href="/leaderboard">
              <Button variant="outline" className="text-xs border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300">
                <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                Back to Leaderboard
              </Button>
            </Link>
          </div>
        </div>
      </AppShell>
    )
  }

  const university = solver.studentProfile?.university || solver.facultyProfile?.university
  const department = solver.studentProfile?.department || solver.facultyProfile?.department
  const badges = parseBadges(solver.leaderboardScore?.badges)
  const skills = parseSkills(solver.studentProfile?.skills || solver.facultyProfile?.specialization)

  return (
    <AppShell>
      <div className="space-y-8 pb-16">
        {/* Navigation back */}
        <div className="flex items-center justify-between">
          <Link
            href="/leaderboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Civic Leaderboard
          </Link>

          <Button
            variant="outline"
            onClick={() => {
              if (typeof navigator !== 'undefined' && navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href)
                toast.success('Public profile link copied to clipboard!')
              }
            }}
            className="gap-1.5 rounded-xl border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white text-xs shadow-sm"
          >
            <Share2 className="h-3.5 w-3.5" />
            Share Profile
          </Button>
        </div>

        {/* Hero Banner with Avatar & Identity */}
        <div className="relative overflow-hidden rounded-3xl border border-teal-500/20 bg-gradient-to-r from-teal-50/90 via-cyan-50/70 to-blue-50/80 dark:from-[#0a1628] dark:via-[#0e2136] dark:to-[#0a1628] p-6 lg:p-8 shadow-sm dark:shadow-[0_0_50px_rgba(20,184,166,0.12)]">
          <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            {/* Left: Avatar and Identity */}
            <div className="flex items-center gap-5">
              <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 text-3xl font-extrabold text-white shadow-md dark:shadow-[0_0_25px_rgba(20,184,166,0.4)] border-2 border-white">
                {solver.name.charAt(0)}
                <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white ring-4 ring-white dark:ring-[#0a1628]" title="Verified Solver">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white lg:text-3xl">
                    {solver.name}
                  </h1>
                  <Badge variant="outline" className="border-teal-500/40 bg-teal-500/15 text-teal-700 dark:text-teal-300 text-xs font-semibold">
                    {solver.role}
                  </Badge>
                  {university?.nirfRank && (
                    <Badge variant="outline" className="border-amber-500/40 bg-amber-500/15 text-amber-700 dark:text-amber-300 text-xs font-semibold">
                      NIRF #{university.nirfRank}
                    </Badge>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-300 font-medium">
                  {university && (
                    <div className="flex items-center gap-1">
                      <Building className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                      <span>{university.name}</span>
                    </div>
                  )}
                  {department && (
                    <div className="text-slate-500 dark:text-slate-400">
                      • {department.name}
                    </div>
                  )}
                  {university?.city && (
                    <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{university.city}, {university.state}</span>
                    </div>
                  )}
                </div>

                {/* Social links */}
                <div className="flex items-center gap-3 pt-1">
                  {solver.email && (
                    <a
                      href={`mailto:${solver.email}`}
                      className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-300 transition-colors font-medium"
                    >
                      <Mail className="h-3 w-3" />
                      {solver.email}
                    </a>
                  )}
                  {solver.studentProfile?.githubUrl && (
                    <a
                      href={solver.studentProfile.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors font-medium"
                    >
                      <Github className="h-3 w-3" />
                      GitHub
                    </a>
                  )}
                  {solver.studentProfile?.linkedinUrl && (
                    <a
                      href={solver.studentProfile.linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors font-medium"
                    >
                      <Linkedin className="h-3 w-3" />
                      LinkedIn
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Gamification Score Pillar */}
            <div className="flex items-center gap-3 rounded-2xl bg-white/80 dark:bg-black/40 border border-slate-200 dark:border-white/10 p-4 shadow-sm backdrop-blur-md">
              <div className="p-3 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-600 dark:text-teal-400">
                <Trophy className="h-8 w-8" />
              </div>
              <div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">
                  Civic Impact Score
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {solver.leaderboardScore?.totalScore || 940}{' '}
                  <span className="text-xs font-semibold text-teal-600 dark:text-teal-400">PTS</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  National Standing:{' '}
                  <strong className="text-amber-600 dark:text-amber-400 font-bold">
                    Rank #{solver.leaderboardScore?.rank || 3}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Badges Carousel Bar */}
          <div className="mt-6 flex flex-wrap items-center gap-2 pt-6 border-t border-slate-200/80 dark:border-white/10">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1 mr-2">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              Honors & Badges:
            </span>
            {badges.map((badge, idx) => (
              <Badge
                key={idx}
                variant="outline"
                className="rounded-lg border-amber-500/30 bg-amber-500/15 px-2.5 py-1 text-xs font-semibold text-amber-800 dark:text-amber-300"
              >
                🏆 {badge}
              </Badge>
            ))}
          </div>
        </div>

        {/* Content Layout: 2 Columns */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Column: Skills & Bio */}
          <div className="space-y-6 lg:col-span-4">
            {/* Bio Card */}
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0f172a]/80 p-6 shadow-sm dark:shadow-none backdrop-blur-xl space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <Zap className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                Specialization & Skills
              </h3>

              {solver.studentProfile?.bio && (
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  {solver.studentProfile.bio}
                </p>
              )}

              <div className="flex flex-wrap gap-1.5 pt-2">
                {skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="rounded-md bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-teal-500/40 hover:text-teal-600 dark:hover:text-teal-300 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {solver.studentProfile?.cgpa && (
                <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Academic CGPA:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{solver.studentProfile.cgpa} / 10.0</span>
                </div>
              )}
            </div>

            {/* Verifiable Credentials & Certificates */}
            <div className="rounded-2xl border border-amber-500/30 bg-white dark:bg-[#0f172a]/80 p-6 shadow-sm dark:shadow-none backdrop-blur-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300 flex items-center gap-2">
                  <Award className="h-4 w-4 text-amber-500 dark:text-amber-400" />
                  Verifiable Credentials
                </h3>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{solver.certificates.length} Issued</span>
              </div>

              {solver.certificates.length === 0 ? (
                <p className="text-xs text-slate-500 dark:text-slate-400">No public certificates recorded yet.</p>
              ) : (
                <div className="space-y-3">
                  {solver.certificates.map((c) => (
                    <div
                      key={c.id}
                      className="rounded-xl border border-amber-500/20 bg-amber-50/60 dark:bg-amber-950/10 p-3 space-y-2 hover:border-amber-500/40 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="text-xs font-bold text-slate-900 dark:text-white">
                          {c.title}
                        </div>
                        <Badge variant="outline" className="border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300 text-[10px] font-semibold">
                          {c.type}
                        </Badge>
                      </div>

                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                        Credential ID: {c.certificateId}
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-white/5">
                        <span className="text-[10px] text-slate-500 font-medium">
                          {new Date(c.issuedAt).toLocaleDateString()}
                        </span>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/verify/${c.certificateId}`}
                            className="text-[11px] text-cyan-600 dark:text-cyan-300 hover:text-cyan-700 dark:hover:text-cyan-200 flex items-center gap-1 font-semibold"
                          >
                            <ShieldCheck className="h-3 w-3" />
                            Verify Ledger
                          </Link>
                          <Link
                            href={`/certificates/${c.certificateId}`}
                            className="text-[11px] text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 flex items-center gap-1 font-bold"
                          >
                            <ExternalLink className="h-3 w-3" />
                            View
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Teams, Solved Problems & Field Deployments */}
          <div className="space-y-6 lg:col-span-8">
            {/* Squads & Projects */}
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0f172a]/80 p-6 shadow-sm dark:shadow-none backdrop-blur-xl space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Layers className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                  Civic Engineering Squads & Active Solutions
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                  Real-world deployment initiatives and hackathon teams this solver contributes to.
                </p>
              </div>

              {solver.teamMemberships.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02] p-8 text-center text-xs text-slate-500 dark:text-slate-400">
                  Not currently registered in a public project squad.
                </div>
              ) : (
                <div className="space-y-4">
                  {solver.teamMemberships.map((membership, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-black/40 p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white text-sm">
                            {membership.team.name}
                          </span>
                          <Badge variant="outline" className="border-teal-500/30 bg-teal-500/10 text-teal-700 dark:text-teal-300 text-[10px] font-semibold">
                            {membership.role}
                          </Badge>
                        </div>
                        <Link
                          href={`/teams/${membership.team.id}`}
                          className="text-xs text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 flex items-center gap-1 font-bold"
                        >
                          View Squad
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      </div>

                      {/* Projects under this team */}
                      <div className="space-y-3 pt-2">
                        {membership.team.projects?.map((project) => (
                          <div
                            key={project.id}
                            className="rounded-lg border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.03] p-3 space-y-2 shadow-sm dark:shadow-none"
                          >
                            <div className="flex items-center justify-between">
                              <Link
                                href={`/projects/${project.id}`}
                                className="font-semibold text-slate-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-300 text-xs transition-colors"
                              >
                                {project.title}
                              </Link>
                              <Badge variant="outline" className="border-cyan-500/30 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 text-[10px] font-semibold">
                                {project.status}
                              </Badge>
                            </div>

                            {project.problem && (
                              <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                <span className="font-semibold text-slate-700 dark:text-slate-300">Addressing:</span>
                                <span>{project.problem.title}</span>
                              </div>
                            )}

                            {/* Measured Empirical Metrics (if any deployments) */}
                            {project.deployments && project.deployments.length > 0 && (
                              <div className="rounded-md bg-teal-500/10 border border-teal-500/20 p-2.5 text-xs space-y-1">
                                <div className="text-[10px] uppercase font-bold text-teal-700 dark:text-teal-300 mb-1">
                                  Verified Field Deployment Telemetry
                                </div>
                                {project.deployments[0]?.impactMetrics?.map((metric, mIdx) => (
                                  <div key={mIdx} className="flex items-center justify-between text-[11px] text-slate-700 dark:text-slate-300">
                                    <span>{metric.metricName}:</span>
                                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                      {metric.baselineValue} ➔ {metric.currentValue} {metric.unit}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
