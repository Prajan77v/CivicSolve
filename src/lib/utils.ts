import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(n: number): string {
  if (n >= 10000000) return (n / 10000000).toFixed(1) + 'Cr'
  if (n >= 100000) return (n / 100000).toFixed(1) + 'L'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
  return n.toString()
}

export function formatDate(d: Date | string): string {
  return new Date(d).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

export function getPriorityColor(priority: string): string {
  const map: Record<string, string> = {
    CRITICAL: 'text-red-400 bg-red-400/10 border-red-400/20',
    HIGH: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
    MEDIUM: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    LOW: 'text-green-400 bg-green-400/10 border-green-400/20',
  }
  return map[priority] || map.MEDIUM
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    SUBMITTED: 'text-slate-400 bg-slate-400/10',
    AI_ANALYZED: 'text-purple-400 bg-purple-400/10',
    MATCHED: 'text-blue-400 bg-blue-400/10',
    TEAM_FORMED: 'text-indigo-400 bg-indigo-400/10',
    PROPOSAL: 'text-violet-400 bg-violet-400/10',
    PROTOTYPE: 'text-pink-400 bg-pink-400/10',
    PILOT: 'text-teal-400 bg-teal-400/10',
    DEPLOYED: 'text-emerald-400 bg-emerald-400/10',
    IMPACT_VERIFIED: 'text-green-400 bg-green-400/10',
    CERTIFIED: 'text-amber-400 bg-amber-400/10',
  }
  return map[status] || map.SUBMITTED
}

export const LIFECYCLE_STAGES = [
  'SUBMITTED', 'AI_ANALYZED', 'MATCHED', 'TEAM_FORMED',
  'PROPOSAL', 'PROTOTYPE', 'PILOT', 'DEPLOYED', 'IMPACT_VERIFIED', 'CERTIFIED',
]
