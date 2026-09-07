export interface ProblemAnalysisInput {
  title: string
  description: string
  category: string
  location?: string
  district?: string
  state?: string
  affectedCount?: number
}

export interface MatchedEntity {
  name: string
  score: number
  reason?: string
  skills?: string[]
  type?: string
}

export interface AIAnalysisResult {
  domain: string
  subdomain: string
  confidence: number
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  priorityScore: number
  priorityReason: string
  affectedEstimate: number
  duplicateRisk: number
  detectedTech: string[]
  recommendedSkills: string[]
  sdgAlignment: string[]
  matchedUniversities: MatchedEntity[]
  matchedTeams: MatchedEntity[]
  matchedIndustry: MatchedEntity[]
  nextSteps: string[]
  tags: string[]
}

export type CivicAIEntity = {
  type: 'PROBLEM' | 'PROJECT' | 'TEAM' | 'SOLUTION' | 'UNIVERSITY'
  id: string
  title: string
  subtitle?: string
  badge?: string
  href: string
}

export type CivicAIActionType =
  | 'CREATE_TASK'
  | 'MARK_MILESTONE_COMPLETE'
  | 'PUBLISH_CHALLENGE'
  | 'ASSIGN_MENTOR'

export interface CivicAIAction {
  actionType: CivicAIActionType
  status: 'PROPOSED' | 'CONFIRMED' | 'EXECUTED' | 'CANCELLED'
  label: string
  description: string
  params: Record<string, any>
  requiresConfirmation: boolean
  executedResult?: string
}

export interface CivicAIMetadata {
  mode: 'REAL_AI' | 'DEMO_AI'
  model?: string
  citations?: Array<{ label: string; url?: string; count?: number }>
  action?: CivicAIAction
  toolsCalled?: string[]
  entities?: CivicAIEntity[]
  suggestedPrompts?: string[]
}

export interface CivicAIChatMessage {
  id?: string
  role: 'user' | 'assistant' | 'system'
  content: string
  context?: string
  metadata?: CivicAIMetadata
  createdAt?: string
}

export interface CivicAIContext {
  pathname: string
  pageType?: 'PROBLEM' | 'PROJECT' | 'TEAM' | 'COMMAND_CENTER' | 'SOLUTION_LIBRARY' | 'STUDENTS' | 'PROFESSIONALS' | 'LEADERBOARD' | 'GENERAL'
  entityId?: string
  entityTitle?: string
  summary?: Record<string, any>
}

export interface AIProvider {
  name: string
  mode: 'REAL_AI' | 'DEMO_AI'
  chat(
    messages: CivicAIChatMessage[],
    context?: CivicAIContext,
    onChunk?: (chunk: string) => void
  ): Promise<{ content: string; metadata: CivicAIMetadata }>
  analyzeProblem(input: ProblemAnalysisInput): Promise<AIAnalysisResult>
  classifyProblem(description: string): Promise<{ domain: string; confidence: number; tags: string[] }>
  detectDuplicates(description: string): Promise<Array<{ title: string; similarity: number }>>
  generatePriority(input: ProblemAnalysisInput): Promise<{ priority: string; score: number; reason: string }>
  matchExperts(skills: string[]): Promise<MatchedEntity[]>
  recommendPartners(domain: string): Promise<MatchedEntity[]>
  generateNextSteps(context: { domain: string; stage: string }): Promise<string[]>
}
