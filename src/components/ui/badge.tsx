import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

export const badgeVariants = cva(
  'inline-flex items-center gap-1.5 font-medium border rounded-full transition-colors select-none',
  {
    variants: {
      variant: {
        default: 'bg-slate-800 text-slate-300 border-slate-700',
        primary: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
        secondary: 'bg-slate-700/50 text-slate-200 border-slate-600',
        outline: 'border-slate-700 text-slate-400 bg-transparent',

        // Priority variants
        CRITICAL: 'bg-red-500/15 text-red-400 border-red-500/30',
        HIGH: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
        MEDIUM: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
        LOW: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',

        // Status variants
        SUBMITTED: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
        AI_ANALYZED: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
        MATCHED: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
        TEAM_FORMED: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
        PROPOSAL: 'bg-violet-500/15 text-violet-400 border-violet-500/30',
        PROTOTYPE: 'bg-pink-500/15 text-pink-400 border-pink-500/30',
        PILOT: 'bg-teal-500/15 text-teal-400 border-teal-500/30',
        DEPLOYED: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
        IMPACT_VERIFIED: 'bg-green-500/15 text-green-400 border-green-500/30',
        CERTIFIED: 'bg-amber-400/15 text-amber-300 border-amber-400/30 shadow-sm shadow-amber-400/10',

        // Category variants
        WATER: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
        TRAFFIC: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
        AIR_QUALITY: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
        AGRICULTURE: 'bg-lime-500/15 text-lime-400 border-lime-500/30',
        WASTE: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
        HEALTH: 'bg-red-500/15 text-red-400 border-red-500/30',
        EDUCATION: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
        INFRASTRUCTURE: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
        ENERGY: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
        TRANSPORT: 'bg-violet-500/15 text-violet-400 border-violet-500/30',
      },
      size: {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-xs px-2.5 py-1',
        lg: 'text-sm px-3 py-1.5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

const dotColorMap: Record<string, string> = {
  CRITICAL: 'bg-red-400',
  HIGH: 'bg-orange-400',
  MEDIUM: 'bg-amber-400',
  LOW: 'bg-emerald-400',
  SUBMITTED: 'bg-slate-400',
  AI_ANALYZED: 'bg-purple-400',
  MATCHED: 'bg-blue-400',
  TEAM_FORMED: 'bg-indigo-400',
  PROPOSAL: 'bg-violet-400',
  PROTOTYPE: 'bg-pink-400',
  PILOT: 'bg-teal-400',
  DEPLOYED: 'bg-emerald-400',
  IMPACT_VERIFIED: 'bg-green-400',
  CERTIFIED: 'bg-amber-400',
  WATER: 'bg-cyan-400',
  TRAFFIC: 'bg-amber-400',
  AIR_QUALITY: 'bg-emerald-400',
  AGRICULTURE: 'bg-lime-400',
  WASTE: 'bg-rose-400',
  HEALTH: 'bg-red-400',
  EDUCATION: 'bg-indigo-400',
  INFRASTRUCTURE: 'bg-blue-400',
  ENERGY: 'bg-yellow-400',
  TRANSPORT: 'bg-violet-400',
}

const humanLabelMap: Record<string, string> = {
  CRITICAL: 'Critical',
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low',
  SUBMITTED: 'Submitted',
  AI_ANALYZED: 'AI Analyzed',
  MATCHED: 'Matched',
  TEAM_FORMED: 'Team Formed',
  PROPOSAL: 'Proposal',
  PROTOTYPE: 'Prototype',
  PILOT: 'Pilot',
  DEPLOYED: 'Deployed',
  IMPACT_VERIFIED: 'Impact Verified',
  CERTIFIED: 'Certified',
  WATER: 'Water Management',
  TRAFFIC: 'Traffic & Transit',
  AIR_QUALITY: 'Air Quality',
  AGRICULTURE: 'Agriculture',
  WASTE: 'Waste Management',
  HEALTH: 'Healthcare',
  EDUCATION: 'Education',
  INFRASTRUCTURE: 'Infrastructure',
  ENERGY: 'Renewable Energy',
  TRANSPORT: 'Public Transport',
}

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean
  icon?: React.ReactNode
  priority?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  status?:
    | 'SUBMITTED'
    | 'AI_ANALYZED'
    | 'MATCHED'
    | 'TEAM_FORMED'
    | 'PROPOSAL'
    | 'PROTOTYPE'
    | 'PILOT'
    | 'DEPLOYED'
    | 'IMPACT_VERIFIED'
    | 'CERTIFIED'
    | string
  category?:
    | 'WATER'
    | 'TRAFFIC'
    | 'AIR_QUALITY'
    | 'AGRICULTURE'
    | 'WASTE'
    | 'HEALTH'
    | 'EDUCATION'
    | 'INFRASTRUCTURE'
    | 'ENERGY'
    | 'TRANSPORT'
    | string
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant,
      size,
      dot = false,
      icon,
      priority,
      status,
      category,
      children,
      ...props
    },
    ref
  ) => {
    // Resolve variant from direct prop or priority/status/category shorthand
    const resolvedVariant =
      (priority as any) ||
      (status as any) ||
      (category as any) ||
      variant ||
      'default'

    // Determine fallback text if children is not provided
    const displayKey = priority || status || category || (typeof resolvedVariant === 'string' ? resolvedVariant : undefined)
    const content = children ?? (displayKey ? humanLabelMap[displayKey] || displayKey : null)

    const dotClass =
      typeof resolvedVariant === 'string' && dotColorMap[resolvedVariant]
        ? dotColorMap[resolvedVariant]
        : 'bg-current'

    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant: resolvedVariant as any, size }), className)}
        {...props}
      >
        {dot && (
          <span
            className={cn('h-1.5 w-1.5 rounded-full shrink-0', dotClass)}
            aria-hidden="true"
          />
        )}
        {icon && <span className="shrink-0">{icon}</span>}
        <span>{content}</span>
      </span>
    )
  }
)

Badge.displayName = 'Badge'
