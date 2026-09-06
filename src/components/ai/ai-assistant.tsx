'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  Cpu,
  ChevronRight,
  ShieldCheck,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLayout } from '@/components/layout/layout-context'

interface Message {
  id: string
  sender: 'user' | 'assistant'
  text: string
  timestamp: string
  tags?: string[]
  actionLink?: {
    label: string
    href: string
  }
}

const quickPrompts = [
  'How does the matching algorithm work?',
  'Suggest problems for IoT teams',
  'What are the requirements for certificate verification?',
  'Explain project lifecycle stages',
]

const initialMessages: Message[] = [
  {
    id: 'msg-init',
    sender: 'assistant',
    text: `Greetings! I am **Civic AI**, the intelligent assistant powering the **CivicSolve SIH26043** ecosystem. 

I can help you analyze societal challenges, explain our 3-tier matching engine, suggest high-priority problems for student teams, or clarify certificate verification criteria.

How can I assist your civic innovation today?`,
    timestamp: 'Just now',
    tags: ['SIH26043', 'AI-Assistant'],
  },
]

export default function AIAssistant() {
  const { isAiOpen, setAiOpen } = useLayout()
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [speechEnabled, setSpeechEnabled] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<any>(null)

  // Speech synthesis speaker
  const speakText = (text: string) => {
    if (!speechEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()

    // Strip markdown formatting for cleaner audio speech
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

  // Speech recognition listener
  const toggleListening = () => {
    if (typeof window === 'undefined') return

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      alert('Voice recognition is not supported in this browser. Please use Chrome, Edge, or Safari.')
      return
    }

    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
      return
    }

    // Stop speaking if currently speaking
    stopSpeaking()

    try {
      const recognition = new SpeechRecognition()
      recognitionRef.current = recognition
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = 'en-IN'

      recognition.onstart = () => {
        setIsListening(true)
      }

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        if (transcript) {
          setInputValue(transcript)
          handleSendMessage(transcript)
        }
      }

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognition.start()
    } catch (err) {
      console.error('Failed to initialize speech recognition:', err)
      setIsListening(false)
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

  const getAIResponse = (prompt: string): { text: string; tags?: string[]; actionLink?: { label: string; href: string } } => {
    const p = prompt.toLowerCase()

    if (p.includes('matching') || p.includes('algorithm')) {
      return {
        text: `### 🎯 CivicSolve 3-Tier Matchmaking Engine

Our proprietary matching algorithm computes a composite compatibility score ($S_{total} \\in [0, 100]$) using 4 multi-dimensional parameters:

1. **Semantic Domain Alignment (40%)**: Uses dense vector embeddings (Sentence-BERT + TF-IDF) to map civic problem keywords to university department curricula and faculty research specializations.
2. **Geo-Proximity & Field Access (25%)**: Calculates Haversine distance to ensure engineering teams can conduct regular physical site inspections and telemetry deployment (prioritizing < 50 km).
3. **Institutional Track Record (20%)**: Evaluates lab infrastructure (e.g., IoT maker labs, testing equipment) and prior milestone completion velocity.
4. **SDG & Urgency Weight (15%)**: Elevates urgent societal challenges in Clean Water (SDG 6), Zero Hunger (SDG 2), and Good Health (SDG 3).

Top-ranked teams receive automated invitations with complete problem telemetry.`,
        tags: ['Matching Engine', 'BERT Embeddings', 'SIH26043'],
        actionLink: {
          label: 'Open AI Match Center',
          href: '/ai-match-center',
        },
      }
    }

    if (p.includes('iot') || p.includes('suggest problems')) {
      return {
        text: `### 📡 High-Priority Civic Challenges for IoT Teams

Based on current municipal data in Maharashtra, here are the top 4 vetted challenges requiring IoT & hardware solutions:

1. **Nashik Water Contamination & Heavy Metal Detection**
   - *Tech*: pH, ORP, Turbidity, and heavy-metal electrochemical sensor telemetry.
   - *Impact*: 450,000+ citizens in the Godavari industrial belt.
   - *Target Partner*: Maharashtra Pollution Control Board (MPCB).

2. **Vidarbha Smart Irrigation & Groundwater Monitoring**
   - *Tech*: Solar LoRaWAN soil moisture probes & automated drip solenoids.
   - *Impact*: 1,200+ smallholder cotton farmers in Yavatmal district.

3. **Pune Urban Heat Island & Air Quality Sensor Mesh**
   - *Tech*: Low-power PM2.5/PM10 & ambient temperature monitors on municipal transit.
   - *Impact*: Microclimate tracking across 38 transit corridors.

4. **Dharavi High-Density Sanitation Level Telemetry**
   - *Tech*: Ultrasonic non-contact sewage & water tank level monitors.
   - *Impact*: Real-time municipal alert dispatch for 80,000+ residents.`,
        tags: ['IoT', 'Embedded Systems', 'Smart Water'],
        actionLink: {
          label: 'Explore Challenges',
          href: '/problems',
        },
      }
    }

    if (p.includes('certificate') || p.includes('verification')) {
      return {
        text: `### 🛡️ Verified Impact Certificate Protocol

CivicSolve certificates are cryptographically verifiable credentials recognized by government departments and CSR industry partners. Validation requires:

1. **Physical Field Telemetry**: Verified GPS-stamped sensor logs and photo evidence submitted through the platform.
2. **Municipal Counter-Signature**: Digital authorization by the designated Municipal Commissioner, Nagar Parishad, or Gram Panchayat Sarpanch.
3. **Faculty Mentor Endorsement**: Academic review verifying that student work adheres to engineering standards.
4. **SHA-256 Tamper-Evident Ledger**: Every certificate is minted with a unique QR code and cryptographic hash (#CS-2026-XXXX) for instant third-party validation.`,
        tags: ['Verification', 'Certificates', 'Ledger'],
        actionLink: {
          label: 'View Verified Certificates',
          href: '/certificates',
        },
      }
    }

    if (p.includes('lifecycle') || p.includes('stages')) {
      return {
        text: `### 🔄 CivicSolve 10-Stage Project Lifecycle

Every problem is tracked transparently from initial grievance to verified outcome:

1. **SUBMITTED**: Citizen, local body, or NGO posts problem with photographic evidence.
2. **AI_ANALYZED**: NLP extracts urgency, SDG goals, and tech stack requirements.
3. **MATCHED**: AI pairs problem with top academic teams and faculty mentors.
4. **TEAM_FORMED**: Interdisciplinary student team accepts the challenge.
5. **PROPOSAL**: Formal technical architecture and timeline submitted for review.
6. **PROTOTYPE**: Lab-validated prototype or software build demonstrated.
7. **PILOT**: On-ground controlled pilot deployed at the civic site.
8. **DEPLOYED**: Full-scale continuous civic deployment under municipal supervision.
9. **IMPACT_VERIFIED**: Measurable metrics (liters treated, people served) audited.
10. **CERTIFIED**: Tamper-proof credentials issued to students and university.`,
        tags: ['Lifecycle', 'Governance', 'SLA'],
        actionLink: {
          label: 'View Active Projects',
          href: '/projects',
        },
      }
    }

    // Default intelligent response
    return {
      text: `### 💡 Civic AI Insight

Regarding **"${prompt}"**:

CivicSolve is engineered specifically for **Smart India Hackathon 2026 (Problem Statement SIH26043)** to eliminate the disconnect between civic challenges and academic engineering talent.

- **For Students**: Build real-world hardware & software solutions, gain industry mentorship, and earn verified impact credentials.
- **For Governments**: Tap into 50+ university labs to solve pressing municipal issues with transparent SLA tracking.
- **For Industry Partners**: Sponsor high-impact projects through CSR grants with audited outcome metrics.

Would you like me to guide you to a specific challenge or explain our matching algorithm?`,
      tags: ['CivicSolve', 'SIH26043', 'Overview'],
      actionLink: {
        label: 'View Platform Leaderboard',
        href: '/leaderboard',
      },
    }
  }

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputValue.trim()
    if (!text) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMessage])
    if (!textToSend) setInputValue('')
    setIsTyping(true)

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponseData = getAIResponse(text)
      const aiMessage: Message = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: aiResponseData.text,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        tags: aiResponseData.tags,
        actionLink: aiResponseData.actionLink,
      }

      setMessages((prev) => [...prev, aiMessage])
      setIsTyping(false)
      speakText(aiResponseData.text)
    }, 600)
  }

  const handleClearChat = () => {
    stopSpeaking()
    setMessages(initialMessages)
  }

  return (
    <AnimatePresence>
      {isAiOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setAiOpen(false)}
          />

          {/* Sliding Drawer */}
          <motion.aside
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col border-l border-white/10 bg-[#0a0f1e] shadow-2xl shadow-black/90 text-slate-100"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 bg-slate-900/70 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-0.5 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                  <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#0a0f1e]">
                    <Sparkles className="h-5 w-5 text-cyan-400" />
                  </div>
                  <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-500"></span>
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white tracking-tight">Civic AI</h3>
                    <span className="rounded border border-cyan-500/30 bg-cyan-500/10 px-1.5 py-0.2 text-[10px] font-bold uppercase tracking-wider text-cyan-300">
                      SIH26043 Engine
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">Intelligent Societal Problem Matcher</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {isSpeaking && (
                  <button
                    type="button"
                    onClick={stopSpeaking}
                    className="flex items-center gap-1 rounded-lg bg-cyan-500/20 px-2 py-1 text-xs text-cyan-300 animate-pulse border border-cyan-500/30"
                    title="Stop speaking"
                  >
                    <Volume2 className="h-3.5 w-3.5 animate-bounce" />
                    <span className="text-[10px] font-semibold">Speaking...</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    if (isSpeaking) stopSpeaking()
                    setSpeechEnabled(!speechEnabled)
                  }}
                  className={cn(
                    "rounded-lg p-2 transition-colors",
                    speechEnabled ? "text-cyan-400 hover:bg-slate-800" : "text-slate-500 hover:bg-slate-800"
                  )}
                  title={speechEnabled ? "Voice output enabled (Click to mute)" : "Voice output muted (Click to unmute)"}
                >
                  {speechEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </button>

                <button
                  type="button"
                  onClick={handleClearChat}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                  title="Reset conversation"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    stopSpeaking()
                    setAiOpen(false)
                  }}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                  title="Close Assistant"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
              {messages.map((msg) => {
                const isAssistant = msg.sender === 'assistant'

                return (
                  <div
                    key={msg.id}
                    className={cn(
                      'flex gap-3',
                      isAssistant ? 'items-start' : 'items-end flex-row-reverse'
                    )}
                  >
                    {/* Avatar */}
                    <div
                      className={cn(
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold shadow-sm',
                        isAssistant
                          ? 'bg-gradient-to-tr from-blue-600 to-cyan-500 text-white'
                          : 'bg-indigo-600 text-white'
                      )}
                    >
                      {isAssistant ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                    </div>

                    {/* Message Bubble */}
                    <div
                      className={cn(
                        'max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed',
                        isAssistant
                          ? 'bg-slate-900/90 border border-white/10 text-slate-200 shadow-md'
                          : 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                      )}
                    >
                      <div className="whitespace-pre-line space-y-2">
                        {msg.text.split('\n\n').map((paragraph, idx) => {
                          if (paragraph.startsWith('### ')) {
                            return (
                              <h4 key={idx} className="text-sm font-bold text-white pt-1 pb-0.5">
                                {paragraph.replace('### ', '')}
                              </h4>
                            )
                          }
                          return (
                            <p key={idx} className="leading-relaxed">
                              {paragraph}
                            </p>
                          )
                        })}
                      </div>

                      {/* Action link if available */}
                      {msg.actionLink && (
                        <div className="mt-3 pt-2.5 border-t border-white/10">
                          <a
                            href={msg.actionLink.href}
                            onClick={() => setAiOpen(false)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-500/20 border border-cyan-500/40 px-3 py-1.5 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/30 transition-colors"
                          >
                            <span>{msg.actionLink.label}</span>
                            <ChevronRight className="h-3.5 w-3.5" />
                          </a>
                        </div>
                      )}

                      {/* Tags & Timestamp */}
                      <div className="mt-2.5 flex items-center justify-between gap-2 pt-1">
                        <div className="flex flex-wrap gap-1">
                          {msg.tags?.map((t) => (
                            <span
                              key={t}
                              className="rounded bg-white/5 border border-white/10 px-1.5 py-0.5 text-[9px] font-medium text-slate-400"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {msg.timestamp}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-500 text-white">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="flex items-center gap-1.5 rounded-2xl bg-slate-900 border border-white/10 px-4 py-3">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-400"></span>
                    <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-400 [animation-delay:0.2s]"></span>
                    <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-400 [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Suggestions */}
            <div className="border-t border-white/5 px-4 py-3 bg-slate-950/40">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 mb-2">
                <Lightbulb className="h-3.5 w-3.5 text-amber-400" />
                <span>Suggested Questions</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => handleSendMessage(prompt)}
                    className="rounded-lg border border-white/10 bg-slate-900/80 px-2.5 py-1.5 text-[11px] text-slate-300 transition-colors hover:border-cyan-500/40 hover:bg-slate-800 hover:text-cyan-300"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Bar */}
            <div className="border-t border-white/10 p-4 bg-slate-900/90">
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
                  placeholder={isListening ? "Listening to your voice... Speak now" : "Ask Civic AI, or click mic to speak..."}
                  className={cn(
                    "w-full rounded-xl border bg-slate-950 px-4 py-3 pr-20 text-xs text-white placeholder-slate-500 focus:outline-none transition-all",
                    isListening
                      ? "border-red-500/60 ring-2 ring-red-500/20 bg-red-950/10 placeholder-red-400"
                      : "border-white/10 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  )}
                />

                <div className="absolute right-2 flex items-center gap-1">
                  {/* Voice Chat Microphone Button */}
                  <button
                    type="button"
                    onClick={toggleListening}
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200",
                      isListening
                        ? "bg-red-500 text-white shadow-[0_0_12px_rgba(239,68,68,0.6)] animate-pulse"
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-cyan-400"
                    )}
                    title={isListening ? "Stop listening" : "Start Voice Chat"}
                    aria-label="Voice input"
                  >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </button>

                  {/* Send Button */}
                  <button
                    type="submit"
                    disabled={!inputValue.trim()}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500 text-black shadow-md transition-transform duration-150 hover:bg-cyan-400 active:scale-95 disabled:opacity-40 disabled:hover:bg-cyan-500"
                    aria-label="Send message"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </div>
              </form>
              <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
                <span>Civic AI SIH26043 Engine</span>
                <span className="flex items-center gap-1 text-cyan-400/80">
                  <Mic className="h-3 w-3" /> Voice Chat Enabled
                </span>
              </div>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  )
}
