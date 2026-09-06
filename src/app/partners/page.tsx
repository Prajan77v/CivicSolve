'use client'

import React, { useState } from 'react'
import AppShell from '@/components/layout/app-shell'
import {
  Building2,
  Handshake,
  DollarSign,
  HeartHandshake,
  Briefcase,
  MapPin,
  CheckCircle2,
  Search,
  Filter,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award,
  Send,
  Coins,
} from 'lucide-react'
import { toast } from 'sonner'

interface Partner {
  id: string
  name: string
  type: 'INDUSTRY' | 'STARTUP' | 'NGO'
  sector: string
  city: string
  state: string
  expertise: string[]
  verified: boolean
  committedFunding: string
  activeProjects: number
  description: string
}

const partnersList: Partner[] = [
  {
    id: 'org-tcs',
    name: 'Tata Consultancy Services',
    type: 'INDUSTRY',
    sector: 'Technology & Smart Cities',
    city: 'Mumbai',
    state: 'Maharashtra',
    expertise: ['IoT Systems', 'Cloud & Data Infrastructure', 'Predictive AI', 'Smart Cities'],
    verified: true,
    committedFunding: '₹45,00,000',
    activeProjects: 3,
    description:
      'TCS Innovation Labs sponsors high-throughput computing credits, industrial edge sensor kits, and mentorship for university air quality and municipal infrastructure projects.',
  },
  {
    id: 'org-wipro',
    name: 'Wipro EcoEnergy',
    type: 'INDUSTRY',
    sector: 'Energy & Water Technology',
    city: 'Bengaluru',
    state: 'Karnataka',
    expertise: ['Water Purification', 'Industrial Effluent Neutralization', 'Renewable Energy', 'Remote Telemetry'],
    verified: true,
    committedFunding: '₹32,00,000',
    activeProjects: 2,
    description:
      'Partnering with IIT Bombay and Jal Jeevan Mission to co-engineer solar groundwater treatment plants across fluorosis-affected talukas in Maharashtra.',
  },
  {
    id: 'org-jal',
    name: 'Jal Jeevan Mission NGO Coalition',
    type: 'NGO',
    sector: 'Water & Rural Sanitation',
    city: 'New Delhi',
    state: 'Delhi NCR',
    expertise: ['Rural Community Mobilization', 'Field Water Testing', 'Gram Panchayat Governance', 'Sanitation'],
    verified: true,
    committedFunding: '₹28,50,000',
    activeProjects: 4,
    description:
      'Empowering grassroots student deployments with village panchayat liaison, water testing verification labs, and community adoption workshops.',
  },
  {
    id: 'org-smartcity',
    name: 'Smart City Solutions',
    type: 'STARTUP',
    sector: 'Urban Tech & Smart Mobility',
    city: 'Pune',
    state: 'Maharashtra',
    expertise: ['Smart Traffic Control', 'Municipal IoT', 'Smart Streetlights', 'GIS Route Optimization'],
    verified: true,
    committedFunding: '₹18,00,000',
    activeProjects: 2,
    description:
      'Pioneering smart junction edge computers and route optimization algorithms in collaboration with NIT Trichy and Pune Municipal Corporation.',
  },
  {
    id: 'org-agribridge',
    name: 'AgriBridge Technologies',
    type: 'STARTUP',
    sector: 'AgriTech & Rural Enterprise',
    city: 'Hyderabad',
    state: 'Telangana',
    expertise: ['Precision Soil Probes', 'Drone Vegetation Indexing', 'Farmer Mobile Dashboards', 'Edge Irrigation'],
    verified: true,
    committedFunding: '₹22,00,000',
    activeProjects: 2,
    description:
      'Co-developed subsurface capacitive probes with IIIT Hyderabad, providing subsidized micro-irrigation hardware to 3,800 Vidarbha cotton growers.',
  },
  {
    id: 'org-healthfirst',
    name: 'HealthFirst Foundation',
    type: 'NGO',
    sector: 'Rural Healthcare & Medical IT',
    city: 'Chennai',
    state: 'Tamil Nadu',
    expertise: ['Telemedicine Kiosks', 'Hospital Queue IT', 'Primary Healthcare', 'Maternal Diagnostics'],
    verified: true,
    committedFunding: '₹15,00,000',
    activeProjects: 2,
    description:
      'Deploying digital token kiosks and rapid vitals screening booths in civil hospitals across rural Maharashtra and Tamil Nadu with BITS Pilani.',
  },
]

