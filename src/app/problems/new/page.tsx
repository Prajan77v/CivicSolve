'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import {
  FileText,
  MapPin,
  Users,
  AlertOctagon,
  Tag,
  CheckCircle2,
  Cpu,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Plus,
  X,
  Building,
  Upload,
  ShieldCheck,
  Flame,
  Info,
  ExternalLink,
  ChevronRight,
  Loader2,
} from 'lucide-react'
import AppShell from '@/components/layout/app-shell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

const DOMAIN_OPTIONS = [
  { value: 'WATER', label: 'Water Management & Quality' },
  { value: 'TRAFFIC', label: 'Urban Mobility & Traffic Systems' },
  { value: 'AIR_QUALITY', label: 'Air Quality & Emissions' },
  { value: 'AGRICULTURE', label: 'Agriculture & Rural Tech' },
  { value: 'WASTE', label: 'Solid Waste & Sanitation' },
  { value: 'HEALTH', label: 'Public Health & Healthcare Systems' },
  { value: 'INFRASTRUCTURE', label: 'Municipal Infrastructure & Roads' },
  { value: 'ENERGY', label: 'Clean Energy & Power Grids' },
]

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Delhi NCR',
]

const POPULAR_TAGS = [
  'groundwater',
  'arsenic-removal',
  'potable-water',
  'iot-sensors',
  'traffic-congestion',
  'air-pollution',
  'stubble-burning',
  'waste-segregation',
  'rural-clinic',
  'flood-drainage',
  'pothole-detection',
  'solar-microgrid',
]

const SDG_LIST = [
  { id: '3', label: 'SDG 3: Good Health & Well-being' },
  { id: '6', label: 'SDG 6: Clean Water & Sanitation' },
  { id: '7', label: 'SDG 7: Affordable & Clean Energy' },
  { id: '9', label: 'SDG 9: Industry, Innovation & Infrastructure' },
  { id: '11', label: 'SDG 11: Sustainable Cities & Communities' },
  { id: '12', label: 'SDG 12: Responsible Consumption' },
  { id: '13', label: 'SDG 13: Climate Action' },
]

interface FormData {
  // Step 1: Core Problem
  title: string
  category: string
  subcategory: string
  description: string

  // Step 2: Location & Mapping
  address: string
  district: string
  state: string
  pincode: string
  lat: string
  lng: string

  // Step 3: Impact & Stakeholders
  affectedCount: string
  primaryVictims: string
  vulnerability: string

  // Step 4: Urgency & Existing Attempts
  previousAttempts: string
  urgencyRationale: string

  // Step 5: Evidence & Tags
  evidenceUrl: string
  evidenceType: string
  tags: string[]
  sdgGoals: string[]
}

const INITIAL_DATA: FormData = {
  title: '',
  category: 'WATER',
  subcategory: '',
  description: '',
  address: '',
  district: '',
  state: 'Bihar',
  pincode: '',
  lat: '25.5941',
  lng: '85.1376',
  affectedCount: '',
  primaryVictims: '',
  vulnerability: 'High',
  previousAttempts: '',
  urgencyRationale: '',
  evidenceUrl: '',
  evidenceType: 'Water Lab Report',
  tags: ['groundwater', 'arsenic-removal'],
  sdgGoals: ['6', '3'],
}

const STEPS = [
  { step: 1, title: 'Core Problem', icon: FileText },
  { step: 2, title: 'Location & Mapping', icon: MapPin },
  { step: 3, title: 'Impact & Stakeholders', icon: Users },
  { step: 4, title: 'Urgency & Attempts', icon: AlertOctagon },
  { step: 5, title: 'Evidence & Tags', icon: Tag },
  { step: 6, title: 'Review & Confirm', icon: CheckCircle2 },
  { step: 7, title: 'AI Classification', icon: Cpu },
]

