'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { type LucideIcon, TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export type StatCardColor = 'blue' | 'cyan' | 'emerald' | 'purple' | 'orange'

export interface StatCardProps {
  title: string
  value: number | string
  subtext?: string
  icon: LucideIcon
  trend?: string
  trendUp?: boolean
  color?: StatCardColor
  className?: string
  onClick?: () => void
}

const colorThemes: Record<
  StatCardColor,
  {
    iconBg: string
    borderHover: string
    glow: string
    accentText: string
  }
> = {
  blue: {
    iconBg: 'bg-blue-500/15 border-blue-500/30 text-blue-400',
    borderHover: 'hover:border-blue-500/40',
    glow: 'hover:shadow-blue-500/10',
    accentText: 'text-blue-400',
  },
  cyan: {
    iconBg: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400',
    borderHover: 'hover:border-cyan-500/40',
    glow: 'hover:shadow-cyan-500/10',
    accentText: 'text-cyan-400',
  },
  emerald: {
    iconBg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
    borderHover: 'hover:border-emerald-500/40',
    glow: 'hover:shadow-emerald-500/10',
    accentText: 'text-emerald-400',
  },
  purple: {
    iconBg: 'bg-purple-500/15 border-purple-500/30 text-purple-400',
    borderHover: 'hover:border-purple-500/40',
    glow: 'hover:shadow-purple-500/10',
    accentText: 'text-purple-400',
  },
  orange: {
    iconBg: 'bg-orange-500/15 border-orange-500/30 text-orange-400',
    borderHover: 'hover:border-orange-500/40',
    glow: 'hover:shadow-orange-500/10',
    accentText: 'text-orange-400',
  },
}

export function StatCard({
  title,
  value,
  subtext,
  icon: Icon,
  trend,
  trendUp,
  color = 'blue',
  className,
  onClick,
}: StatCardProps) {
  const theme = colorThemes[color] || colorThemes.blue

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={onClick}
      className={cn(
        'glass-card rounded-2xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur-xl shadow-xl transition-all duration-200 cursor-default',
        theme.borderHover,
        theme.glow,
        onClick && 'cursor-pointer active:scale-[0.99]',
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <h4 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {value}
            </h4>
          </div>
        </div>

        <div
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-xl border p-2.5 shrink-0 transition-transform duration-200 group-hover:scale-110',
            theme.iconBg
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>

      {(trend || subtext) && (
        <div className="mt-4 flex items-center justify-between gap-2 pt-3 border-t border-white/5 text-xs">
          {trend && (
            <div
              className={cn(
                'inline-flex items-center gap-1 font-semibold',
                trendUp === true && 'text-emerald-400',
                trendUp === false && 'text-red-400',
                trendUp === undefined && 'text-slate-400'
              )}
            >
              {trendUp === true && <TrendingUp className="h-3.5 w-3.5" />}
              {trendUp === false && <TrendingDown className="h-3.5 w-3.5" />}
              <span>{trend}</span>
            </div>
          )}

          {subtext && (
            <span className="text-slate-400 truncate ml-auto">{subtext}</span>
          )}
        </div>
      )}
    </motion.div>
  )
}
