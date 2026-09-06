'use client'

import React, { useState } from 'react'
import AppShell from '@/components/layout/app-shell'
import {
  TrendingUp,
  Award,
  Users,
  Droplet,
  Sprout,
  Wind,
  HeartPulse,
  ExternalLink,
  CheckCircle2,
  Calendar,
  Building,
  ArrowRight,
  Share2,
  Sparkles,
  ShieldCheck,
  MapPin,
  Flame,
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

interface ImpactCardData {
  id: string
  title: string
  category: 'Water' | 'Agriculture' | 'Air Quality' | 'Health'
  location: string
  district: string
  state: string
  university: string
  universityLogo?: string
  teamName: string
  partner: string
  certificateId: string
  summary: string
  quote: {
    text: string
    author: string
    designation: string
  }
  deploymentDate: string
  beforeAfterMetrics: {
    label: string
    before: string
    after: string
    improvement: string
    unit: string
  }[]
  tags: string[]
}

const impactProjects: ImpactCardData[] = [
  {
    id: 'impact-01',
    title: 'Nashik Groundwater Contamination & IoT Remediation',
    category: 'Water',
    location: 'Sinnar Taluka, 6 Villages',
    district: 'Nashik',
    state: 'Maharashtra',
    university: 'IIT Bombay',
    teamName: 'AquaTech Innovators',
    partner: 'Jal Jeevan Mission NGO & Wipro EcoEnergy',
    certificateId: 'cert-nashik-001',
    summary:
      'Distributed solar-powered IoT filtration units and electro-chemical adsorption systems deployed across 6 rural habitations severely impacted by deep aquifer fluoride and industrial runoff.',
    quote: {
      text: 'For seven years our children suffered bone fluorosis. Today, every tap provides crystal clear water tested hourly by IIT student sensors.',
      author: 'Priya Sharma',
      designation: 'Gram Panchayat Secretary, Sinnar',
    },
    deploymentDate: 'October 2025',
    beforeAfterMetrics: [
      {
        label: 'Fluoride & Arsenic Level',
        before: '4.2 mg/L',
        after: '0.9 mg/L',
        improvement: '-78% (WHO Compliant)',
        unit: 'mg/L',
      },
      {
        label: 'Water Contamination Incidents',
        before: '38 / mo',
        after: '4 / mo',
        improvement: '-89% Reduction',
        unit: 'cases/mo',
      },
      {
        label: 'Households with Safe Water',
        before: '140',
        after: '620',
        improvement: '+342% Coverage',
        unit: 'families',
      },
      {
        label: 'Child Absenteeism due to Water Illness',
        before: '28%',
        after: '3%',
        improvement: '-89% Drop',
        unit: 'school rate',
      },
    ],
    tags: ['IoT Sensors', 'Fluoride Filtration', 'Jal Jeevan Mission', 'Clean Water SDG 6'],
  },
  {
    id: 'impact-02',
    title: 'Vidarbha Cotton Belt AI Precision Irrigation & Soil Intelligence',
    category: 'Agriculture',
    location: 'Yavatmal District, 8 Villages, 320 Farms',
    district: 'Yavatmal',
    state: 'Maharashtra',
    university: 'IIIT Hyderabad',
    teamName: 'FarmSense AI',
    partner: 'AgriBridge Technologies & State Agri Dept',
    certificateId: 'cert-vidarbha-002',
    summary:
      'Edge-computed micro-meteorological stations and subsurface capacitive moisture probes driving automated solar micro-drip scheduling tailored specifically to Vidarbha black-cotton soil.',
    quote: {
      text: 'We went from crop failure every alternating drought to harvesting record yields with half the canal water.',
      author: 'Mohan Kumar',
      designation: 'Progressive Cotton Farmer, Yavatmal',
    },
    deploymentDate: 'December 2025',
    beforeAfterMetrics: [
      {
        label: 'Average Crop Yield Efficiency',
        before: '35%',
        after: '72%',
        improvement: '+106% Yield Boost',
        unit: 'harvest ratio',
      },
      {
        label: 'Seasonal Farmer Net Income',
        before: '₹42,000',
        after: '₹78,000',
        improvement: '+86% Income Growth',
        unit: '₹ per season',
      },
      {
        label: 'Canal & Well Water Usage',
        before: '8,500 L',
        after: '4,200 L',
        improvement: '-51% Water Saved',
        unit: 'liters/acre',
      },
      {
        label: 'Critical Farm Distress Events',
        before: '12 / yr',
        after: '3 / yr',
        improvement: '-75% Decline',
        unit: 'incidents/yr',
      },
    ],
    tags: ['Edge AI', 'Precision Irrigation', 'AgriTech', 'Zero Hunger SDG 2'],
  },
  {
    id: 'impact-03',
    title: 'Delhi Industrial Corridor Hyperlocal Air Quality Warning Grid',
    category: 'Air Quality',
    location: 'Okhla, Anand Vihar & Mayapuri Corridors',
    district: 'South & East Delhi',
    state: 'Delhi NCR',
    university: 'IIT Delhi',
    teamName: 'AirGuard Lab',
    partner: 'Tata Consultancy Services & Delhi Pollution Board',
    certificateId: 'cert-delhi-003',
    summary:
      'A dense matrix of 180 low-cost optical particulate matter sensors paired with micro-wind acoustic sensors delivering predictive 48-hour aerosol trajectory alerts to sensitive communities.',
    quote: {
      text: 'Schools in Anand Vihar now adjust outdoor assemblies according to real-time micro-plume forecasts instead of city-wide delayed estimates.',
      author: 'Dr. Anita Joshi',
      designation: 'Senior Pulmonologist, Delhi NCR',
    },
    deploymentDate: 'January 2026',
    beforeAfterMetrics: [
      {
        label: 'Acute Exposure Warnings Ahead-of-Time',
        before: '0 hours',
        after: '48 hours',
        improvement: 'Predictive Warning',
        unit: 'lead time',
      },
      {
        label: 'Harmful Pollutant Micro-Spikes Tracked',
        before: '18% mapped',
        after: '94% mapped',
        improvement: '+422% Traceability',
        unit: 'hotspot coverage',
      },
      {
        label: 'Citizen Alert App Subscribers',
        before: '0',
        after: '124,000+',
        improvement: 'Hyperlocal Reach',
        unit: 'active citizens',
      },
      {
        label: 'Average Acute Respiratory ER Visits',
        before: '142 / wk',
        after: '88 / wk',
        improvement: '-38% ER Burden',
        unit: 'patients/wk',
      },
    ],
    tags: ['PM2.5 Sensors', 'Aerosol Forecasting', 'Smart Cities', 'Climate SDG 13'],
  },
  {
    id: 'impact-04',
    title: 'Civil Hospital OPD Smart Queue & Tele-Triage System',
    category: 'Health',
    location: 'Amravati District Hospital Complex',
    district: 'Amravati',
    state: 'Maharashtra',
    university: 'BITS Pilani',
    teamName: 'HealthBridge Team',
    partner: 'HealthFirst Foundation',
    certificateId: 'cert-amravati-004',
    summary:
      'Digital token dispensing kiosks, multilingually integrated SMS queue broadcasts, and initial vital tele-triage reducing devastating 6-hour wait times for impoverished patients.',
    quote: {
      text: 'Elderly patients no longer spend the night sitting on cold floors just to get a token slip at sunrise.',
      author: 'Dr. R. Kulkarni',
      designation: 'Medical Superintendent, Civil Hospital',
    },
    deploymentDate: 'February 2026',
    beforeAfterMetrics: [
      {
        label: 'Average OPD Wait Time',
        before: '5.5 hours',
        after: '48 mins',
        improvement: '-85% Wait Reduction',
        unit: 'hours to mins',
      },
      {
        label: 'Daily Patient Throughput',
        before: '650 patients',
        after: '1,280 patients',
        improvement: '+97% Capacity',
        unit: 'patients/day',
      },
      {
        label: 'Patient Dignity & Satisfaction Score',
        before: '22%',
        after: '89%',
        improvement: '+304% Satisfaction',
        unit: 'approval score',
      },
      {
        label: 'High-Risk Cardiac / Sepsis Flagging',
        before: 'Post-consult',
        after: '< 10 mins',
        improvement: 'Instant Triaged',
        unit: 'response time',
      },
    ],
    tags: ['Health IT', 'Triage Automation', 'Rural Healthcare', 'Good Health SDG 3'],
  },
]

export default function ImpactWallPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')

  const filteredProjects = impactProjects.filter((p) => {
    if (selectedCategory === 'ALL') return true
    return p.category === selectedCategory
  })

  const handleShare = (title: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!', {
        description: `Share the verified impact story for "${title.slice(0, 36)}..."`,
      })
    }
  }

  return (
    <AppShell>
      <div className="space-y-10 pb-16">
        {/* Hero Top Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-[#0c1933] via-[#101b38] to-[#0a1124] p-8 md:p-12 shadow-[0_0_60px_rgba(6,182,212,0.15)]">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-blue-600/10 blur-[80px] pointer-events-none" />

          <div className="relative z-10 max-w-4xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-semibold text-cyan-300">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
              Official Verification Wall of Honor • SIH 2026
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
              The CivicSolve Impact Wall
              <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
                Where Code & Engineering Transform Real Lives
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl">
              Every card below represents a real-world societal problem reported by Indian citizens, engineered into working hardware and software by top student teams, and verified in villages and municipal districts.
            </p>
          </div>
        </div>

        {/* 4 Big Headline Stat Banners */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-b from-cyan-950/40 to-slate-900/80 p-6 backdrop-blur-md shadow-lg">
            <div className="flex items-center justify-between text-cyan-400 mb-3">
              <Droplet className="h-6 w-6" />
              <span className="text-[11px] font-mono tracking-wider uppercase text-cyan-300/80">
                SDG 6 • WATER
              </span>
            </div>
            <div className="text-3xl font-black text-white tracking-tight">2,500+</div>
            <div className="text-sm font-semibold text-cyan-200 mt-1">Nashik Villagers</div>
            <p className="text-xs text-slate-400 mt-1.5">
              Provided clean, lab-verified drinking water with 78% reduction in toxic fluoride.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-emerald-950/40 to-slate-900/80 p-6 backdrop-blur-md shadow-lg">
            <div className="flex items-center justify-between text-emerald-400 mb-3">
              <Sprout className="h-6 w-6" />
              <span className="text-[11px] font-mono tracking-wider uppercase text-emerald-300/80">
                SDG 2 • AGRI
              </span>
            </div>
            <div className="text-3xl font-black text-white tracking-tight">3,800+</div>
            <div className="text-sm font-semibold text-emerald-200 mt-1">Vidarbha Farmers</div>
            <p className="text-xs text-slate-400 mt-1.5">
              Protected from crop ruin with AI micro-irrigation, doubling average seasonal income.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-purple-500/30 bg-gradient-to-b from-purple-950/40 to-slate-900/80 p-6 backdrop-blur-md shadow-lg">
            <div className="flex items-center justify-between text-purple-400 mb-3">
              <Wind className="h-6 w-6" />
              <span className="text-[11px] font-mono tracking-wider uppercase text-purple-300/80">
                SDG 13 • CLIMATE
              </span>
            </div>
            <div className="text-3xl font-black text-white tracking-tight">120,000+</div>
            <div className="text-sm font-semibold text-purple-200 mt-1">Delhi Citizens</div>
            <p className="text-xs text-slate-400 mt-1.5">
              Empowered with 48-hour advance predictive alerts on toxic industrial micro-spikes.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-blue-500/30 bg-gradient-to-b from-blue-950/40 to-slate-900/80 p-6 backdrop-blur-md shadow-lg">
            <div className="flex items-center justify-between text-blue-400 mb-3">
              <TrendingUp className="h-6 w-6" />
              <span className="text-[11px] font-mono tracking-wider uppercase text-blue-300/80">
                NATIONAL AVG
              </span>
            </div>
            <div className="text-3xl font-black text-white tracking-tight">87%</div>
            <div className="text-sm font-semibold text-blue-200 mt-1">Pollutant Cut</div>
            <p className="text-xs text-slate-400 mt-1.5">
              Average reduction in severe contaminants across verified pilot and field locations.
            </p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Filter By Domain:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {['ALL', 'Water', 'Agriculture', 'Air Quality', 'Health'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-all ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {cat === 'ALL' ? 'All Deployments' : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="text-xs text-slate-400">
            Showing <span className="font-bold text-white">{filteredProjects.length}</span> verified impact dossiers
          </div>
        </div>

        {/* Deployed Project Cards with BEFORE vs AFTER */}
        <div className="space-y-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-xl p-6 sm:p-8 transition-all hover:border-blue-500/40 hover:shadow-[0_0_40px_rgba(37,99,235,0.15)]"
            >
              {/* Card Header */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/5 pb-6">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="inline-flex items-center gap-1 rounded-md bg-blue-500/20 px-2.5 py-0.5 text-xs font-bold text-blue-300 border border-blue-500/30">
                      {project.category}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                      <MapPin className="h-3.5 w-3.5 text-slate-500" />
                      {project.location}, {project.state}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                      <Calendar className="h-3.5 w-3.5 text-slate-500" />
                      Deployed {project.deploymentDate}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                      <CheckCircle2 className="h-3 w-3" />
                      FIELD VERIFIED
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black text-white group-hover:text-cyan-300 transition-colors">
                    {project.title}
                  </h2>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                    <span className="flex items-center gap-1 text-slate-300">
                      <Building className="h-3.5 w-3.5 text-blue-400" />
                      Academic Lead: <strong className="text-white">{project.university}</strong>
                    </span>
                    <span className="text-slate-400">•</span>
                    <span>
                      Team: <strong className="text-white">{project.teamName}</strong>
                    </span>
                    <span className="text-slate-400">•</span>
                    <span>
                      Partner: <strong className="text-slate-300">{project.partner}</strong>
                    </span>
                  </div>
                </div>

                {/* Top Right Action Links */}
                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <button
                    onClick={() => handleShare(project.title)}
                    className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-800/80 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                  >
                    <Share2 className="h-3.5 w-3.5" />
                    Share
                  </button>

                  <Link
                    href={`/certificates`}
                    className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-xs font-bold text-black shadow-md hover:from-amber-400 hover:to-amber-500 transition-all active:scale-95"
                  >
                    <Award className="h-3.5 w-3.5 text-black" />
                    View Verified Certificate
                  </Link>
                </div>
              </div>

              {/* Solution Summary */}
              <div className="py-4">
                <p className="text-sm text-slate-300 leading-relaxed">
                  {project.summary}
                </p>
              </div>

              {/* BEFORE vs AFTER Metrics Matrix */}
              <div className="my-4">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  Empirical Before vs. After Ground Truth Verification
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {project.beforeAfterMetrics.map((metric, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-white/10 bg-slate-950/60 p-4 relative overflow-hidden"
                    >
                      <div className="text-xs font-semibold text-slate-300 mb-2 truncate" title={metric.label}>
                        {metric.label}
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        {/* BEFORE */}
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-mono uppercase text-rose-400/80 block">
                            BEFORE
                          </span>
                          <span className="text-sm font-bold font-mono text-rose-300 line-through">
                            {metric.before}
                          </span>
                        </div>

                        <ArrowRight className="h-4 w-4 text-slate-600 shrink-0" />

                        {/* AFTER */}
                        <div className="space-y-0.5 text-right">
                          <span className="text-[10px] font-mono uppercase text-emerald-400 block">
                            AFTER
                          </span>
                          <span className="text-base font-black font-mono text-emerald-400">
                            {metric.after}
                          </span>
                        </div>
                      </div>

                      {/* Improvement Badge */}
                      <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Impact Delta:</span>
                        <span className="font-bold text-emerald-300">
                          {metric.improvement}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Citizen Testimonial Quote & Tags */}
              <div className="mt-5 pt-4 border-t border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-800/20 rounded-xl p-4">
                <div className="italic text-xs text-slate-300 flex-1">
                  &ldquo;{project.quote.text}&rdquo;
                  <span className="block not-italic text-slate-400 font-semibold text-[11px] mt-1">
                    — {project.quote.author}, <span className="text-cyan-400">{project.quote.designation}</span>
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-400"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  )
}