export default function NewProblemPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>(INITIAL_DATA)
  const [tagInput, setTagInput] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  // AI Pipeline animation state for Step 7
  const [pipelineProgress, setPipelineProgress] = useState(0)
  const [pipelineStepIndex, setPipelineStepIndex] = useState(0)
  const [createdProblemId, setCreatedProblemId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const pipelineStages = [
    { title: 'Analyzing problem narrative with NLP...', detail: 'Extracting key civic entities, domains, and semantic gravity' },
    { title: 'Detecting required engineering disciplines...', detail: 'Identifying Embedded Systems, IoT, Chemical & Civil Engineering needs' },
    { title: 'Calculating priority & urgency index...', detail: 'Evaluating affected population risk against municipal health benchmarks' },
    { title: 'Matching university departments & student teams...', detail: 'Cross-referencing NIRF top-tier institutes, labs, and specialized centers' },
    { title: 'Synthesizing cross-domain solution blueprint...', detail: 'Generating standard deployment roadmap and impact verification criteria' },
  ]

  const updateForm = (fields: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...fields }))
    // Clear errors for modified fields
    setErrors((prev) => {
      const copy = { ...prev }
      Object.keys(fields).forEach((key) => delete copy[key])
      return copy
    })
  }

  const handleAddTag = (tagToAdd?: string) => {
    const raw = tagToAdd || tagInput
    const cleaned = raw.trim().toLowerCase().replace(/[^a-z0-9-]/g, '')
    if (cleaned && !formData.tags.includes(cleaned)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, cleaned] }))
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tagToRemove),
    }))
  }

  const toggleSdg = (sdgId: string) => {
    setFormData((prev) => {
      const exists = prev.sdgGoals.includes(sdgId)
      return {
        ...prev,
        sdgGoals: exists
          ? prev.sdgGoals.filter((id) => id !== sdgId)
          : [...prev.sdgGoals, sdgId],
      }
    })
  }

  // Step Validation logic
  const validateStep = (step: number): boolean => {
    const errs: Record<string, string> = {}

    if (step === 1) {
      if (!formData.title.trim() || formData.title.length < 5) {
        errs.title = 'Please enter a descriptive title (minimum 5 characters).'
      }
      if (!formData.category) {
        errs.category = 'Please select a problem domain category.'
      }
      if (!formData.description.trim() || formData.description.length < 20) {
        errs.description = 'Please provide a detailed description (minimum 20 characters).'
      }
    } else if (step === 2) {
      if (!formData.district.trim()) {
        errs.district = 'District is required for administrative and geographic mapping.'
      }
      if (!formData.state.trim()) {
        errs.state = 'State is required.'
      }
      if (formData.pincode && !/^\d{6}$/.test(formData.pincode.trim())) {
        errs.pincode = 'Please enter a valid 6-digit Indian Pincode.'
      }
    } else if (step === 3) {
      const count = parseInt(formData.affectedCount, 10)
      if (isNaN(count) || count <= 0) {
        errs.affectedCount = 'Please specify estimated number of affected citizens (positive number).'
      }
      if (!formData.primaryVictims.trim()) {
        errs.primaryVictims = 'Please identify the primary community victims.'
      }
    } else if (step === 4) {
      if (!formData.urgencyRationale.trim() || formData.urgencyRationale.length < 10) {
        errs.urgencyRationale = 'Please explain the urgency rationale (minimum 10 characters).'
      }
    } else if (step === 5) {
      if (formData.tags.length === 0) {
        errs.tags = 'Please add at least one relevant tag.'
      }
    }

    setErrors(errs)
    if (Object.keys(errs).length > 0) {
      toast.error('Please complete all required fields before proceeding.')
      return false
    }
    return true
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 6) {
        setCurrentStep((prev) => prev + 1)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else if (currentStep === 6) {
        // Proceed to Step 7 (Submission & AI Pipeline)
        startSubmission()
      }
    }
  }

  const handleBack = () => {
    if (currentStep > 1 && currentStep < 7) {
      setCurrentStep((prev) => prev - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // Step 7: Submitting to API & running simulated AI animations
  const startSubmission = async () => {
    setCurrentStep(7)
    setIsSubmitting(true)
    setPipelineProgress(15)
    setPipelineStepIndex(0)

    try {
      // 1. Submit to POST /api/problems
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        subcategory: formData.subcategory.trim() || undefined,
        priority: formData.vulnerability === 'Severe' ? 'CRITICAL' : 'HIGH',
        affectedCount: parseInt(formData.affectedCount, 10) || 5000,
        urgencyNote: [
          formData.urgencyRationale ? `Urgency: ${formData.urgencyRationale}` : '',
          formData.previousAttempts ? `Previous Attempts: ${formData.previousAttempts}` : '',
          formData.primaryVictims ? `Primary Victims: ${formData.primaryVictims}` : '',
        ]
          .filter(Boolean)
          .join('\n\n'),
        tags: formData.tags,
        sdgGoals: formData.sdgGoals,
        address: formData.address || undefined,
        district: formData.district || undefined,
        state: formData.state || undefined,
        pincode: formData.pincode || undefined,
        lat: parseFloat(formData.lat) || undefined,
        lng: parseFloat(formData.lng) || undefined,
      }

      const responsePromise = fetch('/api/problems', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      // Run visual progression for stages
      const advanceStages = async () => {
        setPipelineStepIndex(0)
        setPipelineProgress(20)
        await new Promise((r) => setTimeout(r, 700))

        setPipelineStepIndex(1)
        setPipelineProgress(40)
        await new Promise((r) => setTimeout(r, 800))

        setPipelineStepIndex(2)
        setPipelineProgress(65)
        await new Promise((r) => setTimeout(r, 800))

        setPipelineStepIndex(3)
        setPipelineProgress(85)
        await new Promise((r) => setTimeout(r, 900))

        setPipelineStepIndex(4)
        setPipelineProgress(100)
        await new Promise((r) => setTimeout(r, 600))
      }

      const [res] = await Promise.all([responsePromise, advanceStages()])
      const json = await res.json()

      if (json.success && json.data) {
        const problemId = json.data.id
        setCreatedProblemId(problemId)
        setIsSubmitting(false)
        toast.success('Challenge classified & submitted to CivicSolve ecosystem!')

        // Auto redirect after short pause
        setTimeout(() => {
          router.push(`/problems/${problemId}`)
        }, 1200)
      } else {
        throw new Error(json.error || 'Submission failed')
      }
    } catch (err: any) {
      console.error('Problem creation failed:', err)
      toast.error(err.message || 'Failed to submit problem. Please try again.')
      setIsSubmitting(false)
    }
  }

  // Pre-fill demo helper
  const handlePreFillSample = () => {
    setFormData({
      title: 'High Arsenic & Fluoride Contamination in Rural Drinking Wells',
      category: 'WATER',
      subcategory: 'Groundwater Toxicity & Community Filtration',
      description:
        'Over 14 public borewells in Barhara block show arsenic levels reaching 120 ppb, exceeding the WHO safety limit of 10 ppb by 12x. Local residents suffer from endemic hyperkeratosis, gastrointestinal illnesses, and lack access to affordable testing or decentralized filtration technology.',
      address: 'Barhara Gram Panchayat, Near Block Development Office',
      district: 'Bhojpur',
      state: 'Bihar',
      pincode: '802311',
      lat: '25.6601',
      lng: '84.6738',
      affectedCount: '8500',
      primaryVictims: 'Marginalized farming families, school children, and daily wage earners.',
      vulnerability: 'Severe',
      previousAttempts:
        'Commercial solar RO plants installed in 2021 malfunctioned due to excessive siltation and lack of local spare parts or technician training. High brine waste also polluted adjacent agricultural fields.',
      urgencyRationale:
        'Groundwater arsenic levels rise sharply before the monsoon season. Clinical screenings indicate 140+ children showing early dermal toxicity symptoms.',
      evidenceUrl: 'https://jaljeevanmission.gov.in/water-quality-report-sample.pdf',
      evidenceType: 'District Health Water Test Lab Report',
      tags: ['groundwater', 'arsenic-removal', 'iot-monitoring', 'rural-filtration', 'bhojpur'],
      sdgGoals: ['6', '3', '11'],
    })
    toast.info('Loaded realistic Bihar groundwater challenge template.')
  }

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-8 pb-16">
        {/* Wizard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
                Civic Intake Wizard
              </span>
              <span className="text-xs text-slate-400">SIH26043 Intelligent Verification</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Submit New Civic Challenge
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Document a verified societal problem. Our AI engine will analyze urgency, identify required engineering skills, and match university solvers.
            </p>
          </div>

          {currentStep < 7 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreFillSample}
              className="text-xs shrink-0 self-start sm:self-auto border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
              leftIcon={<Sparkles className="h-3.5 w-3.5 text-cyan-400" />}
            >
              Fill Sample Challenge
            </Button>
          )}
        </div>

        {/* 7-Step Indicator Progress Bar */}
        <div className="glass-card rounded-2xl border border-white/10 bg-slate-900/80 p-4 sm:p-5 shadow-lg">
          {/* Top Progress Percentage */}
          <div className="flex items-center justify-between text-xs font-medium text-slate-300 mb-3">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
              <span>
                Step {currentStep} of {STEPS.length}:{' '}
                <strong className="text-white">{STEPS[currentStep - 1].title}</strong>
              </span>
            </span>
            <span className="text-blue-400 font-semibold">
              {Math.round(((currentStep - 1) / (STEPS.length - 1)) * 100)}% Completed
            </span>
          </div>

          {/* Bar */}
          <div className="relative w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-5">
            <div
              className="h-full bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-500 transition-all duration-500 rounded-full"
              style={{
                width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%`,
              }}
            />
          </div>

          {/* Step Nodes */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {STEPS.map((s) => {
              const isPast = s.step < currentStep
              const isCurrent = s.step === currentStep
              const Icon = s.icon

              return (
                <button
                  key={s.step}
                  type="button"
                  disabled={s.step > currentStep || currentStep === 7}
                  onClick={() => s.step < currentStep && setCurrentStep(s.step)}
                  className={cn(
                    'flex flex-col items-center text-center p-1.5 rounded-xl transition-all select-none',
                    isCurrent && 'bg-blue-600/15 border border-blue-500/30 text-white',
                    isPast && 'text-slate-300 hover:bg-white/5 cursor-pointer',
                    !isPast && !isCurrent && 'opacity-40 cursor-not-allowed text-slate-500'
                  )}
                >
                  <div
                    className={cn(
                      'h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold mb-1 transition-colors',
                      isCurrent && 'bg-blue-600 text-white shadow-md shadow-blue-500/30',
                      isPast && 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
                      !isPast && !isCurrent && 'bg-slate-800 text-slate-400'
                    )}
                  >
                    {isPast ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : s.step}
                  </div>
                  <span className="text-[10px] hidden sm:block truncate w-full font-medium">
                    {s.title}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Step Content Containers */}
        <div className="glass-card rounded-2xl border border-white/10 bg-slate-900/80 p-6 sm:p-8 shadow-2xl">
          {/* STEP 1: Core Problem */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-400" />
                  Step 1: Core Problem Definition
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Articulate the fundamental civic bottleneck with clear, objective parameters.
                </p>
              </div>

              <div className="space-y-4">
                <Input
                  id="title"
                  name="title"
                  label="Challenge Title *"
                  placeholder="e.g. Arsenic Contamination in Rural Groundwater"
                  value={formData.title}
                  onChange={(e) => updateForm({ title: e.target.value })}
                  error={errors.title}
                  helperText="Provide a clear, punchy title summarizing the root problem and context."
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Domain Category *"
                    value={formData.category}
                    onChange={(e) => updateForm({ category: e.target.value })}
                    error={errors.category}
                    options={DOMAIN_OPTIONS}
                  />

                  <Input
                    label="Subcategory / Focus Area"
                    placeholder="e.g. Potable Water Purification & IoT Telemetry"
                    value={formData.subcategory}
                    onChange={(e) => updateForm({ subcategory: e.target.value })}
                    helperText="Specific niche (e.g. Heavy Metal Adsorption, Pothole Mapping)"
                  />
                </div>

                <Textarea
                  id="description"
                  name="description"
                  label="Detailed Problem Description *"
                  placeholder="Describe the issue in detail: what causes it, who experiences it, current severity, and on-ground constraints..."
                  rows={6}
                  value={formData.description}
                  onChange={(e) => updateForm({ description: e.target.value })}
                  error={errors.description}
                  helperText={`${formData.description.length} characters (minimum 20 recommended)`}
                />
              </div>
            </motion.div>
          )}

          {/* STEP 2: Location & Mapping */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-rose-400" />
                  Step 2: Geographic Location & Civic Mapping
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Anchor the challenge to exact municipal coordinates for proximity matching with local universities.
                </p>
              </div>

              <div className="space-y-4">
                <Input
                  label="Street Address / Gram Panchayat / Landmark"
                  placeholder="e.g. Barhara Block, Near Primary Health Center"
                  value={formData.address}
                  onChange={(e) => updateForm({ address: e.target.value })}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="District *"
                    placeholder="e.g. Bhojpur"
                    value={formData.district}
                    onChange={(e) => updateForm({ district: e.target.value })}
                    error={errors.district}
                  />

                  <Select
                    label="State *"
                    value={formData.state}
                    onChange={(e) => updateForm({ state: e.target.value })}
                    error={errors.state}
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st} className="bg-slate-900 text-white">
                        {st}
                      </option>
                    ))}
                  </Select>

                  <Input
                    label="Pincode"
                    placeholder="e.g. 802311"
                    maxLength={6}
                    value={formData.pincode}
                    onChange={(e) => updateForm({ pincode: e.target.value })}
                    error={errors.pincode}
                  />
                </div>

                {/* Simulated Geocoordinate telemetry */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span className="font-medium flex items-center gap-1.5 text-cyan-400">
                      <MapPin className="h-3.5 w-3.5" />
                      GIS Coordinate Telemetry (Auto-computed from location)
                    </span>
                    <span className="text-slate-400">WGS84 Datum</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <Input
                      label="Latitude"
                      value={formData.lat}
                      onChange={(e) => updateForm({ lat: e.target.value })}
                    />
                    <Input
                      label="Longitude"
                      value={formData.lng}
                      onChange={(e) => updateForm({ lng: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Impact & Stakeholders */}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Users className="h-5 w-5 text-cyan-400" />
                  Step 3: Impact Scale & Affected Stakeholders
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Quantify the human impact to help AI prioritize funding, urgency weighting, and academic allocation.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Estimated Affected Population (People) *"
                    type="number"
                    placeholder="e.g. 8500"
                    value={formData.affectedCount}
                    onChange={(e) => updateForm({ affectedCount: e.target.value })}
                    error={errors.affectedCount}
                    helperText="Citizens directly suffering from this challenge"
                  />

                  <Select
                    label="Community Vulnerability Severity"
                    value={formData.vulnerability}
                    onChange={(e) => updateForm({ vulnerability: e.target.value })}
                  >
                    <option value="Severe" className="bg-slate-900 text-white">
                      Severe — Threat to public health / life safety
                    </option>
                    <option value="High" className="bg-slate-900 text-white">
                      High — Significant economic or daily hardship
                    </option>
                    <option value="Moderate" className="bg-slate-900 text-white">
                      Moderate — Civic degradation & efficiency bottleneck
                    </option>
                  </Select>
                </div>

                <Textarea
                  label="Primary Affected Demographic & Victims *"
                  placeholder="e.g. Farming families reliant on shallow tubewells, primary school students drinking unmonitored tap water..."
                  rows={3}
                  value={formData.primaryVictims}
                  onChange={(e) => updateForm({ primaryVictims: e.target.value })}
                  error={errors.primaryVictims}
                />
              </div>
            </motion.div>
          )}

          {/* STEP 4: Urgency & Existing Attempts */}
          {currentStep === 4 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <AlertOctagon className="h-5 w-5 text-amber-400" />
                  Step 4: Urgency & Failure Analysis of Past Interventions
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Why haven't previous solutions worked? Understanding failure modes is essential for student innovators.
                </p>
              </div>

              <div className="space-y-4">
                <Textarea
                  label="Urgency Rationale (Why must this be addressed immediately?) *"
                  placeholder="e.g. Health clinic reports 40% increase in waterborne ailments over the past 3 months; seasonal pre-monsoon spike expected..."
                  rows={3}
                  value={formData.urgencyRationale}
                  onChange={(e) => updateForm({ urgencyRationale: e.target.value })}
                  error={errors.urgencyRationale}
                />

                <Textarea
                  label="Why Previous Government or NGO Attempts Failed"
                  placeholder="e.g. Centralized RO plant lacked local repair technicians; high electricity tariff caused plant closure; no automated water quality monitoring..."
                  rows={4}
                  value={formData.previousAttempts}
                  onChange={(e) => updateForm({ previousAttempts: e.target.value })}
                  helperText="Helps engineering teams avoid repeating obsolete or high-maintenance approaches."
                />
              </div>
            </motion.div>
          )}

          {/* STEP 5: Evidence & Tags */}
          {currentStep === 5 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Tag className="h-5 w-5 text-purple-400" />
                  Step 5: Evidence & Categorization Tags
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Provide evidence links, technical tags, and SDG mappings for automated ontology extraction.
                </p>
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Evidence Document / Lab Report URL"
                    placeholder="https://... or link to government notice / report"
                    value={formData.evidenceUrl}
                    onChange={(e) => updateForm({ evidenceUrl: e.target.value })}
                  />

                  <Input
                    label="Evidence Document Type"
                    placeholder="e.g. District Lab Report, Media Article, Survey"
                    value={formData.evidenceType}
                    onChange={(e) => updateForm({ evidenceType: e.target.value })}
                  />
                </div>

                {/* Tags Management */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">
                    Challenge Tags * (At least 1 required)
                  </label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type tag and press Enter or Add (e.g. iot-monitoring)"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleAddTag()
                        }
                      }}
                    />
                    <Button type="button" variant="secondary" onClick={() => handleAddTag()}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add Tag
                    </Button>
                  </div>
                  {errors.tags && <p className="text-xs text-red-400">{errors.tags}</p>}

                  {/* Selected tags */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1.5 bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs px-2.5 py-1 rounded-lg"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-red-400 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Popular suggestions */}
                  <div className="pt-2">
                    <span className="text-xs text-slate-400 mr-2">Suggestions:</span>
                    <div className="inline-flex flex-wrap gap-1.5 mt-1">
                      {POPULAR_TAGS.map((pt) => {
                        const isAdded = formData.tags.includes(pt)
                        if (isAdded) return null
                        return (
                          <button
                            key={pt}
                            type="button"
                            onClick={() => handleAddTag(pt)}
                            className="text-[11px] bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700 px-2 py-0.5 rounded border border-slate-700"
                          >
                            +{pt}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* SDG Goals */}
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <label className="text-sm font-medium text-slate-300">
                    UN Sustainable Development Goals (SDGs)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {SDG_LIST.map((sdg) => {
                      const isSelected = formData.sdgGoals.includes(sdg.id)
                      return (
                        <button
                          key={sdg.id}
                          type="button"
                          onClick={() => toggleSdg(sdg.id)}
                          className={cn(
                            'text-xs text-left p-2.5 rounded-xl border transition-all flex items-center justify-between',
                            isSelected
                              ? 'bg-purple-600/20 border-purple-500/50 text-purple-200'
                              : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                          )}
                        >
                          <span>{sdg.label}</span>
                          {isSelected && <CheckCircle2 className="h-4 w-4 text-purple-400 shrink-0" />}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 6: Review & Confirmation */}
          {currentStep === 6 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  Step 6: Review Challenge & Confirm Submission
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Verify the compiled intelligence before sending this challenge to the CivicSolve AI engine.
                </p>
              </div>

              {/* Review summary cards */}
              <div className="space-y-4">
                {/* Core */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                      Core Challenge
                    </span>
                    <Badge category={formData.category} size="sm" />
                  </div>
                  <h3 className="text-base font-bold text-white">{formData.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{formData.description}</p>
                </div>

                {/* Geography & Impact */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-950/70 border border-white/5 space-y-1.5 text-xs">
                    <span className="font-semibold text-rose-400 uppercase tracking-wider">
                      Location
                    </span>
                    <p className="text-white font-medium">
                      {formData.address || 'Address unlisted'}
                    </p>
                    <p className="text-slate-400">
                      {formData.district}, {formData.state} - {formData.pincode || 'Pincode N/A'}
                    </p>
                    <p className="text-slate-400">
                      GPS: {formData.lat}, {formData.lng}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/70 border border-white/5 space-y-1.5 text-xs">
                    <span className="font-semibold text-cyan-400 uppercase tracking-wider">
                      Impact Scope
                    </span>
                    <p className="text-2xl font-bold text-cyan-300">
                      {parseInt(formData.affectedCount, 10).toLocaleString('en-IN')}{' '}
                      <span className="text-xs font-normal text-slate-400">citizens affected</span>
                    </p>
                    <p className="text-slate-300">
                      <strong>Severity:</strong> {formData.vulnerability}
                    </p>
                    <p className="text-slate-400 truncate">
                      <strong>Victims:</strong> {formData.primaryVictims}
                    </p>
                  </div>
                </div>

                {/* Urgency & Tags */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-white/5 space-y-2 text-xs">
                  <span className="font-semibold text-amber-400 uppercase tracking-wider">
                    Urgency & Failures
                  </span>
                  <p className="text-slate-300">
                    <strong>Urgency Note:</strong> {formData.urgencyRationale}
                  </p>
                  {formData.previousAttempts && (
                    <p className="text-slate-400">
                      <strong>Previous Attempts:</strong> {formData.previousAttempts}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {formData.tags.map((t) => (
                      <span
                        key={t}
                        className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[11px] border border-slate-700"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Consent callout */}
                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-200 flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white mb-0.5">
                      Verification & Academic Open Access
                    </strong>
                    By submitting, this civic challenge will enter the public SIH26043 challenge repository. Verified engineering faculties and student teams will receive matching notifications to begin prototyping solutions.
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 7: Submitting & Simulated AI Classification Animation */}
          {currentStep === 7 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-6 space-y-8 text-center"
            >
              <div className="relative mx-auto w-20 h-20">
                <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl animate-pulse" />
                <div className="relative h-full w-full rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-2xl">
                  <Cpu className="h-10 w-10 animate-bounce" />
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  CivicSolve AI Engine Active
                </h2>
                <p className="text-sm text-slate-400 max-w-lg mx-auto">
                  Processing challenge submission through multi-agent semantic pipeline, NLP domain classification, and NIRF university matching models.
                </p>
              </div>

              {/* Progress bar */}
              <div className="max-w-md mx-auto space-y-2">
                <div className="flex justify-between text-xs font-semibold text-cyan-400">
                  <span>Engine Pipeline Telemetry</span>
                  <span>{pipelineProgress}%</span>
                </div>
                <Progress value={pipelineProgress} color="cyan" size="md" />
              </div>

              {/* Pipeline step checklist */}
              <div className="max-w-md mx-auto space-y-2.5 text-left">
                {pipelineStages.map((stage, idx) => {
                  const isDone = idx < pipelineStepIndex
                  const isCurrent = idx === pipelineStepIndex
                  const isPending = idx > pipelineStepIndex

                  return (
                    <div
                      key={stage.title}
                      className={cn(
                        'p-3 rounded-xl border transition-all text-xs flex items-start gap-3',
                        isDone && 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200',
                        isCurrent && 'bg-blue-600/15 border-blue-500/40 text-blue-100 shadow-md',
                        isPending && 'bg-slate-950/40 border-slate-800 text-slate-500'
                      )}
                    >
                      <div className="mt-0.5 shrink-0">
                        {isDone && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                        {isCurrent && <Loader2 className="h-4 w-4 text-blue-400 animate-spin" />}
                        {isPending && <span className="h-4 w-4 rounded-full border border-slate-700 flex items-center justify-center text-[10px] text-slate-500">{idx + 1}</span>}
                      </div>
                      <div>
                        <p className={cn('font-semibold', isCurrent ? 'text-cyan-300' : isDone ? 'text-emerald-300' : 'text-slate-400')}>
                          {stage.title}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{stage.detail}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Success redirect splash */}
              {createdProblemId && (
                <div className="pt-4 animate-fadeIn">
                  <Button
                    asChild
                    size="lg"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-500/20"
                  >
                    <Link href={`/problems/${createdProblemId}`}>
                      <span>View Generated Challenge & AI Insights</span>
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              )}
            </motion.div>
          )}

          {/* Navigation Controls (Steps 1 - 6) */}
          {currentStep < 7 && (
            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={handleBack}
                disabled={currentStep === 1}
                leftIcon={<ArrowLeft className="h-4 w-4" />}
              >
                Back
              </Button>

              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  size="md"
                  onClick={handleNext}
                  className="bg-blue-600 hover:bg-blue-500 text-white"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  {currentStep === 6 ? 'Confirm & Run AI Engine' : 'Next Step'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