export default function PartnersPage() {
  const [selectedType, setSelectedType] = useState<string>('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [partners, setPartners] = useState<Partner[]>(partnersList)

  // Modal State
  const [isModalOpen, setModalOpen] = useState(false)
  const [selectedPartnerForPledge, setSelectedPartnerForPledge] = useState<string>('')
  const [pledgeType, setPledgeType] = useState('CSR_FUNDING')
  const [amount, setAmount] = useState('500000')
  const [targetDomain, setTargetDomain] = useState('Water & Sanitation')
  const [donorEmail, setDonorEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const filteredPartners = partners.filter((p) => {
    const matchesType = selectedType === 'ALL' || p.type === selectedType
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sector.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.state.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesSearch
  })

  const handleOpenPledge = (partnerName?: string) => {
    if (partnerName) {
      setSelectedPartnerForPledge(partnerName)
    } else {
      setSelectedPartnerForPledge(partners[0].name)
    }
    setModalOpen(true)
  }

  const handlePledgeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    setTimeout(() => {
      setIsSubmitting(false)
      setModalOpen(false)
      toast.success('Pledge Confirmed & Recorded!', {
        description: `Your pledge of ₹${Number(amount).toLocaleString('en-IN')} for ${targetDomain} has been logged on the official SIH 2026 partner registry.`,
      })
    }, 600)
  }

  return (
    <AppShell>
      <div className="space-y-10 pb-16">
        {/* Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-[#0e162e] via-[#151a38] to-[#0a1224] p-8 md:p-12 shadow-[0_0_50px_rgba(99,102,241,0.15)]">
          <div className="absolute top-0 right-0 h-64 w-64 bg-indigo-500/10 blur-[90px] pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-300">
                <Handshake className="h-3.5 w-3.5 text-indigo-400" />
                Industry, CSR & NGO Synergy
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                Partners & Industry Collaborators
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Connect enterprise CSR capital, industrial testing infrastructure, and NGO ground networks directly with university teams building validated societal prototypes.
              </p>
            </div>

            <button
              onClick={() => handleOpenPledge()}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 px-5 py-3.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition-all active:scale-95 shrink-0 self-start md:self-center"
            >
              <Coins className="h-4 w-4" />
              Offer Sponsorship / Mentorship
            </button>
          </div>
        </div>

        {/* Aggregate Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-md">
            <div className="text-xs text-slate-400 uppercase font-semibold">Committed CSR Capital</div>
            <div className="text-2xl font-black text-emerald-400 mt-1">₹1.60+ Cr</div>
            <div className="text-[11px] text-slate-400 mt-1">Directly allocated to village pilots</div>
          </div>

          <div className="rounded-xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-md">
            <div className="text-xs text-slate-400 uppercase font-semibold">Active Corporate Partners</div>
            <div className="text-2xl font-black text-white mt-1">38 Entities</div>
            <div className="text-[11px] text-slate-400 mt-1">Including TCS, Wipro, and NGOs</div>
          </div>

          <div className="rounded-xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-md">
            <div className="text-xs text-slate-400 uppercase font-semibold">Hardware Prototypes Funded</div>
            <div className="text-2xl font-black text-blue-400 mt-1">54 Prototypes</div>
            <div className="text-[11px] text-slate-400 mt-1">Sensors, filtration & micro-grids</div>
          </div>

          <div className="rounded-xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-md">
            <div className="text-xs text-slate-400 uppercase font-semibold">Student Internships Offered</div>
            <div className="text-2xl font-black text-purple-400 mt-1">142 Offers</div>
            <div className="text-[11px] text-slate-400 mt-1">Full-time and R&D fellowships</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 shrink-0">
              Type:
            </span>
            {['ALL', 'INDUSTRY', 'STARTUP', 'NGO'].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  selectedType === type
                    ? 'bg-blue-600 text-white shadow'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {type === 'ALL' ? 'All Partners' : type}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by company, sector, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-900/80 pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Partner Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPartners.map((partner) => {
            const isIndustry = partner.type === 'INDUSTRY'
            const isStartup = partner.type === 'STARTUP'
            const isNGO = partner.type === 'NGO'

            return (
              <div
                key={partner.id}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-xl p-6 transition-all hover:border-indigo-500/40 hover:shadow-[0_0_35px_rgba(99,102,241,0.12)] flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span
                      className={`rounded-md px-2.5 py-0.5 text-[11px] font-bold ${
                        isIndustry
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : isStartup
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {partner.type}
                    </span>

                    <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                      <CheckCircle2 className="h-3 w-3" />
                      MoE Verified
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {partner.name}
                  </h3>

                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-slate-500" />
                    {partner.city}, {partner.state} • <span className="text-slate-300">{partner.sector}</span>
                  </p>

                  <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                    {partner.description}
                  </p>

                  {/* Expertise tags */}
                  <div className="flex flex-wrap gap-1.5 my-4">
                    {partner.expertise.map((exp) => (
                      <span
                        key={exp}
                        className="rounded bg-slate-800/80 border border-white/5 px-2 py-0.5 text-[10px] text-slate-300"
                      >
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Row */}
                <div className="pt-4 border-t border-white/5">
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="text-slate-400">Fund Allocation:</span>
                    <span className="font-bold text-emerald-400 font-mono">
                      {partner.committedFunding}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenPledge(partner.name)}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 py-2 text-xs font-semibold text-white transition-colors"
                    >
                      <Coins className="h-3.5 w-3.5 text-yellow-400" />
                      Pledge Support
                    </button>

                    <button
                      onClick={() =>
                        toast.info(`Contacting ${partner.name}`, {
                          description: 'Innovation Liaison Officer will email you within 24 hours.',
                        })
                      }
                      className="rounded-xl border border-white/10 hover:border-white/20 p-2 text-slate-400 hover:text-white transition-colors"
                      title="Direct Message Liaison"
                    >
                      <Send className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Modal: Offer Sponsorship / Mentorship */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-2xl border border-indigo-500/30 bg-slate-900 p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <HeartHandshake className="h-5 w-5 text-indigo-400" />
                  Offer Sponsorship or Mentorship
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-slate-400 hover:text-white text-lg"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handlePledgeSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Partner / Sponsor Entity
                  </label>
                  <input
                    type="text"
                    required
                    value={selectedPartnerForPledge}
                    onChange={(e) => setSelectedPartnerForPledge(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-800 px-3.5 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Support Type
                    </label>
                    <select
                      value={pledgeType}
                      onChange={(e) => setPledgeType(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                    >
                      <option value="CSR_FUNDING">CSR Grant Funding</option>
                      <option value="HARDWARE_SPONSOR">Hardware / Sensor Kits</option>
                      <option value="MENTORSHIP">Engineering Mentorship</option>
                      <option value="CLOUD_CREDITS">Compute / Cloud Credits</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Target Domain
                    </label>
                    <select
                      value={targetDomain}
                      onChange={(e) => setTargetDomain(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                    >
                      <option value="Water & Sanitation">Water & Sanitation</option>
                      <option value="Agriculture & Farmers">Agriculture & Farmers</option>
                      <option value="Air Quality & Climate">Air Quality & Climate</option>
                      <option value="Healthcare Systems">Healthcare Systems</option>
                      <option value="Municipal Waste">Municipal Waste</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Pledge Amount (₹ INR)
                  </label>
                  <input
                    type="number"
                    step="50000"
                    min="50000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-800 px-3.5 py-2 text-xs font-mono text-white focus:border-blue-500 focus:outline-none"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Equivalent to ₹{(Number(amount) / 100000).toFixed(2)} Lakhs
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Corporate Contact Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="csr.lead@company.com"
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-800 px-3.5 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="pt-3 flex items-center justify-end gap-3 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="rounded-xl px-4 py-2 text-xs text-slate-300 hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-5 py-2.5 text-xs font-bold text-white transition-all shadow-md active:scale-95 disabled:opacity-50"
                  >
                    <Coins className="h-3.5 w-3.5" />
                    Confirm Official Pledge
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  )
}
