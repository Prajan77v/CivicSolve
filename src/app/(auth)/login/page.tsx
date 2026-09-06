'use client'

import React, { useState } from 'react'
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
} from 'lucide-react'

interface DemoUser {
  id: string
  role: string
  label: string
  name: string
  email: string
  password: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  badgeColor: string
}

const DEMO_USERS: DemoUser[] = [
  {
    id: 'admin',
    role: 'ADMIN',
    label: 'Platform Admin',
    name: 'Platform Administrator',
    email: 'admin@civicsolve.in',
    password: 'password123',
    icon: Shield,
    color: 'hover:border-red-500/50 hover:bg-red-500/10 text-red-300',
    badgeColor: 'bg-red-500/15 text-red-400 border-red-500/30',
  },
  {
    id: 'government',
    role: 'GOVERNMENT',
    label: 'Government Official',
    name: 'Rajesh Patil (District Collector)',
    email: 'collector@maharashtra.gov.in',
    password: 'password123',
    icon: Building,
    color: 'hover:border-amber-500/50 hover:bg-amber-500/10 text-amber-300',
    badgeColor: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  },
  {
    id: 'student',
    role: 'STUDENT',
    label: 'Student Solver',
    name: 'Arun Kumar (IIT Bombay)',
    email: 'arun.kumar@iitb.ac.in',
    password: 'password123',
    icon: GraduationCap,
    color: 'hover:border-emerald-500/50 hover:bg-emerald-500/10 text-emerald-300',
    badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  },
  {
    id: 'faculty',
    role: 'FACULTY',
    label: 'Faculty Mentor',
    name: 'Prof. Anita Desai (IIT Bombay)',
    email: 'prof.desai@iitb.ac.in',
    password: 'password123',
    icon: Microscope,
    color: 'hover:border-indigo-500/50 hover:bg-indigo-500/10 text-indigo-300',
    badgeColor: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
  },
  {
    id: 'citizen',
    role: 'CITIZEN',
    label: 'Citizen Reporter',
    name: 'Priya Sharma (Nashik)',
    email: 'priya.sharma@gmail.com',
    password: 'password123',
    icon: User,
    color: 'hover:border-cyan-500/50 hover:bg-cyan-500/10 text-cyan-300',
    badgeColor: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
  },
  {
    id: 'university',
    role: 'UNIVERSITY',
    label: 'University Leader',
    name: 'Prof. Devang Khakhar (IIT Bombay)',
    email: 'vc@iitb.ac.in',
    password: 'password123',
    icon: GraduationCap,
    color: 'hover:border-blue-500/50 hover:bg-blue-500/10 text-blue-300',
    badgeColor: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  },
  {
    id: 'industry',
    role: 'INDUSTRY',
    label: 'Industry Partner',
    name: 'Suresh Narayanan (TCS Foundation)',
    email: 'csr@tcs.com',
    password: 'password123',
    icon: Building,
    color: 'hover:border-purple-500/50 hover:bg-purple-500/10 text-purple-300',
    badgeColor: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  },
  {
    id: 'ngo',
    role: 'NGO',
    label: 'NGO Partner',
    name: 'Dr. Radhika Sen (Jal Jeevan Alliance)',
    email: 'director@jaljeevan.org',
    password: 'password123',
    icon: Shield,
    color: 'hover:border-teal-500/50 hover:bg-teal-500/10 text-teal-300',
    badgeColor: 'bg-teal-500/15 text-teal-400 border-teal-500/30',
  },
]

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingDemoId, setLoadingDemoId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Handle standard credential form submission
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMessage(null)

    if (!email || !password) {
      setErrorMessage('Please enter both email and password.')
      return
    }

    setIsLoading(true)
    try {
      const res = await signIn('credentials', {
        email: email.trim(),
        password,
        redirect: false,
        callbackUrl,
      })

      if (res?.error) {
        setErrorMessage('Invalid credentials. Check your email and password.')
        setIsLoading(false)
      } else if (res?.ok) {
        router.push(callbackUrl)
        router.refresh()
      } else {
        setIsLoading(false)
      }
    } catch (err) {
      setErrorMessage('An unexpected authentication error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  // Handle 1-click demo login
  async function handleQuickLogin(user: DemoUser) {
    setErrorMessage(null)
    setEmail(user.email)
    setPassword(user.password)
    setLoadingDemoId(user.id)
    setIsLoading(true)

    try {
      const res = await signIn('credentials', {
        email: user.email,
        password: user.password,
        redirect: false,
        callbackUrl,
      })

      if (res?.error) {
        setErrorMessage(`Failed to sign in as ${user.label}. Database might need seeding.`)
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
      setErrorMessage('An unexpected error occurred during quick sign-in.')
      setIsLoading(false)
      setLoadingDemoId(null)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12 bg-[#0a0f1e] overflow-hidden selection:bg-blue-600/30 selection:text-cyan-200">
      {/* Ambient background glows and grid */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/3 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[140px]" />
        <div className="absolute top-2/3 -right-20 h-[450px] w-[450px] rounded-full bg-indigo-600/10 blur-[140px]" />
        <div className="hero-grid absolute inset-0 opacity-70" />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-3 transition-transform hover:scale-105 duration-200"
          >
            <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-0.5 shadow-[0_0_20px_rgba(37,99,235,0.4)]">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#0a0f1e]">
                <Globe className="h-6 w-6 text-cyan-400" />
              </div>
              <Sparkles className="absolute -top-1 -right-1 h-3.5 w-3.5 text-cyan-300 animate-pulse" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-white">
                  Civic<span className="text-blue-500">Solve</span>
                </span>
                <span className="rounded border border-blue-500/30 bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-bold text-blue-400">
                  SIH2026
                </span>
              </div>
              <span className="text-[11px] font-medium text-slate-400">
                Societal Problem-Solving Platform
              </span>
            </div>
          </Link>
          <h1 className="mt-6 text-2xl font-extrabold text-white tracking-tight">
            Sign In to Your Workspace
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Access challenges, project tracking, AI matchmaker, and impact telemetry.
          </p>
        </div>

        {/* Main Glassmorphism Card */}
        <div className="glass-card rounded-2xl border border-white/10 bg-slate-900/80 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl">
          {/* Error message banner */}
          {errorMessage && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs text-red-300 animate-fadeIn">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-red-200">Authentication Failed</p>
                <p className="mt-0.5 text-red-300/90">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 1-CLICK QUICK DEMO LOGINS */}
          {/* ========================================================================= */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                Quick Demo Logins (1-Click)
              </span>
              <span className="text-[10px] text-slate-400">Password: password123</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {DEMO_USERS.map((user) => {
                const Icon = user.icon
                const isThisLoading = loadingDemoId === user.id

                return (
                  <button
                    key={user.id}
                    type="button"
                    disabled={isLoading}
                    onClick={() => handleQuickLogin(user)}
                    className={`flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/60 p-2.5 text-left transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group ${user.color} ${
                      user.id === 'citizen' ? 'sm:col-span-2' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-slate-900 group-hover:scale-105 transition-transform">
                        {isThisLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
                        ) : (
                          <Icon className="h-4 w-4 text-slate-300" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-white truncate">
                          {user.label}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`ml-2 shrink-0 rounded border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${user.badgeColor}`}
                    >
                      {user.role}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <span className="relative bg-slate-900 px-3 text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Or sign in with email
            </span>
          </div>

          {/* Standard Credentials Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-xs font-medium text-slate-300 flex items-center justify-between"
              >
                <span>Email Address</span>
              </label>
              <div className="relative flex items-center">
                <div className="pointer-events-none absolute left-3.5 flex items-center text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@organization.in"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 pl-10 text-sm text-white placeholder-slate-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-xs font-medium text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setPassword('password123')}
                  className="text-[11px] text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Use &apos;password123&apos;
                </button>
              </div>
              <div className="relative flex items-center">
                <div className="pointer-events-none absolute left-3.5 flex items-center text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 pl-10 pr-10 text-sm text-white placeholder-slate-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-slate-400 hover:text-slate-200 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition-all duration-200 hover:bg-blue-500 hover:shadow-blue-500/40 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer note inside card */}
          <div className="mt-6 pt-5 border-t border-white/5 text-center text-xs text-slate-400">
            <span>Don&apos;t have an account yet? </span>
            <Link
              href="/register"
              className="font-semibold text-blue-400 hover:text-cyan-300 transition-colors ml-1"
            >
              Create Account
            </Link>
          </div>
        </div>

        {/* Back to landing link */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-xs text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1"
          >
            <span>← Back to CivicSolve Landing Page</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
