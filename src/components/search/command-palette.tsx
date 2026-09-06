'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Compass,
  PlusCircle,
  Cpu,
  ShieldAlert,
  Trophy,
  Award,
  FolderKanban,
  GraduationCap,
  Building2,
  PlayCircle,
  FileText,
  X,
  ArrowRight,
  Sparkles,
  UserCheck,
  Briefcase,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLayout } from '@/components/layout/layout-context'

interface CommandItem {
  id: string
  title: string
  subtitle?: string
  category: 'Navigation' | 'Actions' | 'Challenges' | 'AI & Analytics' | 'Ecosystem'
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
}

const commandItems: CommandItem[] = [
  // Actions
  {
    id: 'action-submit-problem',
    title: 'Submit New Problem',
    subtitle: 'Upload citizen grievance or civic challenge with evidence',
    category: 'Actions',
    href: '/problems/new',
    icon: PlusCircle,
    badge: 'Action',
  },
  {
    id: 'action-live-demo',
    title: 'Launch Live Demo Runner',
    subtitle: 'Run complete 60-second end-to-end SIH26043 demo simulation',
    category: 'Actions',
    href: '/demo',
    icon: PlayCircle,
    badge: 'Interactive',
  },

  // Navigation
  {
    id: 'nav-problems',
    title: 'Explore Challenges',
    subtitle: 'Browse real-world societal problems mapped by district',
    category: 'Navigation',
    href: '/problems',
    icon: Compass,
  },
  {
    id: 'nav-projects',
    title: 'Active Projects & Solutions',
    subtitle: 'Monitor student prototype milestones and deployment progress',
    category: 'Navigation',
    href: '/projects',
    icon: FolderKanban,
  },
  {
    id: 'nav-leaderboard',
    title: 'Impact Leaderboard',
    subtitle: 'Top performing students, universities, and student teams',
    category: 'Navigation',
    href: '/leaderboard',
    icon: Trophy,
  },
  {
    id: 'nav-certificates',
    title: 'Verified Certificates',
    subtitle: 'Cryptographically verifiable credentials for civic impact',
    category: 'Navigation',
    href: '/certificates',
    icon: Award,
  },

  // AI & Analytics
  {
    id: 'ai-match-center',
    title: 'AI Match Center',
    subtitle: '3-tier matchmaking engine connecting problems to academic teams',
    category: 'AI & Analytics',
    href: '/ai-match-center',
    icon: Cpu,
    badge: 'AI Engine',
  },
  {
    id: 'ai-command-center',
    title: 'Government Command Center',
    subtitle: 'Administrative oversight, SLA monitoring, and emergency escalations',
    category: 'AI & Analytics',
    href: '/command-center',
    icon: ShieldAlert,
    badge: 'Gov/Admin',
  },

  // Challenges (Realistic India SIH cases)
  {
    id: 'problem-nashik-water',
    title: 'Nashik Water Contamination & Heavy Metal Detection',
    subtitle: 'Industrial effluent monitoring in Godavari basin • Priority: Critical',
    category: 'Challenges',
    href: '/problems?search=nashik',
    icon: FileText,
    badge: 'High Impact',
  },
  {
    id: 'problem-vidarbha-irrigation',
    title: 'Vidarbha Smart Irrigation & Groundwater Monitoring',
    subtitle: 'IoT sensor network for drought-resilient cotton cultivation',
    category: 'Challenges',
    href: '/problems?search=vidarbha',
    icon: FileText,
  },
  {
    id: 'problem-dharavi-sanitation',
    title: 'Dharavi High-Density Sanitation Grid Optimization',
    subtitle: 'Community toilet maintenance tracking & graywater reuse',
    category: 'Challenges',
    href: '/problems?search=dharavi',
    icon: FileText,
  },
  {
    id: 'problem-pune-heat-island',
    title: 'Pune Urban Heat Island & Air Quality Sensor Mesh',
    subtitle: 'Microclimate tracking in congested transit corridors',
    category: 'Challenges',
    href: '/problems?search=pune',
    icon: FileText,
  },

  // Ecosystem
  {
    id: 'eco-universities',
    title: 'Universities & Academic Labs',
    subtitle: 'COEP Pune, IIT Bombay, VJTI Mumbai and 40+ engineering colleges',
    category: 'Ecosystem',
    href: '/universities',
    icon: GraduationCap,
  },
  {
    id: 'eco-students',
    title: 'Student Solvers Directory',
    subtitle: 'Engineering fellows, hackathon champions, and SIH solvers',
    category: 'Ecosystem',
    href: '/students',
    icon: UserCheck,
    badge: 'Solvers',
  },
  {
    id: 'eco-professionals',
    title: 'IT Professionals & Mentors',
    subtitle: 'Principal architects, technical advisors, and research fellows',
    category: 'Ecosystem',
    href: '/professionals',
    icon: Briefcase,
    badge: 'Mentors',
  },
  {
    id: 'eco-partners',
    title: 'Industry & CSR Partners',
    subtitle: 'Corporate funding, technical mentorship, and field pilots',
    category: 'Ecosystem',
    href: '/partners',
    icon: Building2,
  },
]

