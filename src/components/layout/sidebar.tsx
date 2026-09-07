'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import {
  LayoutDashboard,
  Compass,
  FolderKanban,
  Users,
  GraduationCap,
  Building2,
  Cpu,
  Globe,
  TrendingUp,
  ShieldCheck,
  ShieldAlert,
  Award,
  Bell,
  Settings,
  Palette,
  PlayCircle,
  LogOut,
  X,
  Layers,
  UserCheck,
  Briefcase,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLayout } from './layout-context'
import { useAppearance } from '@/components/providers/appearance-provider'

interface NavSection {
  title: string
  items: {
    name: string
    href: string
    icon: React.ComponentType<{ className?: string }>
    badge?: string
  }[]
}

const navSections: NavSection[] = [
  {
    title: 'WORKSPACE',
    items: [
      { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
      { name: 'Challenges', href: '/problems', icon: Compass },
      { name: 'Projects', href: '/projects', icon: FolderKanban },
      { name: 'Teams', href: '/teams', icon: Users },
    ],
  },
  {
    title: 'NETWORK',
    items: [
      { name: 'Universities', href: '/universities', icon: GraduationCap },
      { name: 'Students', href: '/students', icon: UserCheck, badge: 'Solvers' },
      { name: 'IT Professionals', href: '/professionals', icon: Briefcase, badge: 'Mentors' },
      { name: 'Partners', href: '/partners', icon: Building2 },
    ],
  },
  {
    title: 'INTELLIGENCE',
    items: [
      { name: 'AI Match', href: '/ai-match-center', icon: Cpu },
      { name: 'Solution Library', href: '/solution-library', icon: Globe },
      { name: 'Impact', href: '/impact', icon: TrendingUp },
    ],
  },
  {
    title: 'GOVERNANCE',
    items: [
      { name: 'Review Queue', href: '/review-queue', icon: ShieldCheck },
      { name: 'Command Center', href: '/command-center', icon: ShieldAlert, badge: 'Gov' },
      { name: 'Certificates', href: '/certificates', icon: Award, badge: 'Registry' },
    ],
  },
  {
    title: 'SYSTEM',
    items: [
      { name: 'Appearance', href: '/settings?tab=appearance', icon: Palette },
      { name: 'Notifications', href: '/notifications', icon: Bell },
      { name: 'Settings', href: '/settings', icon: Settings },
    ],
  },
]

function getRoleLabel(role: string = 'CITIZEN'): string {
  switch (role.toUpperCase()) {
    case 'ADMIN': return 'Administrator'
    case 'GOVERNMENT': return 'District Collector'
    case 'STUDENT': return 'Student Solver'
    case 'FACULTY': return 'Faculty Mentor'
    case 'UNIVERSITY': return 'University Dean'
    case 'INDUSTRY': return 'CSR Partner'
    case 'NGO': return 'NGO Director'
    default: return 'Citizen Reporter'
  }
}

export default function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { isMobileSidebarOpen, setMobileSidebarOpen } = useLayout()
  const { computedAccent } = useAppearance()

  const userRole = (session?.user as any)?.role || 'CITIZEN'
  const userName = session?.user?.name || 'Priya Sharma'
  const userEmail = session?.user?.email || 'priya.sharma@civicsolve.in'

  const isItemActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard'
    }
    if (href.includes('?')) {
      return pathname === href.split('?')[0]
    }
    return pathname === href || pathname.startsWith(href + '/')
  }

  const sidebarContent = (
    <div className="sidebar-container flex h-full flex-col justify-between overflow-y-auto scrollbar-thin px-3.5 py-4 bg-[#08090c] border-r border-slate-800/80 pt-[max(env(safe-area-inset-top),1rem)] pb-[max(env(safe-area-inset-bottom),1rem)]">
      <div className="space-y-5">
        {/* Brand Header */}
        <div className="flex items-center justify-between px-2 pt-1 pb-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 group"
            onClick={() => setMobileSidebarOpen(false)}
          >
            <div
              className="flex h-7 w-7 items-center justify-center rounded-md font-bold shadow-md transition-colors"
              style={{
                backgroundColor: computedAccent.accent,
                color: computedAccent.foreground,
                boxShadow: `0 2px 10px ${computedAccent.glow}`,
              }}
            >
              <Layers className="h-4 w-4" />
            </div>

            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-bold tracking-tight text-white">
                Civic<span style={{ color: computedAccent.accent }}>Solve</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">SIH26043</span>
            </div>
          </Link>

          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white lg:hidden active:scale-95 transition-all"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* 5 Editorial Navigation Sections */}
        <nav className="space-y-4">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-1">
              <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {section.title}
              </div>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const active = isItemActive(item.href)
                  const Icon = item.icon
                  const isCertificates = item.name === 'Certificates'

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileSidebarOpen(false)}
                      className={cn(
                        'group flex min-h-[38px] items-center justify-between rounded-lg px-2.5 py-2 text-xs font-semibold transition-all active:scale-[0.98]',
                        active
                          ? 'font-bold shadow-md border-l-4 border-white pl-2'
                          : isCertificates
                          ? 'text-amber-900 dark:text-slate-100 hover:bg-amber-50 dark:hover:bg-slate-800/80 bg-amber-500/10 dark:bg-slate-900/40 border border-amber-500/30'
                          : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-950 dark:hover:text-white'
                      )}
                      style={
                        active
                          ? {
                              backgroundColor: computedAccent.accent,
                              color: computedAccent.foreground,
                              boxShadow: `0 4px 14px ${computedAccent.glow}`,
                            }
                          : undefined
                      }
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          className={cn(
                            'h-4 w-4 shrink-0 transition-colors',
                            active
                              ? 'text-white'
                              : isCertificates
                              ? 'text-amber-600 dark:text-amber-400 group-hover:text-amber-500 dark:group-hover:text-amber-300'
                              : 'text-slate-500 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white'
                          )}
                        />
                        <span className={cn(isCertificates && !active && 'text-amber-800 dark:text-amber-300 font-bold')}>
                          {item.name}
                        </span>
                      </div>

                      {item.badge && (
                        <span
                          className={cn(
                            'rounded px-1.5 py-0.5 text-[9px] font-mono border transition-colors',
                            active
                              ? 'bg-white/20 text-white border-white/40 font-bold'
                              : isCertificates
                              ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/40 font-bold'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/80'
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* User Profile Footer */}
      <div className="pt-3 border-t border-slate-800/80">
        <div className="flex items-center justify-between px-2">
          <div className="min-w-0">
            <div className="text-xs font-semibold text-slate-200 truncate">{userName}</div>
            <div className="text-[10px] text-slate-500 truncate">{getRoleLabel(userRole)}</div>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors active:scale-95"
            title="Sign out"
            aria-label="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 lg:block">
        {sidebarContent}
      </aside>

      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm animate-fade-in"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl z-10 animate-slide-right">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  )
}
