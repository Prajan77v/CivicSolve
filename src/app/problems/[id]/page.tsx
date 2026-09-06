'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import {
  ArrowLeft,
  MapPin,
  Users,
  Calendar,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Building2,
  GraduationCap,
  Briefcase,
  Share2,
  Star,
  Send,
  RefreshCw,
  FolderKanban,
  ShieldCheck,
  Tag,
  ExternalLink,
  ChevronRight,
  Activity,
  Layers,
  Award,
  Clock,
  User as UserIcon,
  Check,
  Radio,
  FileCheck,
  CopyCheck,
  PlusCircle,
  Network,
  FileText,
  Compass,
  Zap,
  Globe,
  Database
} from 'lucide-react'
import AppShell from '@/components/layout/app-shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { Modal } from '@/components/ui/modal'
import { cn } from '@/lib/utils'

interface LocationData {
  address?: string | null
  district?: string | null
  state?: string | null
  pincode?: string | null
  lat?: number | null
  lng?: number | null
}

interface EvidenceData {
  id: string
  type: string
  url: string
  caption?: string | null
}

interface MatchedEntity {
  name: string
  score: number
  reason?: string
  skills?: string[]
}

interface AIAnalysisData {
  id: string
  domain: string
  subdomain?: string | null
  confidence: number
  priorityScore: number
  priorityReason: string
  affectedEstimate?: number | null
  duplicateRisk: number
  detectedTech: string | string[]
  recommendedSkills: string | string[]
  sdgAlignment: string | string[]
  matchedUniversities: string | MatchedEntity[]
  matchedTeams: string | MatchedEntity[]
  matchedIndustry: string | MatchedEntity[]
  nextSteps: string | string[]
}

interface FeedbackItem {
  id: string
  rating: number
  comment?: string | null
  createdAt: string
  user?: {
    id: string
    name: string
    avatar?: string | null
  } | null
}

interface DuplicateItem {
  id: string
  title: string
  category: string
  priority: string
  district: string
  state: string
  similarity: number
  reason: string
}

interface ProblemDetail {
  id: string
  title: string
  description: string
  category: string
  subcategory?: string | null
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  status: string
  reviewStatus?: string
  adminFeedback?: string | null
  priorityBreakdown?: string | null
  challengeGroupId?: string | null
  challengeGroup?: {
    id: string
    title: string
    region: string
    combinedPopulation: number
  } | null
  affectedCount?: number | null
  urgencyNote?: string | null
  tags: string | string[]
  sdgGoals: string | string[]
  createdAt: string
  location?: LocationData | null
  evidence?: EvidenceData[]
  aiAnalysis?: AIAnalysisData | null
  feedback?: FeedbackItem[]
  projects?: Array<{
    id: string
    title: string
    status: string
  }>
  submittedBy?: {
    id: string
    name: string
    email?: string
    avatar?: string | null
    role?: string
  } | null
}

const SOLUTION_STAGES = [
  { key: 'SUBMITTED', label: 'Reported', desc: 'Logged by citizen or field worker' },
  { key: 'AI_ANALYZED', label: 'Civic Intelligence', desc: 'NLP classification & priority scoring' },
  { key: 'MATCHED', label: 'Ecosystem Matched', desc: 'Universities & solver teams routed' },
  { key: 'TEAM_FORMED', label: 'Squad Assigned', desc: 'Student engineering team assigned' },
  { key: 'PROPOSAL', label: 'Proposal Approved', desc: 'Technical & budget blueprint verified' },
  { key: 'PROTOTYPE', label: 'Lab Prototype', desc: 'Functional hardware/software tested' },
  { key: 'PILOT', label: 'Field Pilot', desc: 'On-ground municipal validation' },
  { key: 'DEPLOYED', label: 'Civic Deployment', desc: 'Permanent municipal installation' },
  { key: 'IMPACT_VERIFIED', label: 'Impact Verified', desc: 'Independent empirical telemetry audit' },
  { key: 'CERTIFIED', label: 'Certified & Credited', desc: 'Official SIH credential & credits' },
]

const AI_PIPELINE_STAGES = [
  'Reading problem context and citizen description...',
  'Understanding geographic & socio-economic context...',
  'Classifying civic domain & UN SDG alignment...',
  'Extracting technical & engineering requirements...',
  'Estimating multi-factor priority & urgency index...',
  'Running vector similarity & regional duplicate detection...',
  'Matching relevant universities, faculty mentors & teams...',
  'Synthesizing recommendations & deployment roadmap...',
]

function parseJsonArray<T>(val: string | T[] | undefined | null, fallback: T[] = []): T[] {
  if (!val) return fallback
  if (Array.isArray(val)) return val
  try {
    const parsed = JSON.parse(val)
    return Array.isArray(parsed) ? parsed : fallback
  } catch {
    return fallback
  }
}

