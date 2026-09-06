'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import AppShell from '@/components/layout/app-shell'
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  Printer,
  Download,
  Share2,
  ArrowLeft,
  Sparkles,
  ExternalLink,
  Copy,
  Building,
  Calendar,
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { QRCodeSVG } from 'qrcode.react'

interface CertificateFullData {
  id: string
  certificateId: string
  recipientName: string
  recipientRole: string
  universityName: string
  universityShort: string
  problemTitle: string
  type: string
  impactSummary: string
  issuedBy: string
  issuedAt: string
  verificationHash: string
  signatures: {
    name: string
    title: string
    organization: string
  }[]
}

const fallbackCerts: Record<string, CertificateFullData> = {
  'cert-nashik-001': {
    id: 'cert-1',
    certificateId: 'cert-nashik-001',
    recipientName: 'Arun Kumar',
    recipientRole: 'Team Leader — AquaTech Innovators',
    universityName: 'Indian Institute of Technology Bombay',
    universityShort: 'IIT Bombay',
    problemTitle: 'Groundwater Arsenic & Fluoride Contamination in Nashik Villages',
    type: 'OUTSTANDING_SOLVER',
    impactSummary:
      'Provided safe drinking water to 2,500+ rural villagers across 6 habitations in Sinnar Taluka. Successfully reduced groundwater fluoride from 4.2 mg/L to 0.9 mg/L (WHO standard compliant) through solar-powered IoT electro-chemical adsorption units.',
    issuedBy: 'Ministry of Jal Shakti & Smart India Hackathon 2026',
    issuedAt: 'October 15, 2025',
    verificationHash: '9E7D8A12B5C3F0E64A8D9B1C2E4F7A9D8C5B3E1F0A7B9C8D6E4F2A1B3C5D7E9F',
    signatures: [
      {
        name: 'Dr. Abhay Jere',
        title: 'Chief Innovation Officer',
        organization: 'Ministry of Education, Govt. of India',
      },
      {
        name: 'Prof. Anil Sahasrabudhe',
        title: 'Chairman, NETF & Steering Committee',
        organization: 'Smart India Hackathon 2026',
      },
    ],
  },
  'cert-vidarbha-002': {
    id: 'cert-2',
    certificateId: 'cert-vidarbha-002',
    recipientName: 'Karthik Rajan',
    recipientRole: 'Team Leader — FarmSense AI',
    universityName: 'International Institute of Information Technology Hyderabad',
    universityShort: 'IIIT Hyderabad',
    problemTitle: 'AI Precision Irrigation & Soil Intelligence for Vidarbha Cotton Farmers',
    type: 'OUTSTANDING_SOLVER',
    impactSummary:
      'Delivered automated subsurface micro-irrigation to 320 farms serving 3,800 farmers in Yavatmal. Doubled average cotton harvest yields (+106%) while cutting canal water usage by 51%, increasing seasonal farmer income from ₹42,000 to ₹78,000.',
    issuedBy: 'Ministry of Agriculture & Smart India Hackathon 2026',
    issuedAt: 'December 01, 2025',
    verificationHash: '4A7B8C9D0E1F2A3B4C5D6E7F8A9B0C1D2E3F4A5B6C7D8E9F0A1B2C3D4E5F6A7B',
    signatures: [
      {
        name: 'Dr. Abhay Jere',
        title: 'Chief Innovation Officer',
        organization: 'Ministry of Education, Govt. of India',
      },
      {
        name: 'Prof. P. J. Narayanan',
        title: 'Director & Steering Committee',
        organization: 'Smart India Hackathon 2026',
      },
    ],
  },
  'cert-desai-003': {
    id: 'cert-3',
    certificateId: 'cert-desai-003',
    recipientName: 'Prof. Anita Desai',
    recipientRole: 'Distinguished Academic Faculty Mentor',
    universityName: 'Indian Institute of Technology Bombay',
    universityShort: 'IIT Bombay',
    problemTitle: 'Groundwater Arsenic & Fluoride Remediation in Nashik Villages',
    type: 'INNOVATION_EXCELLENCE',
    impactSummary:
      'Mentored AquaTech Innovators from laboratory bench prototyping to robust field installation across 6 rural habitations. Provided critical leadership in electrochemical adsorbent calibration.',
    issuedBy: 'CivicSolve Platform & Ministry of Education',
    issuedAt: 'October 15, 2025',
    verificationHash: '1C2D3E4F5A6B7C8D9E0F1A2B3C4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9A0B1C2D',
    signatures: [
      {
        name: 'Dr. Abhay Jere',
        title: 'Chief Innovation Officer',
        organization: 'Ministry of Education, Govt. of India',
      },
      {
        name: 'Prof. Anil Sahasrabudhe',
        title: 'Chairman, NETF & Steering Committee',
        organization: 'Smart India Hackathon 2026',
      },
    ],
  },
  'cert-delhi-003': {
    id: 'cert-4',
    certificateId: 'cert-delhi-003',
    recipientName: 'Meera Nair',
    recipientRole: 'Lead Aerosol Researcher — AirGuard Lab',
    universityName: 'Indian Institute of Technology Delhi',
    universityShort: 'IIT Delhi',
    problemTitle: 'Hyperlocal Air Quality Monitoring Network — Delhi Corridors',
    type: 'CERTIFIED_SOLVER',
    impactSummary:
      'Engineered an interconnected 180-node PM2.5 aerosol telemetry matrix across Okhla and Anand Vihar corridors, providing 120,000+ citizens with 48h advance warning trajectory maps.',
    issuedBy: 'Ministry of Environment, Forest & Climate Change',
    issuedAt: 'January 10, 2026',
    verificationHash: '8B9C0D1E2F3A4B5C6D7E8F9A0B1C2D3E4F5A6B7C8D9E0F1A2B3C4D5E6F7A8B9C',
    signatures: [
      {
        name: 'Dr. Abhay Jere',
        title: 'Chief Innovation Officer',
        organization: 'Ministry of Education, Govt. of India',
      },
      {
        name: 'Prof. Anil Sahasrabudhe',
        title: 'Chairman, NETF',
        organization: 'Smart India Hackathon 2026',
      },
    ],
  },
}

