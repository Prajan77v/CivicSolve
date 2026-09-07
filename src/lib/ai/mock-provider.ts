import type { AIProvider, ProblemAnalysisInput, AIAnalysisResult } from './types'

const delay = (ms: number) => new Promise(r => setTimeout(r, ms))

const DOMAIN_MAP: Record<string, { domain: string; subdomain: string; tech: string[]; skills: string[] }> = {
  WATER: {
    domain: 'Water Management', subdomain: 'Water Quality & Access',
    tech: ['IoT Water Sensors', 'Water Quality Monitoring', 'Filtration Systems', 'GIS Mapping'],
    skills: ['Environmental Engineering', 'IoT', 'Water Treatment', 'Community Health'],
  },
  TRAFFIC: {
    domain: 'Urban Mobility', subdomain: 'Traffic Management Systems',
    tech: ['Computer Vision', 'AI Signal Control', 'Edge Computing', 'IoT Sensors'],
    skills: ['Computer Vision', 'Traffic Engineering', 'AI/ML', 'Edge Computing'],
  },
  AIR_QUALITY: {
    domain: 'Environmental Health', subdomain: 'Air Quality Monitoring',
    tech: ['IoT Air Quality Sensors', 'Predictive Modeling', 'Real-time Dashboard', 'Mobile Alerts'],
    skills: ['Environmental Science', 'IoT', 'Data Science', 'Public Health'],
  },
  AGRICULTURE: {
    domain: 'Agriculture Technology', subdomain: 'Precision Farming',
    tech: ['IoT Soil Sensors', 'Weather API Integration', 'Mobile App', 'ML Crop Modeling'],
    skills: ['Agriculture Engineering', 'IoT', 'Machine Learning', 'Agronomy'],
  },
  WASTE: {
    domain: 'Urban Sanitation', subdomain: 'Waste Management Optimization',
    tech: ['IoT Smart Bins', 'GPS Tracking', 'Route Optimization', 'Mobile App'],
    skills: ['IoT', 'Operations Research', 'Mobile Development', 'Urban Planning'],
  },
  HEALTH: {
    domain: 'Healthcare Technology', subdomain: 'Digital Health Systems',
    tech: ['Queue Management', 'SMS Gateway', 'Mobile App', 'EHR Integration'],
    skills: ['Healthcare IT', 'Mobile Development', 'UX Design', 'Systems Integration'],
  },
  EDUCATION: {
    domain: 'Education Technology', subdomain: 'Digital Learning',
    tech: ['Offline-first Apps', 'AI Adaptive Learning', 'Low-bandwidth Sync', 'Content Delivery'],
    skills: ['EdTech', 'Mobile Development', 'AI/ML', 'Content Design'],
  },
  INFRASTRUCTURE: {
    domain: 'Smart Infrastructure', subdomain: 'Urban Systems Monitoring',
    tech: ['IoT Sensors', 'Predictive Maintenance', 'GIS', 'Cloud Dashboard'],
    skills: ['IoT', 'Civil Engineering', 'Data Analytics', 'Urban Planning'],
  },
  ENERGY: {
    domain: 'Energy Systems', subdomain: 'Smart Grid Technology',
    tech: ['Smart Metering', 'Tamper Detection', 'SCADA Systems', 'Data Analytics'],
    skills: ['Power Systems', 'IoT', 'Electrical Engineering', 'Data Science'],
  },
  TRANSPORT: {
    domain: 'Public Transportation', subdomain: 'Accessible Transport',
    tech: ['Accessibility Mapping', 'Mobile Navigation', 'Real-time Transit', 'GIS'],
    skills: ['UX Design', 'GIS', 'Accessibility Engineering', 'Mobile Development'],
  },
}

const UNIVERSITY_POOL = [
  { name: 'IIT Bombay', score: 0.92, reason: 'Strong IoT and environmental engineering' },
  { name: 'BITS Pilani', score: 0.87, reason: 'Data science and healthcare technology' },
  { name: 'NIT Trichy', score: 0.85, reason: 'Civil and transportation engineering' },
  { name: 'IIT Delhi', score: 0.90, reason: 'Air quality and public policy research' },
  { name: 'IIIT Hyderabad', score: 0.88, reason: 'Machine learning and agricultural AI' },
]

const TEAM_POOL = [
  { name: 'AquaTech Innovators', score: 0.91, skills: ['IoT', 'Water Technology'] },
  { name: 'FarmSense AI', score: 0.88, skills: ['ML', 'Agriculture Tech'] },
  { name: 'AirGuard Lab', score: 0.87, skills: ['Air Quality', 'IoT Sensors'] },
  { name: 'TrafficFlow AI', score: 0.85, skills: ['Computer Vision', 'Traffic Systems'] },
  { name: 'WasteWise', score: 0.82, skills: ['IoT', 'Route Optimization'] },
]

const INDUSTRY_POOL = [
  { name: 'TCS', score: 0.88, type: 'INDUSTRY' },
  { name: 'Wipro EcoEnergy', score: 0.85, type: 'INDUSTRY' },
  { name: 'Jal Jeevan Mission NGO', score: 0.90, type: 'NGO' },
  { name: 'AgriBridge Technologies', score: 0.86, type: 'STARTUP' },
  { name: 'Smart City Solutions', score: 0.83, type: 'STARTUP' },
]

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

export class MockAIProvider implements AIProvider {
  name = 'Mock AI Engine'
  mode: 'DEMO_AI' = 'DEMO_AI'

