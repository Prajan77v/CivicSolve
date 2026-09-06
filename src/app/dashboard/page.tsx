'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import AppShell from '@/components/layout/app-shell'
import {
  ShieldCheck,
  AlertTriangle,
  Users,
  Compass,
  ArrowRight,
  Plus,
  Play,
  MapPin,
  Calendar,
  CheckCircle2,
  Layers,
  Award,
  Globe,
  Coins,
  FileCheck,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type DashboardRole = 'STUDENT' | 'GOVERNMENT' | 'FACULTY' | 'CITIZEN' | 'ADMIN'

export default function DashboardPage() {
  const { data: session } = useSession()

  const sessionUser = session?.user
  const userName = sessionUser?.name || 'Prajan'
  const userRole = ((sessionUser as any)?.role as DashboardRole) || 'STUDENT'

  const [activeRole, setActiveRole] = useState<DashboardRole>(userRole)

  useEffect(() => {
    if ((sessionUser as any)?.role) {
      const r = (sessionUser as any).role.toUpperCase()
      if (['STUDENT', 'GOVERNMENT', 'FACULTY', 'CITIZEN', 'ADMIN'].includes(r)) {
        setActiveRole(r as DashboardRole)
      }
    }
  }, [sessionUser])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening'

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto space-y-10 pb-16">
        {/* ── Section 7 Header: Good morning, Prajan ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">WORKSPACE DASHBOARD</span>
              <span className="text-slate-600">•</span>
              <span className="text-[11px] font-mono text-blue-400 font-semibold uppercase">
                {activeRole === 'GOVERNMENT' ? 'COLLECTOR PERSPECTIVE' : `${activeRole} PERSPECTIVE`}
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
              {greeting}, {userName.split(' ')[0]}.
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              <span className="text-rose-400 font-semibold">3 challenges</span> need attention. <span className="text-emerald-400 font-semibold">2 projects</span> are moving today.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/problems/new"
              className="rounded bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-2 text-xs font-semibold shadow-sm transition-colors inline-flex items-center gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Submit Challenge</span>
            </Link>

            <Link
              href="/demo"
              className="rounded border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 px-3.5 py-2 text-xs font-medium transition-colors inline-flex items-center gap-1.5"
            >
              <Play className="h-3 w-3 fill-current" />
              <span>Launch Demo Runner</span>
            </Link>
          </div>
        </div>

        {/* ── Two-Column Asymmetric Workspace Layout (Main 65% + Right Rail 35%) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Area (Left Column) */}
          <div className="lg:col-span-8 space-y-10">
            {/* 1. Large Priority Challenge Section (Editorial layout) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                  Priority Challenges
                </h2>
                <Link href="/problems" className="text-xs text-blue-400 hover:text-blue-300 font-semibold">
                  Explore All →
                </Link>
              </div>

              {/* Large Spotlight Challenge */}
              <div className="border-t border-b border-slate-800/80 py-5 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-rose-400 font-bold uppercase">CRITICAL PRIORITY</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-400">Nashik District, Maharashtra</span>
                  </div>
                  <span className="font-mono text-[11px] text-emerald-400 font-semibold">AI Match: 96%</span>
                </div>

                <h3 className="text-xl font-bold text-white leading-snug">
                  Severe Groundwater Contamination in Nashik Rural Villages
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
                  Groundwater tests indicate chemical runoff and fluoride levels exceeding 4.2 mg/L across 6 habitations. Ground truth verified by District Collectorate. Interdisciplinary IoT water purification squad requested.
                </p>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
                  <div className="text-slate-400">
                    <span className="text-white font-semibold">2,500 villagers</span> affected • Required: IoT Sensors, Water Chemistry, Embedded Systems
                  </div>
                  <Link
                    href="/problems/cmtoobswg002tzfwtr7evt8z9"
                    className="rounded bg-blue-600/10 border border-blue-500/30 text-blue-400 hover:bg-blue-600/20 px-3 py-1.5 font-semibold text-xs transition-colors"
                  >
                    View Challenge Dossier →
                  </Link>
                </div>
              </div>

              {/* Secondary Challenge */}
              <div className="border-b border-slate-800/80 pb-5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-amber-400 font-bold uppercase">HIGH PRIORITY</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-400">Yavatmal, Vidarbha</span>
                  </div>
                  <span className="font-mono text-[11px] text-emerald-400 font-semibold">AI Match: 91%</span>
                </div>

                <h4 className="text-base font-bold text-white">
                  Cotton Belt Drought & Canal Water Telemetry
                </h4>

                <p className="text-xs text-slate-400 line-clamp-1">
                  Capacitive soil moisture probes and LoRaWAN controllers needed to prevent canal water depletion.
                </p>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-slate-500">12,400 farmers affected</span>
                  <Link href="/problems" className="text-blue-400 hover:text-blue-300 font-semibold">
                    View Challenge →
                  </Link>
                </div>
              </div>
            </div>

            {/* 2. Active Project Progress Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                  Active Projects
                </h2>
                <Link href="/projects" className="text-xs text-blue-400 hover:text-blue-300 font-semibold">
                  All Projects →
                </Link>
              </div>

              <div className="divide-y divide-slate-800/80 border-y border-slate-800/80">
                {/* Project 1 */}
                <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-mono text-[10px] text-blue-400 font-semibold">FIELD PILOT</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-slate-400">Team AquaTech (IIT Bombay)</span>
                    </div>
                    <h4 className="text-sm font-bold text-white">
                      IoT Water Quality Monitoring & Filtration for Nashik Villages
                    </h4>
                    <div className="text-[11px] text-slate-500">
                      Next Milestone: Secondary Filter Telemetry & Chlorine Dosing Validation
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 sm:text-right">
                    <div className="space-y-1 min-w-[100px]">
                      <div className="text-xs text-slate-400">
                        <span className="font-bold text-white">72%</span> done
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600" style={{ width: '72%' }} />
                      </div>
                    </div>

                    <Link
                      href="/projects/cmtoobt010045zfwtusc4x7p3"
                      className="rounded border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 px-3 py-1 text-xs font-medium transition-colors"
                    >
                      Workspace →
                    </Link>
                  </div>
                </div>

                {/* Project 2 */}
                <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-mono text-[10px] text-amber-400 font-semibold">PROPOSAL REVIEW</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-slate-400">Team FarmSense (COEP Pune)</span>
                    </div>
                    <h4 className="text-sm font-bold text-white">
                      Capacitive LoRa Soil Moisture Grid for Cotton Crops
                    </h4>
                    <div className="text-[11px] text-slate-500">
                      Next Milestone: Faculty Advisory & 5-Criteria Evaluation
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 sm:text-right">
                    <div className="space-y-1 min-w-[100px]">
                      <div className="text-xs text-slate-400">
                        <span className="font-bold text-white">41%</span> done
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500" style={{ width: '41%' }} />
                      </div>
                    </div>

                    <Link
                      href="/projects/cmtoobt010045zfwtusc4x7p3"
                      className="rounded border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 px-3 py-1 text-xs font-medium transition-colors"
                    >
                      Workspace →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Rail (Secondary Column) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Role Perspective Switcher */}
            <div className="rounded border border-slate-800 bg-[#0f131a] p-4 space-y-2.5">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                ROLE PERSPECTIVE
              </div>
              <div className="flex flex-wrap gap-1">
                {(['STUDENT', 'GOVERNMENT', 'FACULTY', 'CITIZEN', 'ADMIN'] as DashboardRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => setActiveRole(r)}
                    className={cn(
                      'rounded px-2.5 py-1 text-xs font-medium transition-colors',
                      activeRole === r
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700/60'
                    )}
                  >
                    {r === 'GOVERNMENT' ? 'Collector' : r.charAt(0) + r.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Upcoming Actions / Approvals Queue */}
            <div className="rounded border border-slate-800 bg-[#0f131a] p-4 space-y-3">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                ACTION REQUIRED
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="space-y-0.5 pb-2 border-b border-slate-800/80">
                  <div className="font-semibold text-slate-200">
                    {activeRole === 'GOVERNMENT' ? '4 Ground Truth Verifications' : '3 Priority Challenges Unassigned'}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {activeRole === 'GOVERNMENT'
                      ? 'District habitations pending municipal approval'
                      : 'Urgent problems awaiting multidisciplinary squads'}
                  </p>
                  <Link href="/problems?status=SUBMITTED" className="text-blue-400 text-[11px] font-semibold hover:underline block pt-1">
                    Open Review Queue →
                  </Link>
                </div>

                <div className="space-y-0.5 pb-2 border-b border-slate-800/80">
                  <div className="font-semibold text-slate-200">2 Milestone Sign-offs Pending</div>
                  <p className="text-[11px] text-slate-400">Field pilot deliverables submitted for expert review</p>
                  <Link href="/projects/cmtoobt010045zfwtusc4x7p3" className="text-blue-400 text-[11px] font-semibold hover:underline block pt-1">
                    Review Milestones →
                  </Link>
                </div>

                <div className="space-y-0.5">
                  <div className="font-semibold text-slate-200">1 Industry Equipment Sandbox Active</div>
                  <p className="text-[11px] text-slate-400">IoT testing lab & sensor sandbox available</p>
                  <Link href="/partners" className="text-blue-400 text-[11px] font-semibold hover:underline block pt-1">
                    View Partner Support →
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick Access */}
            <div className="rounded border border-slate-800 bg-[#0f131a] p-4 space-y-2.5 text-xs">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                OPERATIONAL SHORTCUTS
              </div>
              <div className="space-y-1.5 font-medium">
                <Link href="/solution-library" className="block text-slate-300 hover:text-white transition-colors">
                  • Solution Library & Adaptations
                </Link>
                <Link href="/map" className="block text-slate-300 hover:text-white transition-colors">
                  • Geospatial Civic Radar Map
                </Link>
                <Link href="/verify/CERT-WATER-2025-001" className="block text-slate-300 hover:text-white transition-colors">
                  • Public QR Ledger Verification
                </Link>
                <Link href="/command-center" className="block text-slate-300 hover:text-white transition-colors">
                  • Government Command Center
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom Section: Measurable Impact Summary ── */}
        <div className="pt-8 border-t border-slate-800/80 space-y-4">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            MEASURABLE SOCIETAL IMPACT
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded border border-slate-800 bg-[#0f131a] p-4 space-y-1">
              <div className="text-[10px] text-slate-500 font-mono">PEOPLE HELPED</div>
              <div className="text-2xl font-bold text-white tracking-tight">2,500+</div>
              <div className="text-[11px] text-emerald-400">In 6 Nashik villages</div>
            </div>

            <div className="rounded border border-slate-800 bg-[#0f131a] p-4 space-y-1">
              <div className="text-[10px] text-slate-500 font-mono">PILOTS DEPLOYED</div>
              <div className="text-2xl font-bold text-white tracking-tight">4 Systems</div>
              <div className="text-[11px] text-blue-400">100% on-ground verified</div>
            </div>

            <div className="rounded border border-slate-800 bg-[#0f131a] p-4 space-y-1">
              <div className="text-[10px] text-slate-500 font-mono">REUSABLE BLUEPRINTS</div>
              <div className="text-2xl font-bold text-white tracking-tight">5 Solutions</div>
              <div className="text-[11px] text-purple-400">Ready for cross-region adaptation</div>
            </div>

            <div className="rounded border border-slate-800 bg-[#0f131a] p-4 space-y-1">
              <div className="text-[10px] text-slate-500 font-mono">CSR CAPITAL PLEDGED</div>
              <div className="text-2xl font-bold text-amber-400 tracking-tight">₹25.0 Lakhs</div>
              <div className="text-[11px] text-slate-400">TCS & Municipal Local Bodies</div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
