'use client'

import React, { useState, useEffect } from 'react'
import AppShell from '@/components/layout/app-shell'
import {
  Trophy,
  Medal,
  Award,
  Crown,
  Users,
  Building,
  Sparkles,
  TrendingUp,
  Search,
  CheckCircle2,
  Cpu,
  GraduationCap,
  Flame,
  ArrowUpRight,
  Filter,
} from 'lucide-react'
import Link from 'next/link'

type TabType = 'students' | 'teams' | 'universities' | 'faculty'

interface LeaderboardEntry {
  id: string
  rank: number
  name: string
  subtitle?: string
  university: string
  role?: string
  avatar?: string
  problemsSolved: number
  deployments: number
  peopleImpacted: number
  badges: string[]
  totalScore: number
}

const mockStudents: LeaderboardEntry[] = [
  {
    id: 's-1',
    rank: 1,
    name: 'Arun Kumar',
    subtitle: 'Final Year B.Tech CSE',
    university: 'IIT Bombay',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    problemsSolved: 7,
    deployments: 4,
    peopleImpacted: 2350,
    badges: ['Outstanding Solver', 'IoT Expert', 'Rural Champion', 'Water Guardian'],
    totalScore: 185,
  },
  {
    id: 's-2',
    rank: 2,
    name: 'Karthik Rajan',
    subtitle: 'M.Tech Machine Learning',
    university: 'IIIT Hyderabad',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    problemsSolved: 5,
    deployments: 3,
    peopleImpacted: 3800,
    badges: ['Outstanding Solver', 'AgriTech Pioneer', 'Farmer Champion'],
    totalScore: 162,
  },
  {
    id: 's-3',
    rank: 3,
    name: 'Meera Nair',
    subtitle: 'PhD Aerosol Science',
    university: 'IIT Delhi',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    problemsSolved: 5,
    deployments: 2,
    peopleImpacted: 120000,
    badges: ['Air Quality Champion', 'Public Health Hero', 'Sensor Architect'],
    totalScore: 145,
  },
  {
    id: 's-4',
    rank: 4,
    name: 'Divya Patel',
    subtitle: 'M.Tech Data Science',
    university: 'BITS Pilani',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    problemsSolved: 4,
    deployments: 2,
    peopleImpacted: 8000,
    badges: ['Healthcare Innovator', 'Data Wizard'],
    totalScore: 120,
  },
  {
    id: 's-5',
    rank: 5,
    name: 'Rahul Singh',
    subtitle: 'B.Tech Civil Engineering',
    university: 'NIT Trichy',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    problemsSolved: 3,
    deployments: 1,
    peopleImpacted: 12000,
    badges: ['Flood Defense', 'Urban Planner'],
    totalScore: 95,
  },
  {
    id: 's-6',
    rank: 6,
    name: 'Rohan Malhotra',
    subtitle: 'B.Tech Computer Science',
    university: 'IIT Delhi',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    problemsSolved: 3,
    deployments: 1,
    peopleImpacted: 700,
    badges: ['AI Innovator'],
    totalScore: 90,
  },
  {
    id: 's-7',
    rank: 7,
    name: 'Amit Verma',
    subtitle: 'B.Tech CSE',
    university: 'BITS Pilani',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    problemsSolved: 3,
    deployments: 1,
    peopleImpacted: 450,
    badges: ['Tech Builder', 'Cloud Native'],
    totalScore: 80,
  },
]