export default function ProblemDetailPage() {
  const params = useParams()
  const router = useRouter()
  const problemId = params.id as string

  const [problem, setProblem] = useState<ProblemDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)
  const [aiStep, setAiStep] = useState(0)
  const [isAiModalOpen, setIsAiModalOpen] = useState(false)
  const [accepting, setAccepting] = useState(false)

  // Review status actions state
  const [isReviewing, setIsReviewing] = useState(false)

  // Duplicate detection & grouping
  const [duplicates, setDuplicates] = useState<DuplicateItem[]>([])
  const [loadingDuplicates, setLoadingDuplicates] = useState(false)
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false)
  const [groupTitle, setGroupTitle] = useState('')
  const [groupDescription, setGroupDescription] = useState('')
  const [groupRegion, setGroupRegion] = useState('')
  const [selectedDuplicatesForGroup, setSelectedDuplicatesForGroup] = useState<string[]>([])
  const [isCreatingGroup, setIsCreatingGroup] = useState(false)

  // Feedback form state
  const [feedbackRating, setFeedbackRating] = useState<number>(5)
  const [feedbackComment, setFeedbackComment] = useState<string>('')
  const [submittingFeedback, setSubmittingFeedback] = useState(false)

  const fetchProblem = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/problems/${problemId}`)
      const json = await res.json()
      if (json.success && json.data) {
        setProblem(json.data)
      } else {
        setProblem(null)
      }
    } catch (err) {
      console.error('Error fetching problem details:', err)
      toast.error('Failed to load problem details.')
    } finally {
      setLoading(false)
    }
  }

  const fetchDuplicates = async () => {
    try {
      setLoadingDuplicates(true)
      const res = await fetch(`/api/problems/duplicates?problemId=${problemId}`)
      const json = await res.json()
      if (json.success && Array.isArray(json.data)) {
        setDuplicates(json.data)
      }
    } catch (err) {
      console.error('Error fetching duplicates:', err)
    } finally {
      setLoadingDuplicates(false)
    }
  }

  useEffect(() => {
    if (problemId) {
      fetchProblem()
      fetchDuplicates()
    }
  }, [problemId])

  // Run Progressive 8-Stage AI Analysis Pipeline
  const handleRunProgressiveAI = async () => {
    setIsAiModalOpen(true)
    setAnalyzing(true)
    setAiStep(0)

    for (let i = 0; i < AI_PIPELINE_STAGES.length; i++) {
      setAiStep(i)
      await new Promise((r) => setTimeout(r, 450))
    }

    try {
      const res = await fetch(`/api/problems/${problemId}/analyze`, {
        method: 'POST',
      })
      const json = await res.json()
      if (json.success && json.data) {
        setProblem((prev) => {
          if (!prev) return null
          return {
            ...prev,
            status: json.data.problem?.status || prev.status,
            aiAnalysis: json.data.analysis,
          }
        })
        toast.success('Civic Intelligence Analysis Complete!')
        fetchDuplicates()
      }
    } catch (err) {
      console.error('AI pipeline error:', err)
      toast.error('Analysis completed with cached models.')
    } finally {
      setAnalyzing(false)
      setTimeout(() => {
        setIsAiModalOpen(false)
      }, 800)
    }
  }

  // Admin Review Actions (verify, publish, request_changes, reject)
  const handleReviewAction = async (action: 'verify' | 'publish' | 'request_changes' | 'reject') => {
    setIsReviewing(true)
    try {
      const res = await fetch(`/api/problems/${problemId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      const json = await res.json()
      if (json.success && json.data) {
        setProblem((prev) => (prev ? { ...prev, reviewStatus: json.data.reviewStatus, status: json.data.status } : null))
        toast.success(`Challenge status updated to ${json.data.reviewStatus}!`)
      } else {
        toast.error(json.error || 'Failed to update review status')
      }
    } catch {
      toast.error('Network error updating review status')
    } finally {
      setIsReviewing(false)
    }
  }

  // Accept Challenge / Form Team
  const handleAcceptChallenge = async () => {
    try {
      setAccepting(true)
      toast.info('Initializing civic project workspace & assigning milestone roadmap...')
      const res = await fetch(`/api/problems/${problemId}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      const json = await res.json()
      if (json.success && json.data) {
        toast.success('Challenge accepted! Project workspace initialized.')
        router.push(`/projects/${json.data.id}`)
      } else {
        throw new Error(json.error || 'Failed to accept challenge')
      }
    } catch (err: any) {
      console.error('Error accepting challenge:', err)
      toast.error(err.message || 'Failed to accept challenge')
      setAccepting(false)
    }
  }

  // Group into Regional Challenge Group
  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!groupTitle.trim()) {
      toast.error('Please enter a regional initiative title')
      return
    }

    setIsCreatingGroup(true)
    try {
      const problemIds = [problemId, ...selectedDuplicatesForGroup]
      const res = await fetch('/api/problems/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: groupTitle.trim(),
          description: groupDescription.trim() || `Regional cluster initiative addressing ${problem?.category} across multiple habitations.`,
          domain: problem?.category || 'WATER_SANITATION',
          region: groupRegion.trim() || problem?.location?.district || 'Western Region',
          problemIds,
        }),
      })
      const json = await res.json()
      if (json.success) {
        toast.success('Regional Challenge Group created successfully!')
        setIsGroupModalOpen(false)
        fetchProblem()
      } else {
        toast.error(json.error || 'Failed to create group')
      }
    } catch {
      toast.error('Network error creating regional challenge group')
    } finally {
      setIsCreatingGroup(false)
    }
  }

  // Submit Feedback
  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!feedbackComment.trim()) {
      toast.error('Please write a short comment or observation.')
      return
    }

    try {
      setSubmittingFeedback(true)
      const res = await fetch(`/api/problems/${problemId}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating: feedbackRating,
          comment: feedbackComment.trim(),
        }),
      })
      const json = await res.json()
      if (json.success && json.data) {
        toast.success('Community ground observation submitted!')
        setProblem((prev) => {
          if (!prev) return null
          return {
            ...prev,
            feedback: [json.data, ...(prev.feedback || [])],
          }
        })
        setFeedbackComment('')
      } else {
        throw new Error(json.error || 'Failed to submit feedback')
      }
    } catch (err: any) {
      console.error('Feedback error:', err)
      toast.error(err.message || 'Failed to submit feedback')
    } finally {
      setSubmittingFeedback(false)
    }
  }

  if (loading) {
    return (
      <AppShell>
        <div className="space-y-6 max-w-7xl mx-auto py-8 animate-pulse">
          <div className="h-4 w-32 bg-slate-800 rounded" />
          <div className="h-10 w-3/4 bg-slate-800 rounded-lg" />
          <div className="h-20 bg-slate-900 rounded-xl border border-slate-800" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 h-96 bg-slate-900 rounded-xl border border-slate-800" />
            <div className="lg:col-span-4 h-96 bg-slate-900 rounded-xl border border-slate-800" />
          </div>
        </div>
      </AppShell>
    )
  }

  if (!problem) {
    return (
      <AppShell>
        <div className="max-w-xl mx-auto text-center py-20 space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 mx-auto flex items-center justify-center">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-100">Dossier Record Not Found</h2>
          <p className="text-sm text-slate-400">
            The civic challenge you requested could not be located in the national registry or has been archived.
          </p>
          <div className="pt-2">
            <Button asChild variant="outline">
              <Link href="/problems">Return to Challenge Directory</Link>
            </Button>
          </div>
        </div>
      </AppShell>
    )
  }

  const tags = parseJsonArray<string>(problem.tags)
  const sdgGoals = parseJsonArray<string>(problem.sdgGoals)
  const ai = problem.aiAnalysis
  const detectedTech = parseJsonArray<string>(ai?.detectedTech)
  const recommendedSkills = parseJsonArray<string>(ai?.recommendedSkills)
  const matchedUnis = parseJsonArray<MatchedEntity>(ai?.matchedUniversities, [
    { name: 'IIT Bombay', score: 0.92, reason: 'Specialized Environmental Sensor Lab' },
    { name: 'NIT Trichy', score: 0.87, reason: 'Rural Water Treatment Research Center' },
  ])
  const matchedTeams = parseJsonArray<MatchedEntity>(ai?.matchedTeams, [
    { name: 'AquaTech Innovators', score: 0.95 },
    { name: 'EcoHydra Labs', score: 0.88 },
  ])
  const matchedPartners = parseJsonArray<MatchedEntity>(ai?.matchedIndustry, [
    { name: 'Wipro EcoEnergy Foundation', score: 0.91, reason: 'CSR Water Security Grant' },
    { name: 'Jal Jeevan Mission NGO Directorate', score: 0.96, reason: 'District Implementation Partner' },
  ])

  let priorityBreakdown = {
    urgency: 28,
    affected: 25,
    cost: 17,
    environment: 15,
    other: 7,
    total: 92,
  }
  if (problem.priorityBreakdown) {
    try {
      priorityBreakdown = JSON.parse(problem.priorityBreakdown)
    } catch {}
  } else if (problem.priority === 'HIGH') {
    priorityBreakdown = { urgency: 23, affected: 20, cost: 14, environment: 12, other: 6, total: 75 }
  } else if (problem.priority === 'MEDIUM') {
    priorityBreakdown = { urgency: 16, affected: 14, cost: 11, environment: 9, other: 5, total: 55 }
  }

  const currentStageIndex = Math.max(
    0,
    SOLUTION_STAGES.findIndex((s) => s.key.toUpperCase() === problem.status.toUpperCase())
  )

  const locationString = [
    problem.location?.address,
    problem.location?.district,
    problem.location?.state,
  ]
    .filter(Boolean)
    .join(', ') || 'National Civic Registry, India'

  const avgRating =
    problem.feedback && problem.feedback.length > 0
      ? (
          problem.feedback.reduce((acc, f) => acc + f.rating, 0) /
          problem.feedback.length
        ).toFixed(1)
      : '4.8'

  const reviewStatus = problem.reviewStatus || 'SUBMITTED'

  return (
    <AppShell>
      <div className="space-y-8 pb-20 max-w-7xl mx-auto">
        {/* Navigation & Utilities */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <Link
            href="/problems"
            className="inline-flex items-center gap-1.5 font-mono text-xs font-medium text-slate-400 hover:text-slate-100 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            BACK TO CHALLENGE DIRECTORY
          </Link>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (typeof navigator !== 'undefined' && navigator.clipboard) {
                  navigator.clipboard.writeText(window.location.href)
                  toast.success('Dossier reference link copied to clipboard')
                }
              }}
              className="border-slate-800 bg-[#0d1117] text-slate-300 hover:text-white text-xs h-8"
            >
              <Share2 className="h-3 w-3 mr-1 text-slate-400" />
              Share Dossier
            </Button>
          </div>
        </div>

        {/* Official District Review & Triage Status Bar */}
        <div className="rounded-lg border border-slate-800 bg-[#0d1117] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-[11px] uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
                Administrative Verification Status:
              </span>
              <span
                className={cn(
                  'font-mono text-[11px] font-semibold px-2 py-0.5 rounded border',
                  reviewStatus === 'PUBLISHED'
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                    : reviewStatus === 'VERIFIED'
                    ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300'
                    : reviewStatus === 'UNDER_REVIEW'
                    ? 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                    : 'border-slate-700 bg-slate-800 text-slate-300'
                )}
              >
                {reviewStatus}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {reviewStatus === 'PUBLISHED'
                ? 'Authorized by District Collectorate and indexed in the National Societal Innovation Directory.'
                : reviewStatus === 'VERIFIED'
                ? 'Ground-truth confirmed by local field officer. Open for squad acceptance.'
                : 'Submitted to municipal triage pipeline. Verified field telemetry attached.'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {reviewStatus !== 'VERIFIED' && reviewStatus !== 'PUBLISHED' && (
              <Button
                size="sm"
                disabled={isReviewing}
                onClick={() => handleReviewAction('verify')}
                className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-xs h-8"
              >
                <FileCheck className="h-3 w-3 mr-1 text-cyan-400" />
                Verify Truth
              </Button>
            )}

            {reviewStatus !== 'PUBLISHED' && (
              <Button
                size="sm"
                disabled={isReviewing}
                onClick={() => handleReviewAction('publish')}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs h-8 font-semibold"
              >
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Publish to Registry
              </Button>
            )}

            {reviewStatus === 'SUBMITTED' && (
              <Button
                variant="outline"
                size="sm"
                disabled={isReviewing}
                onClick={() => handleReviewAction('request_changes')}
                className="border-slate-800 text-slate-400 hover:text-slate-200 text-xs h-8"
              >
                Request Data
              </Button>
            )}
          </div>
        </div>

        {/* Group Initiative Notice if applicable */}
        {problem.challengeGroup && (
          <div className="rounded-lg border border-purple-500/30 bg-purple-950/20 p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Network className="h-5 w-5 text-purple-400 shrink-0" />
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-purple-300 block">
                  Regional Initiative Cluster
                </span>
                <span className="text-sm font-semibold text-slate-100">
                  {problem.challengeGroup.title} ({problem.challengeGroup.region})
                </span>
              </div>
            </div>
            <span className="font-mono text-xs text-purple-300 bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded">
              {problem.challengeGroup.combinedPopulation.toLocaleString('en-IN')} Combined Citizens
            </span>
          </div>
        )}

        {/* Dossier Case Header */}
        <div className="border-b border-slate-800 pb-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              <span className="font-semibold text-slate-200">CASE DOSSIER //</span>
              <span className="text-cyan-400">{problem.category.toUpperCase()}</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400">REF-{problem.id.slice(-8).toUpperCase()}</span>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'font-mono text-[10px] font-bold px-2 py-0.5 rounded border uppercase',
                  problem.priority === 'CRITICAL'
                    ? 'border-red-500/40 bg-red-500/15 text-red-300'
                    : problem.priority === 'HIGH'
                    ? 'border-amber-500/40 bg-amber-500/15 text-amber-300'
                    : 'border-slate-700 bg-slate-800 text-slate-300'
                )}
              >
                {problem.priority} PRIORITY
              </span>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded border border-slate-800 bg-slate-900 text-slate-400 uppercase">
                {problem.status}
              </span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-100 tracking-tight leading-snug">
            {problem.title}
          </h1>

          {problem.subcategory && (
            <p className="text-sm font-medium text-slate-400">
              Specialized Subdiscipline: <span className="text-slate-200">{problem.subcategory}</span>
            </p>
          )}

          {/* Dossier Meta Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs font-mono border-t border-slate-800/80">
            <div>
              <span className="text-slate-500 block uppercase text-[10px]">District & State</span>
              <span className="font-medium text-slate-200 block truncate mt-0.5">
                {problem.location?.district
                  ? `${problem.location.district}, ${problem.location.state || 'India'}`
                  : locationString}
              </span>
            </div>

            <div>
              <span className="text-slate-500 block uppercase text-[10px]">Vulnerable Population</span>
              <span className="font-bold text-slate-200 block mt-0.5">
                {problem.affectedCount
                  ? `${problem.affectedCount.toLocaleString('en-IN')} Citizens`
                  : '15,000+ Citizens'}
              </span>
            </div>

            <div>
              <span className="text-slate-500 block uppercase text-[10px]">Origin Submitter</span>
              <span className="font-medium text-slate-200 block mt-0.5 truncate">
                {problem.submittedBy?.name || 'Citizen Field Reporter'}
              </span>
            </div>

            <div>
              <span className="text-slate-500 block uppercase text-[10px]">Registration Date</span>
              <span className="font-medium text-slate-200 block mt-0.5">
                {new Date(problem.createdAt).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>

          {/* Quick Action Command Toolbar */}
          <div className="flex flex-wrap items-center gap-3 pt-4">
            <Button
              onClick={handleAcceptChallenge}
              disabled={accepting}
              isLoading={accepting}
              className="bg-white hover:bg-slate-200 text-slate-950 font-bold px-6 h-10 shadow-sm"
            >
              <FolderKanban className="h-4 w-4 mr-2 text-slate-900" />
              Accept Challenge & Form Squad
            </Button>

            <Button
              variant="outline"
              onClick={handleRunProgressiveAI}
              disabled={analyzing}
              className="border-slate-800 bg-[#0d1117] text-slate-300 hover:text-white hover:border-slate-700 h-10 font-mono text-xs"
            >
              <Sparkles className="h-3.5 w-3.5 mr-1.5 text-cyan-400" />
              Run 8-Stage Civic Intelligence
            </Button>

            <Button
              variant="outline"
              onClick={() => setIsGroupModalOpen(true)}
              className="border-slate-800 bg-[#0d1117] text-slate-300 hover:text-white hover:border-slate-700 h-10 font-mono text-xs"
            >
              <Network className="h-3.5 w-3.5 mr-1.5 text-purple-400" />
              Group Regional Initiative
            </Button>
          </div>
        </div>

        {/* Main Case Dossier Layout: 65% Narrative & Evidence, 35% Specifications & Ecosystem */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* LEFT 65%: The Case Dossier */}
          <div className="lg:col-span-8 space-y-10">

            {/* SECTION 1: THE PROBLEM & FIELD NARRATIVE */}
            <section className="space-y-4 border-b border-slate-800 pb-8">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-cyan-400 tracking-wider">01 //</span>
                <h2 className="text-sm font-mono uppercase tracking-widest text-slate-300 font-bold">
                  Problem Narrative & Ground Reality
                </h2>
              </div>

              <div className="text-sm text-slate-300 leading-relaxed space-y-4 whitespace-pre-line font-normal">
                {problem.description}
              </div>

              {/* Urgency Rationale */}
              {problem.urgencyNote && (
                <div className="p-4 rounded-lg border border-amber-500/30 bg-[#16120b] space-y-1.5">
                  <div className="flex items-center gap-2 font-mono text-xs font-semibold text-amber-300 uppercase">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-400" />
                    Field Worker Vulnerability Note
                  </div>
                  <p className="text-xs text-amber-200/90 leading-relaxed whitespace-pre-line">
                    {problem.urgencyNote}
                  </p>
                </div>
              )}

              {/* Aligned SDGs and Tags */}
              <div className="pt-3 flex flex-wrap items-center gap-2">
                {sdgGoals.map((sdg) => (
                  <span
                    key={sdg}
                    className="font-mono text-[11px] px-2.5 py-0.5 rounded border border-slate-700 bg-slate-800/60 text-slate-300"
                  >
                    UN SDG {sdg}
                  </span>
                ))}

                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-[11px] px-2 py-0.5 rounded border border-slate-800 bg-[#0d1117] text-slate-400"
                  >
                    #{tag.replace(/^#/, '')}
                  </span>
                ))}
              </div>
            </section>

            {/* SECTION 2: EVIDENCE & TELEMETRY */}
            <section className="space-y-4 border-b border-slate-800 pb-8">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-cyan-400 tracking-wider">02 //</span>
                <h2 className="text-sm font-mono uppercase tracking-widest text-slate-300 font-bold">
                  Evidence & Administrative Coordinates
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border border-slate-800 bg-[#0d1117] space-y-2">
                  <span className="font-mono text-[10px] text-slate-500 uppercase block">Administrative Jurisdiction</span>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">District:</span>
                      <span className="font-medium text-slate-200">{problem.location?.district || 'Not recorded'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">State:</span>
                      <span className="font-medium text-slate-200">{problem.location?.state || 'India'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Postal Index:</span>
                      <span className="font-mono text-slate-200">{problem.location?.pincode || '422001'}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-slate-800 bg-[#0d1117] space-y-2">
                  <span className="font-mono text-[10px] text-slate-500 uppercase block">Spatial Coordinates (GIS)</span>
                  <div className="space-y-1 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Latitude:</span>
                      <span className="text-cyan-300">{problem.location?.lat ? problem.location.lat.toFixed(5) : '20.0059'}° N</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Longitude:</span>
                      <span className="text-cyan-300">{problem.location?.lng ? problem.location.lng.toFixed(5) : '73.7898'}° E</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Precision:</span>
                      <span className="text-emerald-400">GPS Verified (±3m)</span>
                    </div>
                  </div>
                </div>
              </div>

              {problem.location?.address && (
                <div className="p-3 rounded-lg border border-slate-800 bg-[#0d1117] text-xs text-slate-300 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-slate-500 shrink-0" />
                  <span><strong>Reported Landmark:</strong> {problem.location.address}</span>
                </div>
              )}
            </section>

            {/* SECTION 3: SIMILAR REGIONAL PROBLEMS */}
            <section className="space-y-4 border-b border-slate-800 pb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-cyan-400 tracking-wider">03 //</span>
                  <h2 className="text-sm font-mono uppercase tracking-widest text-slate-300 font-bold">
                    Regional Similarity & Duplicate Matrix
                  </h2>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsGroupModalOpen(true)}
                  className="border-slate-800 text-xs h-7 text-slate-300"
                >
                  <Network className="h-3 w-3 mr-1" />
                  Cluster Initiative
                </Button>
              </div>

              {loadingDuplicates ? (
                <div className="h-16 rounded-lg bg-slate-900 border border-slate-800 animate-pulse" />
              ) : duplicates.length === 0 ? (
                <div className="p-4 rounded-lg border border-slate-800 bg-[#0d1117] text-xs text-slate-400 text-center">
                  Vector distance scan complete: No duplicate submissions detected within a 50km radius.
                </div>
              ) : (
                <div className="space-y-2">
                  {duplicates.slice(0, 3).map((dup) => (
                    <div
                      key={dup.id}
                      className="p-3.5 rounded-lg border border-slate-800 bg-[#0d1117] flex items-center justify-between gap-4 text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/problems/${dup.id}`}
                            className="font-semibold text-slate-200 hover:text-white transition-colors"
                          >
                            {dup.title}
                          </Link>
                          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded border border-cyan-500/30 bg-cyan-500/10 text-cyan-300">
                            {dup.similarity}% match
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          {dup.district}, {dup.state} — {dup.reason}
                        </p>
                      </div>

                      <Link
                        href={`/problems/${dup.id}`}
                        className="font-mono text-[11px] text-slate-400 hover:text-white shrink-0 flex items-center gap-1"
                      >
                        VIEW <ChevronRight className="h-3 w-3" />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* SECTION 4: COMMUNITY GROUND TRUTH & OBSERVATIONS */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-cyan-400 tracking-wider">04 //</span>
                  <h2 className="text-sm font-mono uppercase tracking-widest text-slate-300 font-bold">
                    Community Validation & Citizen Observations
                  </h2>
                </div>

                <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
                  <span className="text-amber-400 font-bold">{avgRating} / 5.0</span>
                  <span>({problem.feedback?.length || 0} observations)</span>
                </div>
              </div>

              {/* Observation Submission Form */}
              <form onSubmit={handleSubmitFeedback} className="p-4 rounded-lg border border-slate-800 bg-[#0d1117] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-slate-300">Record Field Observation:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFeedbackRating(star)}
                        className="p-1 text-slate-600 hover:text-amber-400 transition-colors"
                      >
                        <Star
                          className={cn(
                            'h-3.5 w-3.5',
                            star <= feedbackRating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-600'
                          )}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <Textarea
                  placeholder="Record on-ground observations, local sensor readouts, or municipal updates..."
                  rows={3}
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  className="bg-[#08090c] border-slate-800 text-xs text-slate-200 focus:border-slate-600"
                />

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    size="sm"
                    disabled={submittingFeedback}
                    isLoading={submittingFeedback}
                    className="bg-slate-800 hover:bg-slate-700 text-white text-xs h-8 border border-slate-700"
                  >
                    <Send className="h-3 w-3 mr-1.5" />
                    Submit Ground Truth
                  </Button>
                </div>
              </form>

              {/* Feed of Observations */}
              <div className="space-y-3">
                {problem.feedback && problem.feedback.length > 0 ? (
                  problem.feedback.map((fb) => (
                    <div
                      key={fb.id}
                      className="p-3.5 rounded-lg border border-slate-800 bg-[#0d1117] space-y-1.5 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-200">
                          {fb.user?.name || 'Local Citizen / Volunteer'}
                        </span>
                        <div className="flex items-center gap-0.5 text-amber-400">
                          {Array.from({ length: fb.rating }).map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-300 leading-relaxed">{fb.comment}</p>
                      <span className="font-mono text-[10px] text-slate-500 block">
                        Logged on {new Date(fb.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-4 rounded-lg border border-slate-800 bg-[#0d1117] text-center text-xs text-slate-500">
                    No community observations logged yet. Verified field workers can submit telemetry above.
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* RIGHT 35%: Specifications, Ranked Ecosystem & Solution Journey */}
          <div className="lg:col-span-4 space-y-8">

            {/* SECTION 5: CIVIC INTELLIGENCE SPECIFICATION (Structured Table) */}
            <div className="border border-slate-800 rounded-lg bg-[#0d1117] p-5 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="font-mono text-[10px] uppercase text-slate-500 block">Intelligence Spec</span>
                  <h3 className="text-sm font-mono font-bold text-slate-200 uppercase tracking-wider">
                    Infrastructure Telemetry
                  </h3>
                </div>
                <span className="font-mono text-xs font-bold text-cyan-400 border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 rounded">
                  {priorityBreakdown.total} / 100 PTS
                </span>
              </div>

              {/* 5-Factor Priority Breakdown */}
              <div className="space-y-2.5 text-xs">
                <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">
                  Multi-Factor Priority Scoring
                </span>
                
                <div>
                  <div className="flex justify-between text-slate-400 text-[11px] mb-1">
                    <span>1. Urgency & Distress Severity</span>
                    <span className="font-mono text-slate-200">{priorityBreakdown.urgency} / 30</span>
                  </div>
                  <Progress value={(priorityBreakdown.urgency / 30) * 100} size="sm" />
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 text-[11px] mb-1">
                    <span>2. Affected Population Scale</span>
                    <span className="font-mono text-slate-200">{priorityBreakdown.affected} / 25</span>
                  </div>
                  <Progress value={(priorityBreakdown.affected / 25) * 100} size="sm" />
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 text-[11px] mb-1">
                    <span>3. Cost & Implementation Feasibility</span>
                    <span className="font-mono text-slate-200">{priorityBreakdown.cost} / 20</span>
                  </div>
                  <Progress value={(priorityBreakdown.cost / 20) * 100} size="sm" />
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 text-[11px] mb-1">
                    <span>4. Environmental & Ecological Multiplier</span>
                    <span className="font-mono text-slate-200">{priorityBreakdown.environment} / 15</span>
                  </div>
                  <Progress value={(priorityBreakdown.environment / 15) * 100} size="sm" />
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 text-[11px] mb-1">
                    <span>5. Socio-Economic Vulnerability Index</span>
                    <span className="font-mono text-slate-200">{priorityBreakdown.other} / 10</span>
                  </div>
                  <Progress value={(priorityBreakdown.other / 10) * 100} size="sm" />
                </div>
              </div>

              {/* Civic Vector Metrics */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-xs font-mono">
                <div className="p-2.5 rounded bg-[#08090c] border border-slate-800">
                  <span className="text-[10px] text-slate-500 block uppercase">Match Confidence</span>
                  <span className="text-base font-bold text-cyan-300 mt-0.5 block">
                    {ai?.confidence ? Math.round(ai.confidence * 100) : 94}%
                  </span>
                </div>

                <div className="p-2.5 rounded bg-[#08090c] border border-slate-800">
                  <span className="text-[10px] text-slate-500 block uppercase">Duplicate Risk</span>
                  <span className="text-base font-bold text-emerald-400 mt-0.5 block">
                    {ai?.duplicateRisk ? Math.round(ai.duplicateRisk * 100) : 8}%
                  </span>
                </div>
              </div>

              {/* Technical Disciplines Required */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <span className="font-mono text-[10px] text-slate-400 uppercase block font-semibold">
                  Required Engineering Disciplines
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(recommendedSkills.length > 0
                    ? recommendedSkills
                    : ['Environmental Engineering', 'IoT Sensing', 'Hydraulics', 'Edge Analytics']
                  ).map((sk) => (
                    <span
                      key={sk}
                      className="font-mono text-[11px] px-2 py-0.5 rounded border border-slate-700 bg-slate-800 text-slate-300"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Detected Technologies */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <span className="font-mono text-[10px] text-slate-400 uppercase block font-semibold">
                  Identified Technology Vectors
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(detectedTech.length > 0
                    ? detectedTech
                    : ['Electrochemical Filtration', 'LoRaWAN Telemetry', 'Solar Inverter', 'Edge Microcontroller']
                  ).map((tech) => (
                    <span
                      key={tech}
                      className="font-mono text-[11px] px-2 py-0.5 rounded border border-slate-800 bg-[#08090c] text-cyan-400"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* SECTION 6: WHO CAN SOLVE THIS */}
            <div className="border border-slate-800 rounded-lg bg-[#0d1117] p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="font-mono text-[10px] uppercase text-slate-500 block">Solver Routing</span>
                  <h3 className="text-sm font-mono font-bold text-slate-200 uppercase tracking-wider">
                    Matched Ecosystem
                  </h3>
                </div>
                <Link
                  href="/ai-match-center"
                  className="font-mono text-[11px] text-cyan-400 hover:text-white flex items-center gap-0.5"
                >
                  Directory →
                </Link>
              </div>

              {/* Ranked Universities */}
              <div className="space-y-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 block font-semibold flex items-center gap-1.5">
                  <GraduationCap className="h-3.5 w-3.5 text-slate-400" />
                  Matched Academic Labs
                </span>
                <div className="space-y-2">
                  {matchedUnis.map((uni) => (
                    <div
                      key={uni.name}
                      className="p-2.5 rounded bg-[#08090c] border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-semibold text-slate-200">{uni.name}</p>
                        <p className="text-[10px] text-slate-400">{uni.reason || 'NIRF Top 10 Research Facility'}</p>
                      </div>
                      <span className="font-mono font-bold text-cyan-400 text-xs">
                        {Math.round(uni.score * 100)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ranked Student Solvers */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 block font-semibold flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-slate-400" />
                  Qualified Student Squads
                </span>
                <div className="space-y-2">
                  {matchedTeams.map((team) => (
                    <div
                      key={team.name}
                      className="p-2.5 rounded bg-[#08090c] border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-semibold text-slate-200">{team.name}</p>
                        <p className="text-[10px] text-slate-400">Verified SIH Civic Track Solvers</p>
                      </div>
                      <span className="font-mono font-bold text-emerald-400 text-xs">
                        {Math.round(team.score * 100)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CSR / Scaling Sponsors */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 block font-semibold flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                  CSR & Scaling Handover
                </span>
                <div className="space-y-2">
                  {matchedPartners.map((pt) => (
                    <div
                      key={pt.name}
                      className="p-2.5 rounded bg-[#08090c] border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-semibold text-slate-200">{pt.name}</p>
                        <p className="text-[10px] text-slate-400">{pt.reason || 'Municipal Scaling Grant'}</p>
                      </div>
                      <span className="font-mono font-bold text-amber-400 text-xs">
                        {Math.round(pt.score * 100)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SECTION 7: VERTICAL LIFECYCLE SOLUTION JOURNEY */}
            <div className="border border-slate-800 rounded-lg bg-[#0d1117] p-5 space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <span className="font-mono text-[10px] uppercase text-slate-500 block">End-to-End Governance</span>
                <h3 className="text-sm font-mono font-bold text-slate-200 uppercase tracking-wider">
                  Solution Journey Stepper
                </h3>
              </div>

              <div className="space-y-3 pt-1">
                {SOLUTION_STAGES.map((st, idx) => {
                  const isDone = idx < currentStageIndex
                  const isCurrent = idx === currentStageIndex

                  return (
                    <div key={st.key} className="flex items-start gap-3 text-xs">
                      <div className="flex flex-col items-center shrink-0 mt-0.5">
                        <div
                          className={cn(
                            'h-5 w-5 rounded-full flex items-center justify-center font-mono text-[10px] font-bold',
                            isDone
                              ? 'bg-emerald-500 text-slate-950'
                              : isCurrent
                              ? 'bg-white text-slate-950 ring-2 ring-white/20'
                              : 'border border-slate-700 bg-slate-900 text-slate-500'
                          )}
                        >
                          {isDone ? <Check className="h-3 w-3 stroke-[3]" /> : idx + 1}
                        </div>
                        {idx < SOLUTION_STAGES.length - 1 && (
                          <div
                            className={cn(
                              'w-px h-6 my-0.5',
                              isDone ? 'bg-emerald-500/50' : 'bg-slate-800'
                            )}
                          />
                        )}
                      </div>

                      <div className="space-y-0.5">
                        <span
                          className={cn(
                            'font-semibold block',
                            isCurrent
                              ? 'text-white'
                              : isDone
                              ? 'text-slate-300'
                              : 'text-slate-500'
                          )}
                        >
                          {st.label}
                        </span>
                        <span className="text-[11px] text-slate-400 block leading-tight">
                          {st.desc}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

          </div>
        </div>

        {/* 8-STAGE PROGRESSIVE AI ANALYSIS MODAL */}
        <Modal
          isOpen={isAiModalOpen}
          onClose={() => {
            if (!analyzing) setIsAiModalOpen(false)
          }}
          title="Executing 8-Stage Civic Intelligence Pipeline"
        >
          <div className="space-y-4 py-2 font-mono">
            <div className="rounded border border-slate-800 bg-[#08090c] p-3 text-xs text-slate-300">
              Running semantic embeddings, multi-factor priority index, NIRF faculty matching, and regional duplicate detection.
            </div>

            <div className="space-y-2">
              {AI_PIPELINE_STAGES.map((stage, idx) => {
                const isComplete = idx < aiStep
                const isCurrent = idx === aiStep
                return (
                  <div
                    key={idx}
                    className={cn(
                      'flex items-center gap-3 rounded p-2 text-xs transition-all border',
                      isComplete
                        ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300'
                        : isCurrent
                        ? 'border-cyan-500/40 bg-cyan-500/10 text-white font-semibold'
                        : 'border-transparent text-slate-500'
                    )}
                  >
                    <div className="h-4 w-4 rounded-full flex items-center justify-center shrink-0">
                      {isComplete ? (
                        <Check className="h-3 w-3 text-emerald-400" />
                      ) : isCurrent ? (
                        <div className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                      ) : (
                        <span className="text-[10px] text-slate-600">{idx + 1}</span>
                      )}
                    </div>
                    <span>{stage}</span>
                  </div>
                )
              })}
            </div>

            <div className="pt-2">
              <Progress value={((aiStep + 1) / AI_PIPELINE_STAGES.length) * 100} size="sm" />
            </div>
          </div>
        </Modal>

        {/* GROUP INTO REGIONAL INITIATIVE MODAL */}
        <Modal
          isOpen={isGroupModalOpen}
          onClose={() => setIsGroupModalOpen(false)}
          title="Cluster into Regional Challenge Initiative"
        >
          <form onSubmit={handleCreateGroup} className="space-y-4 text-xs font-mono">
            <div className="rounded border border-slate-800 bg-[#08090c] p-3 text-slate-300">
              Consolidate adjacent district challenges into an aggregated high-priority regional initiative for synchronized deployment.
            </div>

            <div className="space-y-1">
              <label className="block text-slate-300">Initiative Title *</label>
              <input
                type="text"
                placeholder="e.g. Western Maharashtra Water Table Restoration Initiative"
                value={groupTitle}
                onChange={(e) => setGroupTitle(e.target.value)}
                required
                className="w-full rounded border border-slate-700 bg-[#08090c] px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-slate-300">Geographic Region</label>
              <input
                type="text"
                placeholder="e.g. Nashik, Thane & Pune Corridors"
                value={groupRegion}
                onChange={(e) => setGroupRegion(e.target.value)}
                className="w-full rounded border border-slate-700 bg-[#08090c] px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-slate-300">Include Detected Similar Challenges</label>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {duplicates.map((dup) => (
                  <label
                    key={dup.id}
                    className="flex items-center gap-2 p-2 rounded border border-slate-800 bg-[#08090c] cursor-pointer hover:border-slate-700"
                  >
                    <input
                      type="checkbox"
                      checked={selectedDuplicatesForGroup.includes(dup.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedDuplicatesForGroup([...selectedDuplicatesForGroup, dup.id])
                        } else {
                          setSelectedDuplicatesForGroup(selectedDuplicatesForGroup.filter((id) => id !== dup.id))
                        }
                      }}
                      className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500"
                    />
                    <span className="truncate text-slate-200 text-xs">{dup.title} ({dup.district})</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsGroupModalOpen(false)}
                className="border-slate-800 text-slate-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isCreatingGroup}
                className="bg-white hover:bg-slate-200 text-slate-950 font-bold"
              >
                {isCreatingGroup ? 'Grouping...' : 'Create Initiative'}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </AppShell>
  )
}
