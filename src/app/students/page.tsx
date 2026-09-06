'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import AppShell from '@/components/layout/app-shell'
import {
  GraduationCap,
  Sparkles,
  Search,
  Filter,
  Trophy,
  CheckCircle2,
  Users,
  Target,
  ArrowUpRight,
  Code2,
  Layers,
  Award,
  Zap,
  Building2,
  MapPin,
  ExternalLink,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface StudentItem {
  id: string
  userId: string
  yearOfStudy: number | null
  skills: string
  impactScore: number
  problemsSolved: number
  deploymentsCount: number
  peopleImpacted: number
  user: {
    id: string
    name: string
    email: string
    avatar: string | null
    bio: string | null
    verified: boolean
    certificates: Array<{ id: string; title: string; type: string }>
    teamMemberships: Array<{ team: { id: string; name: string } }>
  }
  university: {
    id: string
    name: string
    shortName: string
    city: string
    state: string
    ranking: number | null
  } | null
  department: {
    id: string
    name: string
  } | null
}

const POPULAR_SKILLS = [
  'All',
  'IoT',
  'AI/ML',
  'Data Science',
  'Embedded Systems',
  'Water Management',
  'Computer Vision',
  'Full Stack',
  'Drone Tech',
]

export default function StudentsPage() {
  const [students, setStudents] = useState<StudentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSkill, setSelectedSkill] = useState('All')
  const [sortBy, setSortBy] = useState<'impact' | 'problems' | 'deployments'>('impact')

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/students')
      const data = await res.json()
      if (data.success && Array.isArray(data.data)) {
        setStudents(data.data)
      }
    } catch (err) {
      console.error('Failed to load students:', err)
    } finally {
      setLoading(false)
    }
  }

  // Parse skills helper
  const parseSkills = (rawSkills: string): string[] => {
    try {
      if (rawSkills.startsWith('[')) {
        return JSON.parse(rawSkills)
      }
      return rawSkills.split(',').map((s) => s.trim()).filter(Boolean)
    } catch {
      return rawSkills.split(',').map((s) => s.trim()).filter(Boolean)
    }
  }

  const filteredStudents = students.filter((student) => {
    const skillsList = parseSkills(student.skills)
    const matchesSkill =
      selectedSkill === 'All' ||
      skillsList.some((s) => s.toLowerCase().includes(selectedSkill.toLowerCase()))

    const q = searchQuery.toLowerCase().trim()
    const matchesSearch =
      !q ||
      student.user.name.toLowerCase().includes(q) ||
      (student.user.bio && student.user.bio.toLowerCase().includes(q)) ||
      (student.university && student.university.name.toLowerCase().includes(q)) ||
      (student.university && student.university.shortName.toLowerCase().includes(q)) ||
      skillsList.some((s) => s.toLowerCase().includes(q))

    return matchesSkill && matchesSearch
  }).sort((a, b) => {
    if (sortBy === 'impact') return b.impactScore - a.impactScore
    if (sortBy === 'problems') return b.problemsSolved - a.problemsSolved
    if (sortBy === 'deployments') return b.deploymentsCount - a.deploymentsCount
    return 0
  })

  // Aggregates
  const totalSolvers = students.length
  const totalDeployments = students.reduce((acc, s) => acc + s.deploymentsCount, 0)
  const totalPeopleImpacted = students.reduce((acc, s) => acc + s.peopleImpacted, 0)
  const totalProblemsSolved = students.reduce((acc, s) => acc + s.problemsSolved, 0)

  return (
    <AppShell>
      <div className="space-y-8 pb-16">
        {/* Top Header / Hero */}
        <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-background p-6 md:p-8">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              National Student Innovation Network • SIH Solvers
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Student Solvers & Engineering Fellows
            </h1>
            <p className="mt-3 text-muted-foreground leading-relaxed text-sm md:text-base">
              Discover top engineering talent, hackathon medalists, and university innovators building real-world solutions for municipal corporations, rural districts, and civic bodies across India.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-border/50 pt-6 sm:grid-cols-4">
            <div className="space-y-1">
              <div className="text-2xl font-bold tracking-tight text-primary">
                {totalSolvers}
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Users className="h-3 w-3" /> Registered Solvers
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold tracking-tight text-foreground">
                {totalProblemsSolved}
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Target className="h-3 w-3" /> Challenges Solved
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold tracking-tight text-emerald-500">
                {totalDeployments}
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Zap className="h-3 w-3" /> Active Deployments
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold tracking-tight text-amber-500">
                {totalPeopleImpacted.toLocaleString()}+
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Trophy className="h-3 w-3" /> Citizens Impacted
              </div>
            </div>
          </div>
        </div>

        {/* Controls: Search, Skill Pills, Sort */}
        <div className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search solvers by name, college, skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-border bg-card/60 pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary backdrop-blur-sm"
              />
            </div>

            {/* Sort Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                <Filter className="h-3.5 w-3.5" /> Sort:
              </span>
              <div className="inline-flex rounded-lg border border-border bg-card/50 p-1 text-xs">
                <button
                  onClick={() => setSortBy('impact')}
                  className={
                    'rounded-md px-3 py-1 font-medium transition-all ' +
                    (sortBy === 'impact'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground')
                  }
                >
                  Impact Score
                </button>
                <button
                  onClick={() => setSortBy('problems')}
                  className={
                    'rounded-md px-3 py-1 font-medium transition-all ' +
                    (sortBy === 'problems'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground')
                  }
                >
                  Problems Solved
                </button>
                <button
                  onClick={() => setSortBy('deployments')}
                  className={
                    'rounded-md px-3 py-1 font-medium transition-all ' +
                    (sortBy === 'deployments'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground')
                  }
                >
                  Deployments
                </button>
              </div>
            </div>
          </div>

          {/* Skill Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {POPULAR_SKILLS.map((skill) => (
              <button
                key={skill}
                onClick={() => setSelectedSkill(skill)}
                className={
                  'whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ' +
                  (selectedSkill === skill
                    ? 'bg-primary text-primary-foreground shadow'
                    : 'bg-card border border-border/80 text-muted-foreground hover:border-primary/50 hover:text-foreground')
                }
              >
                {skill}
              </button>
            ))}
          </div>
        </div>

        {/* Solvers Grid */}
        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="h-64 animate-pulse rounded-xl border border-border/50 bg-card/30"
              />
            ))}
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border p-12 text-center">
            <GraduationCap className="h-12 w-12 text-muted-foreground/40 mb-3" />
            <h3 className="text-base font-semibold text-foreground">No student solvers found</h3>
            <p className="mt-1 text-sm text-muted-foreground max-w-sm">
              We couldn&apos;t find any students matching &quot;{searchQuery}&quot;. Try selecting another skill tag or clearing your search.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => {
                setSearchQuery('')
                setSelectedSkill('All')
              }}
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredStudents.map((student) => {
              const skillsList = parseSkills(student.skills)
              return (
                <div
                  key={student.id}
                  className="group relative flex flex-col justify-between rounded-xl border border-border/70 bg-card/60 p-5 shadow-sm transition-all hover:border-primary/40 hover:shadow-md hover:bg-card/90"
                >
                  <div>
                    {/* Header: Avatar, Name, Verification */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-primary/20 via-primary/10 to-transparent border border-primary/20 text-primary font-bold text-base uppercase">
                          {student.user.avatar ? (
                            <img
                              src={student.user.avatar}
                              alt={student.user.name}
                              className="h-full w-full rounded-xl object-cover"
                            />
                          ) : (
                            student.user.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .slice(0, 2)
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                              {student.user.name}
                            </h3>
                            {student.user.verified && (
                              <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                            <Building2 className="h-3 w-3" />
                            <span className="truncate max-w-[160px]">
                              {student.university?.shortName || student.university?.name || 'Partner Institute'}
                            </span>
                            {student.yearOfStudy && (
                              <span className="text-muted-foreground/60">• Yr {student.yearOfStudy}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Impact Score Pill */}
                      <div className="flex flex-col items-end">
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-500 border border-amber-500/20">
                          <Trophy className="h-3 w-3" />
                          {Math.round(student.impactScore)}
                        </span>
                        <span className="text-[10px] text-muted-foreground mt-0.5">Score</span>
                      </div>
                    </div>

                    {/* Bio Snippet */}
                    <p className="mt-3 text-xs text-muted-foreground/90 line-clamp-2 leading-relaxed">
                      {student.user.bio ||
                        (student.department?.name || 'Engineering') +
                          ' student focused on applied civic technology and open-source deployments.'}
                    </p>

                    {/* Skills Badges */}
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {skillsList.slice(0, 4).map((skill, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center rounded-md bg-secondary/60 px-2 py-0.5 text-[11px] font-medium text-secondary-foreground border border-border/40"
                        >
                          {skill}
                        </span>
                      ))}
                      {skillsList.length > 4 && (
                        <span className="inline-flex items-center rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                          +{skillsList.length - 4}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Footer Metrics & Profile Link */}
                  <div className="mt-5 border-t border-border/50 pt-3.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <div>
                          <span className="font-semibold text-foreground">{student.problemsSolved}</span> solved
                        </div>
                        <div>
                          <span className="font-semibold text-foreground">{student.deploymentsCount}</span> deployed
                        </div>
                      </div>

                      <Link
                        href={`/solvers/${student.user.id}`}
                        className="inline-flex items-center gap-1 font-medium text-primary hover:underline group-hover:translate-x-0.5 transition-transform"
                      >
                        Profile
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </AppShell>
  )
}
