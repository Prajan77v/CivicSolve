'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import AppShell from '@/components/layout/app-shell'
import {
  User,
  Palette,
  Bell,
  Lock,
  Shield,
  CreditCard,
  Building,
  Key,
  Save,
  CheckCircle2,
  Smartphone,
  Mail,
  Award,
  Sparkles,
  Eye,
  Sliders,
  FileCheck,
} from 'lucide-react'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'
import AppearanceSettings from '@/components/settings/appearance-settings'
import { cn } from '@/lib/utils'

export type SettingsSection =
  | 'profile'
  | 'appearance'
  | 'notifications'
  | 'privacy'
  | 'security'
  | 'account'

const SETTINGS_NAV: {
  id: SettingsSection
  label: string
  icon: React.ComponentType<{ className?: string }>
  description: string
}[] = [
  {
    id: 'profile',
    label: 'Profile',
    icon: User,
    description: 'Personal details, bio, and engineering skills',
  },
  {
    id: 'appearance',
    label: 'Appearance',
    icon: Palette,
    description: 'Theme, accent palette, density, and motion',
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: Bell,
    description: 'Civic alert digests and AI matching alerts',
  },
  {
    id: 'privacy',
    label: 'Privacy',
    icon: Shield,
    description: 'Public visibility, telemetry access, and audit',
  },
  {
    id: 'security',
    label: 'Security',
    icon: Lock,
    description: 'Password credentials and two-factor auth',
  },
  {
    id: 'account',
    label: 'Account',
    icon: CreditCard,
    description: 'Role permissions and institutional verification',
  },
]

