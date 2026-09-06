'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  Users,
  Search,
  Plus,
  Building2,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  GraduationCap,
  Layers,
  Award,
  Filter,
  Check,
  Zap,
} from 'lucide-react'
import AppShell from '@/components/layout/app-shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface MemberInfo {
  id: string
  role: string
  user: {
    id: string
    name: string
    avatar?: string | null
    email: string
    role: string
  }
}

interface TeamProjectSummary {
  id: string
  title: string
  status: string
  progressPercent: number
}

interface TeamItem {
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
  members: MemberInfo[]
  projects: TeamProjectSummary[]
  _count?: {
    members: number
    projects: number
  }
}

interface UniversityOption {
  id: string
  name: string
  shortName: string
}

const COMMON_SKILLS = [
  'All',
  'IoT',
  'Water Technology',
  'AI/ML',
  'Computer Vision',
  'Environmental Engineering',
  'Data Science',
  'Traffic Management',
  'Healthcare Tech',
  'Agriculture Tech',
  'Embedded Systems',
] as const

function parseSkills(skillsString?: string | null): string[] {
  if (!skillsString) return []
  try {
    const parsed = JSON.parse(skillsString)
    return Array.isArray(parsed) ? parsed : [skillsString]
  } catch {
    return skillsString.split(',').map((s) => s.trim()).filter(Boolean)
  }
}

