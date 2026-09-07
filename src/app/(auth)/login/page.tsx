'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import {
  Globe,
  Sparkles,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Loader2,
  Shield,
  GraduationCap,
  Microscope,
  Building,
  User,
  Phone,
  KeyRound,
  CheckCircle2,
  Building2,
  Fingerprint,
  FileCheck,
  Zap,
  Briefcase,
  Layers,
  ChevronRight,
  RefreshCw,
  QrCode,
  ShieldCheck,
  Code2,
  Cpu
} from 'lucide-react'

type LoginMethod = 'STUDENT' | 'GOVERNMENT' | 'CITIZEN' | 'FACULTY' | 'INDUSTRY' | 'FAST_PASS'

interface MethodConfig {
  id: LoginMethod
  title: string
  subtitle: string
  icon: React.ComponentType<{ className?: string }>
  themeGradient: string
  accentBorder: string
  badgeText: string
  badgeClass: string
  bannerClass: string
  bannerTextClass: string
  watermarkIcon: React.ComponentType<{ className?: string }>
  demoEmail: string
  demoPassword: string
  roleLabel: string
}

const METHODS: Record<LoginMethod, MethodConfig> = {
  STUDENT: {
    id: 'STUDENT',
    title: 'Student Innovation Portal',
    subtitle: 'NIRF Engineering & Innovation Campus Login',
    icon: GraduationCap,
    themeGradient: 'from-emerald-500 via-teal-600 to-cyan-500',
    accentBorder: 'border-emerald-500/40 dark:border-emerald-500/40 focus-within:border-emerald-500',
    badgeText: 'SIH26043 SOLVER REGISTRY',
    badgeClass: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    bannerClass: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-500/30',
    bannerTextClass: 'text-emerald-900 dark:text-emerald-200',
    watermarkIcon: Code2,
    demoEmail: 'arun.kumar@iitb.ac.in',
    demoPassword: 'password123',
    roleLabel: 'Arun Kumar (IIT Bombay — Team Lead)'
  },
  GOVERNMENT: {
    id: 'GOVERNMENT',
    title: 'District Collectorate & Municipal Portal',
    subtitle: 'Government Official & Field Administration Clearance',
    icon: Building2,
    themeGradient: 'from-amber-500 via-orange-600 to-yellow-500',
    accentBorder: 'border-amber-500/40 dark:border-amber-500/40 focus-within:border-amber-500',
    badgeText: 'GOVERNMENT OF INDIA SECURE NIC',
    badgeClass: 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300',
    bannerClass: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-500/30',
    bannerTextClass: 'text-amber-900 dark:text-amber-200',
    watermarkIcon: ShieldCheck,
    demoEmail: 'collector@maharashtra.gov.in',
    demoPassword: 'password123',
    roleLabel: 'Rajesh Patil (District Collector)'
  },
  CITIZEN: {
    id: 'CITIZEN',
    title: 'Citizen Ground Reporter',
    subtitle: 'Instant Mobile OTP & Problem Reporting Gateway',
    icon: User,
    themeGradient: 'from-cyan-500 via-blue-600 to-sky-400',
    accentBorder: 'border-cyan-500/40 dark:border-cyan-500/40 focus-within:border-cyan-500',
    badgeText: 'GROUND TRUTH CITIZEN ACCESS',
    badgeClass: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300',
    bannerClass: 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-500/30',
    bannerTextClass: 'text-cyan-900 dark:text-cyan-200',
    watermarkIcon: Phone,
    demoEmail: 'priya.sharma@gmail.com',
    demoPassword: 'password123',
    roleLabel: 'Priya Sharma (Citizen Reporter, Nashik)'
  },
  FACULTY: {
    id: 'FACULTY',
    title: 'Faculty Mentor & Dean Portal',
    subtitle: 'Institutional Research, Review & Academic Grants',
    icon: Microscope,
    themeGradient: 'from-indigo-500 via-purple-600 to-pink-500',
    accentBorder: 'border-indigo-500/40 dark:border-indigo-500/40 focus-within:border-indigo-500',
    badgeText: 'ACADEMIC RESEARCH & MENTORSHIP',
    badgeClass: 'border-indigo-500/30 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300',
    bannerClass: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-500/30',
    bannerTextClass: 'text-indigo-900 dark:text-indigo-200',
    watermarkIcon: Microscope,
    demoEmail: 'prof.desai@iitb.ac.in',
    demoPassword: 'password123',
    roleLabel: 'Prof. Anita Desai (IIT Bombay Mentor)'
  },
  INDUSTRY: {
    id: 'INDUSTRY',
    title: 'Industry CSR & Foundation Portal',
    subtitle: 'Corporate Grants, Sponsorship & Sandbox Deployment',
    icon: Briefcase,
    themeGradient: 'from-purple-500 via-violet-600 to-indigo-500',
    accentBorder: 'border-purple-500/40 dark:border-purple-500/40 focus-within:border-purple-500',
    badgeText: 'CORPORATE CSR PARTNERSHIP',
    badgeClass: 'border-purple-500/30 bg-purple-500/10 text-purple-700 dark:text-purple-300',
    bannerClass: 'bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-500/30',
    bannerTextClass: 'text-purple-900 dark:text-purple-200',
    watermarkIcon: Building,
    demoEmail: 'csr@tcs.com',
    demoPassword: 'password123',
    roleLabel: 'Suresh Narayanan (TCS CSR Foundation)'
  },
  FAST_PASS: {
    id: 'FAST_PASS',
    title: 'Biometric Passkey & Sandbox',
    subtitle: 'Instant Role Simulation & Passkey Evaluation',
    icon: Fingerprint,
    themeGradient: 'from-blue-500 via-indigo-600 to-cyan-400',
    accentBorder: 'border-blue-500/40 dark:border-blue-500/40 focus-within:border-blue-500',
    badgeText: 'HACKATHON EVALUATION PASS',
    badgeClass: 'border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300',
    bannerClass: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-500/30',
    bannerTextClass: 'text-blue-900 dark:text-blue-200',
    watermarkIcon: Zap,
    demoEmail: 'admin@civicsolve.in',
    demoPassword: 'password123',
    roleLabel: 'Platform Administrator'
  }
}

