'use client'

import React, { useState, useEffect, useRef } from 'react'
import AppShell from '@/components/layout/app-shell'
import {
  Play,
  RotateCcw,
  CheckCircle2,
  Clock,
  Sparkles,
  Terminal,
  Cpu,
  Users,
  FileCheck,
  Wrench,
  Rocket,
  Activity,
  Award,
  ArrowRight,
  ExternalLink,
  ShieldAlert,
  Droplet,
  Pause,
  FastForward,
  Building,
  Coins,
  ShieldCheck,
  Layers,
  Scale,
  Compass,
  Trophy,
  Check,
  Share2,
  BookOpen,
  Network,
  Star
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface DemoStage {
  id: number
  name: string
  subtitle: string
  icon: React.ComponentType<{ className?: string }>
  badge: string
  logMessage: string
  metricUpdate?: {
    label: string
    value: string
  }
}

const DEMO_STAGES_22: DemoStage[] = [
  {
    id: 1,
    name: '1. Problem Submitted',
    subtitle: 'Citizen Priya Sharma files distress report from Sinnar, Nashik',
    icon: ShieldAlert,
    badge: 'STEP 1/22',
    logMessage:
      '[00:00.10] 📝 Citizen Submission Received: "Groundwater Fluoride & Arsenic in Sinnar Taluka (6 Habitations)". GPS tagged: 19.8512°N, 73.9982°E. Initial reviewStatus: SUBMITTED.',
    metricUpdate: { label: 'Distress Reported', value: '6 Villages / 2,500 Citizens' },
  },
  {
    id: 2,
    name: '2. Collectorate Review',
    subtitle: 'District Collectorate initiates administrative validation',
    icon: Building,
    badge: 'STEP 2/22',
    logMessage:
      '[00:00.90] 🏛️ Collectorate Dispatch: Administrative review initiated by Nashik Zilla Parishad. Ground-truth questionnaire dispatched to field engineers.',
    metricUpdate: { label: 'Administrative Action', value: 'Collectorate Review Started' },
  },
  {
    id: 3,
    name: '3. Ground Reality Verified',
    subtitle: 'Field officer authenticates community water crisis',
    icon: ShieldCheck,
    badge: 'STEP 3/22',
    logMessage:
      '[00:01.80] 🛡️ Ground Reality Verified: Taluka Medical Officer confirms severe dental and skeletal fluorosis cluster. Status updated: VERIFIED.',
    metricUpdate: { label: 'Field Audit', value: 'Verified by Taluka Health Officer' },
  },
  {
    id: 4,
    name: '4. Published to Directory',
    subtitle: 'Challenge listed on National Civic Problem Board',
    icon: Compass,
    badge: 'STEP 4/22',
    logMessage:
      '[00:02.50] 📢 Public Broadcast: Challenge published to open SIH problem directory. reviewStatus transitioned to PUBLISHED. Geocoded on National Civic Map.',
    metricUpdate: { label: 'Public Status', value: 'Live on Civic Explorer' },
  },
  {
    id: 5,
    name: '5. AI Semantic Analysis',
    subtitle: 'NLP models extract domain, contaminants, and SDG goals',
    icon: Cpu,
    badge: 'STEP 5/22',
    logMessage:
      '[00:03.30] 🤖 AI Inference Pipeline: Domain: WATER_SANITATION. Contaminants detected: F- (4.2 mg/L), As (>0.05 mg/L). UN SDG Alignment: SDG 6 (Clean Water) & SDG 3 (Good Health).',
    metricUpdate: { label: 'AI Confidence', value: '98.4% Domain Classification' },
  },
  {
    id: 6,
    name: '6. 5-Factor Priority Scorecard',
    subtitle: 'Urgency, population, cost, and ecology calculated',
    icon: Scale,
    badge: 'STEP 6/22',
    logMessage:
      '[00:04.10] ⚖️ Transparent Scoring: Urgency: 28/30, Population: 25/25, Feasibility: 17/20, Environment: 15/15, Vulnerability: 7/10. Overall Score: 92/100 (CRITICAL PRIORITY).',
    metricUpdate: { label: 'Priority Score', value: '92 / 100 PTS (CRITICAL)' },
  },
  {
    id: 7,
    name: '7. Vector Duplicate Check',
    subtitle: 'Duplicate detection matches 4 identical regional challenges',
    icon: Layers,
    badge: 'STEP 7/22',
    logMessage:
      '[00:04.90] 🔍 Duplicate Matrix: Found 3 related aquifer issues in Jalna & Satara (88% similarity). Flagged for Western Maharashtra Regional Water Initiative grouping.',
    metricUpdate: { label: 'Similarity Index', value: '88% Regional Pattern Match' },
  },
  {
    id: 8,
    name: '8. AI Ecosystem Matching',
    subtitle: 'Compatibility dials match IIT Bombay & AquaTech squad',
    icon: Sparkles,
    badge: 'STEP 8/22',
    logMessage:
      '[00:05.70] 🎯 AI Ecosystem Matching: IIT Bombay CTARA matched (95.8% affinity). Student Squad "AquaTech Innovators" matched with 96% hardware skill compatibility.',
    metricUpdate: { label: 'University Match', value: 'IIT Bombay CTARA (95.8%)' },
  },
  {
    id: 9,
    name: '9. Student Squad Formation',
    subtitle: '6 engineering students accept challenge and mobilize',
    icon: Users,
    badge: 'STEP 9/22',
    logMessage:
      '[00:06.50] 👥 Squad Mobilization: Team "AquaTech Innovators" (6 student researchers) claims challenge. Project workspace initialized with 7-milestone roadmap.',
    metricUpdate: { label: 'Engineers Mobilized', value: '6 Student Specialists' },
  },
  {
    id: 10,
    name: '10. Faculty Mentor Assigned',
    subtitle: 'Prof. Anita Desai assigned for technical advisory',
    icon: Award,
    badge: 'STEP 10/22',
    logMessage:
      '[00:07.30] 🎓 Academic Mentorship: Prof. Anita Desai (Distinguished Environmental Faculty, IIT Bombay) joins as technical mentor and research advisor.',
    metricUpdate: { label: 'Faculty Mentor', value: 'Prof. Anita Desai (IITB)' },
  },
  {
    id: 11,
    name: '11. Industry Equipment Support Pledged',
    subtitle: 'TCS Industry Partner pledges 50 IoT nodes & testing sandbox',
    icon: Building,
    badge: 'STEP 11/22',
    logMessage:
      '[00:08.10] 🏭 Industry & Partner Support: Tata Consultancy Services pledges 50 IoT sensor nodes and pilot testing sandbox in Nashik.',
    metricUpdate: { label: 'Equipment Sandbox', value: '50 IoT Nodes & Lab by TCS' },
  },
  {
    id: 12,
    name: '12. Proposal Blueprint Submitted',
    subtitle: 'Engineering BOM and schematic submitted to workspace',
    icon: FileCheck,
    badge: 'STEP 12/22',
    logMessage:
      '[00:08.90] 📜 Technical Blueprint: Full proposal submitted. Bill of Materials: ₹1,05,500. Electrochemical filtration protocol verified for Sinnar water profile.',
    metricUpdate: { label: 'Proposal Status', value: 'Submitted with Full BOM' },
  },
  {
    id: 13,
    name: '13. 5-Criteria Evaluation',
    subtitle: 'Accredited judge scores solution at 92.5/100',
    icon: Star,
    badge: 'STEP 13/22',
    logMessage:
      '[00:09.70] ⭐ Expert Rubric Evaluation: Innovation: 9/10, Feasibility: 9/10, Cost: 9/10, Scalability: 9/10, Social: 10/10. Overall: 92.5/100. RECOMMENDED FOR PILOT.',
    metricUpdate: { label: 'Evaluation Score', value: '92.5 / 100 (Recommended)' },
  },
  {
    id: 14,
    name: '14. Hardware Prototype Built',
    subtitle: 'ESP32 LoRaWAN optical ion-selective sensor calibrated',
    icon: Wrench,
    badge: 'STEP 14/22',
    logMessage:
      '[00:10.50] ⚙️ Hardware Prototype: Bench calibrated prototype v1.4 tested in IIT Bombay Environmental Engineering Lab. Repeatability error &lt; 2%.',
    metricUpdate: { label: 'Prototype Status', value: 'Calibrated Bench Unit v1.4' },
  },
  {
    id: 15,
    name: '15. Field Pilot Deployed',
    subtitle: '3 community kiosks equipped with solar telemetry nodes',
    icon: Rocket,
    badge: 'STEP 15/22',
    logMessage:
      '[00:11.30] 🚚 Community Field Pilot: 3 solar-powered filtration kiosks installed at Sinnar gram panchayat handpumps. MQTT telemetry handshake confirmed.',
    metricUpdate: { label: 'Pilot Sandbox', value: '3 Kiosks Streaming Live' },
  },
  {
    id: 16,
    name: '16. Permanent District Rollout',
    subtitle: '24 continuous nodes active across 6 habitations',
    icon: Activity,
    badge: 'STEP 16/22',
    logMessage:
      '[00:12.10] 🌐 Scaled Deployment: All 24 continuous sensor nodes deployed across 6 rural habitations. Real-time telemetry reporting 99.8% uptime.',
    metricUpdate: { label: 'District Rollout', value: '6 Villages / 24 Nodes' },
  },
  {
    id: 17,
    name: '17. Empirical Impact Verified',
    subtitle: 'District Health Lab confirms 78% drop in toxic fluoride',
    icon: Droplet,
    badge: 'STEP 17/22',
    logMessage:
      '[00:12.90] 🧪 Ground-Truth Verification: Nashik District Health Laboratory independent assay confirms fluoride dropped from 4.2 mg/L to 0.9 mg/L (WHO compliant).',
    metricUpdate: { label: 'Fluoride Reduction', value: '4.2 ➔ 0.9 mg/L (-78%)' },
  },
  {
    id: 18,
    name: '18. Solution Library Publishing',
    subtitle: 'Standardized blueprint archived in National Solution Library',
    icon: BookOpen,
    badge: 'STEP 18/22',
    logMessage:
      '[00:13.70] 📚 Reusable Solution Archived: Solution standardized as "Solar Electro-Chemical Adsorption Unit" in the National Civic Solution Library for open adoption.',
    metricUpdate: { label: 'Library Status', value: 'Published Reusable Blueprint' },
  },
  {
    id: 19,
    name: '19. Regional Adaptation Pilot',
    subtitle: 'Jalna District Collector adapts blueprint for 4 villages',
    icon: Network,
    badge: 'STEP 19/22',
    logMessage:
      '[00:14.50] 🔄 Cross-Regional Adaptation: Jalna Municipal Council initiates adaptation project using AquaTech blueprint. Zero redevelopment overhead!',
    metricUpdate: { label: 'Adaptation Initiated', value: 'Jalna, Maharashtra Pilot' },
  },
  {
    id: 20,
    name: '20. Digital Certificate Issued',
    subtitle: 'Cryptographic SHA-256 credential signed by Govt of India',
    icon: Award,
    badge: 'STEP 20/22',
    logMessage:
      '[00:15.30] 🎓 Credential Generation: Certificate "cert-nashik-001" generated with SHA-256 hash. Co-signed by Dr. Abhay Jere (CIO, Ministry of Education).',
    metricUpdate: { label: 'Credential ID', value: 'cert-nashik-001' },
  },
  {
    id: 21,
    name: '21. Public QR Ledger Verification',
    subtitle: 'QR code verified on tamper-proof civic ledger',
    icon: CheckCircle2,
    badge: 'STEP 21/22',
    logMessage:
      '[00:16.10] 🔗 Public Ledger Audit: QR verification ledger accessed at /verify/cert-nashik-001. Cryptographic hash authenticity validated: 100% AUTHENTIC.',
    metricUpdate: { label: 'Ledger Audit', value: 'Verified Authentic & Active' },
  },
  {
    id: 22,
    name: '22. Leaderboard & Honors',
    subtitle: 'AquaTech and IIT Bombay climb to Rank #1 in Maharashtra',
    icon: Trophy,
    badge: 'STEP 22/22',
    logMessage:
      '[00:16.90] 🏆 National Honors: AquaTech Innovators awarded 980 Civic Impact Points. IIT Bombay awarded Top Innovation University. Full lifecycle complete!',
    metricUpdate: { label: 'National Rank', value: 'Rank #1 Maharashtra (980 pts)' },
  },
]

export default function LiveDemoPage() {
  const [currentStage, setCurrentStage] = useState<number>(0)
  const [isRunning, setIsRunning] = useState<boolean>(false)
  const [isCompleted, setIsCompleted] = useState<boolean>(false)
  const [speed, setSpeed] = useState<number>(2) // 1x, 2x, 5x
  const [logs, setLogs] = useState<string[]>([
    'CivicSolve SIH 2026 End-to-End 22-Stage Autonomous Lifecycle Simulator initialized.',
    'Ready to simulate full lifecycle of civic problem resolution. Press "RUN 22-STEP LIVE DEMO" to begin.',
  ])

  const terminalEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollTop = terminalEndRef.current.scrollHeight
    }
  }, [logs])

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (isRunning && currentStage < DEMO_STAGES_22.length) {
      const delay = 1400 / speed
      timer = setTimeout(() => {
        const nextStage = currentStage + 1
        setCurrentStage(nextStage)

        const stageData = DEMO_STAGES_22[nextStage - 1]
        if (stageData) {
          setLogs((prev) => [...prev, stageData.logMessage])
        }

        if (nextStage >= DEMO_STAGES_22.length) {
          setIsRunning(false)
          setIsCompleted(true)
          toast.success('Full 22-Stage Lifecycle Accomplished! 🎉', {
            description: 'From citizen report to verifiable digital certificate and regional adaptation.',
          })
        }
      }, delay)
    }

    return () => clearTimeout(timer)
  }, [isRunning, currentStage, speed])

  const handleStartDemo = () => {
    if (isCompleted) {
      handleReset()
    }
    setIsRunning(true)
    if (currentStage === 0) {
      setLogs((prev) => [
        ...prev,
        '------------------------------------------------------------------------',
        '🚀 DISPATCHING FULL 22-STEP SIH26043 CIVIC INNOVATION LIFECYCLE',
        '------------------------------------------------------------------------',
      ])
    }
  }

  const handlePause = () => {
    setIsRunning(false)
  }

  const handleReset = () => {
    setIsRunning(false)
    setCurrentStage(0)
    setIsCompleted(false)
    setLogs([
      'CivicSolve SIH 2026 Simulation Engine reset.',
      'Ready to execute full 22-stage lifecycle demonstration.',
    ])
  }

  const handleStepForward = () => {
    if (currentStage < DEMO_STAGES_22.length) {
      const nextStage = currentStage + 1
      setCurrentStage(nextStage)
      const stageData = DEMO_STAGES_22[nextStage - 1]
      if (stageData) {
        setLogs((prev) => [...prev, stageData.logMessage])
      }
      if (nextStage >= DEMO_STAGES_22.length) {
        setIsCompleted(true)
      }
    }
  }

  const progressPercent = Math.round((currentStage / DEMO_STAGES_22.length) * 100)

  return (
    <AppShell>
      <div className="space-y-8 pb-16">
        {/* Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-[#0a1824] via-[#0d2133] to-[#091522] p-6 lg:p-8 shadow-[0_0_60px_rgba(16,185,129,0.15)]">
          <div className="absolute top-0 right-0 h-64 w-64 bg-emerald-500/10 blur-[90px] pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-300">
                <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                Smart India Hackathon 2026 • Full 22-Step Judge Demonstration Runner
              </div>

              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                Complete End-to-End Civic Innovation Runner
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Watch the complete 22-step lifecycle unfold: Citizen Report ➔ Collectorate Verification ➔ 8-Stage AI Analysis ➔ 5-Factor Priority Scoring ➔ Duplicate Grouping ➔ Multi-Entity Matching ➔ Team Formation ➔ Equipment Sandbox ➔ Proposal ➔ 5-Criteria Rubric ➔ Hardware Prototype ➔ Field Pilot ➔ Deployment ➔ Telemetry Impact ➔ Solution Library ➔ Adaptation ➔ QR Credential ➔ Leaderboard.
              </p>
            </div>

            {/* Big Action Controls */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              {!isRunning ? (
                <button
                  onClick={handleStartDemo}
                  className="flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 px-6 py-3.5 text-xs sm:text-sm font-black text-slate-950 shadow-xl shadow-emerald-500/25 transition-all active:scale-95 uppercase tracking-wider"
                >
                  <Play className="h-4 w-4 fill-slate-950" />
                  {currentStage === 0
                    ? '🚀 Run 22-Step Live Demo'
                    : isCompleted
                    ? '🔄 Re-Run Complete Pipeline'
                    : '▶ Resume Simulation'}
                </button>
              ) : (
                <button
                  onClick={handlePause}
                  className="flex items-center gap-2 rounded-2xl bg-amber-500 hover:bg-amber-400 px-6 py-3.5 text-xs sm:text-sm font-black text-black shadow-lg transition-all active:scale-95 uppercase tracking-wider"
                >
                  <Pause className="h-4 w-4" />
                  Pause
                </button>
              )}

              <button
                onClick={handleStepForward}
                disabled={isRunning || isCompleted}
                className="rounded-xl border border-white/10 hover:border-white/20 bg-slate-800/80 p-3 text-xs font-bold text-slate-300 hover:text-white transition-colors disabled:opacity-40"
                title="Advance 1 step"
              >
                <FastForward className="h-4 w-4" />
              </button>

              <button
                onClick={handleReset}
                className="rounded-xl border border-white/10 hover:border-white/20 bg-slate-800/80 p-3 text-xs font-bold text-slate-300 hover:text-white transition-colors"
                title="Reset simulation"
              >
                <RotateCcw className="h-4 w-4" />
              </button>

              {/* Speed toggle */}
              <div className="flex items-center rounded-xl bg-slate-800/80 border border-white/10 p-1 text-xs">
                {[1, 2, 5].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSpeed(s)}
                    className={`px-2.5 py-1 rounded-lg font-mono font-bold transition-colors ${
                      speed === s ? 'bg-cyan-500 text-black' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Live Progress Bar */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-5 backdrop-blur-xl space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300 flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${isRunning ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
              Active Step: {currentStage} of {DEMO_STAGES_22.length} (
              <span className="text-teal-300">
                {currentStage > 0 ? DEMO_STAGES_22[currentStage - 1]?.name : 'Ready to Launch'}
              </span>
              )
            </span>
            <span className="font-mono font-bold text-cyan-300">{progressPercent}% COMPLETE</span>
          </div>

          <div className="h-3 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-blue-500 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* 22-Stage Stepper Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {DEMO_STAGES_22.map((stage) => {
            const Icon = stage.icon
            const isDone = currentStage >= stage.id
            const isCurrent = currentStage === stage.id

            return (
              <div
                key={stage.id}
                className={cn(
                  'relative overflow-hidden rounded-2xl border p-3.5 transition-all duration-300 flex flex-col justify-between',
                  isDone
                    ? 'border-emerald-500/40 bg-emerald-950/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                    : isCurrent
                    ? 'border-cyan-500 bg-cyan-950/30 shadow-[0_0_25px_rgba(6,182,212,0.3)] ring-2 ring-cyan-500/40'
                    : 'border-white/5 bg-slate-900/40 opacity-60'
                )}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={cn(
                        'rounded px-1.5 py-0.5 text-[9px] font-mono font-bold',
                        isDone
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : isCurrent
                          ? 'bg-cyan-500/20 text-cyan-300 animate-pulse'
                          : 'bg-slate-800 text-slate-500'
                      )}
                    >
                      {stage.badge}
                    </span>

                    {isDone ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    ) : isCurrent ? (
                      <Clock className="h-3.5 w-3.5 text-cyan-400 animate-spin" />
                    ) : (
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-700" />
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-1.5">
                    <div
                      className={cn(
                        'p-1.5 rounded-lg shrink-0',
                        isDone ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <h3 className="font-bold text-white text-[11px] truncate leading-tight">{stage.name}</h3>
                  </div>

                  <p className="text-[10px] text-slate-400 line-clamp-2 leading-tight">
                    {stage.subtitle}
                  </p>
                </div>

                {stage.metricUpdate && isDone && (
                  <div className="mt-2 pt-1.5 border-t border-white/5 text-[9px] font-mono text-cyan-300 truncate">
                    ✓ {stage.metricUpdate.value}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Real-time Animated Event Terminal */}
        <div className="rounded-2xl border border-white/10 bg-[#070d18] shadow-2xl overflow-hidden">
          <div className="bg-slate-900/90 px-4 py-3 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-emerald-400" />
              <span className="text-xs font-mono font-bold text-slate-300">
                CivicSolve 22-Stage Execution Telemetry Terminal
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
            </div>
          </div>

          <div
            ref={terminalEndRef}
            className="p-5 font-mono text-xs text-emerald-300/90 space-y-2 max-h-64 overflow-y-auto scrollbar-thin bg-black/40"
          >
            {logs.map((log, idx) => (
              <div
                key={idx}
                className={cn(
                  'transition-opacity duration-300',
                  log.startsWith('[-') || log.startsWith('🚀')
                    ? 'text-cyan-300 font-bold'
                    : log.includes('CRITICAL') || log.includes('Fluoride')
                    ? 'text-amber-300'
                    : log.includes('AUTHENTIC') || log.includes('Verified') || log.includes('verified')
                    ? 'text-emerald-400 font-bold'
                    : 'text-slate-300'
                )}
              >
                {log}
              </div>
            ))}
          </div>
        </div>

        {/* Completion Celebration Card with All Direct Links */}
        {isCompleted && (
          <div className="relative overflow-hidden rounded-3xl border-2 border-emerald-500/50 bg-gradient-to-r from-emerald-950/60 via-slate-900/90 to-cyan-950/60 p-8 shadow-[0_0_50px_rgba(16,185,129,0.2)]">
            <div className="flex flex-col gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/30">
                  <CheckCircle2 className="h-4 w-4" />
                  FULL 22-STEP LIFECYCLE DEMONSTRATION COMPLETE
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  Nashik Groundwater Remediation Successfully Verified!
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-3xl">
                  Every phase from citizen submission to public QR verification is live and inspectable in the database. Explore the live endpoints below:
                </p>
              </div>

              {/* Direct Links to Artifacts */}
              <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-white/10">
                <Link
                  href="/problems"
                  className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-800 hover:bg-slate-700 px-4 py-2.5 text-xs font-bold text-white transition-colors"
                >
                  <Compass className="h-3.5 w-3.5" />
                  Problem Board
                </Link>

                <Link
                  href="/map"
                  className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-800 hover:bg-slate-700 px-4 py-2.5 text-xs font-bold text-white transition-colors"
                >
                  <Activity className="h-3.5 w-3.5" />
                  Civic Map
                </Link>

                <Link
                  href="/solution-library"
                  className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-800 hover:bg-slate-700 px-4 py-2.5 text-xs font-bold text-teal-300 transition-colors"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  Solution Library
                </Link>

                <Link
                  href="/partners"
                  className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-800 hover:bg-slate-700 px-4 py-2.5 text-xs font-bold text-amber-300 transition-colors"
                >
                  <Building className="h-3.5 w-3.5" />
                  Industry Partners
                </Link>

                <Link
                  href="/certificates/cert-nashik-001"
                  className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 px-4 py-2.5 text-xs font-bold text-black shadow-md transition-all active:scale-95"
                >
                  <Award className="h-4 w-4" />
                  View Certificate
                </Link>

                <Link
                  href="/verify/cert-nashik-001"
                  className="flex items-center gap-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 px-4 py-2.5 text-xs font-bold text-white shadow-md transition-all active:scale-95"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Test QR Verification
                </Link>

                <Link
                  href="/leaderboard"
                  className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-800 hover:bg-slate-700 px-4 py-2.5 text-xs font-bold text-white transition-colors"
                >
                  <Trophy className="h-3.5 w-3.5" />
                  Leaderboard
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  )
}
