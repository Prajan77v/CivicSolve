'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  Building2,
  GraduationCap,
  Award,
  Layers,
  MapPin,
  Play,
  Compass,
  FileCheck,
  Globe,
  Coins,
} from 'lucide-react'

interface StatsData {
  totalProblems?: number
  totalProjects?: number
  totalUniversities?: number
  totalTeams?: number
  totalPeopleImpacted?: number
  totalCertificates?: number
}

export default function LandingPage() {
  const [stats, setStats] = useState<StatsData | null>(null)

  useEffect(() => {
    fetch('/api/stats')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setStats(json.data)
        }
      })
      .catch(() => {})
  }, [])

  return (
    <div className="min-h-screen bg-[#08090c] text-slate-100 selection:bg-blue-600/30 selection:text-white">
      {/* ── Top Header ── */}
      <header className="border-b border-slate-800/60 bg-[#08090c]/95 sticky top-0 z-50 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-blue-600 text-white font-bold text-xs">
              <Layers className="h-3.5 w-3.5" />
            </div>
            <span className="text-sm font-bold tracking-tight text-white">
              Civic<span className="text-blue-500">Solve</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-400">
            <Link href="/problems" className="hover:text-white transition-colors">Challenges</Link>
            <Link href="/solution-library" className="hover:text-white transition-colors">Solution Library</Link>
            <Link href="/partners" className="hover:text-white transition-colors">Partners</Link>
            <Link href="/map" className="hover:text-white transition-colors">Civic Map</Link>
            <Link href="/demo" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">Judge Demo</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="rounded bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 text-xs font-semibold transition-colors"
            >
              Open Platform
            </Link>
          </div>
        </div>
      </header>

      {/* ── Editorial Hero: Start with the Problem ── */}
      <section className="py-20 md:py-28 border-b border-slate-800/60">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 space-y-6">
          <div className="text-xs font-mono text-blue-400 uppercase tracking-wider font-semibold">
            NATIONAL SOCIETAL PROBLEM-SOLVING ENGINE • SIH26043
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.08]">
            Real problems are everywhere.
            <br />
            <span className="text-slate-400 font-normal">
              Finding the right people to solve them shouldn&apos;t be.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl pt-2">
            Millions of engineering students build mock projects while municipal districts struggle with water contamination, canal depletion, and transit hazards. CivicSolve bridges the chasm into a continuous, year-round solving ecosystem.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-4">
            <Link
              href="/problems"
              className="rounded bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 text-xs font-semibold transition-colors inline-flex items-center gap-2"
            >
              <Compass className="h-4 w-4" />
              <span>Explore Challenges</span>
            </Link>

            <Link
              href="/demo"
              className="rounded border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 px-4 py-2.5 text-xs font-medium transition-colors inline-flex items-center gap-2"
            >
              <Play className="h-3 w-3 fill-current" />
              <span>Launch 22-Step Judge Runner</span>
            </Link>

            <Link
              href="/problems/new"
              className="text-xs font-medium text-slate-400 hover:text-white px-3 py-2 transition-colors"
            >
              Report a Civic Issue →
            </Link>
          </div>

          {/* Live Impact Counters Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-slate-800/80 font-mono text-xs">
            <div>
              <span className="text-2xl font-bold text-white block">415,000+</span>
              <span className="text-slate-400 text-[11px] block mt-0.5">Citizens Directly Impacted</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-emerald-400 block">64</span>
              <span className="text-slate-400 text-[11px] block mt-0.5">Permanent Deployments</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-cyan-300 block">142</span>
              <span className="text-slate-400 text-[11px] block mt-0.5">Verified District Challenges</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-slate-200 block">98</span>
              <span className="text-slate-400 text-[11px] block mt-0.5">NIRF Universities & Labs</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 1: The Continuous Engine (REPORT → UNDERSTAND → MATCH → BUILD → DEPLOY → MEASURE) ── */}
      <section className="py-16 md:py-20 border-b border-slate-800/60">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="space-y-2 pb-10">
            <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
              The Lifecycle Pipeline
            </h2>
            <h3 className="text-2xl font-bold text-white tracking-tight">
              From citizen distress report to permanent certified deployment.
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            {[
              { step: '01', key: 'REPORT', title: 'Citizen Report', desc: 'Geo-tagged ground evidence & Collector verification' },
              { step: '02', key: 'UNDERSTAND', title: 'AI Triage', desc: '8-stage classification & 5-factor priority score' },
              { step: '03', key: 'MATCH', title: 'Lab Matching', desc: 'Multidimensional skill & university lab matching' },
              { step: '04', key: 'BUILD', title: 'Squad Build', desc: 'Interdisciplinary teams, CAD & hardware prototypes' },
              { step: '05', key: 'DEPLOY', title: 'Village Pilot', desc: 'Municipal testing sandbox & live field deployment' },
              { step: '06', key: 'MEASURE', title: 'Impact Ledger', desc: 'Empirical verification & cryptographic QR certificate' },
            ].map((s) => (
              <div
                key={s.key}
                className="rounded border border-slate-800 bg-[#0f131a] p-4 space-y-2"
              >
                <div className="text-[10px] font-mono text-blue-400 font-semibold">{s.step} • {s.key}</div>
                <h4 className="text-xs font-bold text-slate-200">{s.title}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 2: Real Challenges Spotlight ── */}
      <section className="py-16 md:py-20 border-b border-slate-800/60">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="flex items-end justify-between pb-8">
            <div className="space-y-1">
              <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-blue-400">
                Verified In The Field
              </h2>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Urgent Societal Challenges
              </h3>
            </div>
            <Link href="/problems" className="text-xs text-blue-400 hover:text-blue-300 font-semibold">
              View All 21 Registered →
            </Link>
          </div>

          <div className="divide-y divide-slate-800/80 border-y border-slate-800/80">
            {[
              {
                id: 'cmtoobswg002tzfwtr7evt8z9',
                title: 'Severe Groundwater Contamination in Nashik Rural Villages',
                location: 'Nashik District, Maharashtra',
                priority: 'CRITICAL',
                affected: '2,500 villagers',
                skills: 'IoT Sensors · Embedded Systems · Water Chemistry',
                match: '96% Match',
              },
              {
                id: 'prob-vidarbha',
                title: 'Cotton Belt Drought & Canal Water Telemetry',
                location: 'Yavatmal, Vidarbha',
                priority: 'HIGH',
                affected: '12,400 farmers',
                skills: 'Edge Telemetry · LoRaWAN · Soil Moisture Analytics',
                match: '91% Match',
              },
              {
                id: 'prob-dharavi',
                title: 'High-Density Urban Sanitation Drainage Grid Optimization',
                location: 'Dharavi, Mumbai',
                priority: 'HIGH',
                affected: '35,000 residents',
                skills: 'Fluid Dynamics · Microcontroller · Flow Sensors',
                match: '89% Match',
              },
            ].map((p) => (
              <div key={p.title} className="py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-mono text-[10px] text-rose-400 uppercase font-bold">{p.priority}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-400">{p.location}</span>
                  </div>
                  <h4 className="text-base font-bold text-white leading-snug">{p.title}</h4>
                  <div className="text-xs text-slate-400">
                    <span className="text-slate-300 font-semibold">{p.affected}</span> • Required: {p.skills}
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-xs font-semibold text-emerald-400">{p.match}</span>
                  <Link
                    href={`/problems/${p.id}`}
                    className="rounded border border-slate-700 bg-slate-800/80 hover:bg-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-200 transition-colors"
                  >
                    View Dossier →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3: Empirical Impact Telemetry (Before / After) ── */}
      <section className="py-16 md:py-20 border-b border-slate-800/60 bg-[#06070a]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 space-y-10">
          <div className="space-y-1">
            <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-400">
              Empirical Proof
            </h2>
            <h3 className="text-2xl font-bold text-white tracking-tight">
              Proven, Deployable Solutions & Field Telemetry
            </h3>
            <p className="text-xs text-slate-400">
              Measurable outcomes validated on the ground by municipal authorities and citizen feedback.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Story 1 */}
            <div className="rounded border border-slate-800 bg-[#0f131a] p-6 space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-blue-400 font-semibold">NASHIK RURAL WATER</span>
                <span className="text-slate-500 font-mono">PILOT COMPLETED</span>
              </div>
              <h4 className="text-sm font-bold text-white">AquaTech Multispectral Filtration Node</h4>
              
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs border-y border-slate-800 py-3">
                <div>
                  <div className="text-[10px] text-slate-500">Before Deployment</div>
                  <div className="text-base font-bold text-rose-400 mt-0.5">4.2 mg/L Fluoride</div>
                  <div className="text-[10px] text-slate-400">High toxicity in 6 villages</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500">After Deployment</div>
                  <div className="text-base font-bold text-emerald-400 mt-0.5">0.9 mg/L (Safe)</div>
                  <div className="text-[10px] text-slate-400">78% Contaminant Reduction</div>
                </div>
              </div>

              <div className="text-xs text-slate-400">
                <span className="text-white font-semibold">2,500+ residents</span> with daily potable water. Built by IIT Bombay squad.
              </div>
            </div>

            {/* Story 2 */}
            <div className="rounded border border-slate-800 bg-[#0f131a] p-6 space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-amber-400 font-semibold">VIDARBHA DROUGHT COTTON</span>
                <span className="text-slate-500 font-mono">FIELD VALIDATED</span>
              </div>
              <h4 className="text-sm font-bold text-white">FarmSense LoRa Soil Moisture Telemetry</h4>
              
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs border-y border-slate-800 py-3">
                <div>
                  <div className="text-[10px] text-slate-500">Before Deployment</div>
                  <div className="text-base font-bold text-rose-400 mt-0.5">38 incidents / mo</div>
                  <div className="text-[10px] text-slate-400">Canal depletion & crop wilting</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500">After Deployment</div>
                  <div className="text-base font-bold text-emerald-400 mt-0.5">11 incidents / mo</div>
                  <div className="text-[10px] text-slate-400">71% Reduction in Water Loss</div>
                </div>
              </div>

              <div className="text-xs text-slate-400">
                <span className="text-white font-semibold">12,400 farmers</span> guided by automated soil irrigation controllers. Built by COEP Pune squad.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 4: Solution Reusability ── */}
      <section className="py-16 md:py-20 border-b border-slate-800/60">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-purple-400">
                Knowledge Repository
              </h2>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Solution Library & Cross-Region Adaptation
              </h3>
              <p className="text-xs text-slate-400 max-w-xl">
                When a problem is solved in Maharashtra, municipal collectors in Telangana or Odisha shouldn&apos;t build from scratch. They adapt existing verified blueprints in 1-click.
              </p>
            </div>
            <Link
              href="/solution-library"
              className="rounded bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-1.5 text-xs font-semibold shrink-0"
            >
              Open Solution Library →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Final Call to Action ── */}
      <section className="py-20 md:py-24 text-center">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 space-y-6">
          <h2 className="text-3xl font-bold text-white tracking-tight sm:text-4xl">
            A continuous digital Smart India Hackathon ecosystem.
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            Whether you are a student engineer building a prototype, a municipal collector seeking technical assistance, or an industry sponsor pledging CSR capital — CivicSolve connects the entire lifecycle.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/problems"
              className="rounded bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 text-xs font-semibold transition-colors"
            >
              Explore All Challenges
            </Link>
            <Link
              href="/login"
              className="rounded border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 px-5 py-2.5 text-xs font-medium transition-colors"
            >
              1-Click Demo Login
            </Link>
          </div>
        </div>
      </section>

      {/* ── Minimal Footer ── */}
      <footer className="border-t border-slate-800/60 py-6 text-xs text-slate-500">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>CivicSolve • SIH26043 Intelligent Societal Problem-Solving Platform</div>
          <div className="flex items-center gap-4">
            <Link href="/problems" className="hover:text-slate-300">Challenges</Link>
            <Link href="/solution-library" className="hover:text-slate-300">Solutions</Link>
            <Link href="/partners" className="hover:text-slate-300">Partners</Link>
            <Link href="/demo" className="hover:text-slate-300">Judge Runner</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