const mockTeams: LeaderboardEntry[] = [
  {
    id: 't-1',
    rank: 1,
    name: 'AquaTech Innovators',
    subtitle: '6 Members • IoT & Filtration',
    university: 'IIT Bombay',
    problemsSolved: 8,
    deployments: 4,
    peopleImpacted: 2500,
    badges: ['SIH Champion 2026', 'Jal Jeevan Honor', 'Field Tested'],
    totalScore: 320,
  },
  {
    id: 't-2',
    rank: 2,
    name: 'FarmSense AI',
    subtitle: '5 Members • Precision AgriTech',
    university: 'IIIT Hyderabad',
    problemsSolved: 6,
    deployments: 3,
    peopleImpacted: 3800,
    badges: ['AgriTech Gold', 'Doubled Yield Award'],
    totalScore: 285,
  },
  {
    id: 't-3',
    rank: 3,
    name: 'AirGuard Lab',
    subtitle: '6 Members • Environmental Monitoring',
    university: 'IIT Delhi',
    problemsSolved: 5,
    deployments: 2,
    peopleImpacted: 120000,
    badges: ['Clean Air Fellow', 'Predictive Model Star'],
    totalScore: 260,
  },
  {
    id: 't-4',
    rank: 4,
    name: 'HealthBridge Team',
    subtitle: '4 Members • Hospital Systems',
    university: 'BITS Pilani',
    problemsSolved: 4,
    deployments: 2,
    peopleImpacted: 8000,
    badges: ['Triage Innovator', 'Public Health'],
    totalScore: 210,
  },
  {
    id: 't-5',
    rank: 5,
    name: 'FloodShield Ops',
    subtitle: '5 Members • Disaster Telemetry',
    university: 'NIT Trichy',
    problemsSolved: 3,
    deployments: 1,
    peopleImpacted: 12000,
    badges: ['Disaster Hero', 'Odisha Defense'],
    totalScore: 175,
  },
]

const mockUniversities: LeaderboardEntry[] = [
  {
    id: 'u-1',
    rank: 1,
    name: 'Indian Institute of Technology Bombay',
    subtitle: 'NIRF Rank 1 • Mumbai, Maharashtra',
    university: 'IIT Bombay',
    problemsSolved: 24,
    deployments: 11,
    peopleImpacted: 45000,
    badges: ['Premier Institutional Hub', 'Top Deployment Rate', 'Patents Filed'],
    totalScore: 840,
  },
  {
    id: 'u-2',
    rank: 2,
    name: 'Indian Institute of Technology Delhi',
    subtitle: 'NIRF Rank 2 • New Delhi',
    university: 'IIT Delhi',
    problemsSolved: 21,
    deployments: 9,
    peopleImpacted: 135000,
    badges: ['Clean Tech Leader', 'Urban Resilience'],
    totalScore: 780,
  },
  {
    id: 'u-3',
    rank: 3,
    name: 'IIIT Hyderabad',
    subtitle: 'Specialized Tech • Hyderabad, Telangana',
    university: 'IIIT Hyderabad',
    problemsSolved: 18,
    deployments: 8,
    peopleImpacted: 22000,
    badges: ['AI/ML Center of Excellence', 'Rural Smart Hub'],
    totalScore: 690,
  },
  {
    id: 'u-4',
    rank: 4,
    name: 'BITS Pilani',
    subtitle: 'NIRF Rank 3 • Pilani & Goa Campuses',
    university: 'BITS Pilani',
    problemsSolved: 16,
    deployments: 6,
    peopleImpacted: 18500,
    badges: ['Healthcare Pioneers', 'Industry Incubator'],
    totalScore: 590,
  },
  {
    id: 'u-5',
    rank: 5,
    name: 'National Institute of Technology Trichy',
    subtitle: 'NIRF Rank 5 • Tiruchirappalli, Tamil Nadu',
    university: 'NIT Trichy',
    problemsSolved: 14,
    deployments: 5,
    peopleImpacted: 28000,
    badges: ['Civil & Hydrology Leader', 'Coastal Resiliency'],
    totalScore: 510,
  },
]

