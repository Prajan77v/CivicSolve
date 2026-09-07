'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  MapPin,
  Plus,
  Sparkles,
  Menu,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLayout } from './layout-context'
import { useAppearance } from '@/components/providers/appearance-provider'

export default function BottomNav() {
  const pathname = usePathname()
  const { toggleAi, toggleMobileSidebar } = useLayout()
  const { computedAccent } = useAppearance()

  const isHomeActive = pathname === '/dashboard' || pathname === '/'
  const isMapActive = pathname === '/map'
  const isSubmitActive = pathname === '/problems/new'

  return (
    <nav
      aria-label="Mobile bottom navigation"
      className="fixed inset-x-0 bottom-0 z-40 block lg:hidden border-t border-slate-200/80 dark:border-slate-800/90 bg-white/95 dark:bg-[#08090c]/95 backdrop-blur-xl shadow-[0_-4px_20px_rgba(0,0,0,0.15)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.5)] transition-colors pb-[max(env(safe-area-inset-bottom),0.5rem)]"
    >
      <div className="grid h-14 grid-cols-5 items-center px-1 max-w-lg mx-auto">
        {/* 1. Dashboard */}
        <Link
          href="/dashboard"
          className={cn(
            'group flex flex-col items-center justify-center py-1 text-[10px] font-semibold transition-transform active:scale-95',
            isHomeActive
              ? 'text-slate-950 dark:text-white font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          )}
        >
          <div
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded-xl transition-all',
              isHomeActive && 'shadow-sm'
            )}
            style={
              isHomeActive
                ? {
                    backgroundColor: computedAccent.light,
                    color: computedAccent.accent,
                  }
                : undefined
            }
          >
            <LayoutDashboard className="h-4 w-4" />
          </div>
          <span className="mt-0.5 tracking-tight">Overview</span>
        </Link>

        {/* 2. GIS Problem Map */}
        <Link
          href="/map"
          className={cn(
            'group flex flex-col items-center justify-center py-1 text-[10px] font-semibold transition-transform active:scale-95',
            isMapActive
              ? 'text-slate-950 dark:text-white font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          )}
        >
          <div
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded-xl transition-all',
              isMapActive && 'shadow-sm'
            )}
            style={
              isMapActive
                ? {
                    backgroundColor: computedAccent.light,
                    color: computedAccent.accent,
                  }
                : undefined
            }
          >
            <MapPin className="h-4 w-4" />
          </div>
          <span className="mt-0.5 tracking-tight">Civic Map</span>
        </Link>

        {/* 3. Report Problem / Center Primary Action (Elevated Floating Button) */}
        <div className="flex items-center justify-center">
          <Link
            href="/problems/new"
            aria-label="Submit new societal challenge"
            className={cn(
              'relative -top-2.5 flex h-11 w-11 items-center justify-center rounded-full shadow-lg transition-transform active:scale-90 hover:scale-105',
              isSubmitActive && 'ring-2 ring-white dark:ring-slate-900'
            )}
            style={{
              backgroundColor: computedAccent.accent,
              color: computedAccent.foreground,
              boxShadow: `0 4px 18px ${computedAccent.glow}`,
            }}
          >
            <Plus className="h-5 w-5 stroke-[2.5]" />
          </Link>
        </div>

        {/* 4. Civic AI Assistant Drawer Trigger */}
        <button
          type="button"
          onClick={toggleAi}
          aria-label="Open Civic AI Assistant"
          className="group flex flex-col items-center justify-center py-1 text-[10px] font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 active:scale-95 transition-transform"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="mt-0.5 tracking-tight">Civic AI</span>
        </button>

        {/* 5. Menu / Full Navigation Drawer Trigger */}
        <button
          type="button"
          onClick={toggleMobileSidebar}
          aria-label="Open full platform menu"
          className="group flex flex-col items-center justify-center py-1 text-[10px] font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 active:scale-95 transition-transform"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-xl">
            <Menu className="h-4 w-4" />
          </div>
          <span className="mt-0.5 tracking-tight">Menu</span>
        </button>
      </div>
    </nav>
  )
}
