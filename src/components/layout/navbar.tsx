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
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLayout } from './layout-context'
import NotificationPanel from '@/components/notifications/notification-panel'

export default function Navbar() {
  const { data: session } = useSession()
  const {
    toggleAi,
    setCommandPaletteOpen,
    toggleMobileSidebar,
    unreadNotificationsCount,
  } = useLayout()

  const [isNotificationsOpen, setNotificationsOpen] = useState(false)
  const [isUserMenuOpen, setUserMenuOpen] = useState(false)

  const notificationsRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)

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
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-20 flex h-14 w-full items-center justify-between border-b border-slate-800/80 bg-[#0b0f17]/90 px-4 backdrop-blur-md md:px-6">
      {/* Left section: Mobile menu & Search bar */}
      <div className="flex items-center gap-3 md:gap-4 flex-1 max-w-xl">
        {/* Mobile Sidebar Hamburger */}
        <button
          onClick={toggleMobileSidebar}
          className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
          aria-label="Open navigation drawer"
        >
          <Menu className="h-4 w-4" />
        </button>

        {/* Global Search Bar (Trigger for Command Palette) */}
        <button
          type="button"
          onClick={() => setCommandPaletteOpen(true)}
          className="group relative flex w-full items-center justify-between rounded-lg border border-slate-800 bg-[#111726] px-3 py-1.5 text-xs text-slate-400 transition-colors hover:border-slate-700 hover:text-slate-200 sm:w-80 md:w-96"
        >
          <div className="flex items-center gap-2 truncate">
            <Search className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span className="truncate">Search challenges, teams, solutions...</span>
          </div>
          <kbd className="hidden sm:flex items-center gap-0.5 rounded border border-slate-700 bg-slate-800/60 px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
            <span>⌘</span>K
          </kbd>
        </button>
      </div>

      {/* Right section: Action buttons, Notifications, AI Assistant & User profile */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Submit Problem Button */}
        <Link
          href="/problems/new"
          className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-blue-500 active:scale-[0.98]"
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
              <span className="absolute -top-0.5 -right-0.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-blue-600 px-1 text-[8px] font-bold text-white">
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
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600 text-xs font-semibold text-white shadow-sm overflow-hidden">
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
                <div className="mt-1.5 inline-flex items-center rounded border border-blue-500/20 bg-blue-500/10 px-1.5 py-0.5 text-[9px] font-semibold tracking-wider text-blue-400">
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
