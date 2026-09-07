'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  RotateCcw,
  Lightbulb,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  History,
  Plus,
  Trash2,
  Copy,
  Check,
  Layers,
  ArrowUpRight,
  AlertCircle,
  HelpCircle,
  Building2,
  Users,
  Target,
  Paperclip,
  Loader2,
  Camera,
  Video,
  FileText,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLayout } from '@/components/layout/layout-context'
import { CivicAIChatMessage, CivicAIContext, CivicAIMetadata, CivicAIAction, CivicAIEntity } from '@/lib/ai/types'
import VideoPreviewModal from '@/components/evidence/video-preview-modal'

interface ConversationItem {
  id: string
  title: string
  contextType?: string
  messageCount: number
  updatedAt: string
}

function renderInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = []
  const regex = /(\[.*?\]\(.*?\)|\*\*.*?\*\*|\*.*?\*|`.*?`)/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index))
    }
    const token = match[0]
    if (token.startsWith('[') && token.includes('](')) {
      const label = token.substring(1, token.indexOf(']('))
      const href = token.substring(token.indexOf('](') + 2, token.length - 1)
      parts.push(
        <a
          key={match.index}
          href={href}
          className="text-cyan-600 dark:text-cyan-400 underline underline-offset-2 hover:text-cyan-700 dark:hover:text-cyan-300 font-semibold"
        >
          {label}
        </a>
      )
    } else if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(
        <strong key={match.index} className="font-bold text-slate-900 dark:text-white">
          {token.slice(2, -2)}
        </strong>
      )
    } else if (token.startsWith('*') && token.endsWith('*')) {
      parts.push(
        <em key={match.index} className="text-slate-600 dark:text-slate-300 italic">
          {token.slice(1, -1)}
        </em>
      )
    } else if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(
        <code
          key={match.index}
          className="rounded bg-slate-100 dark:bg-slate-800 px-1 py-0.5 font-mono text-[11px] text-cyan-800 dark:text-cyan-300 border border-slate-200 dark:border-white/10"
        >
          {token.slice(1, -1)}
        </code>
      )
    }
    lastIndex = regex.lastIndex
  }
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex))
  }
  return parts.length > 0 ? parts : text
}

function renderFormattedText(text: string) {
  const paragraphs = text.split('\n\n')
  return (
    <div className="space-y-2.5 leading-relaxed">
      {paragraphs.map((p, pIdx) => {
        if (p.startsWith('### ')) {
          return (
            <h4 key={pIdx} className="text-sm font-bold text-slate-900 dark:text-white pt-1 pb-1 border-b border-slate-200 dark:border-white/10">
              {renderInline(p.replace('### ', ''))}
            </h4>
          )
        }
        if (p.startsWith('#### ')) {
          return (
            <h5 key={pIdx} className="text-xs font-bold text-cyan-700 dark:text-cyan-300 pt-1">
              {renderInline(p.replace('#### ', ''))}
            </h5>
          )
        }
        if (p.startsWith('> ')) {
          return (
            <blockquote
              key={pIdx}
              className="border-l-2 border-cyan-500 bg-cyan-50/80 dark:bg-cyan-950/20 px-3 py-1.5 text-slate-700 dark:text-slate-300 italic rounded-r border-slate-200 dark:border-cyan-500/60"
            >
              {renderInline(p.replace(/^>\s*/, ''))}
            </blockquote>
          )
        }
        const lines = p.split('\n')
        const isList = lines.some((l) => l.trim().startsWith('- ') || /^\d+\.\s/.test(l.trim()))
        if (isList) {
          return (
            <ul key={pIdx} className="space-y-1.5 my-1 pl-1">
              {lines.map((l, lIdx) => {
                const trimmed = l.trim()
                if (trimmed.startsWith('- ')) {
                  return (
                    <li key={lIdx} className="flex items-start gap-1.5 text-slate-800 dark:text-slate-200">
                      <span className="text-cyan-600 dark:text-cyan-400 font-bold">•</span>
                      <span>{renderInline(trimmed.replace(/^- /, ''))}</span>
                    </li>
                  )
                }
                const numMatch = trimmed.match(/^(\d+)\.\s*(.*)/)
                if (numMatch) {
                  return (
                    <li key={lIdx} className="flex items-start gap-1.5 text-slate-800 dark:text-slate-200">
                      <span className="text-cyan-600 dark:text-cyan-400 font-mono text-[10px] pt-0.5">{numMatch[1]}.</span>
                      <span>{renderInline(numMatch[2])}</span>
                    </li>
                  )
                }
                return <p key={lIdx} className="text-slate-800 dark:text-slate-200">{renderInline(l)}</p>
              })}
            </ul>
          )
        }
        return (
          <p key={pIdx} className="text-slate-800 dark:text-slate-200">
            {renderInline(p)}
          </p>
        )
      })}
    </div>
  )
}

