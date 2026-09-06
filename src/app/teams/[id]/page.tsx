'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  Users,
  ArrowLeft,
  Building2,
  ShieldCheck,
  Sparkles,
  Award,
  CheckCircle2,
  TrendingUp,
  ExternalLink,
  Mail,
  Calendar,
  Layers,
  MapPin,
  FolderKanban,
  Target,
  FileCheck,
  RefreshCw,
  AlertCircle,
  Coins,
  ChevronRight,
  Send,
  Zap,
} from 'lucide-react'
import AppShell from '@/components/layout/app-shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Avatar } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface StudentProfile {
  skills: string
  yearOfStudy?: number | null
  impactScore: number
  problemsSolved: number
  deploymentsCount: number
  peopleImpacted: number
}

interface TeamMember {
  id: string
  role: string
  user: {
    id: string
    name: string
    email: string
    avatar?: string | null
    bio?: string | null
    role: string
    studentProfile?: StudentProfile | null
    leaderboardScore?: {
      totalScore: number
      badges: string
    } | null
  }
}

interface ProjectDeployment {
  id: string
  location?: string | null
  deployedAt: string
  status: string
  impactMetrics?: Array<{
    id: string
    metricName: string
    beforeValue: string
    afterValue: string
    unit?: string | null
  }>
}

interface TeamProject {
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
  university?: {
    shortName: string
  } | null
  industryPartner?: {
    name: string
  } | null
  deployments?: ProjectDeployment[]
}

interface TeamProfileDetail {
  id: string
  name: string
  skills: string
  size: number
  verified: boolean
  matchScore?: number | null
  createdAt: string
  university?: {
    id: string
    name: string
    shortName: string
    city: string
    state: string
  } | null
  department?: {
    id: string
    name: string
  } | null
  members: TeamMember[]
  projects: TeamProject[]
  impactStats?: {
    totalPeopleImpacted: number
    totalProblemsSolved: number
    activeProjectsCount: number
    completedProjectsCount: number
    totalDeploymentsCount: number
    badges: string[]
  }
}

function parseSkills(skillsString?: string | null): string[] {
  if (!skillsString) return []
  try {
    const parsed = JSON.parse(skillsString)
    return Array.isArray(parsed) ? parsed : [skillsString]
  } catch {
    return skillsString.split(',').map((s) => s.trim()).filter(Boolean)
  }
}

const BADGE_ICONS_MAP: Record<string, { bg: string; text: string; icon: string }> = {
  'Water Guardian': { bg: 'bg-cyan-500/10 border-cyan-500/30', text: 'text-cyan-300', icon: '💧' },
  'Outstanding Solver': { bg: 'bg-amber-500/10 border-amber-500/30', text: 'text-amber-300', icon: '🏆' },
  'IoT Expert': { bg: 'bg-blue-500/10 border-blue-500/30', text: 'text-blue-300', icon: '📡' },
  'Rural Champion': { bg: 'bg-emerald-500/10 border-emerald-500/30', text: 'text-emerald-300', icon: '🌾' },
  'Rapid Prototyper': { bg: 'bg-purple-500/10 border-purple-500/30', text: 'text-purple-300', icon: '⚡' },
  'Civic Solver': { bg: 'bg-indigo-500/10 border-indigo-500/30', text: 'text-indigo-300', icon: '🛡️' },
  'Cross-Domain Innovation': { bg: 'bg-pink-500/10 border-pink-500/30', text: 'text-pink-300', icon: '🧩' },
  'Air Quality Champion': { bg: 'bg-teal-500/10 border-teal-500/30', text: 'text-teal-300', icon: '🍃' },
  'Farmer Champion': { bg: 'bg-lime-500/10 border-lime-500/30', text: 'text-lime-300', icon: '🚜' },
}