export default function SettingsPage() {
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const router = useRouter()

  const initialTab = (searchParams.get('tab') as SettingsSection) || 'appearance'
  const [activeSection, setActiveSection] = useState<SettingsSection>(initialTab)

  useEffect(() => {
    const tabParam = searchParams.get('tab') as SettingsSection
    if (tabParam && ['profile', 'appearance', 'notifications', 'privacy', 'security', 'account'].includes(tabParam)) {
      setActiveSection(tabParam)
    }
  }, [searchParams])

  const handleSelectSection = (section: SettingsSection) => {
    setActiveSection(section)
    router.replace(`/settings?tab=${section}`, { scroll: false })
  }

  // Profile Form States
  const [name, setName] = useState('Priya Sharma')
  const [email, setEmail] = useState('priya.sharma@civicsolve.in')
  const [bio, setBio] = useState('Senior Environmental Engineering lead & municipal sensor specialist. Active contributor on SIH26043 groundwater initiatives.')
  const [phone, setPhone] = useState('+91 98765 43210')
  const [skills, setSkills] = useState('IoT Water Sensors, Embedded C++, LoRaWAN, React, GIS Mapping')

  // Security Form States
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true)

  // Notification States
  const [emailDigest, setEmailDigest] = useState(true)
  const [urgentSms, setUrgentSms] = useState(true)
  const [aiMatchAlerts, setAiMatchAlerts] = useState(true)
  const [weeklyReport, setWeeklyReport] = useState(false)

  // Privacy States
  const [publicProfile, setPublicProfile] = useState(true)
  const [showTelemetryActivity, setShowTelemetryActivity] = useState(true)
  const [allowDirectInquiries, setAllowDirectInquiries] = useState(true)

  // Account / Affiliation States
  const [institution, setInstitution] = useState('Indian Institute of Technology Bombay')
  const [department, setDepartment] = useState('Computer Science & Environmental Tech')
  const [roleTitle, setRoleTitle] = useState('Senior Innovation Fellow')

  const [isSaving, setIsSaving] = useState(false)

  const handleSaveGeneric = (title: string) => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      toast.success(`${title} saved successfully!`)
    }, 400)
  }

  return (
    <AppShell>
      <div className="space-y-8 pb-16 max-w-6xl mx-auto">
        {/* Settings Header */}
        <div className="border-b border-slate-800/80 pb-6">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span>CivicSolve Workspace</span>
            <span>/</span>
            <span className="text-blue-400 font-medium">Settings & Preferences</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Customize your platform experience, interface appearance, communication preferences, and institutional profile.
          </p>
        </div>

        {/* 2-Column Responsive Layout: Sidebar & Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Settings Navigation Sidebar */}
          <aside className="lg:col-span-3 space-y-1 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-2 shadow-sm">
            <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Settings Menu
            </div>

            <nav className="space-y-0.5" aria-label="Settings sections">
              {SETTINGS_NAV.map((item) => {
                const Icon = item.icon
                const isActive = activeSection === item.id

                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    data-testid={`settings-nav-${item.id}`}
                    onClick={() => handleSelectSection(item.id)}
                    className={cn(
                      'w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-left transition-all',
                      isActive
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    )}
                  >
                    <Icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-white' : 'text-slate-400')} />
                    <span className="truncate">{item.label}</span>
                  </button>
                )
              })}
            </nav>
          </aside>

          {/* Main Settings Content Area */}
          <section className="lg:col-span-9 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 sm:p-8 backdrop-blur-xl shadow-lg">
            {/* 1. APPEARANCE TAB */}
            {activeSection === 'appearance' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Palette className="h-5 w-5 text-blue-400" />
                    Appearance & Display Customization
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Tune the visual atmosphere of your CivicSolve workspace with real theme tokens, custom accents, density, and animation controls.
                  </p>
                </div>

                <AppearanceSettings />
              </div>
            )}

            {/* 2. PROFILE TAB */}
            {activeSection === 'profile' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSaveGeneric('Profile information')
                }}
                className="space-y-6"
              >
                <div className="flex items-center gap-4 pb-6 border-b border-slate-800">
                  <div className="h-16 w-16 rounded-2xl bg-blue-600 flex items-center justify-center font-bold text-xl text-white shadow-md">
                    PS
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{name}</h3>
                    <p className="text-xs text-slate-400">{email}</p>
                    <span className="inline-block mt-1 text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      Verified Municipal Solver
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      disabled
                      className="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2 text-xs text-slate-500 cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-300">Professional Bio</label>
                    <textarea
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-300">Skills & Focus Tags</label>
                    <input
                      type="text"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-500"
                  >
                    <Save className="h-3.5 w-3.5" />
                    Save Profile
                  </button>
                </div>
              </form>
            )}

            {/* 3. NOTIFICATIONS TAB */}
            {activeSection === 'notifications' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSaveGeneric('Notification preferences')
                }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-base font-bold text-white">Alert Preferences</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Control how and when CivicSolve notifies you about relevant opportunities.</p>
                </div>

                <div className="space-y-3">
                  {[
                    { title: 'AI Challenge Match Alerts', desc: 'Notify immediately when an uploaded municipal challenge matches your skills', checked: aiMatchAlerts, setChecked: setAiMatchAlerts },
                    { title: 'Weekly Impact Digest', desc: 'Summary of community problem-solving progress and regional deployment milestones', checked: weeklyReport, setChecked: setWeeklyReport },
                    { title: 'Urgent Citizen Alerts', desc: 'Critical alerts for water quality or safety hazards in your monitored districts', checked: urgentSms, setChecked: setUrgentSms },
                  ].map((item, idx) => (
                    <label key={idx} className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 cursor-pointer hover:bg-slate-850 transition-colors">
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={(e) => item.setChecked(e.target.checked)}
                        className="mt-1 h-4 w-4 rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <span className="text-xs font-semibold text-white block">{item.title}</span>
                        <span className="text-[11px] text-slate-400">{item.desc}</span>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-500"
                  >
                    <Save className="h-3.5 w-3.5" />
                    Save Notifications
                  </button>
                </div>
              </form>
            )}

            {/* 4. PRIVACY TAB */}
            {activeSection === 'privacy' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSaveGeneric('Privacy settings')
                }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-base font-bold text-white">Privacy & Telemetry Control</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Manage how your profile and activity are viewed across universities and government agencies.</p>
                </div>

                <div className="space-y-3">
                  {[
                    { title: 'Public Solver Profile', desc: 'Allow universities and government agencies to view your innovation credentials on the public registry', checked: publicProfile, setChecked: setPublicProfile },
                    { title: 'Telemetry Activity Sharing', desc: 'Share anonymized IoT validation logs with regional environmental boards', checked: showTelemetryActivity, setChecked: setShowTelemetryActivity },
                    { title: 'Direct Innovation Inquiries', desc: 'Allow verified faculty and local bodies to send direct collaboration requests', checked: allowDirectInquiries, setChecked: setAllowDirectInquiries },
                  ].map((item, idx) => (
                    <label key={idx} className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 cursor-pointer hover:bg-slate-850 transition-colors">
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={(e) => item.setChecked(e.target.checked)}
                        className="mt-1 h-4 w-4 rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <span className="text-xs font-semibold text-white block">{item.title}</span>
                        <span className="text-[11px] text-slate-400">{item.desc}</span>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-500"
                  >
                    <Save className="h-3.5 w-3.5" />
                    Save Privacy Settings
                  </button>
                </div>
              </form>
            )}

            {/* 5. SECURITY TAB */}
            {activeSection === 'security' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  if (newPassword && newPassword !== confirmPassword) {
                    toast.error('New passwords do not match')
                    return
                  }
                  handleSaveGeneric('Security credentials')
                }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-base font-bold text-white">Security & Authentication</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Manage password credentials and multi-factor verification.</p>
                </div>

                <div className="space-y-4 max-w-md">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Current Password</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 8 characters"
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat new password"
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-500"
                  >
                    <Save className="h-3.5 w-3.5" />
                    Update Password
                  </button>
                </div>
              </form>
            )}

            {/* 6. ACCOUNT TAB */}
            {activeSection === 'account' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-white">Institutional Affiliation & Credentials</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Official university or municipal agency registry details.</p>
                </div>

                <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">Registered Institution</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      NIRF Verified
                    </span>
                  </div>
                  <p className="text-sm font-bold text-white">{institution}</p>
                  <p className="text-xs text-slate-400">{department}</p>
                </div>

                <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/10 text-xs text-blue-200">
                  <div className="font-semibold text-white mb-1">Academic Open Access</div>
                  Your account is registered under SIH26043 educational consortium licensing. Verification records are permanently anchored on the public certificate ledger.
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </AppShell>
  )
}
