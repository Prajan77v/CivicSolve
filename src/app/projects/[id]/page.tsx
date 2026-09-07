'use client'

import React, { useState, useEffect, useMemo, useRef } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  FolderKanban,
  ArrowLeft,
  ArrowRight,
  Calendar,
  Building2,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  Coins,
  GraduationCap,
  Plus,
  MoveRight,
  MoveLeft,
  FileCheck,
  Download,
  Award,
  RefreshCw,
  MapPin,
  HelpCircle,
  Target,
  FileText,
  UserCheck,
  Check,
  ArrowUpRight,
  MessageSquare,
  Paperclip,
  Send,
  Star,
  FileCode,
  Layers,
  FileSpreadsheet,
  Upload,
  Cpu,
  ThumbsUp,
  RotateCcw
} from 'lucide-react'
import AppShell from '@/components/layout/app-shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Avatar } from '@/components/ui/avatar'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import EvidenceUploadZone, { UploadedEvidenceItem } from '@/components/evidence/evidence-upload-zone'
import { ProjectCopilotButton } from '@/components/ai/project-copilot-button'

interface TaskItem {
  id: string
  title: string
  description?: string | null
  status: string // TODO | IN_PROGRESS | DONE
  priority: string // LOW | MEDIUM | HIGH | CRITICAL
  assigneeId?: string | null
  dueDate?: string | null
  createdAt: string
}

interface MilestoneItem {
  id: string
  title: string
  description?: string | null
  type: string
  status: string // PENDING | IN_PROGRESS | COMPLETED
  completionPct: number
  order: number
  dueDate?: string | null
  completedAt?: string | null
  evidence?: string | null
  reviewNotes?: string | null
}

interface ImpactMetricItem {
  id: string
  metricName: string
  beforeValue: string
  afterValue: string
  unit?: string | null
  verified: boolean
}

interface DeploymentItem {
  id: string
  location?: string | null
  description?: string | null
  deployedAt: string
  status: string
  impactMetrics?: ImpactMetricItem[]
}

interface TeamMemberItem {
  id: string
  role: string
  user: {
    id: string
    name: string
    email: string
    avatar?: string | null
    bio?: string | null
    studentProfile?: {
      skills: string
      yearOfStudy?: number | null
      impactScore: number
      problemsSolved: number
      deploymentsCount: number
    } | null
  }
}

interface MentorshipItem {
  id: string
  status: string
  notes?: string | null
  faculty: {
    id: string
    designation?: string | null
    specializations: string
    user: {
      id: string
      name: string
      email: string
      avatar?: string | null
      bio?: string | null
    }
    university?: {
      name: string
      shortName: string
    } | null
    department?: {
      name: string
    } | null
  }
}

interface FundingItem {
  id: string
  type: string
  amount?: number | null
  description?: string | null
  status: string
  organization: {
    id: string
    name: string
    type: string
    sector: string
    city: string
  }
}

interface ProjectFileItem {
  id: string
  name: string
  url: string
  fileType: string
  sizeBytes: number
  uploadedBy: string
  createdAt: string
}

interface ChatMessageItem {
  id: string
  content: string
  createdAt: string
  sender?: {
    id: string
    name: string
    role: string
    avatar?: string | null
    email?: string
  } | null
}

interface EvaluationItem {
  id: string
  evaluatorName: string
  evaluatorRole: string
  innovation: number
  feasibility: number
  cost: number
  scalability: number
  socialImpact: number
  overallScore: number
  recommendation: string
  comments: string
  createdAt: string
}

interface ProjectDetail {
  id: string
  title: string
  status: string
  progressPercent: number
  startDate: string
  targetDate?: string | null
  completedAt?: string | null
  problem: {
    id: string
    title: string
    description: string
    category: string
    priority: string
    affectedCount?: number | null
    urgencyNote?: string | null
    location?: {
      address?: string | null
      district?: string | null
      state?: string | null
    } | null
    submittedBy?: {
      name: string
      role: string
    } | null
  }
  team?: {
    id: string
    name: string
    skills: string
    size: number
    members: TeamMemberItem[]
    university?: {
      name: string
      shortName: string
    } | null
    department?: {
      name: string
    } | null
  } | null
  university?: {
    id: string
    name: string
    shortName: string
    city: string
    state: string
  } | null
  industryPartner?: {
    id: string
    name: string
    type: string
    sector: string
  } | null
  milestones: MilestoneItem[]
  tasks: TaskItem[]
  deployments: DeploymentItem[]
  mentorships: MentorshipItem[]
  fundingSupport: FundingItem[]
  updates: Array<{
    id: string
    content: string
    type: string
    createdAt: string
    author?: {
      name: string
      avatar?: string | null
    } | null
  }>
  certificates?: Array<{
    id: string
    certificateId: string
    type: string
    role: string
    impactSummary?: string | null
  }>
}

type TabType =
  | 'overview'
  | 'proposal'
  | 'milestones'
  | 'tasks'
  | 'evaluation'
  | 'team'
  | 'chat'
  | 'files'
  | 'impact'

const CANONICAL_STAGES = [
  'PROPOSAL',
  'PROTOTYPE',
  'PILOT',
  'DEPLOYED',
  'COMPLETED',
] as const

const STAGE_ORDER_MAP: Record<string, number> = {
  PROPOSAL: 1,
  PROTOTYPE: 2,
  PILOT: 3,
  DEPLOYED: 4,
  COMPLETED: 5,
}

function formatCurrency(num?: number | null): string {
  if (!num) return '₹0'
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)} Cr`
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)} Lakh`
  return `₹${num.toLocaleString('en-IN')}`
}

function parseSkills(skillsString?: string | null): string[] {
  if (!skillsString) return []
  try {
    const parsed = JSON.parse(skillsString)
    return Array.isArray(parsed) ? parsed : [skillsString]
  } catch {
    return skillsString.split(',').map((s) => s.trim()).filter(Boolean)
  }
}

