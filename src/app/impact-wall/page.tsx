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
  CheckCircle2,
  Calendar,
  Building,
  ArrowRight,
  Share2,
  ShieldCheck,
  MapPin,
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface ImpactCardData {
  id: string
  title: string
  category: 'Water' | 'Agriculture' | 'Air Quality' | 'Health'
  location: string
  district: string
  state: string
  university: string
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
        label: 'Groundwater Canal Drawdown',
        before: '14,000 L/acre',
        after: '6,200 L/acre',
        improvement: '-56% Water Saved',
        unit: 'Liters',
      },
      {
        label: 'Crop Loss Incidents due to Heat Spikes',
        before: '62%',
        after: '9%',
        improvement: '-85% Risk Reduction',
        unit: 'loss rate',
      },
    ],
    tags: ['Edge AI', 'Precision Irrigation', 'Soil Telemetry', 'Zero Hunger SDG 2'],
  },
  {
    id: 'impact-03',
    title: 'Industrial Corridor Micro-Particulate Air Quality Telemetry',
    category: 'Air Quality',
    location: 'Anand Vihar & Okhla Phase II, 14 Wards',
    district: 'New Delhi',
    state: 'Delhi NCR',
    university: 'IIT Delhi',
    teamName: 'AirGuard Lab',
    partner: 'Delhi Pollution Control Committee & TCS Lab',
    certificateId: 'cert-delhi-003',
    summary:
      'Dense grid of 48 solar optical particle counters tracking localized PM2.5 and PM10 hotspots, paired with automated street-level mist cannons triggered by edge AI inference.',
    quote: {
      text: 'Having ward-level street telemetry allowed municipal teams to suppress dust storms within 12 minutes of trigger.',
      author: 'Sunil Aggarwal',
      designation: 'Assistant Environmental Engineer, DPCC',
    },
    deploymentDate: 'November 2025',
    beforeAfterMetrics: [
      {
        label: 'Local Acute PM2.5 Exposure Index',
        before: '380 µg/m³',
        after: '115 µg/m³',
        improvement: '-70% Peak Drop',
        unit: 'µg/m³',
      },
      {
        label: 'Municipal Hotspot Reaction Time',
        before: '4.5 hours',
        after: '12 minutes',
        improvement: '22x Faster Response',
        unit: 'minutes',
      },
      {
        label: 'Respiratory OPD Visits (Anand Vihar)',
        before: '420 / week',
        after: '160 / week',
        improvement: '-62% Hospital Load',
        unit: 'patients/wk',
      },
      {
        label: 'Citizen High-Risk Alerts Sent',
        before: '0 (None)',
        after: '28,400+',
        improvement: 'Full Ward Telemetry',
        unit: 'residents',
      },
    ],
    tags: ['Optical PM2.5', 'Automated Mist Cannons', 'Edge AI', 'Climate SDG 13'],
  },
  {
    id: 'impact-04',
    title: 'Rural PHC Rapid Digital Triage & Diagnostic Pipeline',
    category: 'Health',
    location: 'Dharwad Rural Primary Health Centers (4 Centers)',
    district: 'Dharwad',
    state: 'Karnataka',
    university: 'BITS Pilani',
    teamName: 'HealthBridge Core',
    partner: 'National Rural Health Mission & Apollo Civic',
    certificateId: 'cert-dharwad-004',
    summary:
      'Low-power portable vitals capture units with offline-first predictive triage AI for rural ASHAs and ANMs, directly connected to district hospital tele-consultation.',
    quote: {
      text: 'Our mothers no longer travel 40 kilometers on unpaved roads just to find out if high blood pressure requires emergency admission.',
      author: 'Dr. Radhika Kulkarni',
      designation: 'Medical Officer, Dharwad Rural PHC',
    },
    deploymentDate: 'January 2026',
    beforeAfterMetrics: [
      {
        label: 'Average Patient Wait to Triage',
        before: '180 mins',
        after: '14 mins',
        improvement: '92% Time Saved',
        unit: 'minutes',
      },
      {
        label: 'Maternal Tele-Consultation Turnaround',
        before: '3 days',
        after: '45 mins',
        improvement: '96x Faster Access',
        unit: 'hours',
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
      toast.success('Link copied to clipboard!')
    }
  }

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto space-y-8 pb-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold text-blue-400 uppercase tracking-wider">
                EMPIRICAL TELEMETRY
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-[11px] font-mono text-slate-400">ON-GROUND VERIFICATION</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
              Societal Impact Wall
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              Real-world societal challenges solved by multidisciplinary university engineering teams, field-deployed in municipal districts, and verified through empirical sensor data.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/certificates"
              className="rounded border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Award className="h-3.5 w-3.5 text-amber-400" />
              <span>Verify Credentials</span>
            </Link>
          </div>
        </div>

        {/* 4 Headline Metrics (Restrained, Crisp) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded border border-slate-800 bg-[#0f131a] p-4 space-y-1">
            <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
              <Droplet className="h-3 w-3 text-blue-400" />
              <span>SDG 6 • WATER</span>
            </div>
            <div className="text-2xl font-bold text-white tracking-tight">2,500+</div>
            <div className="text-xs font-semibold text-slate-200">Nashik Villagers</div>
            <div className="text-[11px] text-slate-400">Fluoride reduced 78% to WHO standards</div>
          </div>

          <div className="rounded border border-slate-800 bg-[#0f131a] p-4 space-y-1">
            <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
              <Sprout className="h-3 w-3 text-emerald-400" />
              <span>SDG 2 • AGRI</span>
            </div>
            <div className="text-2xl font-bold text-white tracking-tight">3,800+</div>
            <div className="text-xs font-semibold text-slate-200">Vidarbha Farmers</div>
            <div className="text-[11px] text-slate-400">Micro-irrigation cut water drawdown by 56%</div>
          </div>

          <div className="rounded border border-slate-800 bg-[#0f131a] p-4 space-y-1">
            <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
              <Wind className="h-3 w-3 text-purple-400" />
              <span>SDG 13 • CLIMATE</span>
            </div>
            <div className="text-2xl font-bold text-white tracking-tight">120,000+</div>
            <div className="text-xs font-semibold text-slate-200">Delhi Citizens</div>
            <div className="text-[11px] text-slate-400">48-hour advance PM2.5 predictive alerts</div>
          </div>

          <div className="rounded border border-slate-800 bg-[#0f131a] p-4 space-y-1">
            <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-emerald-400" />
              <span>NATIONAL AVERAGE</span>
            </div>
            <div className="text-2xl font-bold text-emerald-400 tracking-tight">87%</div>
            <div className="text-xs font-semibold text-slate-200">Pollutant Reduction</div>
            <div className="text-[11px] text-slate-400">Average improvement across 64 deployments</div>
          </div>
        </div>

        {/* Domain Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div className="flex flex-wrap items-center gap-1">
            {['ALL', 'Water', 'Agriculture', 'Air Quality', 'Health'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  'rounded px-3 py-1 text-xs font-medium transition-colors',
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                )}
              >
                {cat === 'ALL' ? 'All Deployments' : cat}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-500 font-mono">
            {filteredProjects.length} Verified Field Deployments
          </div>
        </div>

        {/* Deployed Project Cards with BEFORE vs AFTER Matrix */}
        <div className="space-y-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="rounded-lg border border-slate-800 bg-[#0f131a] p-6 space-y-5"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-800/80 pb-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-mono text-[10px] font-bold text-blue-400 uppercase">
                      {project.category}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-400">{project.location}, {project.state}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-500 font-mono">Deployed {project.deploymentDate}</span>
                    <span className="text-slate-600">•</span>
                    <span className="font-mono text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      FIELD VERIFIED
                    </span>
                  </div>

                  <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                    {project.title}
                  </h2>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                    <span>
                      University: <strong className="text-slate-200">{project.university}</strong>
                    </span>
                    <span className="text-slate-600">•</span>
                    <span>
                      Team: <strong className="text-slate-200">{project.teamName}</strong>
                    </span>
                    <span className="text-slate-600">•</span>
                    <span>
                      Partner: <strong className="text-slate-200">{project.partner}</strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleShare(project.title)}
                    className="rounded border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-1"
                  >
                    <Share2 className="h-3 w-3" />
                    <span>Share</span>
                  </button>

                  <Link
                    href={`/verify/${project.certificateId}`}
                    className="rounded bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 text-xs font-semibold transition-colors flex items-center gap-1"
                  >
                    <Award className="h-3 w-3" />
                    <span>Verify Credential</span>
                  </Link>
                </div>
              </div>

              {/* Narrative Summary */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-4xl">
                {project.summary}
              </p>

              {/* Citizen Quote */}
              <div className="border-l-2 border-slate-700 pl-3 py-0.5 text-xs text-slate-400 italic">
                &ldquo;{project.quote.text}&rdquo;
                <div className="text-slate-500 font-normal not-italic mt-1">
                  — {project.quote.author}, {project.quote.designation}
                </div>
              </div>

              {/* BEFORE vs AFTER Metrics Matrix (Section #21) */}
              <div className="space-y-2 pt-2">
                <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Empirical Before vs. After Ground Truth Verification</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {project.beforeAfterMetrics.map((metric, idx) => (
                    <div
                      key={idx}
                      className="rounded border border-slate-800/80 bg-slate-950/60 p-3 space-y-2"
                    >
                      <div className="text-xs font-semibold text-slate-300 truncate" title={metric.label}>
                        {metric.label}
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        {/* BEFORE */}
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-mono text-rose-400 block font-semibold">
                            BEFORE
                          </span>
                          <span className="text-sm font-bold font-mono text-slate-400 line-through">
                            {metric.before}
                          </span>
                        </div>

                        <ArrowRight className="h-3.5 w-3.5 text-slate-600 shrink-0" />

                        {/* AFTER */}
                        <div className="space-y-0.5 text-right">
                          <span className="text-[10px] font-mono text-emerald-400 block font-semibold">
                            AFTER
                          </span>
                          <span className="text-sm font-bold font-mono text-emerald-400">
                            {metric.after}
                          </span>
                        </div>
                      </div>

                      <div className="text-[10px] font-mono text-emerald-300/90 font-medium pt-1 border-t border-slate-800">
                        {metric.improvement}
                      </div>
                    </div>
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