export default function CertificateDetailPage() {
  const params = useParams()
  const rawId = (params?.id as string) || 'cert-nashik-001'
  const cleanId = rawId.toLowerCase()

  const [cert, setCert] = useState<CertificateFullData>(
    fallbackCerts[cleanId] ||
      Object.values(fallbackCerts).find(
        (c) => c.certificateId.toLowerCase() === cleanId || c.id === cleanId
      ) ||
      fallbackCerts['cert-nashik-001']
  )

  const [origin, setOrigin] = useState('https://civicsolve.in')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin)
    }

    // Try fetching from API
    fetch(`/api/certificates/${rawId}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          const d = res.data
          setCert({
            id: d.id,
            certificateId: d.certificateId || d.id,
            recipientName: d.user?.name || cert.recipientName,
            recipientRole: d.role || cert.recipientRole,
            universityName:
              d.user?.studentProfile?.university?.name ||
              d.user?.facultyProfile?.university?.name ||
              d.project?.university?.name ||
              cert.universityName,
            universityShort:
              d.user?.studentProfile?.university?.shortName ||
              d.user?.facultyProfile?.university?.shortName ||
              d.project?.university?.shortName ||
              cert.universityShort,
            problemTitle: d.problemTitle || cert.problemTitle,
            type: d.type || cert.type,
            impactSummary: d.impactSummary || cert.impactSummary,
            issuedBy: d.issuedBy || cert.issuedBy,
            issuedAt: d.issuedAt
              ? new Date(d.issuedAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })
              : cert.issuedAt,
            verificationHash: d.verificationHash || cert.verificationHash,
            signatures: cert.signatures,
          })
        }
      })
      .catch(() => {
        // keep fallback
      })
  }, [rawId])

  const verifyUrl = `${origin}/verify/${cert.certificateId}`

  const handlePrint = () => {
    window.print()
  }

  const handleCopyHash = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(cert.verificationHash)
      toast.success('Cryptographic hash copied to clipboard!', {
        description: cert.verificationHash,
      })
    }
  }

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(verifyUrl)
      toast.success('Verification URL copied!', {
        description: verifyUrl,
      })
    }
  }

  return (
    <AppShell>
      <div className="space-y-6 pb-20">
        {/* Navigation & Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
          <Link
            href="/certificates"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Certificates Registry
          </Link>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleCopyHash}
              className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
              title="Copy cryptographic hash"
            >
              <Copy className="h-3.5 w-3.5" />
              Copy Hash
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
            >
              <Share2 className="h-3.5 w-3.5" />
              Share Link
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 px-3.5 py-2 text-xs font-semibold text-white transition-colors"
            >
              <Printer className="h-3.5 w-3.5" />
              Print Certificate
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 px-4 py-2 text-xs font-bold text-black shadow-md transition-all active:scale-95"
            >
              <Download className="h-3.5 w-3.5" />
              Download PDF
            </button>

            <Link
              href={`/verify/${cert.certificateId}`}
              className="flex items-center gap-1.5 rounded-xl bg-cyan-600/80 hover:bg-cyan-600 px-3.5 py-2 text-xs font-semibold text-white transition-colors"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              Public Verification Ledger
            </Link>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* OFFICIAL DIGITAL CERTIFICATE CANVAS                                       */}
        {/* ========================================================================= */}
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl p-3 sm:p-5 bg-gradient-to-br from-amber-600/30 via-yellow-500/20 to-amber-700/30 shadow-[0_0_80px_rgba(245,158,11,0.2)] border border-amber-500/40">
          {/* Inner parchment-dark container with double gold borders */}
          <div className="relative overflow-hidden rounded-2xl bg-[#0b0f19] p-8 sm:p-14 border-4 border-amber-400/70 shadow-inner">
            {/* Fine secondary gold border */}
            <div className="pointer-events-none absolute inset-3 rounded-xl border border-amber-500/30" />
            <div className="pointer-events-none absolute inset-5 rounded-lg border border-amber-400/20" />

            {/* Subtle background seal watermark */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.03]">
              <Award className="h-[600px] w-[600px] text-amber-300" />
            </div>

            {/* Corner Decorative Ornaments */}
            <div className="pointer-events-none absolute top-4 left-4 h-8 w-8 border-t-2 border-l-2 border-amber-400" />
            <div className="pointer-events-none absolute top-4 right-4 h-8 w-8 border-t-2 border-r-2 border-amber-400" />
            <div className="pointer-events-none absolute bottom-4 left-4 h-8 w-8 border-b-2 border-l-2 border-amber-400" />
            <div className="pointer-events-none absolute bottom-4 right-4 h-8 w-8 border-b-2 border-r-2 border-amber-400" />

            {/* Certificate Contents */}
            <div className="relative z-10 text-center space-y-6">
              {/* Header Crest & Titles */}
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-3">
                  <span className="h-0.5 w-12 sm:w-20 bg-gradient-to-r from-transparent to-amber-400" />
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-[0_0_20px_rgba(251,191,36,0.5)]">
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-[#0b0f19]">
                      <Award className="h-6 w-6 text-amber-400" />
                    </div>
                  </div>
                  <span className="h-0.5 w-12 sm:w-20 bg-gradient-to-l from-transparent to-amber-400" />
                </div>

                <div className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.25em] text-amber-300/90 uppercase">
                  Republic of India • Ministry of Education & Smart India Hackathon 2026
                </div>

                <div className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
                  National Civic Engineering Registry • Credential ID: {cert.certificateId}
                </div>
              </div>

              {/* Main Certificate Title */}
              <div className="py-2">
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-wider uppercase text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-300 to-yellow-100 drop-shadow-sm font-serif">
                  Certificate of Outstanding Societal Impact
                </h1>
                <p className="text-xs sm:text-sm text-amber-200/70 font-serif italic mt-1">
                  Presented under the auspices of the Government of India CivicSolve Platform
                </p>
              </div>

              {/* Conferred Text */}
              <div className="space-y-2 max-w-2xl mx-auto">
                <p className="text-xs text-slate-400 uppercase tracking-widest font-mono">
                  This distinguished credential is duly awarded to
                </p>

                <div className="py-2 border-b border-amber-400/40 max-w-xl mx-auto">
                  <span className="text-2xl sm:text-4xl font-extrabold text-white tracking-wide font-serif text-shadow">
                    {cert.recipientName}
                  </span>
                </div>

                <div className="text-sm font-semibold text-cyan-300">
                  {cert.recipientRole}
                </div>

                <div className="text-xs text-slate-400">
                  Academic Affiliation: <strong className="text-slate-200">{cert.universityName}</strong>
                </div>
              </div>

              {/* Project & Empirical Citation */}
              <div className="max-w-3xl mx-auto rounded-xl border border-amber-500/20 bg-amber-950/10 p-5 sm:p-6 text-left space-y-3 shadow-inner">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 font-mono">
                    Societal Challenge & Engineered Solution
                  </span>
                  <div className="text-base sm:text-lg font-bold text-white mt-0.5">
                    {cert.problemTitle}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 font-mono">
                    Verified Empirical Impact Citation
                  </span>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-1">
                    {cert.impactSummary}
                  </p>
                </div>
              </div>

              {/* Footer: Signatures & QR Code */}
              <div className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-end border-t border-amber-500/20 max-w-4xl mx-auto">
                {/* Signature 1 */}
                <div className="text-center md:text-left space-y-1">
                  <div className="h-10 flex items-center justify-center md:justify-start">
                    <span className="font-serif italic text-amber-300/80 text-lg tracking-wider font-semibold">
                      Abhay Jere
                    </span>
                  </div>
                  <div className="w-40 mx-auto md:mx-0 border-t border-amber-400/50 pt-1">
                    <div className="font-bold text-white text-xs">Dr. Abhay Jere</div>
                    <div className="text-[10px] text-slate-400">Chief Innovation Officer</div>
                    <div className="text-[9px] text-slate-500">Ministry of Education, Govt. of India</div>
                  </div>
                </div>

                {/* Center: Official Seal & QR Code */}
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="p-2 rounded-xl bg-white shadow-lg border border-amber-400/40">
                    <QRCodeSVG
                      value={verifyUrl}
                      size={92}
                      level="H"
                      includeMargin={false}
                    />
                  </div>
                  <div className="text-[10px] font-mono text-cyan-300 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                    Scan to Verify Online
                  </div>
                  <div className="text-[9px] text-slate-500 font-mono">
                    Issued: {cert.issuedAt}
                  </div>
                </div>

                {/* Signature 2 */}
                <div className="text-center md:text-right space-y-1">
                  <div className="h-10 flex items-center justify-center md:justify-end">
                    <span className="font-serif italic text-amber-300/80 text-lg tracking-wider font-semibold">
                      Anil Sahasrabudhe
                    </span>
                  </div>
                  <div className="w-40 mx-auto md:ml-auto md:mr-0 border-t border-amber-400/50 pt-1">
                    <div className="font-bold text-white text-xs">Prof. Anil Sahasrabudhe</div>
                    <div className="text-[10px] text-slate-400">Chairman, Steering Committee</div>
                    <div className="text-[9px] text-slate-500">Smart India Hackathon 2026</div>
                  </div>
                </div>
              </div>

              {/* Bottom Verification Hash Footnote */}
              <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-slate-400 font-mono">
                <span>Verification Authority: {cert.issuedBy}</span>
                <span className="truncate max-w-md" title={cert.verificationHash}>
                  SHA256: {cert.verificationHash}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
