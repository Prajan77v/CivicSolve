'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import {
  Globe,
  Sparkles,
  User,
  Mail,
  Lock,
  Building,
  GraduationCap,
  Microscope,
  Briefcase,
  ArrowRight,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Eye,
  EyeOff,
} from 'lucide-react'

type RoleType = 'CITIZEN' | 'STUDENT' | 'FACULTY' | 'GOVERNMENT' | 'INDUSTRY'

interface RoleOption {
  value: RoleType
  label: string
  subtitle: string
  icon: React.ComponentType<{ className?: string }>
  color: string
}

const ROLES: RoleOption[] = [
  {
    value: 'STUDENT',
    label: 'Student Solver',
    subtitle: 'University engineering / research student',
    icon: GraduationCap,
    color: 'text-emerald-400',
  },
  {
    value: 'CITIZEN',
    label: 'Citizen Reporter',
    subtitle: 'Local resident reporting societal issues',
    icon: User,
    color: 'text-cyan-400',
  },
  {
    value: 'FACULTY',
    label: 'Faculty Mentor',
    subtitle: 'Professor or researcher guiding student squads',
    icon: Microscope,
    color: 'text-indigo-400',
  },
  {
    value: 'GOVERNMENT',
    label: 'Government Official',
    subtitle: 'Municipal corporation, collectorate, or ministry',
    icon: Building,
    color: 'text-amber-400',
  },
  {
    value: 'INDUSTRY',
    label: 'Industry / NGO Partner',
    subtitle: 'CSR sponsor, technology company, or civic NGO',
    icon: Briefcase,
    color: 'text-purple-400',
  },
]

