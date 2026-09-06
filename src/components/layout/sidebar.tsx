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
  PlayCircle,
  LogOut,
  X,
  Layers,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLayout } from './layout-context'

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
      { name: 'Experts', href: '/teams', icon: Users },
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
      { name: 'Certificates', href: '/certificates', icon: Award },
    ],
  },
  {
    title: 'SYSTEM',
    items: [
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
    <div className="flex h-full flex-col justify-between overflow-y-auto scrollbar-thin px-3 py-4 bg-[#08090c] border-r border-slate-800/60">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center justify-between px-2 pt-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 group"
            onClick={() => setMobileSidebarOpen(false)}
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600 text-white font-bold">
              <Layers className="h-4 w-4" />
            </div>

            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-bold tracking-tight text-white">
                Civic<span className="text-blue-500">Solve</span>
              </span>
              <span className="text-[10px] font-mono text-slate-500">SIH26043</span>
            </div>
          </Link>

          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="rounded p-1 text-slate-400 hover:text-white lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* 5 Editorial Navigation Sections */}
        <nav className="space-y-5">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-1">
              <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {section.title}
              </div>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const active = isItemActive(item.href)
                  const Icon = item.icon

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileSidebarOpen(false)}
                      className={cn(
                        'flex items-center justify-between rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors',
                        active
                          ? 'bg-slate-800/80 text-white font-semibold'
                          : 'text-slate-400 hover:bg-slate-850 hover:text-slate-200'
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={cn('h-3.5 w-3.5 shrink-0', active ? 'text-blue-400' : 'text-slate-500')} />
                        <span>{item.name}</span>
                      </div>

                      {item.badge && (
                        <span className="rounded bg-slate-800 px-1.5 py-0.2 text-[9px] font-mono text-slate-400 border border-slate-700/50">
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
            className="p-1 text-slate-500 hover:text-slate-300 transition-colors"
            title="Sign out"
          >
            <LogOut className="h-3.5 w-3.5" />
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
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-60 shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  )
}
