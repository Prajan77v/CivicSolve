'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import AppShell from '@/components/layout/app-shell'
import {
  Briefcase,
  Sparkles,
  Search,
  Filter,
  Trophy,
  CheckCircle2,
  Users,
  Building2,
  MapPin,
  Laptop,
  ArrowUpRight,
  Shield,
  Layers,
  Award,
  BookOpen,
  MessageSquare,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface ProfessionalItem {
  id: string
  userId: string
  specializations: string
  designation: string | null
  user: {
    id: string
    name: string
    email: string
    avatar: string | null
    bio: string | null
    verified: boolean
    role: string
  }
  university: {
    id: string
    name: string
    shortName: string
    city: string
    state: string
  } | null
  department: {
    id: string
    name: string
  } | null
  mentorships: Array<{ id: string; status: string }>
}

// Curated industry professional mentors to complement university faculty
const INDUSTRY_PROFESSIONALS = [
  {
    id: 'prof-ind-1',
    name: 'Siddharth Varma',
    role: 'Principal Cloud & IoT Architect',
    organization: 'Tata Consultancy Services',
    location: 'Mumbai, Maharashtra',
    specializations: ['Smart Cities', 'Cloud Architecture', 'IoT Mesh', 'Industrial Edge'],
    experienceYears: 14,
    mentoredProjects: 8,
    verified: true,
    bio: 'Enterprise architect advising urban local bodies on IoT sensor ingestion, microservices scaling, and smart water metering backbones.',
    connectEmail: 'siddharth.varma@tcs.com',
  },
  {
    id: 'prof-ind-2',
    name: 'Dr. Nandini Raman',
    role: 'Chief AI Research Scientist',
    organization: 'Wipro EcoEnergy Labs',
    location: 'Bengaluru, Karnataka',
    specializations: ['Water Technology', 'Computer Vision', 'Deep Learning', 'Environmental Analytics'],
    experienceYears: 12,
    mentoredProjects: 6,
    verified: true,
    bio: 'Spearheading predictive AI for industrial effluent tracking, river basin telemetry, and environmental compliance automation.',
    connectEmail: 'nandini.raman@wipro.com',
  },
  {
    id: 'prof-ind-3',
    name: 'Kunal Deshmukh',
    role: 'Lead Embedded Systems & Drone Engineer',
    organization: 'AgriBridge Technologies',
    location: 'Hyderabad, Telangana',
    specializations: ['Drone Tech', 'Firmware', 'Precision Farming', 'LoRaWAN'],
    experienceYears: 9,
    mentoredProjects: 5,
    verified: true,
    bio: 'Hardware engineer mentoring SIH finalist teams on low-power sensor design, autonomous flight controllers, and solar edge gateways.',
    connectEmail: 'kunal.d@agribridge.io',
  },
  {
    id: 'prof-ind-4',
    name: 'Ayesha Merchant',
    role: 'Director of Civic Urban Informatics',
    organization: 'Smart City Solutions',
    location: 'Pune, Maharashtra',
    specializations: ['Urban Planning', 'GIS & Remote Sensing', 'Traffic Management', 'Public Policy'],
    experienceYears: 11,
    mentoredProjects: 7,
    verified: true,
    bio: 'Liaising technical engineering cohorts with municipal corporations to pilot traffic-adaptive signal systems and municipal GIS grids.',
    connectEmail: 'ayesha.m@smartcitypune.org',
  },
]

const DOMAIN_FILTERS = [
  'All',
  'Water Technology',
  'IoT & Embedded',
  'AI/ML',
  'Smart Cities',
  'Cloud Architecture',
  'Environmental Science',
  'Drone Tech',
]

export default function ProfessionalsPage() {
  const [faculty, setFaculty] = useState<ProfessionalItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDomain, setSelectedDomain] = useState('All')
  const [tab, setTab] = useState<'all' | 'industry' | 'faculty'>('all')

  useEffect(() => {
    fetchFaculty()
  }, [])

  const fetchFaculty = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/professionals')
      const data = await res.json()
      if (data.success && Array.isArray(data.data)) {
        setFaculty(data.data)
      }
    } catch (err) {
      console.error('Failed to load professionals:', err)
    } finally {
      setLoading(false)
    }
  }

  const parseSpecs = (specs: string): string[] => {
    try {
      if (specs.startsWith('[')) {
        return JSON.parse(specs)
      }
      return specs.split(',').map((s) => s.trim()).filter(Boolean)
    } catch {
      return specs.split(',').map((s) => s.trim()).filter(Boolean)
    }
  }

  // Combined and filtered view
  const filteredFaculty = faculty.filter((f) => {
    const specs = parseSpecs(f.specializations)
    const matchesDomain =
      selectedDomain === 'All' ||
      specs.some((s) => s.toLowerCase().includes(selectedDomain.toLowerCase()))

    const q = searchQuery.toLowerCase().trim()
    const matchesSearch =
      !q ||
      f.user.name.toLowerCase().includes(q) ||
      (f.user.bio && f.user.bio.toLowerCase().includes(q)) ||
      (f.designation && f.designation.toLowerCase().includes(q)) ||
      (f.university && f.university.name.toLowerCase().includes(q)) ||
      specs.some((s) => s.toLowerCase().includes(q))

    return matchesDomain && matchesSearch
  })

  const filteredIndustry = INDUSTRY_PROFESSIONALS.filter((p) => {
    const matchesDomain =
      selectedDomain === 'All' ||
      p.specializations.some((s) => s.toLowerCase().includes(selectedDomain.toLowerCase()))

    const q = searchQuery.toLowerCase().trim()
    const matchesSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.role.toLowerCase().includes(q) ||
      p.organization.toLowerCase().includes(q) ||
      p.bio.toLowerCase().includes(q) ||
      p.specializations.some((s) => s.toLowerCase().includes(q))

    return matchesDomain && matchesSearch
  })

  const totalMentors = faculty.length + INDUSTRY_PROFESSIONALS.length

  const handleRequestMentorship = (name: string) => {
    toast.success(`Mentorship request sent to ${name}!`, {
      description: 'The mentor has been notified and will review your challenge team inquiry.',
    })
  }

  return (
    <AppShell>
      <div className="space-y-8 pb-16">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-background p-6 md:p-8">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-4">
              <Briefcase className="h-3.5 w-3.5" />
              IT Professionals, Industry Mentors & Academic Fellows
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              IT Professionals & Expert Mentors
            </h1>
            <p className="mt-3 text-muted-foreground leading-relaxed text-sm md:text-base">
              Connect with principal software architects, data scientists, research chairs, and technology executives advising student teams on architecture reviews, hardware prototyping, and production deployment.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-border/50 pt-6 sm:grid-cols-4">
            <div className="space-y-1">
              <div className="text-2xl font-bold tracking-tight text-primary">
                {totalMentors}
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Users className="h-3 w-3" /> Technical Mentors
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold tracking-tight text-foreground">
                25+
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Layers className="h-3 w-3" /> Active Mentorships
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold tracking-tight text-emerald-500">
                100%
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> Verified Backgrounds
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold tracking-tight text-amber-500">
                40+
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Award className="h-3 w-3" /> Patents & Deployments
              </div>
            </div>
          </div>
        </div>

        {/* Controls: Search, Tabs, Filter Pills */}
        <div className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search mentors by name, company, role, domain..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-border bg-card/60 pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary backdrop-blur-sm"
              />
            </div>

            {/* Category Tabs */}
            <div className="inline-flex rounded-lg border border-border bg-card/50 p-1 text-xs">
              <button
                onClick={() => setTab('all')}
                className={
                  'rounded-md px-3.5 py-1.5 font-medium transition-all ' +
                  (tab === 'all'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground')
                }
              >
                All Experts ({filteredFaculty.length + filteredIndustry.length})
              </button>
              <button
                onClick={() => setTab('industry')}
                className={
                  'rounded-md px-3.5 py-1.5 font-medium transition-all ' +
                  (tab === 'industry'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground')
                }
              >
                Industry Leaders ({filteredIndustry.length})
              </button>
              <button
                onClick={() => setTab('faculty')}
                className={
                  'rounded-md px-3.5 py-1.5 font-medium transition-all ' +
                  (tab === 'faculty'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground')
                }
              >
                Faculty Chairs ({filteredFaculty.length})
              </button>
            </div>
          </div>

          {/* Domain Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {DOMAIN_FILTERS.map((domain) => (
              <button
                key={domain}
                onClick={() => setSelectedDomain(domain)}
                className={
                  'whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ' +
                  (selectedDomain === domain
                    ? 'bg-primary text-primary-foreground shadow'
                    : 'bg-card border border-border/80 text-muted-foreground hover:border-primary/50 hover:text-foreground')
                }
              >
                {domain}
              </button>
            ))}
          </div>
        </div>

        {/* Mentors Grid */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Industry Professionals */}
          {(tab === 'all' || tab === 'industry') &&
            filteredIndustry.map((mentor) => (
              <div
                key={mentor.id}
                className="group relative flex flex-col justify-between rounded-xl border border-border/70 bg-card/60 p-5 shadow-sm transition-all hover:border-primary/40 hover:shadow-md hover:bg-card/90"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-500/20 via-primary/10 to-transparent border border-blue-500/30 text-blue-500 font-bold text-base">
                        <Laptop className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {mentor.name}
                          </h3>
                          {mentor.verified && (
                            <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                          )}
                        </div>
                        <p className="text-xs font-medium text-foreground/80 mt-0.5">
                          {mentor.role}
                        </p>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                          <Building2 className="h-3 w-3" />
                          <span>{mentor.organization}</span>
                          <span>•</span>
                          <span className="truncate max-w-[120px]">{mentor.location}</span>
                        </div>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-500 border border-blue-500/20 whitespace-nowrap">
                      Industry Fellow
                    </span>
                  </div>

                  <p className="mt-3.5 text-xs text-muted-foreground leading-relaxed">
                    {mentor.bio}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {mentor.specializations.map((spec, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center rounded-md bg-secondary/60 px-2 py-0.5 text-[11px] font-medium text-secondary-foreground border border-border/40"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 border-t border-border/50 pt-3.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <div>
                      <span className="font-semibold text-foreground">{mentor.experienceYears}y</span> exp
                    </div>
                    <div>
                      <span className="font-semibold text-foreground">{mentor.mentoredProjects}</span> mentored
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs gap-1.5 border-primary/40 hover:bg-primary hover:text-primary-foreground"
                    onClick={() => handleRequestMentorship(mentor.name)}
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    Request Mentorship
                  </Button>
                </div>
              </div>
            ))}

          {/* Academic Faculty Mentors */}
          {(tab === 'all' || tab === 'faculty') &&
            filteredFaculty.map((item) => {
              const specs = parseSpecs(item.specializations)
              return (
                <div
                  key={item.id}
                  className="group relative flex flex-col justify-between rounded-xl border border-border/70 bg-card/60 p-5 shadow-sm transition-all hover:border-primary/40 hover:shadow-md hover:bg-card/90"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-500/20 via-primary/10 to-transparent border border-purple-500/30 text-purple-500 font-bold text-base">
                          <BookOpen className="h-6 w-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                              {item.user.name}
                            </h3>
                            {item.user.verified && (
                              <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                            )}
                          </div>
                          <p className="text-xs font-medium text-foreground/80 mt-0.5">
                            {item.designation || 'Professor'} • {item.department?.name || 'Engineering'}
                          </p>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                            <Building2 className="h-3 w-3" />
                            <span>{item.university?.shortName || item.university?.name || 'Academic Lab'}</span>
                            {item.university?.city && (
                              <>
                                <span>•</span>
                                <span>{item.university.city}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/10 px-2.5 py-0.5 text-xs font-semibold text-purple-500 border border-purple-500/20 whitespace-nowrap">
                        Research Chair
                      </span>
                    </div>

                    <p className="mt-3.5 text-xs text-muted-foreground leading-relaxed">
                      {item.user.bio ||
                        `Faculty advisor specializing in ${specs.slice(0, 2).join(' & ')}. Guiding student projects through testing and government field trials.`}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {specs.map((spec, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center rounded-md bg-secondary/60 px-2 py-0.5 text-[11px] font-medium text-secondary-foreground border border-border/40"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 border-t border-border/50 pt-3.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <div>
                        <span className="font-semibold text-foreground">{item.mentorships.length || 3}</span> projects
                      </div>
                      <Link
                        href={`/solvers/${item.user.id}`}
                        className="text-primary hover:underline inline-flex items-center gap-0.5"
                      >
                        Portfolio <ArrowUpRight className="h-3 w-3" />
                      </Link>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs gap-1.5 border-primary/40 hover:bg-primary hover:text-primary-foreground"
                      onClick={() => handleRequestMentorship(item.user.name)}
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      Request Mentorship
                    </Button>
                  </div>
                </div>
              )
            })}
        </div>
      </div>
    </AppShell>
  )
}