const mockFaculty: LeaderboardEntry[] = [
  {
    id: 'f-1',
    rank: 1,
    name: 'Prof. Anita Desai',
    subtitle: 'Prof. of Environmental Engineering',
    university: 'IIT Bombay',
    problemsSolved: 8,
    deployments: 5,
    peopleImpacted: 8000,
    badges: ['Master Mentor', 'Innovation Excellence', 'Water Guardian'],
    totalScore: 210,
  },
  {
    id: 'f-2',
    rank: 2,
    name: 'Prof. Vikram Gupta',
    subtitle: 'Prof. of Public Policy & Aerosol Tech',
    university: 'IIT Delhi',
    problemsSolved: 5,
    deployments: 3,
    peopleImpacted: 50000,
    badges: ['Air Quality Champion', 'Research Leader', 'National Advisor'],
    totalScore: 150,
  },
  {
    id: 'f-3',
    rank: 3,
    name: 'Dr. Ravi Krishna',
    subtitle: 'Associate Prof., Healthcare Analytics',
    university: 'BITS Pilani',
    problemsSolved: 4,
    deployments: 2,
    peopleImpacted: 12000,
    badges: ['Healthcare Luminary', 'Student Champion'],
    totalScore: 135,
  },
  {
    id: 'f-4',
    rank: 4,
    name: 'Dr. Suresh Menon',
    subtitle: 'Professor, Civil & Transportation',
    university: 'NIT Trichy',
    problemsSolved: 4,
    deployments: 2,
    peopleImpacted: 15000,
    badges: ['Infrastructure Pillar', 'Field Deployment Star'],
    totalScore: 115,
  },
]

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>('students')
  const [searchQuery, setSearchQuery] = useState('')
  const [data, setData] = useState<LeaderboardEntry[]>(mockStudents)

  useEffect(() => {
    switch (activeTab) {
      case 'students':
        setData(mockStudents)
        break
      case 'teams':
        setData(mockTeams)
        break
      case 'universities':
        setData(mockUniversities)
        break
      case 'faculty':
        setData(mockFaculty)
        break
    }
  }, [activeTab])

  const filteredData = data.filter((item) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      item.name.toLowerCase().includes(q) ||
      item.university.toLowerCase().includes(q) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(q))
    )
  })

  const top1 = filteredData.find((item) => item.rank === 1) || filteredData[0]
  const top2 = filteredData.find((item) => item.rank === 2) || filteredData[1]
  const top3 = filteredData.find((item) => item.rank === 3) || filteredData[2]

  return (
    <AppShell>
      <div className="space-y-10 pb-16">
        {/* Top Header */}
        <div className="relative overflow-hidden rounded-3xl border border-yellow-500/30 bg-gradient-to-r from-[#17130b] via-[#1f1a10] to-[#0d1222] p-8 shadow-[0_0_50px_rgba(234,179,8,0.12)]">
          <div className="absolute top-0 right-0 h-64 w-64 bg-yellow-500/10 blur-[90px] pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-xs font-bold text-yellow-300">
                <Crown className="h-3.5 w-3.5 text-yellow-400" />
                SIH 2026 National Impact Rankings
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-3">
                <Trophy className="h-8 w-8 text-yellow-400 shrink-0" />
                National Problem Solvers Leaderboard
              </h1>
              <p className="text-sm sm:text-base text-slate-300 max-w-2xl">
                Honoring outstanding Indian engineering students, collaborative university teams, faculty mentors, and academic institutes building deployed societal solutions.
              </p>
            </div>

            <div className="flex items-center gap-3 bg-slate-900/80 border border-white/10 rounded-2xl p-3.5 backdrop-blur-md">
              <div className="text-center px-3 border-r border-white/10">
                <div className="text-2xl font-black text-yellow-400">1,482</div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Distress Solved</div>
              </div>
              <div className="text-center px-3 border-r border-white/10">
                <div className="text-2xl font-black text-cyan-400">415K+</div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Lives Touched</div>
              </div>
              <div className="text-center px-3">
                <div className="text-2xl font-black text-emerald-400">64</div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Active Pilots</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex p-1 rounded-xl bg-slate-900 border border-white/10 w-full sm:w-auto">
            {(
              [
                { id: 'students', label: 'Students', icon: Users },
                { id: 'teams', label: 'Teams', icon: Flame },
                { id: 'universities', label: 'Universities', icon: Building },
                { id: 'faculty', label: 'Faculty Mentors', icon: GraduationCap },
              ] as const
            ).map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all flex-1 sm:flex-initial ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-900/80 pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* TOP 3 PODIUM */}
        {top1 && top2 && top3 && (
          <div className="pt-8 pb-4">
            <div className="flex flex-col md:flex-row items-end justify-center gap-4 lg:gap-6 max-w-4xl mx-auto px-4">
              {/* 2nd Place - Silver (Left) */}
              <div className="w-full md:w-1/3 order-2 md:order-1 flex flex-col items-center">
                <div className="relative -mb-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-slate-300 text-slate-900 font-black text-sm shadow-lg border-2 border-slate-100">
                  2
                </div>
                <div className="w-full rounded-2xl border border-slate-400/40 bg-gradient-to-b from-slate-800/90 to-slate-900/90 p-5 text-center shadow-lg hover:border-slate-300 transition-all">
                  <div className="relative mx-auto mb-3 h-16 w-16 rounded-full border-2 border-slate-300 p-0.5 overflow-hidden bg-slate-800 flex items-center justify-center">
                    {top2.avatar ? (
                      <img src={top2.avatar} alt={top2.name} className="h-full w-full object-cover rounded-full" />
                    ) : (
                      <Users className="h-7 w-7 text-slate-300" />
                    )}
                  </div>
                  <h3 className="font-bold text-white text-sm truncate">{top2.name}</h3>
                  <p className="text-[11px] text-slate-400 truncate">{top2.university}</p>
                  <div className="mt-3 rounded-lg bg-slate-800/80 py-1.5 px-2 border border-white/5">
                    <span className="text-base font-black text-slate-200">{top2.totalScore}</span>
                    <span className="text-[10px] text-slate-400 ml-1">Impact Pts</span>
                  </div>
                  <div className="mt-2 text-[10px] text-slate-400">
                    {top2.problemsSolved} solved • {top2.deployments} deployed
                  </div>
                </div>
              </div>

              {/* 1st Place - Gold (Center, Taller) */}
              <div className="w-full md:w-1/3 order-1 md:order-2 flex flex-col items-center -mt-6">
                <div className="relative -mb-4 z-10 flex flex-col items-center">
                  <Crown className="h-6 w-6 text-yellow-400 animate-bounce" />
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400 text-yellow-950 font-black text-base shadow-[0_0_20px_rgba(250,204,21,0.6)] border-2 border-yellow-200">
                    1
                  </div>
                </div>
                <div className="w-full rounded-2xl border-2 border-yellow-400/60 bg-gradient-to-b from-yellow-950/40 via-slate-900/90 to-slate-900/95 p-6 text-center shadow-[0_0_35px_rgba(234,179,8,0.2)] hover:border-yellow-400 transition-all">
                  <div className="relative mx-auto mb-3 h-20 w-20 rounded-full border-2 border-yellow-400 p-0.5 overflow-hidden bg-slate-800 flex items-center justify-center shadow-md">
                    {top1.avatar ? (
                      <img src={top1.avatar} alt={top1.name} className="h-full w-full object-cover rounded-full" />
                    ) : (
                      <Crown className="h-9 w-9 text-yellow-400" />
                    )}
                  </div>
                  <div className="inline-flex items-center gap-1 rounded-full bg-yellow-500/20 px-2.5 py-0.5 text-[10px] font-bold text-yellow-300 border border-yellow-500/30 mb-1">
                    NATIONAL CHAMPION
                  </div>
                  <h3 className="font-extrabold text-white text-base truncate">{top1.name}</h3>
                  <p className="text-xs text-yellow-200/80 truncate">{top1.university}</p>
                  <div className="mt-4 rounded-xl bg-yellow-500/10 py-2 px-3 border border-yellow-500/30 shadow-inner">
                    <span className="text-xl font-black text-yellow-400">{top1.totalScore}</span>
                    <span className="text-xs text-yellow-300 ml-1.5 font-bold">Impact Pts</span>
                  </div>
                  <div className="mt-2 text-xs text-slate-300">
                    <strong className="text-white">{top1.problemsSolved}</strong> Solved •{' '}
                    <strong className="text-white">{top1.deployments}</strong> Deployed
                  </div>
                </div>
              </div>

              {/* 3rd Place - Bronze (Right) */}
              <div className="w-full md:w-1/3 order-3 md:order-3 flex flex-col items-center">
                <div className="relative -mb-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-amber-700 text-amber-100 font-black text-sm shadow-lg border-2 border-amber-600">
                  3
                </div>
                <div className="w-full rounded-2xl border border-amber-600/40 bg-gradient-to-b from-slate-800/90 to-slate-900/90 p-5 text-center shadow-lg hover:border-amber-500 transition-all">
                  <div className="relative mx-auto mb-3 h-16 w-16 rounded-full border-2 border-amber-600 p-0.5 overflow-hidden bg-slate-800 flex items-center justify-center">
                    {top3.avatar ? (
                      <img src={top3.avatar} alt={top3.name} className="h-full w-full object-cover rounded-full" />
                    ) : (
                      <Users className="h-7 w-7 text-amber-500" />
                    )}
                  </div>
                  <h3 className="font-bold text-white text-sm truncate">{top3.name}</h3>
                  <p className="text-[11px] text-slate-400 truncate">{top3.university}</p>
                  <div className="mt-3 rounded-lg bg-slate-800/80 py-1.5 px-2 border border-white/5">
                    <span className="text-base font-black text-amber-400">{top3.totalScore}</span>
                    <span className="text-[10px] text-slate-400 ml-1">Impact Pts</span>
                  </div>
                  <div className="mt-2 text-[10px] text-slate-400">
                    {top3.problemsSolved} solved • {top3.deployments} deployed
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* RANKED TABLE */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-xl">
          <div className="p-5 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-400" />
              Complete National Rankings • {activeTab.toUpperCase()}
            </h2>
            <span className="text-xs text-slate-400">
              Ranked by verified citizen impact and deployments
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="border-b border-white/5 bg-slate-800/50 text-xs font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-5 py-3.5">Rank</th>
                  <th className="px-5 py-3.5">Name / Identifier</th>
                  <th className="px-5 py-3.5">Institution</th>
                  <th className="px-5 py-3.5 text-center">Problems Solved</th>
                  <th className="px-5 py-3.5 text-center">Deployments</th>
                  <th className="px-5 py-3.5 text-right">People Impacted</th>
                  <th className="px-5 py-3.5">Verified Badges</th>
                  <th className="px-5 py-3.5 text-right">Impact Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredData.map((item) => {
                  const isGold = item.rank === 1
                  const isSilver = item.rank === 2
                  const isBronze = item.rank === 3

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-800/40 transition-colors ${
                        isGold ? 'bg-yellow-500/5' : isSilver ? 'bg-slate-400/5' : isBronze ? 'bg-amber-600/5' : ''
                      }`}
                    >
                      {/* Rank */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {isGold ? (
                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-yellow-400/20 text-yellow-400 font-black text-xs border border-yellow-400/40">
                              🥇 1
                            </span>
                          ) : isSilver ? (
                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-300/20 text-slate-300 font-black text-xs border border-slate-300/40">
                              🥈 2
                            </span>
                          ) : isBronze ? (
                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-600/20 text-amber-400 font-black text-xs border border-amber-600/40">
                              🥉 3
                            </span>
                          ) : (
                            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 text-slate-400 font-mono text-xs">
                              #{item.rank}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Name / Identifier */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-slate-800 border border-white/10 overflow-hidden shrink-0 flex items-center justify-center text-xs font-bold text-slate-300">
                            {item.avatar ? (
                              <img src={item.avatar} alt={item.name} className="h-full w-full object-cover" />
                            ) : (
                              item.name.slice(0, 2).toUpperCase()
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-white group-hover:text-blue-400">
                              {item.name}
                            </div>
                            {item.subtitle && (
                              <div className="text-[11px] text-slate-400">{item.subtitle}</div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* University */}
                      <td className="px-5 py-4 whitespace-nowrap text-xs text-slate-300">
                        <span className="inline-flex items-center gap-1.5">
                          <Building className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                          {item.university}
                        </span>
                      </td>

                      {/* Problems Solved */}
                      <td className="px-5 py-4 whitespace-nowrap text-center font-mono text-xs font-bold text-white">
                        {item.problemsSolved}
                      </td>

                      {/* Deployments */}
                      <td className="px-5 py-4 whitespace-nowrap text-center font-mono text-xs">
                        <span className="inline-flex items-center gap-1 rounded bg-emerald-500/20 text-emerald-300 px-2 py-0.5 font-bold border border-emerald-500/30">
                          <CheckCircle2 className="h-3 w-3" />
                          {item.deployments}
                        </span>
                      </td>

                      {/* People Impacted */}
                      <td className="px-5 py-4 whitespace-nowrap text-right font-mono text-xs text-cyan-300 font-bold">
                        {item.peopleImpacted.toLocaleString('en-IN')}+
                      </td>

                      {/* Badges List */}
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {item.badges.map((badge) => (
                            <span
                              key={badge}
                              className="rounded-full bg-slate-800 border border-white/10 px-2 py-0.5 text-[10px] font-medium text-slate-300"
                            >
                              {badge}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Total Impact Score */}
                      <td className="px-5 py-4 whitespace-nowrap text-right">
                        <span className="font-mono text-base font-black text-yellow-400">
                          {item.totalScore}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