export default function TeamsPage() {
  const router = useRouter()
  const [teams, setTeams] = useState<TeamItem[]>([])
  const [universities, setUniversities] = useState<UniversityOption[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUniversity, setSelectedUniversity] = useState<string>('ALL')
  const [selectedSkill, setSelectedSkill] = useState<string>('All')

  // Create Team Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newTeamName, setNewTeamName] = useState('')
  const [newTeamUni, setNewTeamUni] = useState('')
  const [newTeamSkills, setNewTeamSkills] = useState('')
  const [newTeamSize, setNewTeamSize] = useState('4')

  const fetchTeams = async () => {
    try {
      setError(null)
      const res = await fetch('/api/teams')
      if (!res.ok) throw new Error('Failed to load teams')
      const json = await res.json()
      if (json.success && Array.isArray(json.data)) {
        setTeams(json.data)

        // Extract unique universities
        const uniMap = new Map<string, UniversityOption>()
        json.data.forEach((t: TeamItem) => {
          if (t.university) {
            uniMap.set(t.university.id, {
              id: t.university.id,
              name: t.university.name,
              shortName: t.university.shortName,
            })
          }
        })
        setUniversities(Array.from(uniMap.values()))
      } else {
        throw new Error('Invalid teams response')
      }
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to fetch teams')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchTeams()
  }, [])

  const handleRefresh = () => {
    setIsRefreshing(true)
    fetchTeams()
  }

  // Create team handler
  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTeamName.trim()) {
      toast.error('Team name is required')
      return
    }

    setIsSubmitting(true)
    try {
      const skillsArr = newTeamSkills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)

      const res = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newTeamName.trim(),
          universityId: newTeamUni || null,
          skills: skillsArr,
          size: parseInt(newTeamSize, 10) || 4,
        }),
      })

      if (!res.ok) throw new Error('Failed to create team')
      const json = await res.json()

      toast.success(`Team "${newTeamName}" registered successfully!`)
      setIsCreateModalOpen(false)
      setNewTeamName('')
      setNewTeamSkills('')
      setNewTeamUni('')
      await fetchTeams()

      if (json.data?.id) {
        router.push(`/teams/${json.data.id}`)
      }
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || 'Failed to create team')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Filtered teams
  const filteredTeams = useMemo(() => {
    return teams.filter((team) => {
      // 1. University filter
      if (selectedUniversity !== 'ALL' && team.university?.id !== selectedUniversity) {
        return false
      }

      // 2. Skill filter
      if (selectedSkill !== 'All') {
        const teamSkills = parseSkills(team.skills).map((s) => s.toLowerCase())
        if (!teamSkills.some((s) => s.includes(selectedSkill.toLowerCase()))) {
          return false
        }
      }

      // 3. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const teamName = team.name.toLowerCase()
        const uniName = (team.university?.name || team.university?.shortName || '').toLowerCase()
        const skillsText = team.skills.toLowerCase()
        return teamName.includes(q) || uniName.includes(q) || skillsText.includes(q)
      }

      return true
    })
  }, [teams, selectedUniversity, selectedSkill, searchQuery])

  // Statistics
  const stats = useMemo(() => {
    const total = teams.length
    const verified = teams.filter((t) => t.verified).length
    const totalMembers = teams.reduce((sum, t) => sum + (t.members.length || t.size || 0), 0)
    const solvedChallenges = teams.reduce(
      (sum, t) => sum + t.projects.filter((p) => p.status === 'COMPLETED').length,
      0
    )
    return { total, verified, totalMembers, solvedChallenges }
  }, [teams])

  return (
    <AppShell>
      <div className="space-y-8 pb-16">
        {/* Top Header Banner */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 p-6 md:p-8 backdrop-blur-xl shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                <Users className="h-3.5 w-3.5" />
                <span>Interdisciplinary Solver Directory</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
                University Teams & Labs
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Explore student-led and faculty-mentored interdisciplinary problem-solving squads across premier Indian
                universities matching cutting-edge technical capability with urgent public challenges.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleRefresh}
                isLoading={isRefreshing}
                leftIcon={<RefreshCw className={cn('h-4 w-4', isRefreshing && 'animate-spin')} />}
              >
                Refresh
              </Button>
              <Button
                size="sm"
                variant="default"
                onClick={() => setIsCreateModalOpen(true)}
                leftIcon={<Plus className="h-4 w-4" />}
              >
                Create New Team
              </Button>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-white/10 pt-6">
            <div className="rounded-xl border border-white/5 bg-slate-900/60 p-3.5 backdrop-blur-md">
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-blue-400" />
                Active Teams
              </span>
              <p className="text-xl font-bold text-white mt-1">{stats.total}</p>
              <span className="text-[11px] text-slate-500">Across 5 Universities</span>
            </div>

            <div className="rounded-xl border border-white/5 bg-slate-900/60 p-3.5 backdrop-blur-md">
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                Verified Squads
              </span>
              <p className="text-xl font-bold text-emerald-300 mt-1">{stats.verified}</p>
              <span className="text-[11px] text-emerald-500/80">Faculty sanctioned</span>
            </div>

            <div className="rounded-xl border border-white/5 bg-slate-900/60 p-3.5 backdrop-blur-md">
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                <GraduationCap className="h-3.5 w-3.5 text-purple-400" />
                Researchers & Students
              </span>
              <p className="text-xl font-bold text-purple-300 mt-1">{stats.totalMembers}+</p>
              <span className="text-[11px] text-purple-500/80">Active contributors</span>
            </div>

            <div className="rounded-xl border border-white/5 bg-slate-900/60 p-3.5 backdrop-blur-md">
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" />
                Solved Challenges
              </span>
              <p className="text-xl font-bold text-cyan-300 mt-1">{stats.solvedChallenges}</p>
              <span className="text-[11px] text-cyan-500/80">Completed deployments</span>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by team name, university, or domain skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* University Dropdown Filter */}
            <div className="w-full md:w-64 shrink-0">
              <select
                value={selectedUniversity}
                onChange={(e) => setSelectedUniversity(e.target.value)}
                className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                <option value="ALL">All Academic Institutions</option>
                {universities.map((uni) => (
                  <option key={uni.id} value={uni.id}>
                    {uni.shortName || uni.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Domain Skills Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
            <span className="text-xs text-slate-400 font-medium shrink-0 mr-1 flex items-center gap-1">
              <Filter className="h-3 w-3" />
              Domain:
            </span>
            {COMMON_SKILLS.map((skill) => {
              const isActive = selectedSkill === skill
              return (
                <button
                  key={skill}
                  onClick={() => setSelectedSkill(skill)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border',
                    isActive
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/30'
                      : 'bg-slate-900/60 border-white/5 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  )}
                >
                  {skill}
                </button>
              )
            })}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-400" />
            <span>{error}</span>
            <Button size="sm" variant="ghost" className="ml-auto" onClick={handleRefresh}>
              Retry
            </Button>
          </div>
        )}

        {/* Teams Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-5 w-32 rounded-md" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <Skeleton className="h-4 w-3/4 rounded-md" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16 rounded-md" />
                  <Skeleton className="h-6 w-20 rounded-md" />
                  <Skeleton className="h-6 w-16 rounded-md" />
                </div>
                <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                  <Skeleton className="h-4 w-24 rounded-md" />
                  <Skeleton className="h-8 w-24 rounded-lg" />
                </div>
              </Card>
            ))}
          </div>
        ) : filteredTeams.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-12 text-center space-y-4">
            <div className="h-16 w-16 mx-auto rounded-2xl bg-slate-800/80 flex items-center justify-center text-slate-400">
              <Users className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-white">No teams match your criteria</h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                Try clearing your search query or selecting &quot;All Academic Institutions&quot; and &quot;All&quot; domain skills.
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setSearchQuery('')
                setSelectedUniversity('ALL')
                setSelectedSkill('All')
              }}
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeams.map((team) => {
              const skillsList = parseSkills(team.skills)
              const solvedCount = team.projects.filter((p) => p.status === 'COMPLETED').length
              const matchPercent = team.matchScore
                ? Math.round(team.matchScore * 100)
                : 85 + (team.name.length % 12)

              return (
                <Card
                  key={team.id}
                  hoverEffect
                  className="flex flex-col justify-between border-white/10 bg-slate-900/80 backdrop-blur-xl group p-6"
                >
                  <div className="space-y-4">
                    {/* Header: Verified & Match Score */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        {team.verified && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            <ShieldCheck className="h-3 w-3" />
                            Verified Squad
                          </span>
                        )}
                      </div>

                      <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30 shadow-sm shadow-purple-500/10">
                        <Sparkles className="h-3 w-3 text-purple-400" />
                        <span>{matchPercent}% Match</span>
                      </div>
                    </div>

                    {/* Team Title & University */}
                    <div className="space-y-1.5">
                      <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {team.name}
                      </h3>

                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Building2 className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                        <span className="truncate">
                          {team.university?.shortName || team.university?.name || 'Autonomous Partner'}
                        </span>
                        {team.department && (
                          <>
                            <span>•</span>
                            <span className="truncate">{team.department.name}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Members Avatar Row & Solved Count */}
                    <div className="flex items-center justify-between py-2 border-y border-white/5">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2 overflow-hidden">
                          {team.members && team.members.length > 0 ? (
                            team.members.slice(0, 3).map((m) => (
                              <Avatar
                                key={m.id}
                                name={m.user.name}
                                size="sm"
                                className="ring-2 ring-slate-900"
                              />
                            ))
                          ) : (
                            <div className="h-7 w-7 rounded-full bg-slate-800 flex items-center justify-center text-[10px] text-slate-400 font-bold ring-2 ring-slate-900">
                              {team.size}
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-slate-300 font-medium">
                          {team.members?.length || team.size} Members
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-xs font-semibold text-cyan-400">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>{solvedCount} Solved</span>
                      </div>
                    </div>

                    {/* Key Skills Chips */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] text-slate-500 font-medium block uppercase tracking-wider">
                        Core Domains
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {skillsList.slice(0, 4).map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md text-[11px] bg-slate-800/80 text-slate-300 border border-white/5 font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                        {skillsList.length > 4 && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] text-slate-500">
                            +{skillsList.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Footer CTA */}
                  <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">
                      {team.projects.length > 0
                        ? `${team.projects.length} Active Challenge${team.projects.length > 1 ? 's' : ''}`
                        : 'Available for matching'}
                    </span>

                    <Link href={`/teams/${team.id}`}>
                      <Button
                        size="sm"
                        variant="secondary"
                        rightIcon={<ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />}
                      >
                        View Team
                      </Button>
                    </Link>
                  </div>
                </Card>
              )
            })}
          </div>
        )}

        {/* Create Team Modal */}
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Create New Team"
          description="Register an interdisciplinary student research or engineering squad."
          maxWidth="md"
        >
          <form onSubmit={handleCreateTeam} className="space-y-4">
            <Input
              label="Team Name"
              placeholder="e.g. EcoSensors Lab"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              required
            />

            <Select
              label="Academic University"
              value={newTeamUni}
              onChange={(e) => setNewTeamUni(e.target.value)}
            >
              <option value="">Select Academic Institution</option>
              {universities.map((uni) => (
                <option key={uni.id} value={uni.id}>
                  {uni.name} ({uni.shortName})
                </option>
              ))}
            </Select>

            <Input
              label="Domain Skills (comma separated)"
              placeholder="e.g. IoT, Water Sensors, GIS, Machine Learning"
              value={newTeamSkills}
              onChange={(e) => setNewTeamSkills(e.target.value)}
            />

            <Select
              label="Squad Target Size"
              value={newTeamSize}
              onChange={(e) => setNewTeamSize(e.target.value)}
            >
              <option value="2">2 Members</option>
              <option value="3">3 Members</option>
              <option value="4">4 Members</option>
              <option value="5">5 Members</option>
              <option value="6">6 Members</option>
            </Select>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setIsCreateModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" isLoading={isSubmitting}>
                Register Team
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </AppShell>
  )
}
