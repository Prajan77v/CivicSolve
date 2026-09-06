'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import {
  Search,
  Plus,
  Play,
  Bell,
  Sparkles,
  Menu,
  ChevronDown,
  User as UserIcon,
  Settings,
  Shield,
  LogOut,
  Sun,
  Moon,
  Laptop,
  Palette,
  Check,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLayout } from './layout-context'
import { useAppearance } from '@/components/providers/appearance-provider'
import { ACCENT_PRESETS } from '@/types/appearance'
import NotificationPanel from '@/components/notifications/notification-panel'

export default function Navbar() {
  const { data: session } = useSession()
  const {
    toggleAi,
    setCommandPaletteOpen,
    toggleMobileSidebar,
    unreadNotificationsCount,
  } = useLayout()

  const {
    theme,
    resolvedTheme,
    accentKey,
    computedAccent,
    setTheme,
    setAccentKey,
  } = useAppearance()

  const [isNotificationsOpen, setNotificationsOpen] = useState(false)
  const [isUserMenuOpen, setUserMenuOpen] = useState(false)
  const [isAppearanceOpen, setAppearanceOpen] = useState(false)

  const notificationsRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const appearanceRef = useRef<HTMLDivElement>(null)

  const user = session?.user
  const userRole = (user as any)?.role || 'CITIZEN'
  const userName = user?.name || 'Priya Sharma'
  const userEmail = user?.email || 'priya.sharma@civicsolve.in'
  const userAvatar = user?.image

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setNotificationsOpen(false)
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false)
      }
      if (
        appearanceRef.current &&
        !appearanceRef.current.contains(event.target as Node)
      ) {
        setAppearanceOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-20 flex h-14 w-full items-center justify-between border-b border-slate-800/80 bg-[#0b0f17]/90 px-4 backdrop-blur-md md:px-6">
      {/* Left section: Mobile menu & Search bar */}
      <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0 max-w-xl">
        {/* Mobile Sidebar Hamburger */}
        <button
          onClick={toggleMobileSidebar}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
          aria-label="Open navigation drawer"
        >
          <Menu className="h-4 w-4" />
        </button>

        {/* Global Search Bar (Trigger for Command Palette) */}
        <button
          type="button"
          onClick={() => setCommandPaletteOpen(true)}
          className="group relative flex w-full min-w-0 items-center justify-between rounded-lg border border-slate-800 bg-[#111726] px-2.5 py-1.5 text-xs text-slate-400 transition-colors hover:border-slate-700 hover:text-slate-200 sm:w-80 md:w-96"
        >
          <div className="flex items-center gap-2 min-w-0 truncate">
            <Search className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span className="truncate">Search challenges, teams, solutions...</span>
          </div>
          <kbd className="hidden sm:flex items-center gap-0.5 rounded border border-slate-700 bg-slate-800/60 px-1.5 py-0.5 text-[10px] font-medium text-slate-400 shrink-0">
            <span>⌘</span>K
          </kbd>
        </button>
      </div>

      {/* Right section: Action buttons, Notifications, Appearance, AI Assistant & User profile */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Submit Problem Button */}
        <Link
          href="/problems/new"
          className="hidden sm:inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold shadow-sm transition-opacity hover:opacity-90 active:scale-[0.98]"
          style={{
            backgroundColor: computedAccent.accent,
            color: computedAccent.foreground,
          }}
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Submit Problem</span>
        </Link>

        {/* Live Demo Runner Button */}
        <Link
          href="/demo"
          className="hidden md:inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:bg-slate-700"
        >
          <Play className="h-3 w-3 fill-current text-slate-300" />
          <span>Demo Runner</span>
        </Link>

        {/* Quick Appearance Dropdown */}
        <div className="relative" ref={appearanceRef}>
          <button
            type="button"
            data-testid="header-appearance-toggle"
            onClick={() => setAppearanceOpen((prev) => !prev)}
            className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-[#111726] text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
            aria-label="Customize appearance"
            title="Appearance & Theme"
          >
            {resolvedTheme === 'dark' ? (
              <Moon className="h-3.5 w-3.5" style={{ color: computedAccent.accent }} />
            ) : (
              <Sun className="h-3.5 w-3.5 text-amber-500" />
            )}
          </button>

          {isAppearanceOpen && (
            <div
              data-testid="header-appearance-popover"
              className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-800 bg-[#111726] p-3 shadow-xl shadow-black/60 z-50 animate-fade-in space-y-3"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Palette className="h-3.5 w-3.5" style={{ color: computedAccent.accent }} />
                  Appearance Quick Menu
                </span>
                <span className="text-[10px] font-mono uppercase" style={{ color: computedAccent.accent }}>{theme}</span>
              </div>

              {/* Theme choices */}
              <div className="space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Theme</div>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { id: 'light', label: 'Light', icon: Sun },
                    { id: 'dark', label: 'Dark', icon: Moon },
                    { id: 'system', label: 'System', icon: Laptop },
                  ].map((t) => {
                    const Icon = t.icon
                    const isSelected = theme === t.id
                    return (
                      <button
                        key={t.id}
                        type="button"
                        data-testid={`quick-theme-${t.id}`}
                        onClick={() => setTheme(t.id as any)}
                        className={cn(
                          'flex flex-col items-center justify-center py-1.5 rounded-lg border text-[11px] font-medium transition-all relative',
                          isSelected
                            ? 'border-2 text-white font-bold shadow-md'
                            : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:text-white hover:bg-slate-800'
                        )}
                        style={
                          isSelected
                            ? {
                                backgroundColor: computedAccent.accent,
                                borderColor: computedAccent.accent,
                                color: computedAccent.foreground,
                                boxShadow: `0 2px 10px ${computedAccent.glow}`,
                              }
                            : undefined
                        }
                      >
                        <Icon className="h-3.5 w-3.5 mb-1" />
                        <span>{t.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Accent quick swatches */}
              <div className="space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Accent</div>
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  {ACCENT_PRESETS.map((p) => {
                    const isSelected = accentKey === p.key
                    return (
                      <button
                        key={p.key}
                        type="button"
                        data-testid={`quick-accent-${p.key}`}
                        title={p.label}
                        onClick={() => setAccentKey(p.key)}
                        className={cn(
                          'h-6 w-6 rounded-full flex items-center justify-center transition-all hover:scale-110',
                          isSelected
                            ? 'ring-2 ring-white ring-offset-2 ring-offset-[#111726] scale-110 shadow-md'
                            : 'opacity-80 hover:opacity-100'
                        )}
                        style={{ backgroundColor: p.hex }}
                      >
                        {isSelected && <Check className="h-3 w-3 text-white stroke-[3]" />}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Link to full settings */}
              <div className="pt-2 border-t border-slate-800">
                <Link
                  href="/settings?tab=appearance"
                  onClick={() => setAppearanceOpen(false)}
                  className="flex items-center justify-between text-[11px] font-semibold transition-colors hover:opacity-80"
                  style={{ color: computedAccent.accent }}
                >
                  <span>All Appearance Settings</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* AI Assistant Toggle Button */}
        <button
          type="button"
          onClick={toggleAi}
          className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/60 px-2.5 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
          title="Open Civic AI Assistant"
        >
          <Sparkles className="h-3.5 w-3.5 text-blue-400" />
          <span className="hidden sm:inline">Civic AI</span>
        </button>

        {/* Notification Bell with Dropdown */}
        <div className="relative" ref={notificationsRef}>
          <button
            type="button"
            onClick={() => setNotificationsOpen((prev) => !prev)}
            className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-[#111726] text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
            aria-label="Toggle notifications"
          >
            <Bell className="h-3.5 w-3.5" />
            {unreadNotificationsCount > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full px-1 text-[8px] font-bold text-white shadow-sm"
                style={{ backgroundColor: computedAccent.accent, color: computedAccent.foreground }}
              >
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown Panel */}
          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 z-50 animate-fade-in">
              <NotificationPanel onClose={() => setNotificationsOpen(false)} />
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            type="button"
            onClick={() => setUserMenuOpen((prev) => !prev)}
            className="flex items-center gap-1.5 rounded-lg p-1 transition-colors hover:bg-slate-800/80"
            aria-label="User menu"
          >
            <div
              className="flex h-7 w-7 items-center justify-center rounded-md text-xs font-semibold text-white shadow-sm overflow-hidden"
              style={{ backgroundColor: computedAccent.accent, color: computedAccent.foreground }}
            >
              {userAvatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={userAvatar}
                  alt={userName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span>
                  {userName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)}
                </span>
              )}
            </div>
            <ChevronDown className="hidden sm:block h-3 w-3 text-slate-400" />
          </button>

          {/* Dropdown Menu */}
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-800 bg-[#111726] p-1.5 shadow-xl shadow-black/60 z-50 animate-fade-in">
              {/* User Header */}
              <div className="px-3 py-2 border-b border-slate-800">
                <p className="text-xs font-semibold text-white truncate">{userName}</p>
                <p className="text-[11px] text-slate-400 truncate">{userEmail}</p>
                <div
                  className="mt-1.5 inline-flex items-center rounded border px-1.5 py-0.5 text-[9px] font-semibold tracking-wider"
                  style={{
                    backgroundColor: computedAccent.light,
                    borderColor: computedAccent.border,
                    color: computedAccent.accent,
                  }}
                >
                  {userRole}
                </div>
              </div>

              {/* Menu Links */}
              <div className="py-1">
                <Link
                  href="/solvers/cmtoobsm20014zfwtfy8h3pfz"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
                >
                  <UserIcon className="h-3.5 w-3.5 text-slate-400" />
                  <span>Your Profile</span>
                </Link>

                <Link
                  href="/settings?tab=appearance"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
                >
                  <Palette className="h-3.5 w-3.5 text-blue-400" />
                  <span>Appearance Settings</span>
                </Link>

                <Link
                  href="/settings"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
                >
                  <Settings className="h-3.5 w-3.5 text-slate-400" />
                  <span>Settings & Preferences</span>
                </Link>

                {(userRole === 'ADMIN' || userRole === 'GOVERNMENT') && (
                  <Link
                    href="/command-center"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs text-amber-400 transition-colors hover:bg-amber-500/10"
                  >
                    <Shield className="h-3.5 w-3.5 text-amber-400" />
                    <span>Command Center</span>
                  </Link>
                )}
              </div>

              {/* Sign Out */}
              <div className="border-t border-slate-800 pt-1">
                <button
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-xs text-rose-400 transition-colors hover:bg-rose-500/10"
                >
                  <LogOut className="h-3.5 w-3.5 text-rose-400" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
