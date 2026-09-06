'use client'

import React, { useState } from 'react'
import AppShell from '@/components/layout/app-shell'
import {
  GraduationCap,
  Building,
  MapPin,
  Trophy,
  Users,
  FolderKanban,
  CheckCircle2,
  ArrowUpRight,
  Search,
  Filter,
  Sparkles,
  Award,
} from 'lucide-react'
import Link from 'next/link'

interface UniversityData {
  id: string
  slug: string
  name: string
  shortName: string
  city: string
  state: string
  ranking: number
  verified: boolean
  expertise: string[]
  stats: {
    teams: number
    projects: number
    deployments: number
    citizensImpacted: number
  }
  flagshipProject: string
}

const universitiesList: UniversityData[] = [
  {
    id: 'univ-iitb',
    slug: 'iit-bombay',
    name: 'Indian Institute of Technology Bombay',
    shortName: 'IIT Bombay',
    city: 'Mumbai',
    state: 'Maharashtra',
    ranking: 1,
    verified: true,
    expertise: ['IoT & Edge Sensors', 'Water Technology', 'Embedded Systems', 'Smart Cities', 'AI/ML'],
    stats: {
      teams: 8,
      projects: 14,
      deployments: 4,
      citizensImpacted: 45000,
    },
    flagshipProject: 'Groundwater Contamination & IoT Remediation (Nashik Villages)',
  },
  {
    id: 'univ-iitd',
    slug: 'iit-delhi',
    name: 'Indian Institute of Technology Delhi',
    shortName: 'IIT Delhi',
    city: 'New Delhi',
    state: 'Delhi NCR',
    ranking: 2,
    verified: true,
    expertise: ['Air Quality Modeling', 'Aerosol Tech', 'Public Policy', 'Biotechnology', 'Data Science'],
    stats: {
      teams: 6,
      projects: 12,
      deployments: 3,
      citizensImpacted: 135000,
    },
    flagshipProject: 'Hyperlocal Air Quality Warning Network (Delhi Corridors)',
  },
  {
    id: 'univ-bits',
    slug: 'bits-pilani',
    name: 'Birla Institute of Technology & Science Pilani',
    shortName: 'BITS Pilani',
    city: 'Pilani',
    state: 'Rajasthan',
    ranking: 3,
    verified: true,
    expertise: ['Healthcare Systems', 'Environmental Engineering', 'Renewable Energy', 'Data Analytics'],
    stats: {
      teams: 5,
      projects: 10,
      deployments: 2,
      citizensImpacted: 18500,
    },
    flagshipProject: 'Civil Hospital OPD Smart Queue & Tele-Triage (Amravati)',
  },
  {
    id: 'univ-nitt',
    slug: 'nit-trichy',
    name: 'National Institute of Technology Tiruchirappalli',
    shortName: 'NIT Trichy',
    city: 'Tiruchirappalli',
    state: 'Tamil Nadu',
    ranking: 5,
    verified: true,
    expertise: ['Civil & Structural Engineering', 'Hydrology & Coastal Defense', 'Transportation', 'GIS'],
    stats: {
      teams: 4,
      projects: 9,
      deployments: 2,
      citizensImpacted: 28000,
    },
    flagshipProject: 'Automated Coastal Flash Flood Early Warning (Kendrapara)',
  },
  {
    id: 'univ-iiith',
    slug: 'iiit-hyderabad',
    name: 'International Institute of Information Technology Hyderabad',
    shortName: 'IIIT Hyderabad',
    city: 'Hyderabad',
    state: 'Telangana',
    ranking: 7,
    verified: true,
    expertise: ['Machine Learning', 'Computer Vision', 'Smart Agriculture', 'NLP', 'Drone Telemetry'],
    stats: {
      teams: 5,
      projects: 11,
      deployments: 3,
      citizensImpacted: 22000,
    },
    flagshipProject: 'AI Precision Irrigation & Soil Intelligence (Vidarbha Cotton Belt)',
  },
]

