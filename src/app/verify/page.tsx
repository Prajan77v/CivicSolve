'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AppShell from '@/components/layout/app-shell'
import {
  ShieldCheck,
  Search,
  Award,
  CheckCircle2,
  ExternalLink,
  QrCode,
  FileCheck,
  ArrowRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const POPULAR_CERTIFICATES = [
  {
    id: 'CERT-WATER-2025-001',
    name: 'Aarav Sharma',
    role: 'Team Lead — AquaTech Innovators',
    project: 'Nashik Groundwater IoT Monitoring & Filtration',
  },
  {
    id: 'cert-nashik-001',
    name: 'Arun Kumar',
    role: 'Outstanding Solver',
    project: 'Groundwater Contamination Remediation',
  },
  {
    id: 'cert-vidarbha-002',
    name: 'Karthik Rajan',
    role: 'Team Leader — FarmSense AI',
    project: 'Vidarbha Drought Early Warning Engine',
  },
]

export default function VerifyPortalPage() {
  const router = useRouter()
  const [certId, setCertId] = useState('')

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault()
    if (!certId.trim()) return
    router.push(`/verify/${encodeURIComponent(certId.trim())}`)
  }

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-8 py-4">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <ShieldCheck className="h-4 w-4" />
            Official SIH Digital Credential Verification Portal
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
            Verify CivicSolve Credential
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto text-sm">
            Authenticate cryptographically signed project completion and impact certificates issued by government agencies, universities, and industry partners.
          </p>
        </div>

        {/* Verification Card */}
        <div className="glass-card rounded-2xl border border-white/10 bg-slate-900/90 p-8 shadow-2xl space-y-6">
          <form onSubmit={handleVerify} className="space-y-4">
            <label className="block text-sm font-semibold text-slate-200">
              Enter Certificate ID or Hash
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                <input
                  type="text"
                  value={certId}
                  onChange={(e) => setCertId(e.target.value)}
                  placeholder="e.g. CERT-WATER-2025-001 or cert-nashik-001"
                  className="w-full pl-11 pr-4 py-3 bg-slate-950/80 border border-white/15 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-mono"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shrink-0"
              >
                Verify Credential
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </form>

          {/* Quick Click Samples */}
          <div className="pt-4 border-t border-white/10 space-y-3">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Quick Verify Verified Credentials
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {POPULAR_CERTIFICATES.map((sample) => (
                <Link
                  key={sample.id}
                  href={`/verify/${sample.id}`}
                  className="p-3 rounded-xl bg-slate-950/50 border border-white/5 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <div className="text-xs font-mono text-emerald-400 group-hover:text-emerald-300 flex items-center gap-1 font-bold">
                      <FileCheck className="h-3.5 w-3.5" />
                      {sample.id}
                    </div>
                    <div className="text-sm font-semibold text-white line-clamp-1">{sample.name}</div>
                    <div className="text-xs text-slate-400 line-clamp-1">{sample.project}</div>
                  </div>
                  <div className="text-[11px] text-emerald-400 font-medium mt-2 flex items-center gap-1">
                    Verify Now &rarr;
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-xl bg-slate-900/50 border border-white/5 space-y-2">
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div className="text-sm font-semibold text-white">SHA-256 Tamper-Proof</div>
            <div className="text-xs text-slate-400">
              Each certificate is tied to an immutable cryptographic hash of student and problem data.
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/50 border border-white/5 space-y-2">
            <div className="h-8 w-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div className="text-sm font-semibold text-white">NIRF & Ministry Endorsed</div>
            <div className="text-xs text-slate-400">
              Directly verifiable by hiring partners, SIH evaluators, and university academic registrars.
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/50 border border-white/5 space-y-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
              <QrCode className="h-4 w-4" />
            </div>
            <div className="text-sm font-semibold text-white">Instant QR Routing</div>
            <div className="text-xs text-slate-400">
              Physical printouts include QR codes that resolve straight to this verification record.
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
