export interface ProblemAnalysisInput {
  title: string
  description: string
  category: string
  location?: string
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

export interface AIProvider {
  analyzeProblem(input: ProblemAnalysisInput): Promise<AIAnalysisResult>
  classifyProblem(description: string): Promise<{ domain: string; confidence: number; tags: string[] }>
  detectDuplicates(description: string): Promise<Array<{ title: string; similarity: number }>>
  generatePriority(input: ProblemAnalysisInput): Promise<{ priority: string; score: number; reason: string }>
  matchExperts(skills: string[]): Promise<MatchedEntity[]>
  recommendPartners(domain: string): Promise<MatchedEntity[]>
  generateNextSteps(context: { domain: string; stage: string }): Promise<string[]>
}
