'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface TabItem {
  id: string
  label: string
  icon?: LucideIcon
  count?: number
}

export interface TabsProps {
  tabs: TabItem[]
  activeTab: string
  onChange: (id: string) => void
  variant?: 'pill' | 'underline'
  className?: string
  fullWidth?: boolean
}

export function Tabs({
  tabs,
  activeTab,
  onChange,
  variant = 'pill',
  className,
  fullWidth = false,
}: TabsProps) {
  const layoutId = React.useId()

  return (
    <div
      role="tablist"
      className={cn(
        'flex items-center overflow-x-auto scrollbar-none',
        variant === 'pill'
          ? 'bg-slate-900/80 p-1.5 rounded-xl border border-white/10 gap-1'
          : 'border-b border-white/10 gap-2 sm:gap-6',
        fullWidth && 'w-full',
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id
        const Icon = tab.icon

        return (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(
              'relative flex items-center justify-center gap-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 whitespace-nowrap select-none',
              variant === 'pill'
                ? 'px-3.5 py-2 rounded-lg text-slate-400 hover:text-slate-200'
                : 'pb-3 pt-2 text-slate-400 hover:text-slate-200 border-b-2 border-transparent',
              isActive &&
                variant === 'pill' &&
                'text-white shadow-sm',
              isActive &&
                variant === 'underline' &&
                'text-blue-400 font-semibold',
              fullWidth && 'flex-1'
            )}
          >
            {/* Pill Active Background Animation */}
            {variant === 'pill' && isActive && (
              <motion.div
                layoutId={`active-tab-pill-${layoutId}`}
                className="absolute inset-0 rounded-lg bg-blue-600 shadow-md shadow-blue-500/25"
                transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
              />
            )}

            {/* Underline Active Bar Animation */}
            {variant === 'underline' && isActive && (
              <motion.div
                layoutId={`active-tab-underline-${layoutId}`}
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full"
                transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
              />
            )}

            <span className="relative z-10 flex items-center gap-2">
              {Icon && <Icon className="h-4 w-4 shrink-0" />}
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span
                  className={cn(
                    'ml-1 px-1.5 py-0.2 rounded-full text-xs font-semibold',
                    isActive && variant === 'pill'
                      ? 'bg-blue-700 text-white'
                      : isActive && variant === 'underline'
                      ? 'bg-blue-500/20 text-blue-300'
                      : 'bg-slate-800 text-slate-400'
                  )}
                >
                  {tab.count}
                </span>
              )}
            </span>
          </button>
        )
      })}
    </div>
  )
}
