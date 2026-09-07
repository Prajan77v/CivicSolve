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
        <div className="relative overflow-hidden rounded-3xl border border-blue-500/30 bg-gradient-to-r from-[#0d172e] via-[#101b3b] to-[#0a1226] p-8 md:p-10 shadow-[0_0_50px_rgba(37,99,235,0.15)]">
          <div className="absolute top-0 right-0 h-64 w-64 bg-blue-500/10 blur-[90px] pointer-events-none" />
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-300 mb-4">
              <Sparkles className="h-3.5 w-3.5 text-blue-400" />
              National Student Innovation Network • SIH Solvers
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Student Solvers & Engineering Fellows
            </h1>
            <p className="mt-3 text-slate-300 leading-relaxed text-sm md:text-base">
              Discover top engineering talent, hackathon medalists, and university innovators building real-world solutions for municipal corporations, rural districts, and civic bodies across India.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-white/10 pt-6 sm:grid-cols-4">
            <div className="rounded-xl bg-slate-900/50 border border-white/5 p-3.5 backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl font-black tracking-tight text-blue-400">
                {totalSolvers}
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-1 font-medium">
                <Users className="h-3.5 w-3.5 text-blue-400" /> Registered Solvers
              </div>
            </div>
            <div className="rounded-xl bg-slate-900/50 border border-white/5 p-3.5 backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                {totalProblemsSolved}
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-1 font-medium">
                <Target className="h-3.5 w-3.5 text-cyan-400" /> Challenges Solved
              </div>
            </div>
            <div className="rounded-xl bg-slate-900/50 border border-white/5 p-3.5 backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl font-black tracking-tight text-emerald-400">
                {totalDeployments}
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-1 font-medium">
                <Zap className="h-3.5 w-3.5 text-emerald-400" /> Active Deployments
              </div>
            </div>
            <div className="rounded-xl bg-slate-900/50 border border-white/5 p-3.5 backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl font-black tracking-tight text-amber-400">
                {totalPeopleImpacted.toLocaleString()}+
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-1 font-medium">
                <Trophy className="h-3.5 w-3.5 text-amber-400" /> Citizens Impacted
              </div>
            </div>
          </div>
        </div>

        {/* Controls: Search, Skill Pills, Sort */}
        <div className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search solvers by name, college, skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-900/80 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none backdrop-blur-xl shadow-inner"
              />
            </div>

            {/* Sort Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                <Filter className="h-3.5 w-3.5 text-blue-400" /> Sort:
              </span>
              <div className="inline-flex rounded-xl border border-white/10 bg-slate-900/80 p-1 text-xs backdrop-blur-xl">
                <button
                  onClick={() => setSortBy('impact')}
                  className={
                    'rounded-lg px-3 py-1 font-semibold transition-all ' +
                    (sortBy === 'impact'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'text-slate-400 hover:text-white')
                  }
                >
                  Impact Score
                </button>
                <button
                  onClick={() => setSortBy('problems')}
                  className={
                    'rounded-lg px-3 py-1 font-semibold transition-all ' +
                    (sortBy === 'problems'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'text-slate-400 hover:text-white')
                  }
                >
                  Problems Solved
                </button>
                <button
                  onClick={() => setSortBy('deployments')}
                  className={
                    'rounded-lg px-3 py-1 font-semibold transition-all ' +
                    (sortBy === 'deployments'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'text-slate-400 hover:text-white')
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
                  'whitespace-nowrap rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ' +
                  (selectedSkill === skill
                    ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-500/20'
                    : 'bg-slate-900/70 border border-white/10 text-slate-300 hover:border-blue-500/40 hover:text-white')
                }
              >
                {skill}
              </button>
            ))}
          </div>
        </div>

        {/* Solvers Grid */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="h-64 animate-pulse rounded-2xl border border-white/10 bg-slate-900/40"
              />
            ))}
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-slate-900/30 p-12 text-center">
            <GraduationCap className="h-12 w-12 text-slate-500 mb-3" />
            <h3 className="text-base font-semibold text-white">No student solvers found</h3>
            <p className="mt-1 text-sm text-slate-400 max-w-sm">
              We couldn&apos;t find any students matching &quot;{searchQuery}&quot;. Try selecting another skill tag or clearing your search.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 border-white/10 text-slate-300 hover:bg-slate-800"
              onClick={() => {
                setSearchQuery('')
                setSelectedSkill('All')
              }}
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredStudents.map((student) => {
              const skillsList = parseSkills(student.skills)
              return (
                <div
                  key={student.id}
                  className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-slate-900/80 p-6 shadow-lg backdrop-blur-xl transition-all hover:border-blue-500/40 hover:shadow-[0_0_35px_rgba(37,99,235,0.15)] hover:bg-slate-900/95"
                >
                  <div>
                    {/* Header: Avatar, Name, Verification */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3.5">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-500/20 via-cyan-500/10 to-transparent border border-blue-500/30 text-blue-400 font-bold text-base uppercase shadow-sm">
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
                            <h3 className="font-bold text-white text-base group-hover:text-blue-400 transition-colors">
                              {student.user.name}
                            </h3>
                            {student.user.verified && (
                              <CheckCircle2 className="h-4 w-4 text-blue-400 shrink-0" />
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                            <Building2 className="h-3 w-3 text-slate-500" />
                            <span className="truncate max-w-[150px] text-slate-300 font-medium">
                              {student.university?.shortName || student.university?.name || 'Partner Institute'}
                            </span>
                            {student.yearOfStudy && (
                              <span className="text-slate-500">• Yr {student.yearOfStudy}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Impact Score Pill */}
                      <div className="flex flex-col items-end">
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-bold text-amber-400 border border-amber-500/30 shadow-sm">
                          <Trophy className="h-3 w-3 text-amber-400" />
                          {Math.round(student.impactScore)}
                        </span>
                        <span className="text-[10px] font-medium text-slate-400 mt-0.5">Score</span>
                      </div>
                    </div>

                    {/* Bio Snippet */}
                    <p className="mt-4 text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {student.user.bio ||
                        (student.department?.name || 'Engineering') +
                          ' student focused on applied civic technology and open-source deployments.'}
                    </p>

                    {/* Skills Badges */}
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {skillsList.slice(0, 4).map((skill, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center rounded-md bg-slate-800/90 px-2.5 py-1 text-[11px] font-medium text-slate-200 border border-white/5"
                        >
                          {skill}
                        </span>
                      ))}
                      {skillsList.length > 4 && (
                        <span className="inline-flex items-center rounded-md bg-slate-800/60 border border-white/5 px-2 py-1 text-[10px] font-medium text-slate-400">
                          +{skillsList.length - 4}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Footer Metrics & Profile Link */}
                  <div className="mt-6 border-t border-white/10 pt-4">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-4 text-slate-400">
                        <div>
                          <span className="font-bold text-white text-sm">{student.problemsSolved}</span> <span className="text-[11px]">solved</span>
                        </div>
                        <div>
                          <span className="font-bold text-emerald-400 text-sm">{student.deploymentsCount}</span> <span className="text-[11px]">deployed</span>
                        </div>
                      </div>

                      <Link
                        href={`/solvers/${student.user.id}`}
                        className="inline-flex items-center gap-1 font-semibold text-blue-400 hover:text-blue-300 transition-colors"
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