  async chat(
    messages: any[],
    context?: any,
    onChunk?: (chunk: string) => void
  ): Promise<{ content: string; metadata: any }> {
    const last = [...messages].reverse().find((m) => m.role === 'user')?.content || ''
    const content = `Mock AI response to: "${last}"`
    if (onChunk) onChunk(content)
    return { content, metadata: { mode: 'DEMO_AI' } }
  }

  async analyzeProblem(input: ProblemAnalysisInput): Promise<AIAnalysisResult> {
    await delay(50)
    const meta = DOMAIN_MAP[input.category] || DOMAIN_MAP.INFRASTRUCTURE
    const affected = input.affectedCount || 5000
    const priorityScore = Math.min(0.99, 0.4 + (affected / 500000) + Math.random() * 0.2)
    const priority = priorityScore > 0.85 ? 'CRITICAL' : priorityScore > 0.7 ? 'HIGH' : priorityScore > 0.5 ? 'MEDIUM' : 'LOW'

    return {
      domain: meta.domain,
      subdomain: meta.subdomain,
      confidence: 0.82 + Math.random() * 0.16,
      priority: priority as any,
      priorityScore,
      priorityReason: `${priority}: approximately ${affected.toLocaleString()} people affected in the ${meta.domain} domain. ${priority === 'CRITICAL' ? 'Immediate intervention required.' : 'Significant impact requires structured solution.'} Technology solution is feasible with existing expertise.`,
      affectedEstimate: affected,
      duplicateRisk: Math.random() * 0.25,
      detectedTech: meta.tech,
      recommendedSkills: meta.skills,
      sdgAlignment: ['3', '6', '11', '13'].slice(0, 2 + Math.floor(Math.random() * 2)),
      matchedUniversities: shuffle(UNIVERSITY_POOL).slice(0, 3),
      matchedTeams: shuffle(TEAM_POOL).slice(0, 3),
      matchedIndustry: shuffle(INDUSTRY_POOL).slice(0, 3),
      nextSteps: [
        `Conduct detailed field assessment in the affected ${input.location || 'area'}`,
        `Assemble cross-functional team with ${meta.skills[0]} and ${meta.skills[1]} expertise`,
        `Design and prototype the core ${meta.tech[0]} component`,
        `Run a 3-month pilot with regular community feedback sessions`,
        `Document impact metrics and prepare full deployment plan`,
      ],
      tags: [meta.domain.toLowerCase().replace(/\s/g, '-'), input.category.toLowerCase(), 'civic', 'social-impact'],
    }
  }

  async classifyProblem(description: string) {
    await delay(600)
    const lower = description.toLowerCase()
    if (lower.includes('water')) return { domain: 'Water Management', confidence: 0.91, tags: ['water', 'health', 'infrastructure'] }
    if (lower.includes('traffic')) return { domain: 'Urban Mobility', confidence: 0.88, tags: ['traffic', 'smart-city'] }
    if (lower.includes('air') || lower.includes('pollution')) return { domain: 'Environmental Health', confidence: 0.89, tags: ['air-quality', 'health'] }
    if (lower.includes('farm') || lower.includes('crop') || lower.includes('irrigation')) return { domain: 'Agriculture Technology', confidence: 0.87, tags: ['agriculture', 'IoT'] }
    if (lower.includes('waste')) return { domain: 'Urban Sanitation', confidence: 0.86, tags: ['waste', 'smart-city'] }
    if (lower.includes('health') || lower.includes('hospital')) return { domain: 'Healthcare Technology', confidence: 0.85, tags: ['healthcare', 'digital'] }
    return { domain: 'Smart Infrastructure', confidence: 0.78, tags: ['infrastructure', 'civic'] }
  }

  async detectDuplicates(description: string) {
    await delay(500)
    return []
  }

  async generatePriority(input: ProblemAnalysisInput) {
    await delay(400)
    const score = 0.5 + Math.random() * 0.45
    const priority = score > 0.85 ? 'CRITICAL' : score > 0.7 ? 'HIGH' : 'MEDIUM'
    return { priority, score, reason: `Based on affected population of ${(input.affectedCount || 5000).toLocaleString()} and domain severity indicators.` }
  }

  async matchExperts(skills: string[]) {
    await delay(700)
    return shuffle(UNIVERSITY_POOL).slice(0, 3)
  }

  async recommendPartners(domain: string) {
    await delay(600)
    return shuffle(INDUSTRY_POOL).slice(0, 3)
  }

  async generateNextSteps(context: { domain: string; stage: string }) {
    await delay(500)
    const stageMap: Record<string, string[]> = {
      SUBMITTED: ['Complete problem validation with domain experts', 'Gather additional evidence from affected community', 'Clarify impact scope and urgency'],
      AI_ANALYZED: ['Review AI analysis and refine problem statement', 'Contact matched universities for initial assessment', 'Form a multidisciplinary exploration team'],
      MATCHED: ['Schedule kickoff meeting with matched teams', 'Define project scope and success metrics', 'Sign collaboration agreements'],
      TEAM_FORMED: ['Submit initial solution proposal', 'Conduct root cause analysis', 'Define prototype requirements'],
      PROPOSAL: ['Begin prototype development', 'Set up testing environment', 'Define pilot success criteria'],
      PROTOTYPE: ['Arrange pilot deployment site', 'Recruit pilot participants', 'Set up monitoring infrastructure'],
      PILOT: ['Analyze pilot results', 'Refine solution based on feedback', 'Prepare deployment plan'],
      DEPLOYED: ['Measure impact metrics', 'Collect community feedback', 'Document learnings for replication'],
    }
    return stageMap[context.stage] || stageMap.SUBMITTED
  }
}

export const aiProvider = new MockAIProvider()
