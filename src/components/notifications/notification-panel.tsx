'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Info,
  Check,
  Bell,
  Clock,
  ExternalLink,
  Trash2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLayout } from '@/components/layout/layout-context'

export interface NotificationItem {
  id: string
  type: 'AI' | 'SUCCESS' | 'WARNING' | 'INFO'
  title: string
  message: string
  link?: string
  timestamp: string
  read: boolean
}

const initialNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'AI',
    title: 'AI Match Generated',
    message: 'Nashik Water Quality Monitoring matched with COEP IoT Lab (94% compatibility score).',
    link: '/ai-match-center',
    timestamp: '12m ago',
    read: false,
  },
  {
    id: 'notif-2',
    type: 'SUCCESS',
    title: 'Prototype Milestone Approved',
    message: 'Vidarbha Solar Desalination Phase 2 prototype was approved by Agriculture Dept.',
    link: '/projects',
    timestamp: '45m ago',
    read: false,
  },
  {
    id: 'notif-3',
    type: 'WARNING',
    title: 'Urgent Civic Alert',
    message: 'Groundwater heavy metal spike detected in Solapur Industrial Cluster #401.',
    link: '/problems',
    timestamp: '2h ago',
    read: false,
  },
  {
    id: 'notif-4',
    type: 'INFO',
    title: 'Impact Certificate Verified',
    message: 'Verified tamper-evident certificate generated for Team Agritech (#CS-2026-0842).',
    link: '/certificates',
    timestamp: '5h ago',
    read: false,
  },
  {
    id: 'notif-5',
    type: 'SUCCESS',
    title: 'CSR Funding Committed',
    message: 'Tata Motors CSR pledged ₹15,00,000 for Pune Urban Air Filtration pilot grid.',
    link: '/partners',
    timestamp: '1d ago',
    read: true,
  },
]

interface NotificationPanelProps {
  onClose?: () => void
}

export default function NotificationPanel({ onClose }: NotificationPanelProps) {
  const { setUnreadNotificationsCount } = useLayout()
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications)
  const [filter, setFilter] = useState<'all' | 'unread' | 'ai'>('all')

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    setUnreadNotificationsCount(0)
  }

  const handleItemClick = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
    const newUnread = notifications.filter((n) => n.id !== id && !n.read).length
    setUnreadNotificationsCount(newUnread)
    if (onClose) onClose()
  }

  const handleClearAll = () => {
    setNotifications([])
    setUnreadNotificationsCount(0)
  }

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.read
    if (filter === 'ai') return n.type === 'AI'
    return true
  })

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'AI':
        return (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <Sparkles className="h-4 w-4" />
          </div>
        )
      case 'SUCCESS':
        return (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="h-4 w-4" />
          </div>
        )
      case 'WARNING':
        return (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <AlertTriangle className="h-4 w-4" />
          </div>
        )
      case 'INFO':
      default:
        return (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <Info className="h-4 w-4" />
          </div>
        )
    }
  }

  return (
    <div className="flex flex-col w-full max-w-sm sm:w-96 rounded-2xl bg-[#0f172a] border border-white/10 shadow-2xl shadow-black/80 overflow-hidden text-slate-100 z-50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/5 bg-slate-900/60">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-blue-400" />
          <h3 className="text-sm font-semibold tracking-wide text-white">Notifications</h3>
          {unreadCount > 0 && (
            <span className="rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 text-[10px] font-bold">
              {unreadCount} new
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 transition-colors px-2 py-1 rounded hover:bg-slate-800"
              title="Mark all as read"
            >
              <Check className="h-3 w-3" />
              <span>Mark read</span>
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={handleClearAll}
              className="p-1 text-slate-400 hover:text-red-400 rounded hover:bg-slate-800 transition-colors"
              title="Clear all"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 px-4 py-2 border-b border-white/5 bg-slate-950/40 text-xs">
        <button
          onClick={() => setFilter('all')}
          className={cn(
            'px-2.5 py-1 rounded-md transition-colors',
            filter === 'all'
              ? 'bg-blue-600/20 text-blue-400 font-medium'
              : 'text-slate-400 hover:text-slate-200'
          )}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={cn(
            'px-2.5 py-1 rounded-md transition-colors',
            filter === 'unread'
              ? 'bg-blue-600/20 text-blue-400 font-medium'
              : 'text-slate-400 hover:text-slate-200'
          )}
        >
          Unread ({unreadCount})
        </button>
        <button
          onClick={() => setFilter('ai')}
          className={cn(
            'px-2.5 py-1 rounded-md transition-colors',
            filter === 'ai'
              ? 'bg-purple-600/20 text-purple-400 font-medium'
              : 'text-slate-400 hover:text-slate-200'
          )}
        >
          AI Alerts
        </button>
      </div>

      {/* Notification List */}
      <div className="max-h-[380px] overflow-y-auto divide-y divide-white/5 scrollbar-thin">
        {filteredNotifications.length === 0 ? (
          <div className="py-12 px-4 text-center">
            <Bell className="mx-auto h-8 w-8 text-slate-600 mb-2 opacity-60" />
            <p className="text-xs text-slate-400">No notifications in this view</p>
          </div>
        ) : (
          filteredNotifications.map((item) => (
            <div
              key={item.id}
              className={cn(
                'group relative flex gap-3 p-3.5 transition-colors duration-150',
                item.read ? 'bg-transparent hover:bg-slate-800/40' : 'bg-blue-950/20 hover:bg-blue-950/30'
              )}
            >
              {getIcon(item.type)}

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-1">
                  <h4
                    className={cn(
                      'text-xs font-semibold leading-tight truncate',
                      item.read ? 'text-slate-300' : 'text-white'
                    )}
                  >
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 shrink-0">
                    <Clock className="h-2.5 w-2.5" />
                    <span>{item.timestamp}</span>
                  </div>
                </div>

                <p className="mt-1 text-[11px] leading-relaxed text-slate-300 line-clamp-2">
                  {item.message}
                </p>

                {item.link && (
                  <Link
                    href={item.link}
                    onClick={() => handleItemClick(item.id)}
                    className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <span>View details</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                )}
              </div>

              {!item.read && (
                <div className="absolute right-3 top-3.5 h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_6px_#38bdf8]" />
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-2.5 border-t border-white/5 bg-slate-900/60 text-center">
        <Link
          href="/dashboard"
          onClick={onClose}
          className="text-xs font-medium text-slate-400 hover:text-blue-400 transition-colors"
        >
          View All Activity & Logs →
        </Link>
      </div>
    </div>
  )
}
