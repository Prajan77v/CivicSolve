'use client'

import React, { useState } from 'react'
import AppShell from '@/components/layout/app-shell'
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Award,
  Cpu,
  Sparkles,
  Trash2,
  Check,
  ArrowRight,
  Filter,
  ExternalLink,
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { useLayout } from '@/components/layout/layout-context'

interface NotificationItem {
  id: string
  title: string
  message: string
  type: 'SUCCESS' | 'AI' | 'INFO' | 'WARNING'
  read: boolean
  link?: string
  timestamp: string
}

const initialNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Certificate of Outstanding Impact Issued! 🎓',
    message:
      'Your verified digital certificate for the Nashik Water Project has been cryptographically signed by the Ministry of Education.',
    type: 'SUCCESS',
    read: false,
    link: '/certificates/cert-nashik-001',
    timestamp: '10 minutes ago',
  },
  {
    id: 'notif-2',
    title: 'Critical Problem Match Detected (98.4%)',
    message:
      'A new CRITICAL flash flood warning problem in Kendrapara, Odisha matches your hydrology & IoT engineering skills.',
    type: 'AI',
    read: false,
    link: '/problems',
    timestamp: '42 minutes ago',
  },
  {
    id: 'notif-3',
    title: 'Impact Metric Verified by District Health Officer 🌟',
    message:
      'Laboratory assay officially confirms 78% reduction in groundwater fluoride in Sinnar villages. Status updated to FIELD_VERIFIED.',
    type: 'SUCCESS',
    read: false,
    link: '/impact-wall',
    timestamp: '2 hours ago',
  },
  {
    id: 'notif-4',
    title: 'Government Direct Intervention Alert 🚨',
    message:
      'District Magistrate Pune has requested fast-track telemetry for the Mula-Mutha river chemical runoff alert.',
    type: 'WARNING',
    read: false,
    link: '/command-center',
    timestamp: '4 hours ago',
  },
  {
    id: 'notif-5',
    title: 'New Hardware Equipment Sandbox Allocated',
    message:
      'Wipro EcoEnergy allocated 50 IoT sensor and solar testing hardware units for the rural water purification initiative.',
    type: 'INFO',
    read: true,
    link: '/partners',
    timestamp: '1 day ago',
  },
  {
    id: 'notif-6',
    title: 'AI Problem Categorization Finished',
    message:
      'Your submission regarding hospital OPD waiting times has been processed and assigned HIGH priority with SDG 3 alignment.',
    type: 'AI',
    read: true,
    link: '/problems',
    timestamp: '2 days ago',
  },
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications)
  const [filterType, setFilterType] = useState<string>('ALL')
  const { unreadNotificationsCount, setUnreadNotificationsCount } = useLayout()

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    setUnreadNotificationsCount(0)
    toast.success('All notifications marked as read')
  }

  const markSingleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
    setUnreadNotificationsCount(Math.max(0, unreadNotificationsCount - 1))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
    toast.info('Notification removed')
  }

  const filtered = notifications.filter((n) => {
    if (filterType === 'UNREAD') return !n.read
    if (filterType === 'AI') return n.type === 'AI'
    if (filterType === 'CERTS') return n.type === 'SUCCESS' && n.title.includes('Certificate')
    if (filterType === 'ALERTS') return n.type === 'WARNING'
    return true
  })

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <AppShell>
      <div className="space-y-8 pb-16 max-w-5xl mx-auto">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
              <Bell className="h-7 w-7 text-blue-400" />
              Notification Intelligence Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Real-time updates on problem matching, AI insights, deployment telemetry, and certificates.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                Mark all as read
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
          {[
            { id: 'ALL', label: `All (${notifications.length})` },
            { id: 'UNREAD', label: `Unread (${unreadCount})` },
            { id: 'AI', label: 'AI & Matches' },
            { id: 'CERTS', label: 'Certificates' },
            { id: 'ALERTS', label: 'Gov Alerts' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`rounded-xl px-4 py-2 text-xs font-bold whitespace-nowrap transition-all ${
                filterType === tab.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-slate-900 border border-white/10 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-12 text-center text-slate-400 space-y-2">
              <Bell className="h-8 w-8 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-slate-300">No notifications in this filter</p>
              <p className="text-xs">You are completely up-to-date with all system alerts.</p>
            </div>
          ) : (
            filtered.map((item) => {
              const isWarning = item.type === 'WARNING'
              const isSuccess = item.type === 'SUCCESS'
              const isAI = item.type === 'AI'

              return (
                <div
                  key={item.id}
                  className={`group relative overflow-hidden rounded-2xl border p-5 transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-4 ${
                    !item.read
                      ? 'border-blue-500/40 bg-slate-900/90 shadow-[0_0_25px_rgba(37,99,235,0.08)]'
                      : 'border-white/5 bg-slate-950/50 opacity-80 hover:opacity-100 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isWarning
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : isSuccess
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : isAI
                          ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                          : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      }`}
                    >
                      {isWarning ? (
                        <AlertTriangle className="h-5 w-5" />
                      ) : isSuccess ? (
                        <Award className="h-5 w-5" />
                      ) : isAI ? (
                        <Sparkles className="h-5 w-5" />
                      ) : (
                        <Bell className="h-5 w-5" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                          {item.title}
                        </h3>
                        {!item.read && (
                          <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                        )}
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                        {item.message}
                      </p>

                      <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-500">
                        <span>{item.timestamp}</span>
                        {item.link && (
                          <>
                            <span>•</span>
                            <Link
                              href={item.link}
                              onClick={() => markSingleRead(item.id)}
                              className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
                            >
                              View Details
                              <ArrowRight className="h-3 w-3" />
                            </Link>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-start shrink-0">
                    {!item.read && (
                      <button
                        onClick={() => markSingleRead(item.id)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                        title="Mark as read"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    )}

                    <button
                      onClick={() => deleteNotification(item.id)}
                      className="rounded-lg p-2 text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                      title="Delete notification"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </AppShell>
  )
}
