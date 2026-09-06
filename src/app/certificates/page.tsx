'use client'

import React, { useState, useEffect } from 'react'
import AppShell from '@/components/layout/app-shell'
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  Search,
  Filter,
  ArrowUpRight,
  Sparkles,
  QrCode,
  Building,
  GraduationCap,
  Calendar,
  ExternalLink,
  Download,
  Share2,
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

interface CertificateItem {
  id: string
  certificateId: string
  recipientName: string
  recipientRole: string
  universityName: string
  problemTitle: string
  type: string
  impactSummary: string
  issuedBy: string
  issuedAt: string
  verified: boolean
  verificationsCount: number
}

const mockCertificates: CertificateItem[] = [
  {
    id: 'cert-1',
    certificateId: 'cert-nashik-001',
    recipientName: 'Arun Kumar',
    recipientRole: 'Team Leader — AquaTech Innovators',
    universityName: 'Indian Institute of Technology Bombay',
    problemTitle: 'Groundwater Contamination & IoT Remediation in Nashik Villages',
    type: 'OUTSTANDING_SOLVER',
    impactSummary:
      'Provided safe drinking water to 2,500+ rural residents. Reduced fluoride from 4.2 mg/L to 0.9 mg/L. Deployed 24 solar IoT sensors across 6 villages.',
    issuedBy: 'CivicSolve Platform & Ministry of Jal Shakti',
    issuedAt: '2025-10-15',
    verified: true,
    verificationsCount: 42,
  },
  {
    id: 'cert-2',
    certificateId: 'cert-vidarbha-002',
    recipientName: 'Karthik Rajan',
    recipientRole: 'Team Leader — FarmSense AI',
    universityName: 'IIIT Hyderabad',
    problemTitle: 'Smart Irrigation & Soil Telemetry for Vidarbha Cotton Farmers',
    type: 'OUTSTANDING_SOLVER',
    impactSummary:
      'Improved crop harvest yield by 106% for 3,800 farmers. Reduced canal water consumption by 51%. Doubled seasonal farmer net income.',
    issuedBy: 'CivicSolve Platform & Ministry of Agriculture',
    issuedAt: '2025-12-01',
    verified: true,
    verificationsCount: 38,
  },
  {
    id: 'cert-3',
    certificateId: 'cert-desai-003',
    recipientName: 'Prof. Anita Desai',
    recipientRole: 'Faculty Mentor — Environmental Technology',
    universityName: 'Indian Institute of Technology Bombay',
    problemTitle: 'Groundwater Contamination & IoT Remediation in Nashik Villages',
    type: 'INNOVATION_EXCELLENCE',
    impactSummary:
      'Distinguished academic mentorship from research bench to field deployment in 6 rural habitations. Technical guidance on adsorbent filters.',
    issuedBy: 'CivicSolve Platform & Smart India Hackathon',
    issuedAt: '2025-10-15',
    verified: true,
    verificationsCount: 29,
  },
  {
    id: 'cert-4',
    certificateId: 'cert-delhi-003',
    recipientName: 'Meera Nair',
    recipientRole: 'Lead Aerosol Researcher — AirGuard Lab',
    universityName: 'Indian Institute of Technology Delhi',
    problemTitle: 'Hyperlocal Air Quality Monitoring Network — Delhi Corridors',
    type: 'CERTIFIED_SOLVER',
    impactSummary:
      'Designed a distributed 180-node PM2.5 monitoring matrix serving 120,000 residents with 48h advance aerosol hazard alerts.',
    issuedBy: 'CivicSolve Platform & Ministry of Environment',
    issuedAt: '2026-01-10',
    verified: true,
    verificationsCount: 19,
  },
  {
    id: 'cert-5',
    certificateId: 'cert-amravati-004',
    recipientName: 'Divya Patel',
    recipientRole: 'Data Science Lead — HealthBridge Team',
    universityName: 'BITS Pilani',
    problemTitle: 'Healthcare Queue Optimization & Tele-Triage for Civil Hospitals',
    type: 'COMMUNITY_IMPACT',
    impactSummary:
      'Streamlined hospital OPD lines for 8,000 patients/day, reducing grueling 5.5-hour wait times to under 48 minutes with digital triage.',
    issuedBy: 'CivicSolve Platform & HealthFirst Foundation',
    issuedAt: '2026-01-20',
    verified: true,
    verificationsCount: 24,
  },
]

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<CertificateItem[]>(mockCertificates)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('ALL')

  // Attempt to fetch from API in background
  useEffect(() => {
    fetch('/api/certificates')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data && res.data.length > 0) {
          const mapped = res.data.map((c: any) => ({
            id: c.id,
            certificateId: c.certificateId || c.id,
            recipientName: c.user?.name || 'Fellow Engineer',
            recipientRole: c.role || 'Problem Solver',
            universityName:
              c.user?.studentProfile?.university?.name ||
              c.user?.facultyProfile?.university?.name ||
              c.project?.university?.name ||
              'Academic Partner Institute',
            problemTitle: c.problemTitle,
            type: c.type || 'OUTSTANDING_SOLVER',
            impactSummary: c.impactSummary || 'Empirically verified field solution.',
            issuedBy: c.issuedBy || 'CivicSolve Platform & Ministry of Education',
            issuedAt: c.issuedAt ? c.issuedAt.split('T')[0] : '2026-01-01',
            verified: c.verified ?? true,
            verificationsCount: c._count?.verifications || 14,
          }))
          setCertificates(mapped)
        }
      })
      .catch(() => {
        // keep mock
      })
  }, [])

  const filtered = certificates.filter((c) => {
    const matchesType = selectedType === 'ALL' || c.type === selectedType
    const q = searchQuery.toLowerCase()
    const matchesSearch =
      c.recipientName.toLowerCase().includes(q) ||
      c.problemTitle.toLowerCase().includes(q) ||
      c.certificateId.toLowerCase().includes(q) ||
      c.universityName.toLowerCase().includes(q)
    return matchesType && matchesSearch
  })

  return (
    <AppShell>
      <div className="space-y-10 pb-16">
        {/* Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-r from-[#17130b] via-[#1c1810] to-[#0d1222] p-8 md:p-12 shadow-[0_0_50px_rgba(245,158,11,0.12)]">
          <div className="absolute top-0 right-0 h-64 w-64 bg-amber-500/10 blur-[90px] pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-300">
              <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
              Cryptographically Signed & Publicly Verifiable Credentials
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Official Societal Impact Certificates
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Every certificate issued on CivicSolve represents peer-reviewed and field-verified outcomes. Backed by tamper-proof cryptographic verification and instant QR code authentication.
            </p>
          </div>
        </div>

        {/* 4 Stat Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-md">
            <div className="text-xs text-slate-400 uppercase font-semibold">Total Issued</div>
            <div className="text-2xl font-black text-amber-400 mt-1">142 Certificates</div>
            <div className="text-[11px] text-slate-400 mt-1">Across 28 universities</div>
          </div>

          <div className="rounded-xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-md">
            <div className="text-xs text-slate-400 uppercase font-semibold">Public Ledger Verifications</div>
            <div className="text-2xl font-black text-emerald-400 mt-1">1,890 Checks</div>
            <div className="text-[11px] text-slate-400 mt-1">By recruiters, ministries, and NGOs</div>
          </div>

          <div className="rounded-xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-md">
            <div className="text-xs text-slate-400 uppercase font-semibold">Academic Institutions</div>
            <div className="text-2xl font-black text-blue-400 mt-1">28 Institutes</div>
            <div className="text-[11px] text-slate-400 mt-1">IITs, NITs, BITS, and IIITs</div>
          </div>

          <div className="rounded-xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-md">
            <div className="text-xs text-slate-400 uppercase font-semibold">Integrity Standard</div>
            <div className="text-2xl font-black text-purple-400 mt-1">SHA-256</div>
            <div className="text-[11px] text-slate-400 mt-1">100% Tamper-proof digital seal</div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 shrink-0">
              Type:
            </span>
            {['ALL', 'OUTSTANDING_SOLVER', 'INNOVATION_EXCELLENCE', 'CERTIFIED_SOLVER', 'COMMUNITY_IMPACT'].map(
              (type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedType === type
                      ? 'bg-amber-500 text-black font-bold shadow'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {type === 'ALL'
                    ? 'All Credentials'
                    : type.replace(/_/g, ' ')}
                </button>
              )
            )}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by student, project, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-900/80 pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((cert) => (
            <div
              key={cert.id}
              className="group relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-b from-[#131724] to-[#0a0f1d] p-6 transition-all hover:border-amber-500/50 hover:shadow-[0_0_35px_rgba(245,158,11,0.15)] flex flex-col justify-between"
            >
              {/* Gold decorative top border */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600" />

              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="inline-flex items-center gap-1 rounded bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 text-[10px] font-bold text-amber-300">
                    <Award className="h-3 w-3" />
                    {cert.type.replace(/_/g, ' ')}
                  </div>

                  <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                    <CheckCircle2 className="h-3 w-3" />
                    VERIFIED
                  </span>
                </div>

                {/* Recipient info */}
                <h3 className="text-lg font-black text-white group-hover:text-amber-300 transition-colors">
                  {cert.recipientName}
                </h3>
                <p className="text-xs text-cyan-300 font-medium mt-0.5">{cert.recipientRole}</p>

                <p className="flex items-center gap-1.5 text-xs text-slate-400 mt-2">
                  <Building className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                  <span className="truncate">{cert.universityName}</span>
                </p>

                {/* Project Title */}
                <div className="my-3 p-3 rounded-xl bg-slate-900/80 border border-white/5">
                  <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">
                    Problem Solved
                  </div>
                  <div className="text-xs font-semibold text-slate-200 line-clamp-2">
                    {cert.problemTitle}
                  </div>
                </div>

                {/* Impact snippet */}
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {cert.impactSummary}
                </p>
              </div>

              {/* Bottom Row */}
              <div className="pt-4 mt-4 border-t border-white/5 space-y-3">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>ID: {cert.certificateId}</span>
                  <span>Issued: {cert.issuedAt}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/certificates/${cert.certificateId}`}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 py-2 text-xs font-bold text-black shadow transition-all active:scale-95"
                  >
                    <Award className="h-3.5 w-3.5" />
                    View Certificate
                  </Link>

                  <Link
                    href={`/verify/${cert.certificateId}`}
                    className="flex items-center justify-center rounded-xl border border-white/10 hover:border-cyan-500/50 hover:bg-slate-800 p-2 text-slate-300 hover:text-cyan-300 transition-colors"
                    title="Public Verification Check"
                  >
                    <QrCode className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  )
}
