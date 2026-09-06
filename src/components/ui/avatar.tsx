'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl'

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null
  name?: string
  size?: AvatarSize
  alt?: string
}

const sizeClasses: Record<AvatarSize, { container: string; text: string }> = {
  sm: { container: 'h-8 w-8', text: 'text-xs font-semibold' },
  md: { container: 'h-10 w-10', text: 'text-sm font-semibold' },
  lg: { container: 'h-12 w-12', text: 'text-base font-bold' },
  xl: { container: 'h-16 w-16', text: 'text-xl font-bold' },
}

const gradients = [
  'from-blue-600 to-cyan-500',
  'from-purple-600 to-indigo-500',
  'from-emerald-600 to-teal-500',
  'from-orange-500 to-amber-500',
  'from-rose-600 to-pink-500',
  'from-violet-600 to-fuchsia-500',
  'from-sky-600 to-blue-600',
]

function getGradient(name?: string): string {
  if (!name) return gradients[0]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % gradients.length
  return gradients[index]
}

function getInitials(name?: string): string {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function Avatar({
  src,
  name = '',
  size = 'md',
  alt,
  className,
  ...props
}: AvatarProps) {
  const [imageFailed, setImageFailed] = React.useState(false)
  const sizeConfig = sizeClasses[size] || sizeClasses.md
  const initials = getInitials(name)
  const gradient = getGradient(name)

  const showImage = Boolean(src && !imageFailed)

  return (
    <div
      className={cn(
        'relative inline-flex shrink-0 select-none items-center justify-center overflow-hidden rounded-full ring-1 ring-white/10 shadow-inner',
        sizeConfig.container,
        className
      )}
      {...props}
    >
      {showImage ? (
        <img
          src={src!}
          alt={alt || name || 'User avatar'}
          onError={() => setImageFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <div
          className={cn(
            'flex h-full w-full items-center justify-center bg-gradient-to-br text-white shadow-inner',
            gradient,
            sizeConfig.text
          )}
          aria-label={name || 'Avatar'}
        >
          {initials}
        </div>
      )}
    </div>
  )
}
