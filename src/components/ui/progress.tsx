import * as React from 'react'
import { cn } from '@/lib/utils'

export type ProgressSize = 'sm' | 'md' | 'lg'
export type ProgressColor = 'blue' | 'cyan' | 'emerald' | 'purple' | 'amber' | 'rose'

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  max?: number
  size?: ProgressSize
  color?: ProgressColor
  showLabel?: boolean
  label?: string
}

const sizeClasses: Record<ProgressSize, string> = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
}

const colorClasses: Record<ProgressColor, string> = {
  blue: 'bg-gradient-to-r from-blue-600 to-blue-400 shadow-sm shadow-blue-500/30',
  cyan: 'bg-gradient-to-r from-cyan-600 to-cyan-400 shadow-sm shadow-cyan-500/30',
  emerald: 'bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-sm shadow-emerald-500/30',
  purple: 'bg-gradient-to-r from-purple-600 to-purple-400 shadow-sm shadow-purple-500/30',
  amber: 'bg-gradient-to-r from-amber-600 to-amber-400 shadow-sm shadow-amber-500/30',
  rose: 'bg-gradient-to-r from-rose-600 to-rose-400 shadow-sm shadow-rose-500/30',
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      className,
      value = 0,
      max = 100,
      size = 'md',
      color = 'blue',
      showLabel = false,
      label,
      ...props
    },
    ref
  ) => {
    const clampedValue = Math.min(Math.max(0, value), max)
    const percentage = Math.round((clampedValue / max) * 100)

    return (
      <div className={cn('w-full flex flex-col space-y-1.5', className)} {...props}>
        {(showLabel || label) && (
          <div className="flex items-center justify-between text-xs font-medium text-slate-300">
            {label && <span>{label}</span>}
            {showLabel && <span className="ml-auto text-slate-400">{percentage}%</span>}
          </div>
        )}

        <div
          ref={ref}
          role="progressbar"
          aria-valuenow={clampedValue}
          aria-valuemin={0}
          aria-valuemax={max}
          className={cn(
            'relative w-full overflow-hidden rounded-full bg-slate-800/80 border border-white/5',
            sizeClasses[size]
          )}
        >
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500 ease-out',
              colorClasses[color]
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    )
  }
)

Progress.displayName = 'Progress'