const ALL_DEMO_PERSONAS = [
  {
    id: 'admin',
    role: 'ADMIN',
    label: 'Platform Admin',
    name: 'Platform Administrator',
    email: 'admin@civicsolve.in',
    password: 'password123',
    icon: Shield,
    badgeColor: 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30',
  },
  {
    id: 'government',
    role: 'GOVERNMENT',
    label: 'Government Official',
    name: 'Rajesh Patil (District Collector)',
    email: 'collector@maharashtra.gov.in',
    password: 'password123',
    icon: Building2,
    badgeColor: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
  },
  {
    id: 'student',
    role: 'STUDENT',
    label: 'Student Solver',
    name: 'Arun Kumar (IIT Bombay)',
    email: 'arun.kumar@iitb.ac.in',
    password: 'password123',
    icon: GraduationCap,
    badgeColor: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
  },
  {
    id: 'faculty',
    role: 'FACULTY',
    label: 'Faculty Mentor',
    name: 'Prof. Anita Desai (IIT Bombay)',
    email: 'prof.desai@iitb.ac.in',
    password: 'password123',
    icon: Microscope,
    badgeColor: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30',
  },
  {
    id: 'citizen',
    role: 'CITIZEN',
    label: 'Citizen Reporter',
    name: 'Priya Sharma (Nashik)',
    email: 'priya.sharma@gmail.com',
    password: 'password123',
    icon: User,
    badgeColor: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30',
  },
  {
    id: 'university',
    role: 'UNIVERSITY',
    label: 'University Leader',
    name: 'Prof. Devang Khakhar (IIT Bombay)',
    email: 'vc@iitb.ac.in',
    password: 'password123',
    icon: GraduationCap,
    badgeColor: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30',
  },
  {
    id: 'industry',
    role: 'INDUSTRY',
    label: 'Industry Partner',
    name: 'Suresh Narayanan (TCS Foundation)',
    email: 'csr@tcs.com',
    password: 'password123',
    icon: Briefcase,
    badgeColor: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30',
  },
  {
    id: 'ngo',
    role: 'NGO',
    label: 'NGO Partner',
    name: 'Dr. Radhika Sen (Jal Jeevan Alliance)',
    email: 'director@jaljeevan.org',
    password: 'password123',
    icon: ShieldCheck,
    badgeColor: 'bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/30',
  }
]

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'

  const [activeMethod, setActiveMethod] = useState<LoginMethod>('STUDENT')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingDemoId, setLoadingDemoId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Method-specific interactive state
  const [studentUniversity, setStudentUniversity] = useState('IIT Bombay')
  const [studentRollNo, setStudentRollNo] = useState('22B030018')
  const [govDistrict, setGovDistrict] = useState('Nashik Collectorate')
  const [govEmployeeId, setGovEmployeeId] = useState('NIC-MH-4921')
  const [citizenPhone, setCitizenPhone] = useState('+91 98201 44521')
  const [citizenOtp, setCitizenOtp] = useState(['5', '2', '8', '1', '9', '4'])
  const [facultyDept, setFacultyDept] = useState('Environmental Sciences & Water Resource Center')
  const [industrySsoDomain, setIndustrySsoDomain] = useState('tcs.com')

  const currentConfig = METHODS[activeMethod]

  // Pre-fill corresponding credentials on method switch
  useEffect(() => {
    setEmail(currentConfig.demoEmail)
    setPassword(currentConfig.demoPassword)
    setErrorMessage(null)
  }, [activeMethod])

  async function executeSignIn(userEmail: string, userPass: string, personaId?: string) {
    setErrorMessage(null)
    setIsLoading(true)
    if (personaId) setLoadingDemoId(personaId)

    try {
      const res = await signIn('credentials', {
        email: userEmail.trim(),
        password: userPass,
        redirect: false,
        callbackUrl,
      })

      if (res?.error) {
        setErrorMessage('Invalid credentials. Check your inputs or use the 1-Click Demo selector.')
        setIsLoading(false)
        setLoadingDemoId(null)
      } else if (res?.ok) {
        router.push(callbackUrl)
        router.refresh()
      } else {
        setIsLoading(false)
        setLoadingDemoId(null)
      }
    } catch (err) {
      setErrorMessage('An unexpected authentication error occurred. Please try again.')
      setIsLoading(false)
      setLoadingDemoId(null)
    }
  }

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) {
      setErrorMessage('Please enter your credentials.')
      return
    }
    await executeSignIn(email, password)
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-slate-50 dark:bg-[#070b14] overflow-hidden text-slate-900 dark:text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-700 dark:selection:text-cyan-200">
      
      {/* Background ambient lighting */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-blue-500/10 dark:bg-blue-600/10 blur-[140px]" />
        <div className="absolute bottom-0 -right-20 h-[450px] w-[450px] rounded-full bg-indigo-500/10 dark:bg-indigo-600/10 blur-[140px]" />
        <div className="hero-grid absolute inset-0 opacity-30 dark:opacity-40" />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto space-y-6">
        
        {/* Header Strip */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-5">
          <Link
            href="/"
            className="inline-flex items-center gap-3 transition-transform hover:scale-105 duration-200"
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-0.5 shadow-[0_0_20px_rgba(37,99,235,0.3)]">
              <div className="flex h-full w-full items-center justify-center rounded-[9px] bg-white dark:bg-[#070b14]">
                <Globe className="h-5 w-5 text-blue-600 dark:text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                  Civic<span className="text-blue-600 dark:text-blue-500">Solve</span>
                </span>
                <span className="rounded border border-blue-500/30 bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-bold text-blue-600 dark:text-blue-400 font-mono">
                  SIH26043
                </span>
              </div>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block -mt-0.5">
                National Societal Innovation Platform
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs font-mono text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              ← Back to Portal
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link
              href="/register"
              className="text-xs font-semibold text-blue-600 dark:text-cyan-400 hover:underline transition-colors"
            >
              Register New Entity →
            </Link>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* METHOD / PERSONA NAVIGATION TABS */}
        {/* ========================================================================= */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-blue-600 dark:text-cyan-400" />
              Select Specialized Identity & Access Portal:
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              Active: <strong className="text-slate-800 dark:text-slate-200">{currentConfig.id}</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {(Object.keys(METHODS) as LoginMethod[]).map((methodKey) => {
              const method = METHODS[methodKey]
              const Icon = method.icon
              const isSelected = activeMethod === methodKey

              return (
                <button
                  key={methodKey}
                  type="button"
                  onClick={() => setActiveMethod(methodKey)}
                  className={`relative p-3 rounded-xl border transition-all text-left flex flex-col justify-between gap-2 overflow-hidden ${
                    isSelected
                      ? `bg-white dark:bg-slate-900 border-blue-500 dark:border-white/30 shadow-md ring-2 ring-blue-500/20 dark:ring-white/20 text-slate-900 dark:text-white`
                      : 'bg-white/70 dark:bg-slate-950/60 border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/15 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {isSelected && (
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${method.themeGradient}`} />
                  )}
                  <div className="flex items-center justify-between">
                    <div className={`p-1.5 rounded-lg border ${isSelected ? method.badgeClass : 'border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900'}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    {isSelected && (
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-cyan-400 animate-pulse" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-bold leading-tight line-clamp-1">{method.title.split(' ')[0]} {method.title.split(' ')[1]}</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 line-clamp-1 mt-0.5">{method.id}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MAIN DYNAMIC AUTH CONTAINER */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT 60%: THE DEDICATED METHOD UI */}
          <div className="lg:col-span-7 space-y-4">
            <div className={`rounded-2xl border ${currentConfig.accentBorder} bg-white dark:bg-slate-900/90 p-6 shadow-xl dark:shadow-2xl relative overflow-hidden transition-all duration-300`}>
              
              {/* Background Watermark Icon */}
              <div className="pointer-events-none absolute -bottom-8 -right-8 opacity-[0.04] dark:opacity-[0.05] text-slate-900 dark:text-white">
                <currentConfig.watermarkIcon className="h-60 w-60" />
              </div>

              {/* Portal Header */}
              <div className="flex items-start justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-4 mb-5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${currentConfig.badgeClass}`}>
                      {currentConfig.badgeText}
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                    <currentConfig.icon className="h-5 w-5 text-blue-600 dark:text-cyan-400" />
                    {currentConfig.title}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {currentConfig.subtitle}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => executeSignIn(currentConfig.demoEmail, currentConfig.demoPassword)}
                  disabled={isLoading}
                  className="shrink-0 font-mono text-[10px] font-semibold text-blue-600 dark:text-cyan-400 hover:text-blue-700 dark:hover:text-cyan-300 bg-blue-500/10 dark:bg-cyan-500/10 border border-blue-500/20 dark:border-cyan-500/30 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors"
                >
                  <Sparkles className="h-3 w-3" />
                  Auto-Fill
                </button>
              </div>

              {/* Error banner */}
              {errorMessage && (
                <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-300 animate-fadeIn">
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-red-700 dark:text-red-200">Authentication Alert</p>
                    <p className="mt-0.5">{errorMessage}</p>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* METHOD 1: STUDENT SOLVER */}
              {/* ------------------------------------------------------------- */}
              {activeMethod === 'STUDENT' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className={`p-3 rounded-xl border flex items-center justify-between text-xs ${currentConfig.bannerClass}`}>
                    <div className="flex items-center gap-2.5">
                      <GraduationCap className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <div>
                        <span className={`font-semibold block ${currentConfig.bannerTextClass}`}>IIT Bombay — Innovation Cell</span>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">Team: AquaTech Innovators • Rank #3</span>
                      </div>
                    </div>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 font-bold">
                      NIRF #1
                    </span>
                  </div>

                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-mono text-slate-700 dark:text-slate-300">University / Campus</label>
                        <select
                          value={studentUniversity}
                          onChange={(e) => setStudentUniversity(e.target.value)}
                          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none"
                        >
                          <option>IIT Bombay (Powai)</option>
                          <option>NIT Trichy</option>
                          <option>COEP Pune</option>
                          <option>BITS Pilani</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-mono text-slate-700 dark:text-slate-300">Roll No / Student ID</label>
                        <input
                          type="text"
                          value={studentRollNo}
                          onChange={(e) => setStudentRollNo(e.target.value)}
                          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-white font-mono focus:border-emerald-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-mono text-slate-700 dark:text-slate-300">Campus Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="arun.kumar@iitb.ac.in"
                          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 pl-9 text-xs text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-mono text-slate-700 dark:text-slate-300">Password</label>
                        <button
                          type="button"
                          onClick={() => setPassword('password123')}
                          className="text-[10px] text-emerald-600 dark:text-emerald-400 hover:underline font-mono"
                        >
                          Fill &apos;password123&apos;
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 pl-9 pr-9 text-xs text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all"
                    >
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <GraduationCap className="h-4 w-4" />}
                      <span>Launch Student Engineering Hub</span>
                    </button>
                  </form>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* METHOD 2: GOVERNMENT & COLLECTORATE */}
              {/* ------------------------------------------------------------- */}
              {activeMethod === 'GOVERNMENT' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className={`p-3 rounded-xl border flex items-center justify-between text-xs ${currentConfig.bannerClass}`}>
                    <div className="flex items-center gap-2.5">
                      <ShieldCheck className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
                      <div>
                        <span className={`font-semibold block ${currentConfig.bannerTextClass}`}>NIC Gov Cloud Gateway</span>
                        <span className="text-[10px] text-amber-600 dark:text-amber-400 font-mono">Jurisdiction: Nashik Division • Clearance Level 4</span>
                      </div>
                    </div>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 font-bold">
                      .GOV.IN
                    </span>
                  </div>

                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-mono text-slate-700 dark:text-slate-300">District / Department</label>
                        <select
                          value={govDistrict}
                          onChange={(e) => setGovDistrict(e.target.value)}
                          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none"
                        >
                          <option>Nashik Collectorate</option>
                          <option>Nagpur Municipal Corp</option>
                          <option>Pune Metropolitan Auth</option>
                          <option>Brihanmumbai Admin</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-mono text-slate-700 dark:text-slate-300">Gov Employee / DSC ID</label>
                        <input
                          type="text"
                          value={govEmployeeId}
                          onChange={(e) => setGovEmployeeId(e.target.value)}
                          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-white font-mono focus:border-amber-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-mono text-slate-700 dark:text-slate-300">Official Gov Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="collector@maharashtra.gov.in"
                          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 pl-9 text-xs text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-mono text-slate-700 dark:text-slate-300">Official Passkey / Password</label>
                        <button
                          type="button"
                          onClick={() => setPassword('password123')}
                          className="text-[10px] text-amber-600 dark:text-amber-400 hover:underline font-mono"
                        >
                          Fill &apos;password123&apos;
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 pl-9 pr-9 text-xs text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs shadow-lg shadow-amber-600/30 flex items-center justify-center gap-2 transition-all"
                    >
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Building2 className="h-4 w-4" />}
                      <span>Authenticate Municipal Command Center</span>
                    </button>
                  </form>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* METHOD 3: CITIZEN REPORTER */}
              {/* ------------------------------------------------------------- */}
              {activeMethod === 'CITIZEN' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className={`p-3 rounded-xl border flex items-center justify-between text-xs ${currentConfig.bannerClass}`}>
                    <div className="flex items-center gap-2.5">
                      <Phone className="h-4 w-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                      <div>
                        <span className={`font-semibold block ${currentConfig.bannerTextClass}`}>Civic Fast Reporter Gateway</span>
                        <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-mono">DigiLocker & SMS OTP Verified</span>
                      </div>
                    </div>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 font-bold">
                      1-TAP OTP
                    </span>
                  </div>

                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-slate-700 dark:text-slate-300">Citizen Mobile Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          value={citizenPhone}
                          onChange={(e) => setCitizenPhone(e.target.value)}
                          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 pl-9 text-xs text-slate-900 dark:text-white font-mono focus:border-cyan-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Simulated 6-digit OTP keypad */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-mono text-slate-700 dark:text-slate-300">6-Digit SMS Verification Pin</label>
                        <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-mono font-semibold">Auto-Filled: 528194</span>
                      </div>
                      <div className="grid grid-cols-6 gap-2">
                        {citizenOtp.map((digit, idx) => (
                          <input
                            key={idx}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => {
                              const copy = [...citizenOtp]
                              copy[idx] = e.target.value
                              setCitizenOtp(copy)
                            }}
                            className="w-full h-10 text-center font-mono font-bold text-sm bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-cyan-600 dark:text-cyan-300 focus:border-cyan-500 focus:outline-none"
                          />
                        ))}
                      </div>
                    </div>

                    {/* Standard Email & Password hidden inputs */}
                    <input type="hidden" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input type="hidden" value={password} onChange={(e) => setPassword(e.target.value)} />

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 flex items-center justify-center gap-2 transition-all"
                    >
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                      <span>Verify OTP & Open Citizen Intake</span>
                    </button>
                  </form>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* METHOD 4: FACULTY MENTOR */}
              {/* ------------------------------------------------------------- */}
              {activeMethod === 'FACULTY' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className={`p-3 rounded-xl border flex items-center justify-between text-xs ${currentConfig.bannerClass}`}>
                    <div className="flex items-center gap-2.5">
                      <Microscope className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                      <div>
                        <span className={`font-semibold block ${currentConfig.bannerTextClass}`}>Dean & Faculty Evaluation Council</span>
                        <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono">Grant Allocation • SIH Rubrics</span>
                      </div>
                    </div>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30 font-bold">
                      eduID SSO
                    </span>
                  </div>

                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-slate-700 dark:text-slate-300">Department / Research Lab</label>
                      <input
                        type="text"
                        value={facultyDept}
                        onChange={(e) => setFacultyDept(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-mono text-slate-700 dark:text-slate-300">Academic / eduID Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="prof.desai@iitb.ac.in"
                          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 pl-9 text-xs text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-mono text-slate-700 dark:text-slate-300">Faculty Credentials Pin</label>
                        <button
                          type="button"
                          onClick={() => setPassword('password123')}
                          className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline font-mono"
                        >
                          Fill &apos;password123&apos;
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 pl-9 pr-9 text-xs text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
                    >
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Microscope className="h-4 w-4" />}
                      <span>Enter Faculty Review & Scoring Suite</span>
                    </button>
                  </form>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* METHOD 5: INDUSTRY & CSR */}
              {/* ------------------------------------------------------------- */}
              {activeMethod === 'INDUSTRY' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className={`p-3 rounded-xl border flex items-center justify-between text-xs ${currentConfig.bannerClass}`}>
                    <div className="flex items-center gap-2.5">
                      <Briefcase className="h-4 w-4 text-purple-600 dark:text-purple-400 shrink-0" />
                      <div>
                        <span className={`font-semibold block ${currentConfig.bannerTextClass}`}>National CSR Innovation Grant Hub</span>
                        <span className="text-[10px] text-purple-600 dark:text-purple-400 font-mono">SAML 2.0 • Corporate Okta Verified</span>
                      </div>
                    </div>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30 font-bold">
                      SAML SSO
                    </span>
                  </div>

                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-slate-700 dark:text-slate-300">Corporate Foundation Domain</label>
                      <input
                        type="text"
                        value={industrySsoDomain}
                        onChange={(e) => setIndustrySsoDomain(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-white font-mono focus:border-purple-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-mono text-slate-700 dark:text-slate-300">Corporate Work Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="csr@tcs.com"
                          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 pl-9 text-xs text-slate-900 dark:text-white focus:border-purple-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-mono text-slate-700 dark:text-slate-300">Access Key</label>
                        <button
                          type="button"
                          onClick={() => setPassword('password123')}
                          className="text-[10px] text-purple-600 dark:text-purple-400 hover:underline font-mono"
                        >
                          Fill &apos;password123&apos;
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 pl-9 pr-9 text-xs text-slate-900 dark:text-white focus:border-purple-500 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition-all"
                    >
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Building className="h-4 w-4" />}
                      <span>Launch CSR Partnership Suite</span>
                    </button>
                  </form>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* METHOD 6: FAST PASS / PASSKEY */}
              {/* ------------------------------------------------------------- */}
              {activeMethod === 'FAST_PASS' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className={`p-4 rounded-xl border text-center space-y-3 ${currentConfig.bannerClass}`}>
                    <div className="mx-auto w-12 h-12 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                      <Fingerprint className="h-6 w-6 text-blue-600 dark:text-cyan-300 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">Biometric Passkey WebAuthn</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Touch your hardware security key or biometric sensor to sign in instantly with administrator privileges.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => executeSignIn('admin@civicsolve.in', 'password123')}
                      disabled={isLoading}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:opacity-90 text-white font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all"
                    >
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Fingerprint className="h-4 w-4" />}
                      <span>Sign In with Biometric Passkey (Admin)</span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* RIGHT 40%: 1-CLICK INSTANT PERSONA SWITCHER */}
          <div className="lg:col-span-5 space-y-3">
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/80 p-5 shadow-lg backdrop-blur-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Zap className="h-4 w-4 text-blue-600 dark:text-cyan-400" />
                  Instant Persona Switcher (1-Click)
                </span>
                <span className="font-mono text-[10px] text-slate-500">SIH Sandbox</span>
              </div>

              <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                {ALL_DEMO_PERSONAS.map((persona) => {
                  const Icon = persona.icon
                  const isThisLoading = loadingDemoId === persona.id

                  return (
                    <button
                      key={persona.id}
                      type="button"
                      disabled={isLoading}
                      onClick={() => executeSignIn(persona.email, persona.password, persona.id)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-950/60 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:border-slate-300 dark:hover:border-white/20 transition-all text-left flex items-center justify-between gap-3 group disabled:opacity-50"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="h-8 w-8 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                          {isThisLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin text-blue-600 dark:text-cyan-400" />
                          ) : (
                            <Icon className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-cyan-300 transition-colors">
                            {persona.label}
                          </p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                            {persona.email}
                          </p>
                        </div>
                      </div>

                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase shrink-0 ${persona.badgeColor}`}>
                        {persona.role}
                      </span>
                    </button>
                  )
                })}
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-white/5 text-[11px] text-slate-500 dark:text-slate-400 text-center flex items-center justify-center gap-1">
                <span>Default sandbox password:</span>
                <code className="bg-slate-100 dark:bg-slate-950 px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-800 text-blue-600 dark:text-cyan-300 font-mono text-[10px]">
                  password123
                </code>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