export default function AIAssistant() {
  const pathname = usePathname()
  const { isAiOpen, setAiOpen } = useLayout()

  const [messages, setMessages] = useState<CivicAIChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [speechEnabled, setSpeechEnabled] = useState(false)
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const [conversations, setConversations] = useState<ConversationItem[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [aiMode, setAiMode] = useState<'REAL_AI' | 'DEMO_AI'>('DEMO_AI')
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [executingActionId, setExecutingActionId] = useState<string | null>(null)
  const [attachedFiles, setAttachedFiles] = useState<
    Array<{ url: string; originalName: string; mimeType: string; sizeBytes: number; type: string }>
  >([])
  const [isUploadingAttachment, setIsUploadingAttachment] = useState(false)
  const [previewVideo, setPreviewVideo] = useState<{
    url: string
    originalName?: string
    filename?: string
    mimeType?: string
    sizeBytes?: number
    uploadedBy?: string | null
  } | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const attachmentInputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<any>(null)

  // Compute active context from URL
  const getActiveContext = (): CivicAIContext => {
    const segments = pathname.split('/').filter(Boolean)

    if (segments[0] === 'problems' && segments[1] && segments[1] !== 'new') {
      return {
        pathname,
        pageType: 'PROBLEM',
        entityId: segments[1],
      }
    }
    if (segments[0] === 'projects' && segments[1]) {
      return {
        pathname,
        pageType: 'PROJECT',
        entityId: segments[1],
      }
    }
    if (segments[0] === 'teams' && segments[1]) {
      return {
        pathname,
        pageType: 'TEAM',
        entityId: segments[1],
      }
    }
    if (segments[0] === 'command-center') {
      return { pathname, pageType: 'COMMAND_CENTER' }
    }
    if (segments[0] === 'solution-library') {
      return { pathname, pageType: 'SOLUTION_LIBRARY' }
    }
    if (segments[0] === 'students') {
      return { pathname, pageType: 'STUDENTS' }
    }
    if (segments[0] === 'professionals') {
      return { pathname, pageType: 'PROFESSIONALS' }
    }
    return { pathname, pageType: 'GENERAL' }
  }

  const activeContext = getActiveContext()

  // Context-specific suggested questions
  const getContextPrompts = () => {
    switch (activeContext.pageType) {
      case 'PROBLEM':
        return [
          'Why is this high priority?',
          'Who can solve this?',
          'Find similar challenges',
          'Is there an existing solution we could reuse?',
        ]
      case 'PROJECT':
        return [
          'What should we do next?',
          'Create a task to review prototype telemetry',
          'Summarize this project in 5 lines',
          'Are we behind schedule?',
        ]
      case 'COMMAND_CENTER':
        return [
          'Which district has the most critical challenges?',
          'Where should municipal resources be prioritized?',
          'What category is growing fastest?',
        ]
      case 'SOLUTION_LIBRARY':
        return [
          'Which water solutions can we adapt?',
          'Show impact statistics of deployed solutions',
        ]
      default:
        return [
          'What are the highest priority water problems?',
          'How does the 3-tier matching engine work?',
          'Suggest challenges for IoT student teams',
          'What is the project lifecycle?',
        ]
    }
  }

  // Load conversations list on mount / open
  useEffect(() => {
    if (isAiOpen) {
      loadConversations()
      if (messages.length === 0) {
        initWelcomeMessage()
      }
    }
  }, [isAiOpen, pathname])

  const initWelcomeMessage = () => {
    let welcomeText = `Hello! I am **Civic AI**, the conversational copilot for the **CivicSolve** ecosystem.`

    if (activeContext.pageType === 'PROBLEM') {
      welcomeText += `\n\nI am currently analyzing the problem dossier at \`${pathname}\`. You can ask me to explain its **priority breakdown**, find **matching student teams**, or search for **similar challenges** across India.`
    } else if (activeContext.pageType === 'PROJECT') {
      welcomeText += `\n\nI am connected to this **Project Workspace**. I can audit your milestone progress, recommend your **next action items**, or help you **create tasks** for your engineering team.`
    } else if (activeContext.pageType === 'COMMAND_CENTER') {
      welcomeText += `\n\nI am monitoring **Live Command Center Telemetry**. Ask me about district-wise vulnerability, critical hotspots, or resource allocation.`
    } else {
      welcomeText += `\n\nI am grounded in live CivicSolve data. You can ask natural-language questions about challenges, team matchmaking, solution adaptation, and verified impact credentials.`
    }

    const initMsg: CivicAIChatMessage = {
      id: 'welcome-msg',
      role: 'assistant',
      content: welcomeText,
      createdAt: new Date().toISOString(),
      metadata: {
        mode: aiMode,
        model: 'CivicSolve Engine v2.0',
      },
    }
    setMessages([initMsg])
  }

  const loadConversations = async () => {
    try {
      const res = await fetch('/api/ai/conversations')
      const json = await res.json()
      if (json.success && json.data) {
        setConversations(json.data)
      }
    } catch (e) {
      console.warn('Could not load conversations:', e)
    }
  }

  const handleSelectConversation = async (convId: string) => {
    try {
      setIsTyping(true)
      const res = await fetch(`/api/ai/conversations/${convId}`)
      const json = await res.json()
      if (json.success && json.data) {
        setActiveConversationId(convId)
        setMessages(json.data.messages)
        setShowHistory(false)
      }
    } catch (e) {
      console.error('Failed to load conversation:', e)
    } finally {
      setIsTyping(false)
    }
  }

  const handleNewChat = () => {
    setActiveConversationId(null)
    setShowHistory(false)
    initWelcomeMessage()
  }

  const handleDeleteConversation = async (convId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await fetch(`/api/ai/conversations/${convId}`, { method: 'DELETE' })
      setConversations((prev) => prev.filter((c) => c.id !== convId))
      if (activeConversationId === convId) {
        handleNewChat()
      }
    } catch (err) {
      console.error('Failed to delete conversation:', err)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isAiOpen) {
      scrollToBottom()
      setTimeout(() => inputRef.current?.focus(), 150)
    }
  }, [isAiOpen, messages, isTyping])

  // Speech Output
  const speakText = (text: string) => {
    if (!speechEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()

    const cleanText = text
      .replace(/#+\s/g, '')
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/`[^`]+`/g, '')
      .replace(/•/g, '')
      .trim()

    const utterance = new SpeechSynthesisUtterance(cleanText)
    utterance.rate = 1.05
    utterance.pitch = 1.0
    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)
    window.speechSynthesis.speak(utterance)
  }

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  // Voice Chat Speech Recognition
  const toggleListening = () => {
    if (typeof window === 'undefined') return
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      alert('Voice input is not supported in this browser. Please use Chrome, Edge, or Safari.')
      return
    }

    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
      return
    }

    stopSpeaking()

    try {
      const recognition = new SpeechRecognition()
      recognitionRef.current = recognition
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = 'en-IN'

      recognition.onstart = () => setIsListening(true)
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        if (transcript) {
          setInputValue(transcript)
          handleSendMessage(transcript)
        }
      }
      recognition.onerror = () => setIsListening(false)
      recognition.onend = () => setIsListening(false)
      recognition.start()
    } catch (err) {
      console.error('Failed to initialize speech recognition:', err)
      setIsListening(false)
    }
  }

  const handleAttachmentChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    const files = Array.from(e.target.files)
    setIsUploadingAttachment(true)

    try {
      for (const file of files) {
        const formData = new FormData()
        formData.append('file', file)
        const res = await fetch('/api/media/upload', {
          method: 'POST',
          body: formData,
        })
        const json = await res.json()
        if (json.success && json.data && json.data.length > 0) {
          const m = json.data[0]
          setAttachedFiles((prev) => [
            ...prev,
            {
              url: m.url,
              originalName: m.originalName || file.name,
              mimeType: m.mimeType || file.type,
              sizeBytes: m.sizeBytes || file.size,
              type: m.type || (file.type.startsWith('image/') ? 'IMAGE' : file.type.startsWith('video/') ? 'VIDEO' : 'DOCUMENT'),
            },
          ])
        }
      }
    } catch (err) {
      console.error('Failed to upload attachment:', err)
    } finally {
      setIsUploadingAttachment(false)
      if (attachmentInputRef.current) attachmentInputRef.current.value = ''
    }
  }

  // Send message to Civic AI
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim()
    if ((!text && attachedFiles.length === 0) || isTyping) return

    const currentAttachments = [...attachedFiles]
    const userMessage: CivicAIChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text || (currentAttachments.length > 0 ? `Attached ${currentAttachments.length} file(s) for analysis.` : ''),
      createdAt: new Date().toISOString(),
      metadata: currentAttachments.length > 0 ? {
        mode: aiMode,
        attachments: currentAttachments,
      } : undefined,
    }

    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    if (!textToSend) setInputValue('')
    setAttachedFiles([])
    setIsTyping(true)
    stopSpeaking()

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          context: activeContext,
          conversationId: activeConversationId,
        }),
      })

      const json = await res.json()
      if (json.success && json.data) {
        const newMsg: CivicAIChatMessage = json.data.message
        setMessages((prev) => [...prev, newMsg])
        if (json.data.conversationId) {
          setActiveConversationId(json.data.conversationId)
        }
        if (newMsg.metadata?.mode) {
          setAiMode(newMsg.metadata.mode)
        }
        speakText(newMsg.content)
      } else {
        const errorMsg: CivicAIChatMessage = {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: `⚠️ **Civic AI**: ${json.error || 'Unable to complete request. Please retry.'}`,
          createdAt: new Date().toISOString(),
        }
        setMessages((prev) => [...prev, errorMsg])
      }
    } catch (err: any) {
      const errorMsg: CivicAIChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `⚠️ **Civic AI is temporarily unavailable.** Please check your connection and retry.`,
        createdAt: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setIsTyping(false)
      loadConversations()
    }
  }

  // Execute safe confirmed action (e.g. Create Task)
  const handleConfirmAction = async (msgId: string, action: CivicAIAction) => {
    try {
      setExecutingActionId(msgId)
      const res = await fetch('/api/ai/actions/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actionType: action.actionType,
          params: action.params,
          messageId: msgId,
        }),
      })
      const json = await res.json()
      if (json.success) {
        // Update local message state to reflect execution
        setMessages((prev) =>
          prev.map((m) => {
            if (m.id === msgId && m.metadata?.action) {
              return {
                ...m,
                metadata: {
                  ...m.metadata,
                  action: {
                    ...m.metadata.action,
                    status: 'EXECUTED',
                    executedResult: json.data?.message || 'Task created successfully in project workspace.',
                  },
                },
              }
            }
            return m
          })
        )
      } else {
        alert(`Action failed: ${json.error}`)
      }
    } catch (err: any) {
      alert(`Failed to execute action: ${err.message}`)
    } finally {
      setExecutingActionId(null)
    }
  }

  const handleCopyMessage = (text: string, idx: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(idx)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <AnimatePresence>
      {isAiOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setAiOpen(false)}
          />

          {/* Assistant Panel (Full screen on mobile, 540px on desktop) */}
          <motion.aside
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full sm:max-w-xl flex-col border-l border-slate-200 dark:border-white/10 bg-white dark:bg-[#080d1a] shadow-2xl shadow-slate-900/20 dark:shadow-black/90 text-slate-900 dark:text-slate-100"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 px-4 sm:px-5 py-3.5 bg-slate-50/90 dark:bg-slate-900/80 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-0.5 shadow-[0_0_15px_rgba(6,182,212,0.35)]">
                  <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-white dark:bg-[#080d1a]">
                    <Sparkles className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">Civic AI</h3>
                    <span
                      className={cn(
                        'rounded border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider',
                        aiMode === 'REAL_AI'
                          ? 'border-emerald-500/40 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                          : 'border-cyan-500/40 bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-300'
                      )}
                    >
                      {aiMode === 'REAL_AI' ? '⚡ Real AI' : '⚡ Demo AI (Grounded)'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="truncate max-w-[200px]">
                      {activeContext.pageType === 'PROBLEM' && '📌 Problem Dossier Context'}
                      {activeContext.pageType === 'PROJECT' && '🚀 Project Copilot Context'}
                      {activeContext.pageType === 'COMMAND_CENTER' && '🏛️ Command Center Telemetry'}
                      {activeContext.pageType === 'SOLUTION_LIBRARY' && '💡 Solution Library'}
                      {activeContext.pageType === 'GENERAL' && '🌐 CivicSolve Assistant'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex items-center gap-1">
                {/* Conversation History Toggle */}
                <button
                  type="button"
                  onClick={() => setShowHistory(!showHistory)}
                  className={cn(
                    'rounded-lg p-1.5 transition-colors',
                    showHistory
                      ? 'bg-cyan-100 dark:bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-500/30'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  )}
                  title="Chat History"
                  aria-label="Toggle chat history"
                >
                  <History className="h-4 w-4" />
                </button>

                {/* New Chat Button */}
                <button
                  type="button"
                  onClick={handleNewChat}
                  className="rounded-lg p-1.5 text-slate-500 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
                  title="New Conversation"
                  aria-label="New chat"
                >
                  <Plus className="h-4 w-4" />
                </button>

                {/* Voice Output */}
                <button
                  type="button"
                  onClick={() => {
                    if (isSpeaking) stopSpeaking()
                    setSpeechEnabled(!speechEnabled)
                  }}
                  className={cn(
                    'rounded-lg p-1.5 transition-colors',
                    speechEnabled
                      ? 'text-cyan-600 dark:text-cyan-400 hover:bg-slate-200/70 dark:hover:bg-slate-800'
                      : 'text-slate-400 dark:text-slate-500 hover:bg-slate-200/70 dark:hover:bg-slate-800'
                  )}
                  title={speechEnabled ? 'Voice output on' : 'Voice output off'}
                  aria-label="Toggle voice output"
                >
                  {speechEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </button>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => {
                    stopSpeaking()
                    setAiOpen(false)
                  }}
                  className="rounded-lg p-1.5 text-slate-500 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors ml-1"
                  title="Close Assistant"
                  aria-label="Close Assistant"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Conversation History Drawer (if opened) */}
            <AnimatePresence>
              {showHistory && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-b border-slate-200 dark:border-white/10 bg-slate-100/90 dark:bg-slate-950/95 overflow-hidden"
                >
                  <div className="p-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/5">
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Previous Conversations</span>
                      <button
                        type="button"
                        onClick={handleNewChat}
                        className="flex items-center gap-1 text-[11px] text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 font-medium"
                      >
                        <Plus className="h-3 w-3" /> New Chat
                      </button>
                    </div>

                    <div className="mt-2 max-h-48 overflow-y-auto space-y-1 scrollbar-thin">
                      {conversations.length === 0 ? (
                        <p className="text-xs text-slate-400 dark:text-slate-500 py-3 text-center">No previous conversations saved.</p>
                      ) : (
                        conversations.map((c) => (
                          <div
                            key={c.id}
                            onClick={() => handleSelectConversation(c.id)}
                            className={cn(
                              'flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition-colors cursor-pointer group',
                              activeConversationId === c.id
                                ? 'bg-cyan-100 dark:bg-cyan-500/15 text-cyan-900 dark:text-cyan-300 font-medium border border-cyan-300 dark:border-cyan-500/30'
                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white'
                            )}
                          >
                            <span className="truncate max-w-[280px]">{c.title}</span>
                            <button
                              type="button"
                              onClick={(e) => handleDeleteConversation(c.id, e)}
                              className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 p-1 transition-opacity"
                              title="Delete conversation"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Chat Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin bg-slate-50/50 dark:bg-slate-950/30">
              {messages.map((msg, idx) => {
                const isAssistant = msg.role === 'assistant'

                return (
                  <div
                    key={msg.id || idx}
                    className={cn('flex gap-3', isAssistant ? 'items-start' : 'items-end flex-row-reverse')}
                  >
                    {/* Avatar */}
                    <div
                      className={cn(
                        'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold shadow-sm',
                        isAssistant
                          ? 'bg-gradient-to-tr from-blue-600 to-cyan-500 text-white'
                          : 'bg-indigo-600 text-white'
                      )}
                    >
                      {isAssistant ? <Bot className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
                    </div>

                    {/* Message Bubble */}
                    <div
                      className={cn(
                        'max-w-[88%] rounded-2xl p-4 text-xs leading-relaxed group relative shadow-sm',
                        isAssistant
                          ? 'bg-white dark:bg-slate-900/95 border border-slate-200/80 dark:border-white/10 text-slate-800 dark:text-slate-200'
                          : 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      )}
                    >
                      {/* Markdown rendering with paragraphs & headers */}
                      {isAssistant ? (
                        renderFormattedText(msg.content)
                      ) : (
                        <div className="space-y-2">
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                          {msg.metadata?.attachments && msg.metadata.attachments.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {msg.metadata.attachments.map((att, aIdx) => {
                                const isVid = att.type === 'VIDEO' || att.url?.endsWith('.mp4') || att.url?.endsWith('.webm')
                                return isVid ? (
                                  <button
                                    key={aIdx}
                                    type="button"
                                    onClick={() =>
                                      setPreviewVideo({
                                        url: att.url,
                                        originalName: att.originalName,
                                        mimeType: att.mimeType,
                                        sizeBytes: att.sizeBytes,
                                      })
                                    }
                                    title="Click to preview video"
                                    className="inline-flex items-center gap-1 rounded bg-black/30 hover:bg-black/50 border border-purple-400/40 px-2 py-0.5 text-[10px] text-purple-200 transition-colors cursor-pointer"
                                  >
                                    🎥 <span className="truncate max-w-[120px] underline underline-offset-2">{att.originalName}</span>
                                    <span className="text-[9px] bg-purple-500/30 px-1 rounded font-bold">Preview</span>
                                  </button>
                                ) : (
                                  <span
                                    key={aIdx}
                                    className="inline-flex items-center gap-1 rounded bg-black/20 border border-white/20 px-2 py-0.5 text-[10px] text-white"
                                  >
                                    {att.type === 'IMAGE' ? '📷' : '📄'}
                                    <span className="truncate max-w-[120px]">{att.originalName}</span>
                                  </span>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Clickable Entity Cards if present in metadata */}
                      {msg.metadata?.entities && msg.metadata.entities.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-white/10 space-y-1.5">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            <Layers className="h-3 w-3 text-cyan-600 dark:text-cyan-400" /> Linked CivicSolve Records
                          </span>
                          <div className="grid grid-cols-1 gap-1.5">
                            {msg.metadata.entities.map((entity, eIdx) => (
                              <a
                                key={eIdx}
                                href={entity.href}
                                onClick={() => setAiOpen(false)}
                                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-white/10 hover:border-cyan-500/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group/entity"
                              >
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-semibold text-slate-900 dark:text-white group-hover/entity:text-cyan-600 dark:group-hover/entity:text-cyan-300 transition-colors">
                                      {entity.title}
                                    </span>
                                    {entity.badge && (
                                      <span className="rounded bg-cyan-100 dark:bg-cyan-500/20 border border-cyan-200 dark:border-cyan-500/30 px-1.5 py-0.5 text-[9px] font-bold text-cyan-800 dark:text-cyan-300">
                                        {entity.badge}
                                      </span>
                                    )}
                                  </div>
                                  {entity.subtitle && (
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{entity.subtitle}</p>
                                  )}
                                </div>
                                <ArrowUpRight className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500 group-hover/entity:text-cyan-600 dark:group-hover/entity:text-cyan-400 shrink-0" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Safe Action Proposal Card (e.g. Create Task) */}
                      {msg.metadata?.action && (
                        <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-white/10">
                          <div className="p-3 rounded-xl bg-cyan-50/60 dark:bg-slate-950 border border-cyan-300 dark:border-cyan-500/40 shadow-xs space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-cyan-900 dark:text-cyan-300 flex items-center gap-1.5 text-xs">
                                <Sparkles className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" /> Action Confirmation
                              </span>
                              <span
                                className={cn(
                                  'text-[9px] font-bold px-1.5 py-0.5 rounded border',
                                  msg.metadata.action.status === 'EXECUTED'
                                    ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/40'
                                    : 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-500/40'
                                )}
                              >
                                {msg.metadata.action.status === 'EXECUTED' ? '✓ EXECUTED' : 'CONFIRMATION REQUIRED'}
                              </span>
                            </div>

                            <p className="text-[11px] text-slate-700 dark:text-slate-300">{msg.metadata.action.description}</p>

                            {msg.metadata.action.status === 'EXECUTED' ? (
                              <div className="flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400 font-medium pt-1">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                <span>{msg.metadata.action.executedResult || 'Task created and stored in workspace.'}</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 pt-1">
                                <button
                                  type="button"
                                  disabled={executingActionId === msg.id}
                                  onClick={() => msg.id && msg.metadata?.action && handleConfirmAction(msg.id, msg.metadata.action)}
                                  className="flex items-center gap-1.5 rounded-lg bg-cyan-500 px-3.5 py-1.5 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-colors shadow-xs disabled:opacity-50"
                                >
                                  {executingActionId === msg.id ? (
                                    <span>Executing...</span>
                                  ) : (
                                    <>
                                      <Check className="h-3.5 w-3.5" />
                                      <span>Confirm & Create</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Source Citations */}
                      {msg.metadata?.citations && msg.metadata.citations.length > 0 && (
                        <div className="mt-2.5 pt-1.5 border-t border-slate-200 dark:border-white/5 flex flex-wrap gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                          {msg.metadata.citations.map((cite, cIdx) => (
                            <span key={cIdx} className="inline-flex items-center gap-1 text-cyan-700 dark:text-cyan-400/80">
                              <ShieldCheck className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
                              <span>{cite.label}</span>
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Message Footer: Copy button & timestamp */}
                      {isAssistant && (
                        <div className="mt-2 flex items-center justify-between pt-1 text-[10px] text-slate-400 dark:text-slate-500">
                          <button
                            type="button"
                            onClick={() => handleCopyMessage(msg.content, idx)}
                            className="inline-flex items-center gap-1 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                            title="Copy response"
                          >
                            {copiedIndex === idx ? (
                              <>
                                <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                                <span className="text-emerald-600 dark:text-emerald-400 font-medium">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                          <span>{msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}

              {/* Thinking Indicator */}
              {isTyping && (
                <div className="flex items-center gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-500 text-white shadow-sm">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex items-center gap-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 px-4 py-3 text-xs text-slate-700 dark:text-slate-300 shadow-sm">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-500"></span>
                    <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-500 [animation-delay:0.2s]"></span>
                    <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-500 [animation-delay:0.4s]"></span>
                    <span className="ml-1 text-[11px] text-slate-500 dark:text-slate-400">Civic AI is querying database & synthesizing telemetry...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Context-Aware Suggested Prompts */}
            <div className="border-t border-slate-200 dark:border-white/5 px-4 py-2.5 bg-slate-100/70 dark:bg-slate-950/60">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
                <span>Suggested Questions</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {getContextPrompts().map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => handleSendMessage(prompt)}
                    className="rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/90 px-2.5 py-1 text-[11px] text-slate-700 dark:text-slate-300 transition-colors hover:border-cyan-400/50 hover:bg-cyan-50/50 dark:hover:bg-slate-800 hover:text-cyan-700 dark:hover:text-cyan-300 text-left shadow-xs"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Bar */}
            <div className="border-t border-slate-200 dark:border-white/10 p-3 sm:p-4 bg-white/95 dark:bg-slate-900/95">
              {/* Hidden attachment file input */}
              <input
                ref={attachmentInputRef}
                type="file"
                multiple
                accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                className="hidden"
                onChange={handleAttachmentChange}
              />

              {/* Staged Attachment Chips */}
              {attachedFiles.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {attachedFiles.map((att, attIdx) => {
                    const isVid = att.type === 'VIDEO' || att.url?.endsWith('.mp4') || att.url?.endsWith('.webm')
                    return (
                      <span
                        key={attIdx}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-50 dark:bg-cyan-950/80 border border-cyan-300 dark:border-cyan-500/40 px-2 py-1 text-[11px] text-cyan-800 dark:text-cyan-300"
                      >
                        {att.type === 'IMAGE' ? '📷' : att.type === 'VIDEO' ? '🎥' : '📄'}
                        <span className="truncate max-w-[120px] font-medium">{att.originalName}</span>
                        {isVid && (
                          <button
                            type="button"
                            onClick={() =>
                              setPreviewVideo({
                                url: att.url,
                                originalName: att.originalName,
                                mimeType: att.mimeType,
                                sizeBytes: att.sizeBytes,
                              })
                            }
                            className="rounded bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30 px-1 py-0.2 text-[9px] font-bold hover:bg-purple-500 hover:text-white transition-colors"
                          >
                            Preview
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setAttachedFiles((prev) => prev.filter((_, i) => i !== attIdx))}
                          className="ml-0.5 text-cyan-600 dark:text-cyan-400 hover:text-cyan-900 dark:hover:text-white"
                          title="Remove attachment"
                        >
                          ×
                        </button>
                      </span>
                    )
                  })}
                </div>
              )}

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSendMessage()
                }}
                className="relative flex items-center"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={
                    isListening
                      ? 'Listening... Speak your question now'
                      : activeContext.pageType === 'PROBLEM'
                      ? 'Ask about this problem (e.g. Why is this high priority?)...'
                      : activeContext.pageType === 'PROJECT'
                      ? 'Ask project copilot (e.g. What should we do next?)...'
                      : 'Ask Civic AI a question or attach evidence...'
                  }
                  className={cn(
                    'w-full rounded-xl border bg-slate-100/70 dark:bg-slate-950 px-4 py-3 pr-28 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-all',
                    isListening
                      ? 'border-red-500/60 ring-2 ring-red-500/20 bg-red-50 dark:bg-red-950/10 placeholder-red-500 dark:placeholder-red-400'
                      : 'border-slate-200 dark:border-white/10 focus:border-cyan-500 focus:bg-white dark:focus:bg-slate-950 focus:ring-1 focus:ring-cyan-500'
                  )}
                />

                <div className="absolute right-2 flex items-center gap-1">
                  {/* Attachments Paperclip Button */}
                  <button
                    type="button"
                    onClick={() => attachmentInputRef.current?.click()}
                    disabled={isUploadingAttachment}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 hover:text-cyan-700 dark:hover:text-cyan-400 transition-colors"
                    title="Attach Photo, Video, or Document"
                    aria-label="Attach file"
                  >
                    {isUploadingAttachment ? (
                      <Loader2 className="h-4 w-4 animate-spin text-cyan-600 dark:text-cyan-400" />
                    ) : (
                      <Paperclip className="h-4 w-4" />
                    )}
                  </button>

                  {/* Voice Chat Microphone Button */}
                  <button
                    type="button"
                    onClick={toggleListening}
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200',
                      isListening
                        ? 'bg-red-500 text-white shadow-[0_0_12px_rgba(239,68,68,0.6)] animate-pulse'
                        : 'bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 hover:text-cyan-700 dark:hover:text-cyan-400'
                    )}
                    title={isListening ? 'Stop listening' : 'Start Voice Chat'}
                    aria-label="Voice input"
                  >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </button>

                  {/* Send Button */}
                  <button
                    type="submit"
                    disabled={(!inputValue.trim() && attachedFiles.length === 0) || isTyping}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500 text-slate-950 font-bold shadow-sm transition-transform duration-150 hover:bg-cyan-400 active:scale-95 disabled:opacity-40 disabled:hover:bg-cyan-500"
                    aria-label="Send message"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </div>
              </form>
              <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 px-1">
                <span>Civic AI • Smart India Hackathon SIH26043</span>
                <span className="flex items-center gap-1 text-cyan-600 dark:text-cyan-400/80 font-medium">
                  <ShieldCheck className="h-3 w-3 text-cyan-600 dark:text-cyan-400" /> Grounded in CivicSolve Registry
                </span>
              </div>
            </div>
          </motion.aside>

          {/* Video Preview Modal in AIAssistant */}
          <VideoPreviewModal
            isOpen={previewVideo !== null}
            video={previewVideo}
            onClose={() => setPreviewVideo(null)}
          />
        </div>
      )}
    </AnimatePresence>
  )
}