export default function ProjectWorkspacePage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params?.id as string

  const [project, setProject] = useState<ProjectDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>('overview')

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessageItem[]>([])
  const [chatInput, setChatInput] = useState('')
  const [isSendingChat, setIsSendingChat] = useState(false)
  const chatBottomRef = useRef<HTMLDivElement>(null)

  // Files state
  const [files, setFiles] = useState<ProjectFileItem[]>([])
  const [isFileModalOpen, setIsFileModalOpen] = useState(false)
  const [newFileName, setNewFileName] = useState('')
  const [newFileType, setNewFileType] = useState('SCHEMATIC')
  const [isUploadingFile, setIsUploadingFile] = useState(false)
  const [projectStagedMedia, setProjectStagedMedia] = useState<UploadedEvidenceItem[]>([])

  // Evaluation state
  const [evaluations, setEvaluations] = useState<EvaluationItem[]>([])
  const [evalInnovation, setEvalInnovation] = useState(9)
  const [evalFeasibility, setEvalFeasibility] = useState(8)
  const [evalCost, setEvalCost] = useState(9)
  const [evalScalability, setEvalScalability] = useState(8)
  const [evalSocialImpact, setEvalSocialImpact] = useState(10)
  const [evalComments, setEvalComments] = useState('')
  const [evalRecommendation, setEvalRecommendation] = useState('RECOMMENDED_FOR_PILOT')
  const [isSubmittingEval, setIsSubmittingEval] = useState(false)

  // Proposal review status
  const [proposalStatus, setProposalStatus] = useState('APPROVED')

  // Modals & Action States
  const [isAdvanceModalOpen, setIsAdvanceModalOpen] = useState(false)
  const [isAdvancing, setIsAdvancing] = useState(false)
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false)
  const [isSubmittingTask, setIsSubmittingTask] = useState(false)
  const [isCompletingMilestone, setIsCompletingMilestone] = useState<string | null>(null)
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false)

  // New task form state
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDesc, setNewTaskDesc] = useState('')
  const [newTaskPriority, setNewTaskPriority] = useState('MEDIUM')
  const [newTaskStatus, setNewTaskStatus] = useState('TODO')
  const [newTaskAssignee, setNewTaskAssignee] = useState('')
  const [newTaskDueDate, setNewTaskDueDate] = useState('')

  // Fetch project details
  const fetchProject = async () => {
    try {
      setError(null)
      const res = await fetch(`/api/projects/${projectId}`)
      if (!res.ok) {
        if (res.status === 404) throw new Error('Project not found')
        throw new Error('Failed to load project details')
      }
      const json = await res.json()
      if (json.success && json.data) {
        setProject(json.data)
      } else {
        throw new Error('Invalid project response data')
      }
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch Chat
  const fetchChat = async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}/chat`)
      const json = await res.json()
      if (json.success && Array.isArray(json.data)) {
        setChatMessages(json.data)
      }
    } catch (err) {
      console.error('Error fetching chat:', err)
    }
  }

  // Fetch Files
  const fetchFiles = async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}/files`)
      const json = await res.json()
      if (json.success && Array.isArray(json.data)) {
        setFiles(json.data)
      }
    } catch (err) {
      console.error('Error fetching files:', err)
    }
  }

  // Fetch Evaluations
  const fetchEvaluations = async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}/evaluations`)
      const json = await res.json()
      if (json.success && Array.isArray(json.data)) {
        setEvaluations(json.data)
      }
    } catch (err) {
      console.error('Error fetching evaluations:', err)
    }
  }

  useEffect(() => {
    if (projectId) {
      fetchProject()
      fetchChat()
      fetchFiles()
      fetchEvaluations()
    }
  }, [projectId])

  useEffect(() => {
    if (activeTab === 'chat') {
      fetchChat()
      setTimeout(() => chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 200)
    } else if (activeTab === 'files') {
      fetchFiles()
    } else if (activeTab === 'evaluation') {
      fetchEvaluations()
    }
  }, [activeTab])

  // Send Chat Message
  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim()) return

    setIsSendingChat(true)
    try {
      const res = await fetch(`/api/projects/${projectId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: chatInput.trim() }),
      })
      const json = await res.json()
      if (json.success && json.data) {
        setChatMessages((prev) => [...prev, json.data])
        setChatInput('')
        setTimeout(() => chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
      } else {
        toast.error(json.error || 'Failed to send message')
      }
    } catch {
      toast.error('Network error sending message')
    } finally {
      setIsSendingChat(false)
    }
  }

  // Upload File
  const handleUploadFile = async (e: React.FormEvent) => {
    e.preventDefault()

    // If real media was uploaded via EvidenceUploadZone, save each to project files
    if (projectStagedMedia.length > 0) {
      setIsUploadingFile(true)
      try {
        for (const item of projectStagedMedia) {
          const res = await fetch(`/api/projects/${projectId}/files`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: item.originalName,
              fileType: item.type === 'IMAGE' ? 'REPORT' : item.type === 'VIDEO' ? 'REPORT' : newFileType,
              url: item.url,
              sizeBytes: item.sizeBytes,
            }),
          })
          const json = await res.json()
          if (json.success && json.data) {
            setFiles((prev) => [json.data, ...prev])
          }
        }
        toast.success(`Attached ${projectStagedMedia.length} media artifact(s) to project workspace!`)
        setIsFileModalOpen(false)
        setProjectStagedMedia([])
        setNewFileName('')
      } catch {
        toast.error('Network error uploading files')
      } finally {
        setIsUploadingFile(false)
      }
      return
    }

    if (!newFileName.trim()) return

    setIsUploadingFile(true)
    try {
      const res = await fetch(`/api/projects/${projectId}/files`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newFileName.trim(),
          fileType: newFileType,
          url: `/documents/${newFileName.trim().toLowerCase().replace(/\s+/g, '_')}`,
          sizeBytes: 1572864, // 1.5MB mock
        }),
      })
      const json = await res.json()
      if (json.success && json.data) {
        toast.success('Document uploaded to project workspace repository!')
        setFiles((prev) => [json.data, ...prev])
        setIsFileModalOpen(false)
        setNewFileName('')
      } else {
        toast.error(json.error || 'Failed to upload file')
      }
    } catch {
      toast.error('Network error uploading file')
    } finally {
      setIsUploadingFile(false)
    }
  }

  // Submit Evaluation
  const handleSubmitEvaluation = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmittingEval(true)
    try {
      const res = await fetch(`/api/projects/${projectId}/evaluations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          innovation: evalInnovation,
          feasibility: evalFeasibility,
          cost: evalCost,
          scalability: evalScalability,
          socialImpact: evalSocialImpact,
          recommendation: evalRecommendation,
          comments: evalComments.trim() || 'Comprehensive SIH 5-criteria technical evaluation completed.',
        }),
      })
      const json = await res.json()
      if (json.success && json.data) {
        toast.success('Evaluation rubric submitted successfully!')
        setEvaluations((prev) => [json.data, ...prev])
        setEvalComments('')
      } else {
        toast.error(json.error || 'Failed to submit evaluation')
      }
    } catch {
      toast.error('Network error submitting evaluation')
    } finally {
      setIsSubmittingEval(false)
    }
  }

  // Advance stage action
  const handleAdvanceStage = async () => {
    if (!project) return
    setIsAdvancing(true)
    try {
      const currentStage = (project.status || 'PROTOTYPE').toUpperCase()
      const currentIdx = CANONICAL_STAGES.indexOf(currentStage as any)
      const nextStage =
        currentIdx !== -1 && currentIdx < CANONICAL_STAGES.length - 1
          ? CANONICAL_STAGES[currentIdx + 1]
          : 'COMPLETED'

      const nextProgress = Math.min(
        100,
        Math.max(project.progressPercent + 20, Math.round(((currentIdx + 2) / CANONICAL_STAGES.length) * 100))
      )

      const res = await fetch(`/api/projects/${project.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: nextStage,
          progressPercent: nextProgress,
        }),
      })

      if (!res.ok) throw new Error('Failed to advance project stage')

      toast.success(`Project successfully advanced to ${nextStage}!`)
      setIsAdvanceModalOpen(false)
      await fetchProject()
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || 'Failed to advance stage')
    } finally {
      setIsAdvancing(false)
    }
  }

  // Complete milestone action
  const handleCompleteMilestone = async (milestoneId: string, milestoneTitle: string) => {
    setIsCompletingMilestone(milestoneId)
    try {
      const res = await fetch(`/api/milestones/${milestoneId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'COMPLETED',
          completionPct: 100,
          completedAt: new Date().toISOString(),
          reviewNotes: 'Verified and marked completed by project lead & technical mentor.',
        }),
      })

      if (!res.ok) throw new Error('Failed to update milestone')

      toast.success(`"${milestoneTitle}" marked as complete!`)
      await fetchProject()
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || 'Failed to complete milestone')
    } finally {
      setIsCompletingMilestone(null)
    }
  }

  // Move task status across 4 Kanban columns (TODO -> IN_PROGRESS -> REVIEW -> DONE)
  const handleMoveTask = async (taskId: string, currentStatus: string, direction: 'forward' | 'backward') => {
    const sequence = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE']
    const idx = sequence.indexOf(currentStatus)
    if (idx === -1) return
    const nextIdx = direction === 'forward' ? Math.min(sequence.length - 1, idx + 1) : Math.max(0, idx - 1)
    const nextStatus = sequence[nextIdx]

    if (nextStatus === currentStatus) return

    setProject((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        tasks: prev.tasks.map((t) => (t.id === taskId ? { ...t, status: nextStatus } : t)),
      }
    })

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      })

      if (!res.ok) throw new Error('Failed to update task status')

      toast.success(`Task moved to ${nextStatus.replace('_', ' ')}`)
    } catch (err: any) {
      console.error(err)
      toast.error('Failed to move task. Reverting...')
      fetchProject()
    }
  }

  // Create task
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskTitle.trim() || !project) {
      toast.error('Task title is required')
      return
    }

    setIsSubmittingTask(true)
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: project.id,
          title: newTaskTitle.trim(),
          description: newTaskDesc.trim() || null,
          priority: newTaskPriority,
          status: newTaskStatus,
          assigneeId: newTaskAssignee || null,
          dueDate: newTaskDueDate || null,
        }),
      })

      if (!res.ok) throw new Error('Failed to create task')

      toast.success('Task created successfully')
      setIsAddTaskModalOpen(false)
      setNewTaskTitle('')
      setNewTaskDesc('')
      setNewTaskDueDate('')
      await fetchProject()
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || 'Failed to create task')
    } finally {
      setIsSubmittingTask(false)
    }
  }

  // Download project summary
  const handleDownloadSummary = () => {
    if (!project) return
    const content = `CIVICSOLVE PROJECT IMPACT DOSSIER
==================================================
Project: ${project.title}
Stage: ${project.status}
Overall Progress: ${project.progressPercent}%
Academic Institution: ${project.university?.name || 'Autonomous Partner'}
Assigned Team: ${project.team?.name || 'Assigned Student Cohort'}

LINKED PROBLEM BRIEF:
Title: ${project.problem?.title}
Category: ${project.problem?.category}
Priority: ${project.problem?.priority}
Estimated Affected Population: ${project.problem?.affectedCount?.toLocaleString('en-IN') || 'N/A'}
Location: ${project.problem?.location?.district || ''}, ${project.problem?.location?.state || ''}

Description:
${project.problem?.description}

LIFECYCLE MILESTONES:
${project.milestones
  .map(
    (m) =>
      `[${m.status === 'COMPLETED' ? '✓' : ' '}] Step ${m.order}: ${m.title} (${m.status} - ${m.completionPct}%)`
  )
  .join('\n')}

DEPLOYMENT & VERIFIED IMPACT METRICS:
${
  project.deployments && project.deployments.length > 0
    ? project.deployments
        .map(
          (d) =>
            `Location: ${d.location || 'Field Site'}\nStatus: ${d.status}\nMetrics:\n` +
            (d.impactMetrics || [])
              .map(
                (im) =>
                  `  - ${im.metricName}: Before ${im.beforeValue} -> After ${im.afterValue} ${
                    im.unit || ''
                  } [${im.verified ? 'VERIFIED' : 'PENDING'}]`
              )
              .join('\n')
        )
        .join('\n\n')
    : 'Deployment pending final field integration.'
}

Generated automatically by CivicSolve Verification Platform (SIH26043).
Timestamp: ${new Date().toISOString()}
`
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${project.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_impact_summary.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    toast.success('Project Impact Summary downloaded')
  }

  // Filter tasks by 4-Column Agile Kanban
  const tasksByColumn = useMemo(() => {
    const tasks = project?.tasks || []
    return {
      todo: tasks.filter((t) => t.status === 'TODO'),
      inProgress: tasks.filter((t) => t.status === 'IN_PROGRESS'),
      review: tasks.filter((t) => t.status === 'REVIEW'),
      done: tasks.filter((t) => t.status === 'DONE'),
    }
  }, [project?.tasks])

  const mentor = project?.mentorships?.[0]?.faculty
  const primaryDeployment = project?.deployments?.[0]
  const primaryFunding = project?.fundingSupport?.[0]

  // Calculated weighted evaluation score
  const calculatedEvalScore = Math.round(
    (evalInnovation * 2.0 + evalFeasibility * 2.0 + evalCost * 1.5 + evalScalability * 2.0 + evalSocialImpact * 2.5) * 10
  ) / 10

  if (isLoading) {
    return (
      <AppShell>
        <div className="space-y-6 pb-12">
          <Skeleton className="h-6 w-32 rounded-md" />
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-8 space-y-4">
            <Skeleton className="h-8 w-2/3 rounded-lg" />
            <Skeleton className="h-4 w-1/3 rounded-md" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4">
              <Skeleton className="h-16 rounded-xl" />
              <Skeleton className="h-16 rounded-xl" />
              <Skeleton className="h-16 rounded-xl" />
              <Skeleton className="h-16 rounded-xl" />
            </div>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-10 w-28 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      </AppShell>
    )
  }

  if (error || !project) {
    return (
      <AppShell>
        <div className="py-16 text-center space-y-4">
          <div className="h-16 w-16 mx-auto rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
            <AlertCircle className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-white">Project Unavailable</h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            {error || 'Unable to locate the specified project workspace. It may have been relocated or removed.'}
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link href="/projects">
              <Button variant="secondary" size="sm">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Projects
              </Button>
            </Link>
            <Button size="sm" onClick={() => fetchProject()}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Try Again
            </Button>
          </div>
        </div>
      </AppShell>
    )
  }

  const nextStageTarget =
    CANONICAL_STAGES[Math.min(CANONICAL_STAGES.length - 1, (STAGE_ORDER_MAP[project.status] || 1))]

  const tabs: { id: TabType; label: string; count?: number }[] = [
    { id: 'overview', label: 'Overview & Architecture' },
    { id: 'proposal', label: 'Proposal Review' },
    { id: 'milestones', label: 'Milestones & Pipeline', count: project.milestones.length },
    { id: 'tasks', label: 'Agile Tasks', count: project.tasks.length },
    { id: 'evaluation', label: '5-Criteria Evaluation', count: evaluations.length },
    { id: 'team', label: 'Team & Mentors', count: project.team?.members.length || 0 },
    { id: 'chat', label: 'Team Chat', count: chatMessages.length },
    { id: 'files', label: 'Project Files', count: files.length },
    { id: 'impact', label: 'Deployment & Impact' },
  ]

  return (
    <AppShell>
      <div className="space-y-8 pb-16">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Projects Directory</span>
          </Link>

          <div className="flex items-center gap-2">
            <ProjectCopilotButton title="Ask Civic AI Copilot" />

            <Button
              variant="secondary"
              size="sm"
              onClick={() => fetchProject()}
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1 text-slate-400" />
              Sync
            </Button>

            <Button
              size="sm"
              variant="default"
              onClick={() => setIsAdvanceModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-lg"
            >
              <Sparkles className="h-3.5 w-3.5 mr-1 text-blue-200" />
              Advance Stage
            </Button>
          </div>
        </div>

        {/* Top Header Card */}
        <div className="rounded-xl border border-slate-800 bg-[#111726] p-6 md:p-8 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2.5">
                <Badge status={project.status} size="md" dot>
                  {project.status}
                </Badge>

                {project.problem?.category && (
                  <Badge variant="outline" size="md" className="text-xs text-slate-300">
                    {project.problem.category}
                  </Badge>
                )}

                <span className="text-xs text-slate-500 font-mono">ID: {project.id.slice(-8)}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                {project.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300">
                <div className="flex items-center gap-1.5 font-medium text-slate-200">
                  <Users className="h-4 w-4 text-blue-400" />
                  <span>{project.team?.name || 'Student Engineering Team'}</span>
                </div>

                <span className="text-slate-600">•</span>

                <div className="flex items-center gap-1.5 text-slate-300">
                  <Building2 className="h-4 w-4 text-indigo-400" />
                  <span>
                    {project.university?.name ||
                      project.university?.shortName ||
                      'Academic Research Partner'}
                  </span>
                </div>

                <span className="text-slate-600">•</span>

                <div className="flex items-center gap-1.5 text-slate-400">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span>
                    {project.targetDate
                      ? `Target: ${new Date(project.targetDate).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}`
                      : 'Rolling Deployment'}
                  </span>
                </div>
              </div>
            </div>

            {/* Circular Progress Dial */}
            <div className="flex items-center gap-6 shrink-0 bg-slate-900/80 border border-white/5 p-4 rounded-2xl backdrop-blur-md">
              <div className="relative flex items-center justify-center">
                <svg className="h-20 w-20 -rotate-90 transform" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-slate-800"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 - (251.2 * project.progressPercent) / 100}
                    strokeLinecap="round"
                    className="text-cyan-400 transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-lg font-extrabold text-white leading-none">
                    {project.progressPercent}%
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold mt-0.5">
                    Progress
                  </span>
                </div>
              </div>

              <div className="space-y-1 pr-2">
                <span className="text-xs text-slate-400 font-medium block">Lifecycle Stage</span>
                <span className="text-sm font-bold text-white block">
                  {project.status === 'COMPLETED' ? 'Fully Delivered' : project.status}
                </span>
                <span className="text-[11px] text-cyan-400 block font-medium">
                  {project.milestones.filter((m) => m.status === 'COMPLETED').length} of {project.milestones.length} Milestones Done
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 9-Tab Navigation Bar */}
        <div className="border-b border-white/10 pb-0">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'relative flex items-center gap-2 pb-3.5 pt-2 px-3 text-sm font-semibold transition-colors border-b-2 whitespace-nowrap',
                    isActive
                      ? 'text-blue-400 border-blue-500'
                      : 'text-slate-400 border-transparent hover:text-slate-200 hover:border-slate-700'
                  )}
                >
                  <span>{tab.label}</span>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span
                      className={cn(
                        'px-1.5 py-0.2 rounded-full text-[10px] font-bold',
                        isActive ? 'bg-blue-500/20 text-blue-300' : 'bg-slate-800 text-slate-400'
                      )}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* TAB 1: OVERVIEW & ARCHITECTURE */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card className="p-6 space-y-4 border-white/10 bg-slate-900/70">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <FileText className="h-4 w-4 text-cyan-400" />
                      High-Level Solution Architecture
                    </h3>
                    <Badge variant="outline" size="sm" className="text-cyan-400 border-cyan-500/30">
                      Engineering Blueprint
                    </Badge>
                  </div>

                  <p className="text-sm text-slate-300 leading-relaxed">
                    This project executes a closed-loop civic intervention tailored for regional operating constraints.
                    The solution integrates low-power hardware sensing nodes, edge-computed validation telemetry, and an
                    accessible digital reporting interface coordinated directly with local administrative bodies.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div className="rounded-xl border border-white/5 bg-slate-800/40 p-3">
                      <span className="text-xs text-slate-400 font-medium block">Current Phase</span>
                      <span className="text-sm font-bold text-cyan-300 mt-0.5 block">{project.status}</span>
                    </div>
                    <div className="rounded-xl border border-white/5 bg-slate-800/40 p-3">
                      <span className="text-xs text-slate-400 font-medium block">Started Date</span>
                      <span className="text-sm font-bold text-white mt-0.5 block">
                        {new Date(project.startDate).toLocaleDateString('en-IN', {
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="rounded-xl border border-white/5 bg-slate-800/40 p-3">
                      <span className="text-xs text-slate-400 font-medium block">Target Delivery</span>
                      <span className="text-sm font-bold text-white mt-0.5 block">
                        {project.targetDate
                          ? new Date(project.targetDate).toLocaleDateString('en-IN', {
                              month: 'short',
                              year: 'numeric',
                            })
                          : 'Ongoing'}
                      </span>
                    </div>
                  </div>
                </Card>

                {project.problem && (
                  <Card className="p-6 space-y-4 border-white/10 bg-slate-900/70">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-400" />
                        <h3 className="text-base font-bold text-white">Linked Societal Problem Brief</h3>
                      </div>

                      <Link href={`/problems/${project.problem.id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 text-xs"
                        >
                          View Full Dossier
                          <ExternalLink className="h-3.5 w-3.5 ml-1" />
                        </Button>
                      </Link>
                    </div>

                    <div className="rounded-xl bg-slate-800/50 p-4 border border-white/5 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className="text-sm font-bold text-slate-100">{project.problem.title}</h4>
                        <div className="flex items-center gap-2">
                          <Badge priority={project.problem.priority as any} size="sm">
                            {project.problem.priority}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                        {project.problem.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2 border-t border-white/5">
                        {project.problem.affectedCount && (
                          <span className="flex items-center gap-1 font-semibold text-slate-300">
                            <Users className="h-3.5 w-3.5 text-blue-400" />
                            {project.problem.affectedCount.toLocaleString('en-IN')} Citizens Affected
                          </span>
                        )}

                        {project.problem.location && (
                          <span className="flex items-center gap-1 text-slate-300">
                            <MapPin className="h-3.5 w-3.5 text-red-400" />
                            {project.problem.location.district || ''}, {project.problem.location.state || ''}
                          </span>
                        )}
                      </div>
                    </div>
                  </Card>
                )}
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <Card className="p-5 border-blue-500/30 bg-gradient-to-br from-blue-950/40 to-slate-900 shadow-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                      Lifecycle Control
                    </span>
                    <Badge variant="outline" size="sm" className="text-[10px]">
                      Step {STAGE_ORDER_MAP[project.status] || 1}/5
                    </Badge>
                  </div>

                  <h4 className="text-base font-bold text-white">Advance Project Stage</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Ready to move from <span className="font-semibold text-white">{project.status}</span> to{' '}
                    <span className="font-semibold text-cyan-300">{nextStageTarget}</span>? This will notify faculty
                    mentors, community stakeholders, and unlock next-stage deliverables.
                  </p>

                  <Button
                    className="w-full mt-2"
                    size="sm"
                    onClick={() => setIsAdvanceModalOpen(true)}
                  >
                    Advance to {nextStageTarget}
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </Card>

                {mentor && (
                  <Card className="p-5 border-white/10 bg-slate-900/70 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                        <GraduationCap className="h-4 w-4 text-purple-400" />
                        Academic Faculty Mentor
                      </h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-semibold border border-emerald-500/30">
                        Active
                      </span>
                    </div>

                    <div className="rounded-xl bg-slate-800/50 p-3.5 border border-white/5 space-y-2">
                      <div className="flex items-center gap-3">
                        <Avatar name={mentor.user.name} size="md" />
                        <div>
                          <p className="text-sm font-bold text-white">{mentor.user.name}</p>
                          <p className="text-xs text-slate-400">
                            {mentor.designation || 'Professor'} •{' '}
                            {mentor.university?.shortName || project.university?.shortName || 'Faculty Advisory'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PROPOSAL REVIEW & ACTIONS */}
        {activeTab === 'proposal' && (
          <div className="space-y-6">
            <Card className="p-6 border-white/10 bg-slate-900/80 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white">Engineering Proposal & Blueprint</h3>
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-xs font-semibold',
                        proposalStatus === 'APPROVED'
                          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                          : 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                      )}
                    >
                      {proposalStatus}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Submitted by {project.team?.name || 'Project Squad'} • Reviewed under SIH Technical Evaluation Guidelines
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      setProposalStatus('APPROVED')
                      toast.success('Proposal formally approved by Academic Evaluator!')
                    }}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                  >
                    <ThumbsUp className="h-3.5 w-3.5 mr-1" />
                    Approve Proposal
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setProposalStatus('REVISIONS_REQUESTED')
                      toast.info('Clarification request sent to team leader.')
                    }}
                    className="border-white/10 text-xs text-slate-300"
                  >
                    <RotateCcw className="h-3.5 w-3.5 mr-1" />
                    Request Revisions
                  </Button>
                </div>
              </div>

              {/* Proposal Content Dossier */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div className="space-y-4">
                  <div className="rounded-xl bg-black/40 border border-white/5 p-4 space-y-2">
                    <h4 className="font-bold text-cyan-300 flex items-center gap-1.5 text-sm">
                      <Cpu className="h-4 w-4" />
                      Technical Architecture & Sensors
                    </h4>
                    <p className="text-slate-300 leading-relaxed">
                      Modular IoT edge hardware based on ESP32 microcontrollers with LoRaWAN wireless telemetry (865-867 MHz frequency band). Incorporates automated electrochemical water filtration adsorbents calibrated for arsenic and fluoride reduction down to WHO standards (&lt;1.0 mg/L).
                    </p>
                  </div>

                  <div className="rounded-xl bg-black/40 border border-white/5 p-4 space-y-2">
                    <h4 className="font-bold text-amber-300 flex items-center gap-1.5 text-sm">
                      <Coins className="h-4 w-4" />
                      Bill of Materials (BOM) & Frugal Budget
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-slate-300">
                      <li>20x Custom Submersible Sensor Nodes: ₹45,000</li>
                      <li>Electro-chemical Adsorption Cartridges (Pack of 50): ₹30,000</li>
                      <li>Solar Micro-Inverter & 100W Panel: ₹18,500</li>
                      <li>LoRa Gateway & Cloud Telemetry Sink: ₹12,000</li>
                      <li className="font-bold text-white pt-1">Total Estimated BOM: ₹1,05,500</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-xl bg-black/40 border border-white/5 p-4 space-y-2">
                    <h4 className="font-bold text-emerald-300 flex items-center gap-1.5 text-sm">
                      <MapPin className="h-4 w-4" />
                      Field Sandbox & Deployment Protocol
                    </h4>
                    <p className="text-slate-300 leading-relaxed">
                      Pilot testing staged across 4 gram panchayat public water handpumps in Sinnar, Nashik. Community health workers (ASHA) trained to interpret telemetry LCD indicators and alert village water committees upon filter saturation.
                    </p>
                  </div>

                  <div className="rounded-xl bg-black/40 border border-white/5 p-4 space-y-2">
                    <h4 className="font-bold text-purple-300 flex items-center gap-1.5 text-sm">
                      <ShieldCheck className="h-4 w-4" />
                      Civic ROI & Sustainability Model
                    </h4>
                    <p className="text-slate-300 leading-relaxed">
                      Provides immediate clean drinking water access to 2,500+ citizens, eliminating chronic fluorosis risks and reducing healthcare expenditures by an estimated ₹6.5 Lakhs annually for the local administration.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* TAB 3: MILESTONES & VERTICAL LIFECYCLE STEPPER */}
        {activeTab === 'milestones' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-cyan-400 font-bold">LIFECYCLE STEPPER //</span>
                  <h3 className="text-base font-mono font-bold text-slate-100 uppercase tracking-wider">
                    Project Milestones & Verification Trail
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Sequential delivery pipeline verified by academic faculty mentors and district authorities.
                </p>
              </div>

              <span className="font-mono text-xs px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300 font-bold">
                {project.milestones.filter((m) => m.status === 'COMPLETED').length} of {project.milestones.length} Completed
              </span>
            </div>

            {/* Vertical Line Stepper */}
            <div className="relative pl-6 sm:pl-8 space-y-6 border-l-2 border-slate-800 ml-4 sm:ml-6 my-4">
              {project.milestones.map((m, idx) => {
                const isDone = m.status === 'COMPLETED'
                const isCurrent = m.status === 'IN_PROGRESS'

                return (
                  <div key={m.id} className="relative group">
                    {/* Node Circle on the Line */}
                    <div
                      className={cn(
                        'absolute -left-[31px] sm:-left-[39px] top-1.5 h-6 w-6 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all',
                        isDone
                          ? 'bg-emerald-500 text-slate-950 ring-4 ring-emerald-500/20'
                          : isCurrent
                          ? 'bg-white text-slate-950 ring-4 ring-white/20'
                          : 'bg-[#0d1117] border border-slate-700 text-slate-500'
                      )}
                    >
                      {isDone ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : idx + 1}
                    </div>

                    {/* Milestone Item Container */}
                    <div
                      className={cn(
                        'p-5 rounded-lg border transition-all space-y-3',
                        isDone
                          ? 'border-emerald-500/20 bg-[#0d1117]/80'
                          : isCurrent
                          ? 'border-cyan-500/40 bg-[#0d1117] shadow-sm'
                          : 'border-slate-800 bg-[#08090c]'
                      )}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-slate-500">STAGE 0{idx + 1}</span>
                            <h4 className="text-base font-bold text-slate-100">{m.title}</h4>
                            <span
                              className={cn(
                                'font-mono text-[10px] px-2 py-0.5 rounded border uppercase',
                                isDone
                                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                                  : isCurrent
                                  ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300'
                                  : 'border-slate-800 bg-slate-900 text-slate-400'
                              )}
                            >
                              {m.status}
                            </span>
                          </div>
                          {m.type && (
                            <p className="font-mono text-[11px] text-slate-400">Deliverable Vector: {m.type}</p>
                          )}
                        </div>

                        {/* Action CTA */}
                        <div className="shrink-0">
                          {isDone ? (
                            <span className="inline-flex items-center gap-1.5 font-mono text-xs text-emerald-400 px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/20">
                              <Check className="h-3.5 w-3.5" />
                              Empirically Verified
                            </span>
                          ) : (
                            <Button
                              size="sm"
                              variant={isCurrent ? 'default' : 'outline'}
                              onClick={() => handleCompleteMilestone(m.id, m.title)}
                              isLoading={isCompletingMilestone === m.id}
                              className={cn(
                                'h-8 text-xs font-semibold',
                                isCurrent
                                  ? 'bg-white hover:bg-slate-200 text-slate-950 font-bold'
                                  : 'border-slate-800 text-slate-300 hover:text-white'
                              )}
                            >
                              <Check className="h-3.5 w-3.5 mr-1" />
                              Mark as Complete
                            </Button>
                          )}
                        </div>
                      </div>

                      {m.reviewNotes && (
                        <div className="p-3 rounded border border-slate-800 bg-[#08090c] text-xs text-slate-300">
                          <span className="font-semibold text-slate-400 font-mono text-[11px] block">Mentor Verification Note:</span>
                          <span className="mt-0.5 block">{m.reviewNotes}</span>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-500 pt-1 border-t border-slate-800/60">
                        {m.completedAt ? (
                          <span className="text-emerald-400">
                            Completed on {new Date(m.completedAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                          </span>
                        ) : m.dueDate ? (
                          <span>Target: {new Date(m.dueDate).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
                        ) : (
                          <span>Target: Sprint Cadence</span>
                        )}
                        <span>•</span>
                        <span>{m.completionPct}% Progress</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* TAB 4: AGILE TASKS (Compact 4-Column Kanban) */}
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-cyan-400 font-bold">SPRINT BOARD //</span>
                  <h3 className="text-base font-mono font-bold text-slate-100 uppercase tracking-wider">
                    Agile Engineering Tasks
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Compact 4-column workflow across sprint execution, lab QA, and field verification.
                </p>
              </div>

              <Button
                size="sm"
                onClick={() => setIsAddTaskModalOpen(true)}
                className="bg-white hover:bg-slate-200 text-slate-950 font-bold text-xs h-8"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add Task
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Column 1: To Do */}
              <div className="space-y-3 rounded-lg border border-slate-800 bg-[#0d1117] p-3">
                <div className="flex items-center justify-between px-1 pb-2 border-b border-slate-800/80">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400">01 // To Do</span>
                  <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">{tasksByColumn.todo.length}</span>
                </div>
                <div className="space-y-2">
                  {tasksByColumn.todo.map((task) => (
                    <div key={task.id} className="p-3 rounded border border-slate-800/90 bg-[#08090c] space-y-2 hover:border-slate-700 transition-colors">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-semibold text-slate-200 leading-snug">{task.title}</span>
                        <Badge priority={task.priority as any} size="sm">{task.priority}</Badge>
                      </div>
                      {task.description && (
                        <p className="text-[11px] text-slate-400 line-clamp-2">{task.description}</p>
                      )}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-500">
                        <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : 'No due date'}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 text-[11px] text-cyan-400 p-1 hover:bg-slate-800"
                          onClick={() => handleMoveTask(task.id, 'TODO', 'forward')}
                        >
                          Start →
                        </Button>
                      </div>
                    </div>
                  ))}
                  {tasksByColumn.todo.length === 0 && (
                    <div className="py-6 text-center text-[11px] text-slate-600 font-mono">No tasks in backlog</div>
                  )}
                </div>
              </div>

              {/* Column 2: In Progress */}
              <div className="space-y-3 rounded-lg border border-slate-800 bg-[#0d1117] p-3">
                <div className="flex items-center justify-between px-1 pb-2 border-b border-slate-800/80">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-400">02 // In Progress</span>
                  <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 font-bold">{tasksByColumn.inProgress.length}</span>
                </div>
                <div className="space-y-2">
                  {tasksByColumn.inProgress.map((task) => (
                    <div key={task.id} className="p-3 rounded border border-cyan-500/30 bg-[#08090c] space-y-2 shadow-sm">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-semibold text-slate-100 leading-snug">{task.title}</span>
                        <Badge priority={task.priority as any} size="sm">{task.priority}</Badge>
                      </div>
                      {task.description && (
                        <p className="text-[11px] text-slate-400 line-clamp-2">{task.description}</p>
                      )}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px] font-mono">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 text-[11px] text-slate-400 p-1 hover:bg-slate-800"
                          onClick={() => handleMoveTask(task.id, 'IN_PROGRESS', 'backward')}
                        >
                          ← Back
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 text-[11px] text-purple-400 p-1 hover:bg-slate-800"
                          onClick={() => handleMoveTask(task.id, 'IN_PROGRESS', 'forward')}
                        >
                          Review →
                        </Button>
                      </div>
                    </div>
                  ))}
                  {tasksByColumn.inProgress.length === 0 && (
                    <div className="py-6 text-center text-[11px] text-slate-600 font-mono">No active tasks</div>
                  )}
                </div>
              </div>

              {/* Column 3: Review / QA */}
              <div className="space-y-3 rounded-lg border border-slate-800 bg-[#0d1117] p-3">
                <div className="flex items-center justify-between px-1 pb-2 border-b border-slate-800/80">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-purple-400">03 // Review & QA</span>
                  <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-purple-950/40 border border-purple-500/30 text-purple-300 font-bold">{tasksByColumn.review.length}</span>
                </div>
                <div className="space-y-2">
                  {tasksByColumn.review.map((task) => (
                    <div key={task.id} className="p-3 rounded border border-purple-500/30 bg-[#08090c] space-y-2 shadow-sm">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-semibold text-slate-100 leading-snug">{task.title}</span>
                        <Badge priority={task.priority as any} size="sm">{task.priority}</Badge>
                      </div>
                      {task.description && (
                        <p className="text-[11px] text-slate-400 line-clamp-2">{task.description}</p>
                      )}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px] font-mono">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 text-[11px] text-slate-400 p-1 hover:bg-slate-800"
                          onClick={() => handleMoveTask(task.id, 'REVIEW', 'backward')}
                        >
                          ← Back
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 text-[11px] text-emerald-400 p-1 hover:bg-slate-800"
                          onClick={() => handleMoveTask(task.id, 'REVIEW', 'forward')}
                        >
                          Verify Done ✓
                        </Button>
                      </div>
                    </div>
                  ))}
                  {tasksByColumn.review.length === 0 && (
                    <div className="py-6 text-center text-[11px] text-slate-600 font-mono">No tasks in review</div>
                  )}
                </div>
              </div>

              {/* Column 4: Completed */}
              <div className="space-y-3 rounded-lg border border-slate-800 bg-[#0d1117] p-3">
                <div className="flex items-center justify-between px-1 pb-2 border-b border-slate-800/80">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-400">04 // Done</span>
                  <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 font-bold">{tasksByColumn.done.length}</span>
                </div>
                <div className="space-y-2">
                  {tasksByColumn.done.map((task) => (
                    <div key={task.id} className="p-3 rounded border border-emerald-500/20 bg-[#08090c] space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-medium text-slate-400 line-through leading-snug">{task.title}</span>
                        <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-500">
                        <span className="text-emerald-400">Verified</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 text-[11px] text-slate-500 hover:text-slate-300 p-1 hover:bg-slate-800"
                          onClick={() => handleMoveTask(task.id, 'DONE', 'backward')}
                        >
                          ← Reopen
                        </Button>
                      </div>
                    </div>
                  ))}
                  {tasksByColumn.done.length === 0 && (
                    <div className="py-6 text-center text-[11px] text-slate-600 font-mono">No completed tasks</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: 5-CRITERIA EXPERT EVALUATION */}
        {activeTab === 'evaluation' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Form */}
              <div className="lg:col-span-6 space-y-6">
                <Card className="p-6 border-amber-500/30 bg-slate-900/80 space-y-5">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Star className="h-5 w-5 text-amber-400" />
                        Official 5-Criteria Evaluation Engine
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Accredited faculty & SIH judge scoring matrix (0 to 10 Scale)
                      </p>
                    </div>

                    <Badge variant="outline" className="border-amber-400/40 text-amber-300 font-bold text-sm">
                      Preview: {calculatedEvalScore} / 100
                    </Badge>
                  </div>

                  <form onSubmit={handleSubmitEvaluation} className="space-y-4 text-xs">
                    {/* Criterion 1 */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-slate-300 font-medium">
                        <span>1. Innovation & Novelty (Weight 20%)</span>
                        <span className="font-bold text-amber-400">{evalInnovation} / 10</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={evalInnovation}
                        onChange={(e) => setEvalInnovation(parseInt(e.target.value))}
                        className="w-full accent-amber-400 cursor-pointer"
                      />
                    </div>

                    {/* Criterion 2 */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-slate-300 font-medium">
                        <span>2. Technical Feasibility & Reliability (Weight 20%)</span>
                        <span className="font-bold text-cyan-400">{evalFeasibility} / 10</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={evalFeasibility}
                        onChange={(e) => setEvalFeasibility(parseInt(e.target.value))}
                        className="w-full accent-cyan-400 cursor-pointer"
                      />
                    </div>

                    {/* Criterion 3 */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-slate-300 font-medium">
                        <span>3. Frugal Cost & Economic Viability (Weight 15%)</span>
                        <span className="font-bold text-emerald-400">{evalCost} / 10</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={evalCost}
                        onChange={(e) => setEvalCost(parseInt(e.target.value))}
                        className="w-full accent-emerald-400 cursor-pointer"
                      />
                    </div>

                    {/* Criterion 4 */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-slate-300 font-medium">
                        <span>4. Scalability & Regional Transferability (Weight 20%)</span>
                        <span className="font-bold text-purple-400">{evalScalability} / 10</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={evalScalability}
                        onChange={(e) => setEvalScalability(parseInt(e.target.value))}
                        className="w-full accent-purple-400 cursor-pointer"
                      />
                    </div>

                    {/* Criterion 5 */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-slate-300 font-medium">
                        <span>5. Measurable Societal Impact & Civic ROI (Weight 25%)</span>
                        <span className="font-bold text-rose-400">{evalSocialImpact} / 10</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={evalSocialImpact}
                        onChange={(e) => setEvalSocialImpact(parseInt(e.target.value))}
                        className="w-full accent-rose-400 cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-1 font-medium">Formal Recommendation</label>
                      <select
                        value={evalRecommendation}
                        onChange={(e) => setEvalRecommendation(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-[#0f172a] px-3 py-2 text-white focus:border-amber-400 focus:outline-none"
                      >
                        <option value="RECOMMENDED_FOR_PILOT">Recommended for Municipal Pilot Deployment</option>
                        <option value="APPROVED">Approved for Hackathon Finals</option>
                        <option value="NEEDS_REVISION">Revisions Required Before Field Testing</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-1 font-medium">Judge Evaluation Comments & Notes</label>
                      <textarea
                        rows={3}
                        placeholder="Detail technical strengths, BOM justification, calibration recommendations..."
                        value={evalComments}
                        onChange={(e) => setEvalComments(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-[#0f172a] px-3 py-2 text-white focus:border-amber-400 focus:outline-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmittingEval}
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold"
                    >
                      {isSubmittingEval ? 'Submitting Evaluation...' : 'Submit Official Evaluation Score'}
                    </Button>
                  </form>
                </Card>
              </div>

              {/* Right Column: Historical Evaluations */}
              <div className="lg:col-span-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">Recorded Evaluations & Audits</h3>
                  <span className="text-xs text-slate-400">{evaluations.length} Reviews</span>
                </div>

                {evaluations.length === 0 ? (
                  <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8 text-center text-xs text-slate-400">
                    No expert evaluation records logged yet. Be the first to evaluate this solution.
                  </div>
                ) : (
                  evaluations.map((ev) => (
                    <Card key={ev.id} className="p-5 border-white/10 bg-slate-900/70 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-bold text-white text-sm">{ev.evaluatorName}</div>
                          <div className="text-[11px] text-slate-400">{ev.evaluatorRole}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-extrabold text-amber-400">{ev.overallScore} / 100</div>
                          <Badge variant="outline" className="border-teal-500/30 text-teal-300 text-[10px]">
                            {ev.recommendation.replace(/_/g, ' ')}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-5 gap-1.5 text-center text-[10px] pt-1">
                        <div className="p-1.5 rounded bg-white/5">
                          <div className="text-slate-400">Innov</div>
                          <div className="font-bold text-white">{ev.innovation}/10</div>
                        </div>
                        <div className="p-1.5 rounded bg-white/5">
                          <div className="text-slate-400">Feas</div>
                          <div className="font-bold text-white">{ev.feasibility}/10</div>
                        </div>
                        <div className="p-1.5 rounded bg-white/5">
                          <div className="text-slate-400">Cost</div>
                          <div className="font-bold text-white">{ev.cost}/10</div>
                        </div>
                        <div className="p-1.5 rounded bg-white/5">
                          <div className="text-slate-400">Scale</div>
                          <div className="font-bold text-white">{ev.scalability}/10</div>
                        </div>
                        <div className="p-1.5 rounded bg-white/5">
                          <div className="text-slate-400">Social</div>
                          <div className="font-bold text-white">{ev.socialImpact}/10</div>
                        </div>
                      </div>

                      {ev.comments && (
                        <p className="text-xs text-slate-300 italic pt-1 border-t border-white/5">
                          &quot;{ev.comments}&quot;
                        </p>
                      )}
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: TEAM & MENTORS */}
        {activeTab === 'team' && (
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">Project Engineering Team</h3>
                  <p className="text-xs text-slate-400">
                    Students and interdisciplinary researchers assigned from{' '}
                    {project.university?.shortName || project.university?.name || 'Academic Institution'}.
                  </p>
                </div>

                <Badge variant="outline" size="sm" className="text-slate-300">
                  {project.team?.name || 'Assigned Cohort'}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {project.team?.members && project.team.members.length > 0 ? (
                  project.team.members.map((member) => {
                    const sp = member.user.studentProfile
                    const skills = sp?.skills ? parseSkills(sp.skills) : []

                    return (
                      <Card key={member.id} className="p-5 border-white/10 bg-slate-900/80 space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar name={member.user.name} size="lg" />
                            <div>
                              <h4 className="text-base font-bold text-white">{member.user.name}</h4>
                              <p className="text-xs text-slate-400">
                                {member.role === 'LEADER' ? 'Team Lead' : 'Engineering Fellow'}
                              </p>
                            </div>
                          </div>

                          <Badge
                            variant={member.role === 'LEADER' ? 'primary' : 'secondary'}
                            size="sm"
                          >
                            {member.role}
                          </Badge>
                        </div>

                        {member.user.bio && (
                          <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                            {member.user.bio}
                          </p>
                        )}

                        <div className="text-xs text-slate-400 font-mono">
                          {member.user.email}
                        </div>

                        {skills.length > 0 && (
                          <div className="pt-2 border-t border-white/5 space-y-1.5">
                            <span className="text-[11px] text-slate-400 block font-medium">Domain Skills</span>
                            <div className="flex flex-wrap gap-1">
                              {skills.slice(0, 4).map((skill, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-white/5"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </Card>
                    )
                  })
                ) : (
                  <div className="col-span-3 p-8 text-center text-slate-400 border border-dashed border-white/10 rounded-2xl">
                    No individual student members registered yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: TEAM CHAT */}
        {activeTab === 'chat' && (
          <div className="space-y-4">
            <Card className="flex flex-col h-[560px] border-white/10 bg-slate-900/80 p-0 overflow-hidden shadow-2xl">
              {/* Chat Header */}
              <div className="p-4 border-b border-white/10 bg-black/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
                  <div>
                    <h3 className="text-sm font-bold text-white">Project Collaboration Channel</h3>
                    <p className="text-[11px] text-slate-400">Encrypted workspace chat for team members & mentors</p>
                  </div>
                </div>
                <Badge variant="outline" className="border-teal-500/30 text-teal-300 text-xs">
                  {chatMessages.length} Messages
                </Badge>
              </div>

              {/* Chat Thread */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
                {chatMessages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400">
                    <MessageSquare className="h-10 w-10 text-slate-600 mb-2" />
                    <p className="text-xs">No chat messages yet. Start the conversation with your squad!</p>
                  </div>
                ) : (
                  chatMessages.map((msg) => (
                    <div key={msg.id} className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                        {msg.sender?.name ? msg.sender.name.charAt(0) : 'U'}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{msg.sender?.name || 'Teammate'}</span>
                          <span className="text-[10px] text-teal-300 bg-teal-500/10 border border-teal-500/20 px-1.5 py-0.2 rounded">
                            {msg.sender?.role || 'STUDENT'}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className="text-xs text-slate-200 bg-white/5 rounded-xl rounded-tl-none p-3 border border-white/5 inline-block max-w-xl">
                          {msg.content}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendChat} className="p-3 bg-black/50 border-t border-white/10 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Share a milestone update, telemetry result, or message mentors..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 rounded-xl border border-white/10 bg-[#0f172a] px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none"
                />
                <Button
                  type="submit"
                  disabled={isSendingChat || !chatInput.trim()}
                  className="bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold px-4"
                >
                  <Send className="h-3.5 w-3.5" />
                </Button>
              </form>
            </Card>
          </div>
        )}

        {/* TAB 8: PROJECT FILES */}
        {activeTab === 'files' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Project Documents & Schematics</h3>
                <p className="text-xs text-slate-400">Engineering drawings, firmware code, and empirical water test datasets.</p>
              </div>

              <Button
                size="sm"
                onClick={() => setIsFileModalOpen(true)}
                className="bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold"
              >
                <Upload className="h-3.5 w-3.5 mr-1" />
                Upload Document
              </Button>
            </div>

            {files.length === 0 ? (
              <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-12 text-center text-slate-400">
                <Paperclip className="mx-auto h-12 w-12 text-slate-600 mb-3" />
                <h4 className="text-sm font-semibold text-white">No files uploaded yet</h4>
                <p className="text-xs text-slate-400 mt-1">Upload CAD models, PCB schematics, and pilot lab test reports.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {files.map((file) => (
                  <Card key={file.id} className="p-4 border-white/10 bg-slate-900/80 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="h-9 w-9 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-300">
                          {file.fileType === 'SCHEMATIC' ? <FileCode className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                        </div>
                        <div className="truncate">
                          <span className="font-bold text-white text-xs block truncate">{file.name}</span>
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider">{file.fileType}</span>
                        </div>
                      </div>

                      <Badge variant="outline" className="border-white/10 text-slate-400 text-[10px]">
                        {(file.sizeBytes / 1048576).toFixed(1)} MB
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] text-slate-400">
                      <span>By {file.uploadedBy}</span>
                      <a
                        href={file.url}
                        download
                        onClick={() => toast.success(`Downloading ${file.name}`)}
                        className="text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1"
                      >
                        <Download className="h-3 w-3" /> Download
                      </a>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 9: DEPLOYMENT & IMPACT */}
        {activeTab === 'impact' && (
          <div className="space-y-8">
            <Card className="p-6 border-white/10 bg-slate-900/80 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                    Field Deployment Status
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1">
                    {primaryDeployment
                      ? primaryDeployment.location || 'Municipal Field Deployment'
                      : 'Deployment Staging & Field Readiness'}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={handleDownloadSummary}
                  >
                    <Download className="h-3.5 w-3.5 mr-1" />
                    Download Impact Summary
                  </Button>

                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => setIsCertificateModalOpen(true)}
                    className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold"
                  >
                    <Award className="h-3.5 w-3.5 mr-1" />
                    View Certificate
                  </Button>
                </div>
              </div>

              {primaryDeployment && primaryDeployment.impactMetrics && primaryDeployment.impactMetrics.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
                  {primaryDeployment.impactMetrics.map((m) => (
                    <div key={m.id} className="p-4 rounded-xl bg-black/40 border border-teal-500/20 space-y-1">
                      <span className="text-xs text-slate-400 font-medium">{m.metricName}</span>
                      <div className="text-lg font-extrabold text-teal-300">
                        {m.beforeValue} ➔ {m.afterValue} {m.unit}
                      </div>
                      <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 text-[10px]">
                        {m.verified ? 'Empirically Verified' : 'Audit Pending'}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}

        {/* MODAL: ADVANCE STAGE */}
        <Modal
          isOpen={isAdvanceModalOpen}
          onClose={() => setIsAdvanceModalOpen(false)}
          title="Advance Project Stage"
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-800/50 border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Current Stage:</span>
                <span className="font-bold text-white">{project.status}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Advancing To:</span>
                <span className="font-bold text-cyan-300">{nextStageTarget}</span>
              </div>
            </div>

            <p className="text-slate-300 leading-relaxed">
              Advancing the stage validates that technical milestone prerequisites have been reviewed by academic mentors
              and ready for community or municipal progression.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setIsAdvanceModalOpen(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                isLoading={isAdvancing}
                onClick={handleAdvanceStage}
                className="bg-teal-600 hover:bg-teal-500 text-white font-semibold"
              >
                Confirm Advancement
              </Button>
            </div>
          </div>
        </Modal>

        {/* MODAL: ADD TASK */}
        <Modal
          isOpen={isAddTaskModalOpen}
          onClose={() => setIsAddTaskModalOpen(false)}
          title="Add Agile Task"
        >
          <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 mb-1 font-medium">Task Title *</label>
              <input
                id="taskTitle"
                name="taskTitle"
                type="text"
                placeholder="Task title, e.g. Fabricate waterproof sensor enclosure"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                required
                className="w-full rounded-xl border border-white/10 bg-[#0f172a] px-3 py-2 text-white focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-medium">Description</label>
              <textarea
                rows={3}
                placeholder="Details on requirements, acceptance criteria, or component references..."
                value={newTaskDesc}
                onChange={(e) => setNewTaskDesc(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#0f172a] px-3 py-2 text-white focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Priority</label>
                <select
                  value={newTaskPriority}
                  onChange={(e) => setNewTaskPriority(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#0f172a] px-3 py-2 text-white focus:border-teal-500 focus:outline-none"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Initial Column</label>
                <select
                  value={newTaskStatus}
                  onChange={(e) => setNewTaskStatus(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#0f172a] px-3 py-2 text-white focus:border-teal-500 focus:outline-none"
                >
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="REVIEW">Review / QA</option>
                  <option value="DONE">Done</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsAddTaskModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" isLoading={isSubmittingTask} className="bg-teal-600 hover:bg-teal-500 text-white font-semibold">
                Create Task
              </Button>
            </div>
          </form>
        </Modal>

        {/* MODAL: UPLOAD FILE */}
        <Modal
          isOpen={isFileModalOpen}
          onClose={() => {
            setIsFileModalOpen(false)
            setProjectStagedMedia([])
          }}
          title="Upload Project Artifact & Proof"
        >
          <form onSubmit={handleUploadFile} className="space-y-4 text-xs">
            <div className="space-y-3">
              <label className="block text-slate-300 font-medium">
                Upload Media / Artifact (Photos, Videos, Schematics)
              </label>
              <EvidenceUploadZone
                items={projectStagedMedia}
                onChange={(items) => setProjectStagedMedia(items)}
              />
            </div>

            {projectStagedMedia.length === 0 && (
              <>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Document Title *</label>
                  <input
                    type="text"
                    placeholder="e.g. PCB Schematic Revision 2.1 (Eagle)"
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#0f172a] px-3 py-2 text-white focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Artifact Category</label>
                  <select
                    value={newFileType}
                    onChange={(e) => setNewFileType(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#0f172a] px-3 py-2 text-white focus:border-teal-500 focus:outline-none"
                  >
                    <option value="SCHEMATIC">Hardware / Circuit Schematic</option>
                    <option value="CODE">Firmware / Source Code</option>
                    <option value="REPORT">Field Pilot Testing Report</option>
                    <option value="DATASET">Water Telemetry CSV Dataset</option>
                  </select>
                </div>
              </>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsFileModalOpen(false)
                  setProjectStagedMedia([])
                }}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isUploadingFile} className="bg-teal-600 hover:bg-teal-500 text-white font-semibold">
                {isUploadingFile ? 'Uploading...' : 'Confirm Upload'}
              </Button>
            </div>
          </form>
        </Modal>

        {/* MODAL: CERTIFICATE VIEW */}
        <Modal
          isOpen={isCertificateModalOpen}
          onClose={() => setIsCertificateModalOpen(false)}
          title="Civic Impact Certificate"
        >
          <div className="rounded-2xl border-2 border-amber-400/30 bg-gradient-to-b from-slate-900 via-amber-950/10 to-slate-900 p-6 text-center space-y-4">
            <div className="inline-flex p-3 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400">
              <Award className="h-8 w-8" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">
                CivicSolve Verified Certification
              </span>
              <h3 className="text-xl font-bold text-white">{project.title}</h3>
              <p className="text-xs text-slate-300">
                Awarded to <span className="font-semibold text-white">{project.team?.name || 'Project Team'}</span>{' '}
                from{' '}
                <span className="font-semibold text-white">
                  {project.university?.name || 'Autonomous Partner'}
                </span>
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/60 border border-white/5 text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
              &quot;In recognition of successful delivery, community trial validation, and measurable societal impact
              in resolving {project.problem?.title}.&quot;
            </div>

            <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-white/10">
              <span>Verification Token: CS-SIH-{project.id.slice(-6).toUpperCase()}</span>
              <span>Signed by Ministry of Education & SIH26043</span>
            </div>
          </div>
        </Modal>
      </div>
    </AppShell>
  )
}