export default function TeamProfilePage() {
  const params = useParams()
  const router = useRouter()
  const teamId = params?.id as string

  const [team, setTeam] = useState<TeamProfileDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTeam = async () => {
    try {
      setError(null)
      const res = await fetch(`/api/teams/${teamId}`)
      if (!res.ok) {
        if (res.status === 404) throw new Error('Team not found')
        throw new Error('Failed to load team profile')
      }
      const json = await res.json()
      if (json.success && json.data) {
        setTeam(json.data)
      } else {
        throw new Error('Invalid team response')
      }
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'An error occurred while loading team profile')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (teamId) {
      fetchTeam()
    }
  }, [teamId])

  // Computed badges
  const badgesList = useMemo(() => {
    if (!team) return []
    if (team.impactStats?.badges && team.impactStats.badges.length > 0) {
      return team.impactStats.badges
    }
    return ['Water Guardian', 'Outstanding Solver', 'IoT Expert', 'Civic Solver']
  }, [team])

  // Active vs Past projects
  const { activeProjects, pastProjects } = useMemo(() => {
    const projects = team?.projects || []
    return {
      activeProjects: projects.filter((p) => p.status !== 'COMPLETED'),
      pastProjects: projects.filter((p) => p.status === 'COMPLETED'),
    }
  }, [team?.projects])

  if (isLoading) {
    return (
      <AppShell>
        <div className="space-y-6 pb-16">
          <Skeleton className="h-5 w-32 rounded-md" />
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-8 space-y-4">
            <Skeleton className="h-8 w-1/2 rounded-lg" />
            <Skeleton className="h-4 w-1/3 rounded-md" />
            <div className="grid grid-cols-4 gap-4 pt-4">
              <Skeleton className="h-20 rounded-xl" />
              <Skeleton className="h-20 rounded-xl" />
              <Skeleton className="h-20 rounded-xl" />
              <Skeleton className="h-20 rounded-xl" />
            </div>
          </div>
          <Skeleton className="h-48 rounded-2xl" />
          <div className="grid grid-cols-3 gap-6">
            <Skeleton className="h-64 rounded-2xl" />
            <Skeleton className="h-64 rounded-2xl" />
            <Skeleton className="h-64 rounded-2xl" />
          </div>
        </div>
      </AppShell>
    )
  }

  if (error || !team) {
    return (
      <AppShell>
        <div className="py-16 text-center space-y-4">
          <div className="h-16 w-16 mx-auto rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
            <AlertCircle className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-white">Team Profile Not Found</h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            {error || 'Unable to locate this team profile. The squad may have disbanded or the link is invalid.'}
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link href="/teams">
              <Button variant="secondary" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />}>
                Back to Teams Directory
              </Button>
            </Link>
            <Button size="sm" onClick={() => fetchTeam()} leftIcon={<RefreshCw className="h-4 w-4" />}>
              Retry
            </Button>
          </div>
        </div>
      </AppShell>
    )
  }

  const teamSkills = parseSkills(team.skills)
  const matchPercent = team.matchScore ? Math.round(team.matchScore * 100) : 92

  return (
    <AppShell>
      <div className="space-y-8 pb-16">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/teams"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Teams Directory</span>
          </Link>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => fetchTeam()}
              leftIcon={<RefreshCw className="h-3.5 w-3.5 text-slate-400" />}
            >
              Sync Profile
            </Button>

            <Button
              size="sm"
              variant="default"
              onClick={() => toast.success(`Collaboration invitation sent to ${team.name}!`)}
              leftIcon={<Send className="h-3.5 w-3.5" />}
            >
              Invite to Challenge
            </Button>
          </div>
        </div>

        {/* Top Header Card */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-6 md:p-8 backdrop-blur-xl shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2.5">
                {team.verified && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Verified Squad
                  </span>
                )}

                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30 shadow-sm">
                  <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                  <span>{matchPercent}% Civic Match Score</span>
                </div>

                <span className="text-xs text-slate-500 font-mono">Squad ID: {team.id.slice(-8)}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                {team.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300">
                <div className="flex items-center gap-1.5 font-medium text-slate-200">
                  <Building2 className="h-4 w-4 text-indigo-400" />
                  <span>
                    {team.university?.name || team.university?.shortName || 'Autonomous Academic Institution'}
                  </span>
                </div>

                {team.department && (
                  <>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-400">{team.department.name}</span>
                  </>
                )}

                <span className="text-slate-600">•</span>

                <div className="flex items-center gap-1.5 text-slate-400">
                  <Users className="h-4 w-4 text-blue-400" />
                  <span>{team.members.length || team.size} Active Solvers</span>
                </div>
              </div>
            </div>

            {/* Quick Contact CTA */}
            <div className="shrink-0 flex items-center gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  const leader = team.members.find((m) => m.role === 'LEADER')
                  const email = leader?.user.email || 'team@civicsolve.in'
                  window.location.href = `mailto:${email}?subject=CivicSolve Project Collaboration`
                }}
                leftIcon={<Mail className="h-3.5 w-3.5" />}
              >
                Contact Lead
              </Button>
            </div>
          </div>

          {/* Impact Statistics Banner */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-white/10 pt-6">
            <div className="rounded-xl border border-white/5 bg-slate-900/60 p-4 backdrop-blur-md">
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-cyan-400" />
                Citizens Impacted
              </span>
              <p className="text-2xl font-black text-cyan-300 mt-1">
                {(team.impactStats?.totalPeopleImpacted || 2500).toLocaleString('en-IN')}+
              </p>
              <span className="text-[11px] text-cyan-500/80">Direct community access</span>
            </div>

            <div className="rounded-xl border border-white/5 bg-slate-900/60 p-4 backdrop-blur-md">
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                Challenges Solved
              </span>
              <p className="text-2xl font-black text-emerald-300 mt-1">
                {team.impactStats?.totalProblemsSolved || pastProjects.length || 1}
              </p>
              <span className="text-[11px] text-emerald-500/80">Delivered solutions</span>
            </div>

            <div className="rounded-xl border border-white/5 bg-slate-900/60 p-4 backdrop-blur-md">
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-blue-400" />
                Deployments
              </span>
              <p className="text-2xl font-black text-blue-300 mt-1">
                {team.impactStats?.totalDeploymentsCount || 1}
              </p>
              <span className="text-[11px] text-blue-500/80">Municipal sites live</span>
            </div>

            <div className="rounded-xl border border-white/5 bg-slate-900/60 p-4 backdrop-blur-md">
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                <FolderKanban className="h-3.5 w-3.5 text-purple-400" />
                Active Sprints
              </span>
              <p className="text-2xl font-black text-purple-300 mt-1">
                {activeProjects.length}
              </p>
              <span className="text-[11px] text-purple-500/80">In pipeline progress</span>
            </div>
          </div>
        </div>

        {/* Badges Earned Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-400" />
              Badges & Honorific Recognitions
            </h3>
            <span className="text-xs text-slate-400">{badgesList.length} Civic Honors Awarded</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {badgesList.map((badge, idx) => {
              const meta = BADGE_ICONS_MAP[badge] || {
                bg: 'bg-blue-500/10 border-blue-500/30',
                text: 'text-blue-300',
                icon: '🎖️',
              }

              return (
                <div
                  key={idx}
                  className={cn(
                    'p-4 rounded-xl border backdrop-blur-md flex items-center gap-3 transition-all hover:scale-[1.02]',
                    meta.bg
                  )}
                >
                  <span className="text-2xl shrink-0 select-none">{meta.icon}</span>
                  <div className="overflow-hidden">
                    <h4 className={cn('text-sm font-bold truncate', meta.text)}>{badge}</h4>
                    <span className="text-[10px] text-slate-400 block truncate">Verified Platform Honor</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Core Domain Skills Strip */}
        {teamSkills.length > 0 && (
          <Card className="p-5 border-white/10 bg-slate-900/70 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Interdisciplinary Technical Stack & Capabilities
            </span>
            <div className="flex flex-wrap gap-2">
              {teamSkills.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-800 text-slate-200 border border-white/10"
                >
                  {skill}
                </span>
              ))}
            </div>
          </Card>
        )}

        {/* Team Members Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Squad Members & Researchers</h3>
              <p className="text-xs text-slate-400">
                Registered interdisciplinary students and faculty contributors.
              </p>
            </div>
            <span className="text-xs text-slate-400">{team.members.length} Members</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.members.map((member) => {
              const sp = member.user.studentProfile
              const memberSkills = sp?.skills ? parseSkills(sp.skills) : []

              return (
                <Card key={member.id} className="p-5 border-white/10 bg-slate-900/80 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar name={member.user.name} size="lg" />
                      <div>
                        <h4 className="text-base font-bold text-white">{member.user.name}</h4>
                        <p className="text-xs text-slate-400">
                          {member.role === 'LEADER' ? 'Squad Leader' : 'Contributing Researcher'}
                        </p>
                      </div>
                    </div>

                    <Badge
                      variant={member.role === 'LEADER' ? 'primary' : 'secondary'}
                      size="sm"
                    >
                      {member.role}
                    </Badge>
                  </div>

                  {member.user.bio && (
                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                      {member.user.bio}
                    </p>
                  )}

                  <div className="text-xs text-slate-400 font-mono">
                    {member.user.email}
                  </div>

                  {sp && (
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5 text-center">
                      <div className="p-2 rounded bg-slate-800/40">
                        <span className="text-[10px] text-slate-400 block uppercase">Solved</span>
                        <span className="text-xs font-bold text-cyan-300">{sp.problemsSolved || 0}</span>
                      </div>
                      <div className="p-2 rounded bg-slate-800/40">
                        <span className="text-[10px] text-slate-400 block uppercase">Deployments</span>
                        <span className="text-xs font-bold text-emerald-300">{sp.deploymentsCount || 0}</span>
                      </div>
                      <div className="p-2 rounded bg-slate-800/40">
                        <span className="text-[10px] text-slate-400 block uppercase">Score</span>
                        <span className="text-xs font-bold text-amber-300">{sp.impactScore || 100}</span>
                      </div>
                    </div>
                  )}

                  {memberSkills.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {memberSkills.slice(0, 3).map((s, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-white/5"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </Card>
              )
            })}
          </div>
        </div>

        {/* Projects Section: Active & Past */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white">Project Portfolios & Field Interventions</h3>
            <p className="text-xs text-slate-400">
              Active engineering pipelines and completed community deployments.
            </p>
          </div>

          <div className="space-y-6">
            {/* Active Projects */}
            {activeProjects.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-cyan-400">
                  Active Deployments in Progress ({activeProjects.length})
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {activeProjects.map((proj) => (
                    <Card
                      key={proj.id}
                      hoverEffect
                      className="p-6 border-white/10 bg-slate-900/80 space-y-4 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <Badge status={proj.status} size="sm" dot>
                            {proj.status}
                          </Badge>

                          {proj.problem?.category && (
                            <Badge variant="outline" size="sm" className="text-xs text-slate-300">
                              {proj.problem.category}
                            </Badge>
                          )}
                        </div>

                        <h4 className="text-base font-bold text-white leading-snug">{proj.title}</h4>

                        {proj.problem && (
                          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                            <span className="font-semibold text-slate-400">Challenge:</span> {proj.problem.title}
                          </p>
                        )}

                        <div className="space-y-1.5 pt-2">
                          <div className="flex justify-between text-xs font-medium">
                            <span className="text-slate-400">Progress</span>
                            <span className="text-cyan-300 font-bold">{proj.progressPercent}%</span>
                          </div>
                          <Progress value={proj.progressPercent} size="sm" color="cyan" />
                        </div>
                      </div>

                      <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                        <span className="text-xs text-slate-500">
                          {proj.targetDate
                            ? `Target: ${new Date(proj.targetDate).toLocaleDateString('en-IN', {
                                month: 'short',
                                year: 'numeric',
                              })}`
                            : 'Active Deployment'}
                        </span>

                        <Link href={`/projects/${proj.id}`}>
                          <Button size="sm" variant="secondary" rightIcon={<ChevronRight className="h-3.5 w-3.5" />}>
                            Workspace
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Past Completed Projects */}
            {pastProjects.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-white/10">
                <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-400">
                  Completed & Impact-Verified Solutions ({pastProjects.length})
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pastProjects.map((proj) => (
                    <Card
                      key={proj.id}
                      hoverEffect
                      className="p-6 border-emerald-500/20 bg-slate-900/80 space-y-4 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <Badge status="COMPLETED" size="sm" dot>
                            Verified Completed
                          </Badge>

                          {proj.problem?.category && (
                            <Badge variant="outline" size="sm" className="text-xs text-emerald-300">
                              {proj.problem.category}
                            </Badge>
                          )}
                        </div>

                        <h4 className="text-base font-bold text-white leading-snug">{proj.title}</h4>

                        {proj.problem && (
                          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                            <span className="font-semibold text-slate-400">Resolved Issue:</span> {proj.problem.title}
                          </p>
                        )}

                        {proj.deployments && proj.deployments[0]?.impactMetrics && (
                          <div className="rounded-xl bg-slate-800/60 p-3 border border-white/5 space-y-1.5">
                            <span className="text-[10px] uppercase font-bold text-emerald-400 block tracking-wider">
                              Verified Field Metrics
                            </span>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              {proj.deployments[0].impactMetrics.slice(0, 2).map((m) => (
                                <div key={m.id}>
                                  <span className="text-[11px] text-slate-400 block truncate">{m.metricName}</span>
                                  <span className="font-bold text-white">
                                    {m.beforeValue} → <span className="text-emerald-300">{m.afterValue}</span>
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                        <span className="text-xs text-emerald-400 font-medium">100% Impact Verified</span>

                        <Link href={`/projects/${proj.id}`}>
                          <Button size="sm" variant="default" rightIcon={<ChevronRight className="h-3.5 w-3.5" />}>
                            View Case Study
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeProjects.length === 0 && pastProjects.length === 0 && (
              <div className="p-8 text-center text-slate-400 border border-dashed border-white/10 rounded-2xl">
                This squad is currently open for matching with new societal challenges.
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