export default function RegisterPage() {
  const router = useRouter()

  const [role, setRole] = useState<RoleType>('STUDENT')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [organization, setOrganization] = useState('')
  const [skills, setSkills] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Dynamic organization placeholder based on role
  const getOrgDetails = () => {
    switch (role) {
      case 'STUDENT':
        return {
          label: 'University / Institute Name',
          placeholder: 'e.g. Indian Institute of Technology Bombay',
          skillsLabel: 'Primary Technical Skills (comma-separated)',
          skillsPlaceholder: 'e.g. IoT, Python, Machine Learning, Embedded C',
        }
      case 'FACULTY':
        return {
          label: 'University & Department',
          placeholder: 'e.g. IIT Delhi, Civil & Environmental Engineering',
          skillsLabel: 'Research Specializations',
          skillsPlaceholder: 'e.g. Water Treatment, Air Pollution Analytics, GIS',
        }
      case 'GOVERNMENT':
        return {
          label: 'Government Department / Municipal Division',
          placeholder: 'e.g. Pune Municipal Corporation / Urban Dev Dept',
          skillsLabel: 'Jurisdiction / Ward',
          skillsPlaceholder: 'e.g. Ward 14, Pune Division, Maharashtra',
        }
      case 'INDUSTRY':
        return {
          label: 'Company / Organization / NGO Name',
          placeholder: 'e.g. Tata Consultancy Services / Jal Jeevan NGO',
          skillsLabel: 'Focus Sector & CSR Priority',
          skillsPlaceholder: 'e.g. Smart Cities, Clean Water, Renewable Energy',
        }
      default:
        return {
          label: 'City / District / Ward',
          placeholder: 'e.g. Nashik, Maharashtra (Pincode: 422001)',
          skillsLabel: 'Community Interests',
          skillsPlaceholder: 'e.g. Water Quality, Road Safety, Sanitation',
        }
    }
  }

  const orgDetails = getOrgDetails()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    if (!name.trim() || !email.trim() || !password) {
      setErrorMessage('Please fill in all required fields.')
      return
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.')
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.')
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          role,
          organization: organization.trim(),
          skills: skills.trim(),
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || 'Failed to create account. Please try again.')
        setIsLoading(false)
        return
      }

      setSuccessMessage('Account created! Signing you in automatically...')

      // Sign in automatically with credentials
      const signInResult = await signIn('credentials', {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
        callbackUrl: '/dashboard',
      })

      if (signInResult?.ok) {
        router.push('/dashboard')
        router.refresh()
      } else {
        // Redirect to login if auto-signin fails
        router.push('/login?registered=true')
      }
    } catch (err) {
      setErrorMessage('A network error occurred. Please check your connection.')
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12 bg-[#0a0f1e] overflow-hidden selection:bg-blue-600/30 selection:text-cyan-200">
      {/* Ambient background glows and grid */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 right-1/4 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[140px]" />
        <div className="absolute top-2/3 -left-20 h-[450px] w-[450px] rounded-full bg-indigo-600/10 blur-[140px]" />
        <div className="hero-grid absolute inset-0 opacity-70" />
      </div>

      <div className="relative z-10 w-full max-w-xl">
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
            Create Your Solver Account
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Join India&apos;s continuous digital hackathon connecting engineering talent with civic challenges.
          </p>
        </div>

        {/* Main Card */}
        <div className="glass-card rounded-2xl border border-white/10 bg-slate-900/80 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl">
          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs text-red-300 animate-fadeIn">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-red-200">Registration Error</p>
                <p className="mt-0.5 text-red-300/90">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Success Banner */}
          {successMessage && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs text-emerald-300 animate-fadeIn">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-emerald-200">Registration Succeeded</p>
                <p className="mt-0.5 text-emerald-300/90">{successMessage}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Select Your Platform Role
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {ROLES.map((r) => {
                  const isSelected = role === r.value
                  const Icon = r.icon
                  return (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => setRole(r.value)}
                      className={`flex items-start gap-3 rounded-xl border p-3 text-left transition-all duration-150 ${
                        isSelected
                          ? 'border-blue-500 bg-blue-500/15 shadow-[0_0_15px_rgba(37,99,235,0.25)]'
                          : 'border-white/5 bg-slate-950/60 hover:border-white/20 hover:bg-slate-900'
                      } ${r.value === 'INDUSTRY' ? 'sm:col-span-2' : ''}`}
                    >
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 ${
                          isSelected ? 'bg-blue-600 text-white' : 'bg-slate-900 ' + r.color
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p
                          className={`text-xs font-bold ${
                            isSelected ? 'text-white' : 'text-slate-200'
                          }`}
                        >
                          {r.label}
                        </p>
                        <p className="text-[10px] text-slate-400 line-clamp-1">
                          {r.subtitle}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Name and Email Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label
                  htmlFor="name"
                  className="text-xs font-medium text-slate-300"
                >
                  Full Name <span className="text-red-400">*</span>
                </label>
                <div className="relative flex items-center">
                  <div className="pointer-events-none absolute left-3 flex items-center text-slate-400">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Arun Kumar"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2.5 pl-9 text-xs sm:text-sm text-white placeholder-slate-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label
                  htmlFor="reg-email"
                  className="text-xs font-medium text-slate-300"
                >
                  Email Address <span className="text-red-400">*</span>
                </label>
                <div className="relative flex items-center">
                  <div className="pointer-events-none absolute left-3 flex items-center text-slate-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    id="reg-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@institute.ac.in"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2.5 pl-9 text-xs sm:text-sm text-white placeholder-slate-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Dynamic Organization / University Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="org"
                className="text-xs font-medium text-slate-300"
              >
                {orgDetails.label}
              </label>
              <div className="relative flex items-center">
                <div className="pointer-events-none absolute left-3 flex items-center text-slate-400">
                  <Building className="h-4 w-4" />
                </div>
                <input
                  id="org"
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder={orgDetails.placeholder}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2.5 pl-9 text-xs sm:text-sm text-white placeholder-slate-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Skills / Specialization / Jurisdiction */}
            <div className="space-y-1.5">
              <label
                htmlFor="skills"
                className="text-xs font-medium text-slate-300"
              >
                {orgDetails.skillsLabel}
              </label>
              <input
                id="skills"
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder={orgDetails.skillsPlaceholder}
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Password & Confirm Password Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label
                  htmlFor="reg-pass"
                  className="text-xs font-medium text-slate-300"
                >
                  Password <span className="text-red-400">*</span>
                </label>
                <div className="relative flex items-center">
                  <div className="pointer-events-none absolute left-3 flex items-center text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    id="reg-pass"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 chars"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2.5 pl-9 text-xs sm:text-sm text-white placeholder-slate-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="confirm-pass"
                    className="text-xs font-medium text-slate-300"
                  >
                    Confirm <span className="text-red-400">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                <div className="relative flex items-center">
                  <div className="pointer-events-none absolute left-3 flex items-center text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    id="confirm-pass"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2.5 pl-9 text-xs sm:text-sm text-white placeholder-slate-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Terms and Submit */}
            <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
              By registering, you agree to CivicSolve SIH26043 data verification protocols
              and academic contribution guidelines.
            </p>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition-all duration-200 hover:bg-blue-500 hover:shadow-blue-500/40 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Complete Registration</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="mt-6 pt-5 border-t border-white/5 text-center text-xs text-slate-400">
            <span>Already have an account? </span>
            <Link
              href="/login"
              className="font-semibold text-blue-400 hover:text-cyan-300 transition-colors ml-1"
            >
              Sign In Instead
            </Link>
          </div>
        </div>

        {/* Back to landing */}
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