export default function CommandPalette() {
  const router = useRouter()
  const { isCommandPaletteOpen, setCommandPaletteOpen } = useLayout()
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // Filter items based on query
  const filteredItems = commandItems.filter((item) => {
    const q = query.toLowerCase().trim()
    if (!q) return true
    return (
      item.title.toLowerCase().includes(q) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
      item.category.toLowerCase().includes(q)
    )
  })

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  // Focus input when opened
  useEffect(() => {
    if (isCommandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
    } else {
      setQuery('')
      setSelectedIndex(0)
    }
  }, [isCommandPaletteOpen])

  // Keyboard navigation
  useEffect(() => {
    if (!isCommandPaletteOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        setCommandPaletteOpen(false)
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) =>
          prev < filteredItems.length - 1 ? prev + 1 : 0
        )
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : Math.max(0, filteredItems.length - 1)
        )
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (filteredItems[selectedIndex]) {
          const item = filteredItems[selectedIndex]
          setCommandPaletteOpen(false)
          router.push(item.href)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isCommandPaletteOpen, filteredItems, selectedIndex, router, setCommandPaletteOpen])

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const activeElement = listRef.current.querySelector(
        `[data-index="${selectedIndex}"]`
      ) as HTMLElement | null
      if (activeElement) {
        activeElement.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [selectedIndex])

  if (!isCommandPaletteOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 bg-black/75 backdrop-blur-md"
          onClick={() => setCommandPaletteOpen(false)}
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-[#0f172a] shadow-2xl shadow-black/90 text-slate-100 z-10"
        >
          {/* Search Input Bar */}
          <div className="relative flex items-center border-b border-white/10 px-4 py-3.5 bg-slate-900/60">
            <Search className="h-5 w-5 text-blue-400 shrink-0 mr-3" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search challenges, teams, universities, actions..."
              className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="rounded p-1 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-block ml-2 rounded border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-slate-400">
              ESC
            </kbd>
          </div>

          {/* Results List */}
          <div
            ref={listRef}
            className="max-h-96 overflow-y-auto p-2 scrollbar-thin divide-y divide-transparent"
          >
            {filteredItems.length === 0 ? (
              <div className="py-12 text-center">
                <Search className="mx-auto h-8 w-8 text-slate-600 mb-2 opacity-50" />
                <p className="text-sm font-medium text-slate-300">No results found for &ldquo;{query}&rdquo;</p>
                <p className="text-xs text-slate-500 mt-1">
                  Try searching for &quot;water&quot;, &quot;nashik&quot;, &quot;submit&quot;, or &quot;match&quot;
                </p>
              </div>
            ) : (
              filteredItems.map((item, index) => {
                const isSelected = index === selectedIndex
                const Icon = item.icon

                return (
                  <div
                    key={item.id}
                    data-index={index}
                    onClick={() => {
                      setCommandPaletteOpen(false)
                      router.push(item.href)
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={cn(
                      'group flex items-center justify-between rounded-xl px-3 py-2.5 cursor-pointer transition-all duration-150',
                      isSelected
                        ? 'bg-blue-600/20 text-white border border-blue-500/40 shadow-[0_0_15px_rgba(37,99,235,0.2)]'
                        : 'text-slate-300 hover:bg-slate-800/50 border border-transparent'
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={cn(
                          'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors',
                          isSelected
                            ? 'bg-blue-500/25 text-cyan-300'
                            : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-semibold truncate leading-snug">
                            {item.title}
                          </p>
                          {item.badge && (
                            <span className="rounded border border-blue-500/30 bg-blue-500/10 px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider text-blue-300">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        {item.subtitle && (
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">
                            {item.subtitle}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      <span className="hidden sm:inline-block text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                        {item.category}
                      </span>
                      <ArrowRight
                        className={cn(
                          'h-3.5 w-3.5 transition-transform duration-150',
                          isSelected
                            ? 'text-cyan-400 translate-x-0.5'
                            : 'text-slate-600 group-hover:text-slate-400'
                        )}
                      />
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Modal Footer Controls */}
          <div className="flex items-center justify-between border-t border-white/10 px-4 py-2.5 bg-slate-900/60 text-[11px] text-slate-400">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px]">↑</kbd>
                <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px]">↓</kbd>
                <span>navigate</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px]">↵</kbd>
                <span>select</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px]">esc</kbd>
                <span>close</span>
              </span>
            </div>

            <div className="flex items-center gap-1 text-slate-500">
              <Sparkles className="h-3 w-3 text-cyan-400" />
              <span>CivicSolve Search</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
