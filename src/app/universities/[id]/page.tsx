'use client'

import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import AppShell from '@/components/layout/app-shell'
import {
  GraduationCap,
  Building,
  MapPin,
  Trophy,
  Users,
  FolderKanban,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  Award,
  ExternalLink,
  Mail,
  Flame,
  Send,
  Check,
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

interface UniversityDetail {
  id: string
  slug: string
  name: string
  shortName: string
  city: string
  state: string
  ranking: number
  established: number
  description: string
  expertise: string[]
  stats: {
    problemsSolved: number
    activeTeams: number
    deployments: number
    facultyMentors: number
    totalScore: number
    citizensImpacted: number
  }
  departments: {
    name: string
    head: string
    focus: string[]
  }[]
  teams: {
    name: string
    members: number
    lead: string
    focus: string
    status: string
  }[]
  projects: {
    title: string
    status: string
    partner: string
    impact: string
  }[]
  faculty: {
    name: string
    designation: string
    specialization: string
    email: string
  }[]
}

const detailedUniversities: Record<string, UniversityDetail> = {
  'iit-bombay': {
    id: 'univ-iitb',
    slug: 'iit-bombay',
    name: 'Indian Institute of Technology Bombay',
    shortName: 'IIT Bombay',
    city: 'Powai, Mumbai',
    state: 'Maharashtra',
    ranking: 1,
    established: 1958,
    description:
      'IIT Bombay serves as the primary technical node for Western India societal problem matching. Its Center for Technology Alternatives for Rural Areas (CTARA) and Department of Computer Science lead nationwide deployments in water sanitation, IoT sensing, and edge micro-grids.',
    expertise: ['IoT Sensors', 'Water Treatment Technology', 'Edge AI', 'Smart City Grids', 'Rural Automation'],
    stats: {
      problemsSolved: 24,
      activeTeams: 8,
      deployments: 4,
      facultyMentors: 6,
      totalScore: 840,
      citizensImpacted: 45000,
    },
    departments: [
      {
        name: 'Computer Science & Engineering',
        head: 'Prof. Anita Desai',
        focus: ['IoT & Embedded Systems', 'Distributed Systems', 'Edge AI'],
      },
      {
        name: 'Civil & Environmental Engineering',
        head: 'Prof. K. Raman',
        focus: ['Groundwater Chemistry', 'Adsorption Filtration', 'Hydraulic Modeling'],
      },
      {
        name: 'Center for Technology Alternatives for Rural Areas (CTARA)',
        head: 'Prof. S. Joshi',
        focus: ['Rural Water Access', 'Renewable Agro-Energy', 'Community Systems'],
      },
    ],
    teams: [
      {
        name: 'AquaTech Innovators',
        members: 6,
        lead: 'Arun Kumar',
        focus: 'Groundwater Arsenic & Fluoride Remediation',
        status: 'DEPLOYED & CERTIFIED',
      },
      {
        name: 'WasteWise Core',
        members: 5,
        lead: 'Sneha Joshi',
        focus: 'Municipal Solid Waste Automated Route Optimization',
        status: 'PILOT ACTIVE',
      },
      {
        name: 'HydroGrid Bombay',
        members: 4,
        lead: 'Vikram Mehta',
        focus: 'Urban Stormwater Drainage Level Monitoring',
        status: 'PROTOTYPE',
      },
    ],
    projects: [
      {
        title: 'Nashik Groundwater Contamination & IoT Remediation',
        status: 'DEPLOYED',
        partner: 'Jal Jeevan Mission & Wipro EcoEnergy',
        impact: '2,500+ residents provided clean drinking water; -78% fluoride',
      },
      {
        title: 'Municipal Solid Waste Bin Sensors — Aurangabad',
        status: 'ACTIVE PILOT',
        partner: 'Smart City Solutions',
        impact: '42 smart bin nodes deployed across 2 pilot wards',
      },
    ],
    faculty: [
      {
        name: 'Prof. Anita Desai',
        designation: 'Professor, Environmental & Computer Engineering',
        specialization: 'IoT Water Sensors, Electrochemical Remediation',
        email: 'prof.desai@iitb.ac.in',
      },
      {
        name: 'Dr. Sameer Kulkarni',
        designation: 'Associate Professor, Electrical Engineering',
        specialization: 'Low-power LoRaWAN telemetry and solar micro-grids',
        email: 's.kulkarni@iitb.ac.in',
      },
    ],
  },
  'iit-delhi': {
    id: 'univ-iitd',
    slug: 'iit-delhi',
    name: 'Indian Institute of Technology Delhi',
    shortName: 'IIT Delhi',
    city: 'Hauz Khas, New Delhi',
    state: 'Delhi NCR',
    ranking: 2,
    established: 1961,
    description:
      'IIT Delhi pioneers national environmental policy integration, low-cost atmospheric aerosol telemetry, and emergency public health dispatch systems under SIH 2026.',
    expertise: ['Air Quality Modeling', 'Aerosol Tech', 'Public Policy Tech', 'Bio-Medical Sensing', 'Data Science'],
    stats: {
      problemsSolved: 21,
      activeTeams: 6,
      deployments: 3,
      facultyMentors: 5,
      totalScore: 780,
      citizensImpacted: 135000,
    },
    departments: [
      {
        name: 'Centre for Atmospheric Sciences',
        head: 'Prof. Vikram Gupta',
        focus: ['Aerosol Dynamics', 'Micro-climate modeling', 'Pollutant Trajectory'],
      },
      {
        name: 'Department of Computer Science',
        head: 'Prof. R. Sharma',
        focus: ['Predictive Machine Learning', 'Distributed Mobile Alerting'],
      },
    ],
    teams: [
      {
        name: 'AirGuard Lab',
        members: 6,
        lead: 'Meera Nair',
        focus: 'Hyperlocal PM2.5 Grid & Predictive Alerting',
        status: 'DEPLOYED & CERTIFIED',
      },
      {
        name: 'ResilientTransit',
        members: 4,
        lead: 'Rohan Malhotra',
        focus: 'Bus Rapid Transit AI Congestion Diverter',
        status: 'PILOT ACTIVE',
      },
    ],
    projects: [
      {
        title: 'Hyperlocal Air Quality Warning Network — Delhi Industrial Corridor',
        status: 'DEPLOYED',
        partner: 'Tata Consultancy Services',
        impact: '120,000+ residents covered by 48h advance warning app',
      },
    ],
    faculty: [
      {
        name: 'Prof. Vikram Gupta',
        designation: 'Chair Professor, Atmospheric Sciences',
        specialization: 'Aerosol Transport, Environmental Policy',
        email: 'prof.gupta@iitd.ac.in',
      },
    ],
  },
  'bits-pilani': {
    id: 'univ-bits',
    slug: 'bits-pilani',
    name: 'Birla Institute of Technology & Science Pilani',
    shortName: 'BITS Pilani',
    city: 'Pilani & Goa Campuses',
    state: 'Rajasthan',
    ranking: 3,
    established: 1964,
    description:
      'BITS Pilani leverages cross-campus collaborative student laboratories specializing in public health analytics, queue optimization in government civil hospitals, and decentralized solar cold storage.',
    expertise: ['Healthcare Systems', 'Environmental Engineering', 'Renewable Energy', 'Data Analytics'],
    stats: {
      problemsSolved: 16,
      activeTeams: 5,
      deployments: 2,
      facultyMentors: 4,
      totalScore: 590,
      citizensImpacted: 18500,
    },
    departments: [
      {
        name: 'Computer Science & Information Systems',
        head: 'Dr. Ravi Krishna',
        focus: ['Health IT', 'Operations Research', 'Decentralized Applications'],
      },
    ],
    teams: [
      {
        name: 'HealthBridge Team',
        members: 5,
        lead: 'Divya Patel',
        focus: 'District Hospital OPD Queue & Tele-Triage',
        status: 'DEPLOYED & CERTIFIED',
      },
    ],
    projects: [
      {
        title: 'District Civil Hospital OPD Digital Queue System',
        status: 'DEPLOYED',
        partner: 'HealthFirst Foundation',
        impact: '8,000 patients/day; wait time reduced from 5.5h to 48 mins',
      },
    ],
    faculty: [
      {
        name: 'Dr. Ravi Krishna',
        designation: 'Associate Professor, Computer Science',
        specialization: 'Healthcare Informatics & AI Queueing Models',
        email: 'prof.krishna@bits.ac.in',
      },
    ],
  },
  'nit-trichy': {
    id: 'univ-nitt',
    slug: 'nit-trichy',
    name: 'National Institute of Technology Tiruchirappalli',
    shortName: 'NIT Trichy',
    city: 'Tiruchirappalli',
    state: 'Tamil Nadu',
    ranking: 5,
    established: 1964,
    description:
      'NIT Trichy is renowned for coastal disaster telemetry, river hydrology monitoring, and municipal flood early warning networks along the Bay of Bengal.',
    expertise: ['Civil & Structural Engineering', 'Hydrology & Coastal Defense', 'Transportation Systems', 'GIS'],
    stats: {
      problemsSolved: 14,
      activeTeams: 4,
      deployments: 2,
      facultyMentors: 4,
      totalScore: 510,
      citizensImpacted: 28000,
    },
    departments: [
      {
        name: 'Department of Civil Engineering',
        head: 'Dr. Suresh Menon',
        focus: ['Hydraulic Structures', 'Coastal Flooding', 'Remote Sensing'],
      },
    ],
    teams: [
      {
        name: 'FloodShield Ops',
        members: 5,
        lead: 'Rahul Singh',
        focus: 'River Level Automated Early Warning Network',
        status: 'FIELD DEPLOYED',
      },
    ],
    projects: [
      {
        title: 'Automated Flash Flood Early Warning System — Kendrapara Coast',
        status: 'DEPLOYED',
        partner: 'State Disaster Management Authority',
        impact: '12,000 villagers secured with 6h advance siren telemetry',
      },
    ],
    faculty: [
      {
        name: 'Dr. Suresh Menon',
        designation: 'Professor, Civil & Hydrology',
        specialization: 'Disaster Warning Systems, River Hydraulics',
        email: 'prof.menon@nitt.edu',
      },
    ],
  },
  'iiit-hyderabad': {
    id: 'univ-iiith',
    slug: 'iiit-hyderabad',
    name: 'International Institute of Information Technology Hyderabad',
    shortName: 'IIIT Hyderabad',
    city: 'Gachibowli, Hyderabad',
    state: 'Telangana',
    ranking: 7,
    established: 1998,
    description:
      'IIIT Hyderabad leads India in research on computer vision for agriculture, drone vegetation indices, and edge intelligence for smallholder farmers.',
    expertise: ['Machine Learning', 'Computer Vision', 'Smart Agriculture', 'NLP', 'Drone Telemetry'],
    stats: {
      problemsSolved: 18,
      activeTeams: 5,
      deployments: 3,
      facultyMentors: 5,
      totalScore: 690,
      citizensImpacted: 22000,
    },
    departments: [
      {
        name: 'Center for Machine Learning & Vision',
        head: 'Dr. P. Narayanan',
        focus: ['Deep Learning for Crops', 'Edge Microcontrollers', 'Spectral Imaging'],
      },
    ],
    teams: [
      {
        name: 'FarmSense AI',
        members: 5,
        lead: 'Karthik Rajan',
        focus: 'Precision Micro-Irrigation for Cotton Farmers',
        status: 'DEPLOYED & CERTIFIED',
      },
    ],
    projects: [
      {
        title: 'Vidarbha Cotton Belt AI Precision Irrigation',
        status: 'DEPLOYED',
        partner: 'AgriBridge Technologies',
        impact: '3,800 farmers saved from drought; crop yield doubled',
      },
    ],
    faculty: [
      {
        name: 'Dr. C. V. Jawahar',
        designation: 'Professor, Machine Learning Lab',
        specialization: 'Computer Vision for Indian Agronomy',
        email: 'jawahar@iiit.ac.in',
      },
    ],
  },
}

export default function UniversityDetailPage() {
  const params = useParams()
  const router = useRouter()
  const rawId = (params?.id as string) || 'iit-bombay'
  const cleanId = rawId.toLowerCase()

  // Match by slug or id substring
  const univ =
    detailedUniversities[cleanId] ||
    Object.values(detailedUniversities).find(
      (u) =>
        u.slug.includes(cleanId) ||
        u.id.includes(cleanId) ||
        cleanId.includes(u.slug) ||
        cleanId.includes('iit')
    ) ||
    detailedUniversities['iit-bombay']

  const [isConnectModalOpen, setConnectModalOpen] = useState(false)
  const [problemDescription, setProblemDescription] = useState('')
  const [senderName, setSenderName] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleConnectSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
    setTimeout(() => {
      setConnectModalOpen(false)
      setIsSubmitted(false)
      setProblemDescription('')
      toast.success('Partnership Request Dispatched!', {
        description: `Institutional match request routed to ${univ.shortName} Faculty Dean and Innovation Cell.`,
      })
    }, 600)
  }

  return (
    <AppShell>
      <div className="space-y-8 pb-16">
        {/* Back Link */}
        <div>
          <Link
            href="/universities"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Universities Directory
          </Link>
        </div>

        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-blue-500/30 bg-gradient-to-r from-[#0d162d] via-[#101934] to-[#0a1024] p-6 sm:p-10 shadow-[0_0_50px_rgba(37,99,235,0.15)]">
          <div className="absolute top-0 right-0 h-64 w-64 bg-blue-500/10 blur-[90px] pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1 rounded-md bg-yellow-500/20 border border-yellow-500/30 px-2.5 py-0.5 text-xs font-bold text-yellow-300">
                  <Trophy className="h-3.5 w-3.5" />
                  NIRF Rank #{univ.ranking}
                </span>
                <span className="rounded-md bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 text-xs font-bold text-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Government Verified Hub
                </span>
                <span className="text-xs text-slate-400 font-mono">Est. {univ.established}</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                {univ.name}
              </h1>

              <p className="flex items-center gap-1.5 text-sm text-cyan-300">
                <MapPin className="h-4 w-4" />
                {univ.city}, {univ.state}
              </p>

              <p className="text-sm text-slate-300 leading-relaxed pt-1">
                {univ.description}
              </p>

              {/* Expertise chips */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {univ.expertise.map((exp) => (
                  <span
                    key={exp}
                    className="rounded-full bg-blue-950/60 border border-blue-500/30 px-3 py-0.5 text-xs font-medium text-cyan-200"
                  >
                    {exp}
                  </span>
                ))}
              </div>
            </div>

            {/* Action button */}
            <div className="shrink-0">
              <button
                onClick={() => setConnectModalOpen(true)}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition-all active:scale-95"
              >
                <Sparkles className="h-4 w-4" />
                Propose Societal Challenge
              </button>
            </div>
          </div>
        </div>

        {/* 5 Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4 text-center backdrop-blur-md">
            <div className="text-2xl font-black text-white">{univ.stats.problemsSolved}</div>
            <div className="text-[11px] text-slate-400 font-medium uppercase mt-1">
              Problems Solved
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4 text-center backdrop-blur-md">
            <div className="text-2xl font-black text-blue-400">{univ.stats.activeTeams}</div>
            <div className="text-[11px] text-slate-400 font-medium uppercase mt-1">
              Active Student Teams
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4 text-center backdrop-blur-md">
            <div className="text-2xl font-black text-emerald-400">{univ.stats.deployments}</div>
            <div className="text-[11px] text-slate-400 font-medium uppercase mt-1">
              Field Deployments
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4 text-center backdrop-blur-md">
            <div className="text-2xl font-black text-purple-400">{univ.stats.facultyMentors}</div>
            <div className="text-[11px] text-slate-400 font-medium uppercase mt-1">
              Faculty Mentors
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 rounded-xl border border-yellow-500/20 bg-yellow-950/10 p-4 text-center backdrop-blur-md">
            <div className="text-2xl font-black text-yellow-400">{univ.stats.totalScore}</div>
            <div className="text-[11px] text-yellow-300 font-medium uppercase mt-1">
              Institutional Score
            </div>
          </div>
        </div>

        {/* Two-Column: Connected Teams & Flagship Deployments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Connected Student Teams */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-6 backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-400" />
                Connected Student Teams
              </h2>
              <span className="text-xs text-slate-400 font-mono">
                {univ.teams.length} Active Squads
              </span>
            </div>

            <div className="space-y-3">
              {univ.teams.map((t, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-white/5 bg-slate-950/50 p-4 hover:border-white/10 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-bold text-white text-sm">{t.name}</div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        Team Lead: <strong className="text-slate-300">{t.lead}</strong> • {t.members} Engineers
                      </div>
                    </div>
                    <span className="rounded bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                      {t.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mt-2 font-medium">
                    Focus: {t.focus}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Flagship Projects */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-6 backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FolderKanban className="h-4 w-4 text-cyan-400" />
                Flagship Deployments
              </h2>
              <span className="text-xs text-slate-400 font-mono">Verified Field Impact</span>
            </div>

            <div className="space-y-3">
              {univ.projects.map((proj, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-white/5 bg-slate-950/50 p-4 hover:border-cyan-500/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-bold text-white text-sm">{proj.title}</div>
                    <span className="rounded-full bg-blue-500/20 border border-blue-500/30 px-2.5 py-0.5 text-[10px] font-bold text-cyan-300">
                      {proj.status}
                    </span>
                  </div>

                  <div className="mt-2 text-xs text-slate-400">
                    Partner: <span className="text-slate-200 font-semibold">{proj.partner}</span>
                  </div>

                  <div className="mt-2 rounded-lg bg-emerald-950/20 border border-emerald-500/20 p-2 text-xs text-emerald-300 font-medium">
                    🌟 {proj.impact}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Departments & Faculty Mentors */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Departments */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-6 backdrop-blur-xl space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-white/5 pb-4">
              <Building className="h-4 w-4 text-purple-400" />
              Specialized Departments & Research Labs
            </h2>

            <div className="space-y-3">
              {univ.departments.map((dept, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-950/50 border border-white/5">
                  <div className="font-bold text-white text-sm">{dept.name}</div>
                  <div className="text-xs text-slate-400 mt-0.5">Dean/Head: {dept.head}</div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {dept.focus.map((f) => (
                      <span
                        key={f}
                        className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Faculty Mentors */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-6 backdrop-blur-xl space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-white/5 pb-4">
              <GraduationCap className="h-4 w-4 text-emerald-400" />
              Faculty Research Mentors
            </h2>

            <div className="space-y-3">
              {univ.faculty.map((f, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-950/50 border border-white/5">
                  <div className="font-bold text-white text-sm">{f.name}</div>
                  <div className="text-xs text-emerald-400">{f.designation}</div>
                  <p className="text-xs text-slate-300 mt-1">Research Focus: {f.specialization}</p>
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
                    <Mail className="h-3 w-3 text-slate-500" />
                    {f.email}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal for Propose Challenge / Connect */}
        {isConnectModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-2xl border border-blue-500/30 bg-slate-900 p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-400" />
                  Propose Challenge to {univ.shortName}
                </h3>
                <button
                  onClick={() => setConnectModalOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleConnectSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Your Name / Organization
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pune Municipal Corporation / Jal NGO"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-800 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Societal Challenge Summary & Location
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe the urgent problem, affected population count, and technical skills needed..."
                    value={problemDescription}
                    onChange={(e) => setProblemDescription(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-800 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setConnectModalOpen(false)}
                    className="rounded-xl px-4 py-2 text-xs text-slate-300 hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitted}
                    className="flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2 text-xs font-bold text-white transition-all disabled:opacity-50"
                  >
                    <Send className="h-3.5 w-3.5" />
                    Dispatch to Innovation Cell
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  )
}
