'use client'

import React, { useState } from 'react'
import AppShell from '@/components/layout/app-shell'
import {
  User,
  Shield,
  Bell,
  Building,
  Key,
  Save,
  CheckCircle2,
  Lock,
  Smartphone,
  Mail,
  Award,
  Sparkles,
  Upload,
} from 'lucide-react'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'

type SettingsTab = 'profile' | 'security' | 'notifications' | 'institution'

export default function SettingsPage() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile')

  // Profile Form
  const [name, setName] = useState('Arun Kumar')
  const [email, setEmail] = useState('arun.kumar@iitb.ac.in')
  const [bio, setBio] = useState('Final year B.Tech Computer Science student at IIT Bombay. Passionate about embedded IoT sensors, rural drinking water purification, and smart city infrastructure.')
  const [phone, setPhone] = useState('+91 98765 43210')
  const [skills, setSkills] = useState('IoT Sensors, Embedded C++, Python, ESP32, React, LoRaWAN')

  // Security Form
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true)

  // Notification Preferences
  const [emailDigest, setEmailDigest] = useState(true)
  const [urgentSms, setUrgentSms] = useState(true)
  const [aiMatchAlerts, setAiMatchAlerts] = useState(true)
  const [weeklyReport, setWeeklyReport] = useState(false)

  // Institution verification
  const [university, setUniversity] = useState('Indian Institute of Technology Bombay')
  const [department, setDepartment] = useState('Computer Science & Engineering')
  const [studentId, setStudentId] = useState('IITB-2022-CS-084')
  const [isSaving, setIsSaving] = useState(false)

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      toast.success('Profile details updated successfully!')
    }, 500)
  }

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword && newPassword !== confirmPassword) {
      toast.error('New passwords do not match')
      return
    }
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      toast.success('Security settings and password updated!')
    }, 500)
  }

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      toast.success('Notification preferences saved!')
    }, 400)
  }

  const handleSaveInstitution = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      toast.success('Institutional verification record updated!')
    }, 500)
  }

  return (
    <AppShell>
      <div className="space-y-8 pb-16 max-w-5xl mx-auto">
        {/* Header */}
        <div className="border-b border-white/10 pb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Account & System Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage your personal profile, credentials, security, and institutional verification.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex p-1 rounded-2xl bg-slate-900 border border-white/10 overflow-x-auto">
          {[
            { id: 'profile', label: 'Profile Information', icon: User },
            { id: 'security', label: 'Security & 2FA', icon: Key },
            { id: 'notifications', label: 'Alert Preferences', icon: Bell },
            { id: 'institution', label: 'Institutional Affiliation', icon: Building },
          ].map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as SettingsTab)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold whitespace-nowrap transition-all flex-1 sm:flex-initial ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Tab 1: Profile Information */}
        {activeTab === 'profile' && (
          <form
            onSubmit={handleSaveProfile}
            className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 sm:p-8 backdrop-blur-xl space-y-6"
          >
            <div className="flex items-center gap-4 pb-6 border-b border-white/5">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-0.5">
                <div className="h-full w-full rounded-[14px] bg-slate-900 flex items-center justify-center font-black text-xl text-cyan-300">
                  AK
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  {name}
                  <span className="rounded bg-emerald-500/20 text-emerald-300 px-2 py-0.5 text-[10px] font-bold border border-emerald-500/30">
                    VERIFIED STUDENT SOLVER
                  </span>
                </h3>
                <p className="text-xs text-slate-400 font-mono">{email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-800 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Institutional Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-800 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Mobile Phone (SMS Urgency Dispatch)
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-800 px-3.5 py-2.5 text-xs font-mono text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Skills & Technical Domains
                </label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-800 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Bio & Societal Focus
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-800 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="pt-4 border-t border-white/5 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-5 py-2.5 text-xs font-bold text-white transition-all shadow-md active:scale-95 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                Save Profile Changes
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Security & 2FA */}
        {activeTab === 'security' && (
          <form
            onSubmit={handleSaveSecurity}
            className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 sm:p-8 backdrop-blur-xl space-y-6"
          >
            <div className="space-y-1 pb-4 border-b border-white/5">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Lock className="h-5 w-5 text-blue-400" />
                Password & Authentication
              </h3>
              <p className="text-xs text-slate-400">
                Ensure your account is protected with strong password entropy and two-factor authentication.
              </p>
            </div>

            <div className="space-y-4 max-w-md">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Current Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-800 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-800 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-800 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* 2FA Toggle */}
            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-emerald-400" />
                  Two-Factor Authentication (Gov SMS / TOTP)
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Protect official problem submissions and digital signatures.
                </div>
              </div>

              <button
                type="button"
                onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  twoFactorEnabled ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="pt-4 border-t border-white/5 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-5 py-2.5 text-xs font-bold text-white transition-all shadow-md active:scale-95 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                Update Security Credentials
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Notification Preferences */}
        {activeTab === 'notifications' && (
          <form
            onSubmit={handleSaveNotifications}
            className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 sm:p-8 backdrop-blur-xl space-y-6"
          >
            <div className="space-y-1 pb-4 border-b border-white/5">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Bell className="h-5 w-5 text-blue-400" />
                Dispatch & Alert Channels
              </h3>
              <p className="text-xs text-slate-400">
                Configure your thresholds for critical government alarms, AI problem matches, and weekly summaries.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/50 border border-white/5">
                <div>
                  <div className="text-sm font-bold text-white">AI Problem Match Alerts</div>
                  <div className="text-xs text-slate-400">
                    Instant alerts when newly filed problems match your lab skills (&gt;90% score).
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={aiMatchAlerts}
                  onChange={(e) => setAiMatchAlerts(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/50 border border-white/5">
                <div>
                  <div className="text-sm font-bold text-white">Urgent Critical Distress SMS</div>
                  <div className="text-xs text-slate-400">
                    Direct SMS push for Stage 1/2 floods, toxin spills, and emergency interventions.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={urgentSms}
                  onChange={(e) => setUrgentSms(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/50 border border-white/5">
                <div>
                  <div className="text-sm font-bold text-white">Daily Email Telemetry Digest</div>
                  <div className="text-xs text-slate-400">
                    Summary of field sensor readings, milestone sign-offs, and mentor comments.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={emailDigest}
                  onChange={(e) => setEmailDigest(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-5 py-2.5 text-xs font-bold text-white transition-all shadow-md active:scale-95 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                Save Alert Settings
              </button>
            </div>
          </form>
        )}

        {/* Tab 4: Institutional Affiliation */}
        {activeTab === 'institution' && (
          <form
            onSubmit={handleSaveInstitution}
            className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 sm:p-8 backdrop-blur-xl space-y-6"
          >
            <div className="space-y-1 pb-4 border-b border-white/5">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Building className="h-5 w-5 text-blue-400" />
                Academic & Government Verification
              </h3>
              <p className="text-xs text-slate-400">
                Official accreditation from the Ministry of Education for team participation and certificate eligibility.
              </p>
            </div>

            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white uppercase tracking-wider">
                    Institutional Identity Verified
                  </div>
                  <div className="text-xs text-slate-300">
                    Authenticated via IIT Bombay LDAP & National Academic Depository (NAD).
                  </div>
                </div>
              </div>
              <span className="rounded-full bg-emerald-500/20 border border-emerald-500/30 px-3 py-1 text-[11px] font-mono font-bold text-emerald-300">
                ACTIVE • 2025-26
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  University / College Name
                </label>
                <input
                  type="text"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-800 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Academic Department
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-800 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Roll Number / Student ID / Faculty ID
              </label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full max-w-sm rounded-xl border border-white/10 bg-slate-800 px-3.5 py-2.5 text-xs font-mono text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="pt-4 border-t border-white/5 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-5 py-2.5 text-xs font-bold text-white transition-all shadow-md active:scale-95 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                Update Institutional Record
              </button>
            </div>
          </form>
        )}
      </div>
    </AppShell>
  )
}