export default function UniversitiesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedExpertise, setSelectedExpertise] = useState('ALL')

  const allSkills = [
    'ALL',
    'Water Technology',
    'AI/ML',
    'Air Quality Modeling',
    'Smart Agriculture',
    'Healthcare Systems',
    'IoT & Edge Sensors',
  ]

  const filtered = universitiesList.filter((univ) => {
    const matchesSearch =
      univ.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      univ.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      univ.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      univ.state.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesExpertise =
      selectedExpertise === 'ALL' ||
      univ.expertise.some((e) => e.toLowerCase().includes(selectedExpertise.toLowerCase()))

    return matchesSearch && matchesExpertise
  })

  return (
    <AppShell>
      <div className="space-y-10 pb-16">
        {/* Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-blue-500/30 bg-gradient-to-r from-[#0d172e] via-[#101b3b] to-[#0a1226] p-8 md:p-10 shadow-[0_0_50px_rgba(37,99,235,0.15)]">
          <div className="absolute top-0 right-0 h-64 w-64 bg-blue-500/10 blur-[90px] pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-300">
              <GraduationCap className="h-3.5 w-3.5 text-blue-400" />
              National Academic Network • Smart India Hackathon
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Institutional Problem-Solving Hubs
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Explore India&apos;s leading engineering and research institutions mobilized through CivicSolve. Faculty laboratories and student task forces solving municipal and rural challenges.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search university by name, city, state..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-900/80 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            <span className="text-xs font-semibold text-slate-400 shrink-0">Domain:</span>
            {allSkills.map((skill) => (
              <button
                key={skill}
                onClick={() => setSelectedExpertise(skill)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedExpertise === skill
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {skill === 'ALL' ? 'All Disciplines' : skill}
              </button>
            ))}
          </div>
        </div>

        {/* Universities Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filtered.map((univ) => (
            <div
              key={univ.id}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-xl p-6 sm:p-7 transition-all hover:border-blue-500/40 hover:shadow-[0_0_35px_rgba(37,99,235,0.12)] flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 rounded-md bg-yellow-500/20 border border-yellow-500/30 px-2 py-0.5 text-[11px] font-bold text-yellow-300">
                        <Trophy className="h-3 w-3" />
                        NIRF #{univ.ranking}
                      </span>
                      <span className="rounded-md bg-slate-800 border border-white/10 px-2 py-0.5 text-[11px] font-semibold text-cyan-300">
                        {univ.shortName}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                      {univ.name}
                    </h2>

                    <p className="flex items-center gap-1 text-xs text-slate-400">
                      <MapPin className="h-3.5 w-3.5 text-slate-500" />
                      {univ.city}, {univ.state}
                    </p>
                  </div>

                  <div className="h-12 w-12 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center shrink-0">
                    <Building className="h-6 w-6 text-blue-400" />
                  </div>
                </div>

                {/* Metrics 4-grid */}
                <div className="grid grid-cols-4 gap-2 my-5 rounded-xl bg-slate-950/50 p-3 border border-white/5 text-center">
                  <div>
                    <div className="text-base font-black text-white">{univ.stats.teams}</div>
                    <div className="text-[10px] text-slate-400 uppercase">Teams</div>
                  </div>
                  <div>
                    <div className="text-base font-black text-blue-400">{univ.stats.projects}</div>
                    <div className="text-[10px] text-slate-400 uppercase">Projects</div>
                  </div>
                  <div>
                    <div className="text-base font-black text-emerald-400">{univ.stats.deployments}</div>
                    <div className="text-[10px] text-slate-400 uppercase">Pilots</div>
                  </div>
                  <div>
                    <div className="text-base font-black text-amber-300">
                      {(univ.stats.citizensImpacted / 1000).toFixed(0)}k+
                    </div>
                    <div className="text-[10px] text-slate-400 uppercase">Impacted</div>
                  </div>
                </div>

                {/* Expertise Chips */}
                <div className="mb-4">
                  <div className="text-[11px] font-mono text-slate-400 uppercase mb-2">
                    Research & Technical Specializations
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {univ.expertise.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-slate-800/90 border border-white/5 px-2.5 py-1 text-xs text-slate-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Flagship Project */}
                <div className="rounded-lg bg-blue-950/20 border border-blue-500/20 p-3 text-xs mb-5">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider text-blue-300 mb-0.5">
                    Flagship Deployment:
                  </span>
                  <span className="font-semibold text-white">{univ.flagshipProject}</span>
                </div>
              </div>

              {/* Action */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-semibold">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Verified MoE Partner
                </span>

                <Link
                  href={`/universities/${univ.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2 text-xs font-bold text-white shadow transition-all active:scale-95"
                >
                  Explore Showcase
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  )
}
