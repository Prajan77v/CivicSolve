/**
 * CivicSolve Duplicate Detector
 * Multi-factor similarity scoring for civic problems to prevent data bloat.
 *
 * Scoring breakdown:
 *  - Title token Jaccard: 40%
 *  - Description keyword overlap: 25%
 *  - Domain (category) exact match: 15%
 *  - Geographic match (district/state): 15%
 *  - Population proximity: 5%
 *
 * Labels:
 *  DUPLICATE  >= 0.85
 *  RELATED    >= 0.55
 *  UNIQUE     < 0.55
 */

export type SimilarityLabel = 'DUPLICATE' | 'RELATED' | 'UNIQUE'

export interface DuplicateCandidate {
  id: string
  title: string
  district?: string | null
  state?: string | null
  category: string
  affectedCount?: number | null
  score: number
  label: SimilarityLabel
  similarityBreakdown: {
    titleScore: number
    keywordScore: number
    domainScore: number
    geoScore: number
    populationScore: number
  }
}

export interface DuplicateCheckResult {
  score: number
  label: SimilarityLabel
  topMatches: DuplicateCandidate[]
}

const STOP_WORDS = new Set([
  'a','an','and','are','as','at','be','been','but','by','for',
  'from','has','have','he','her','him','his','how','i','in','is',
  'it','its','me','my','not','of','on','or','our','out','she',
  'so','than','that','the','their','them','then','there','they',
  'this','to','up','us','was','we','were','what','when','which',
  'who','will','with','you','your','problem','issue','challenge',
  'area','city','town','village','india','district','block',
])

function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((t) => t.length > 2 && !STOP_WORDS.has(t))
  )
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 1
  if (a.size === 0 || b.size === 0) return 0
  const intersection = new Set([...a].filter((x) => b.has(x)))
  const union = new Set([...a, ...b])
  return intersection.size / union.size
}

function extractKeywords(text: string): Set<string> {
  const civic = [
    'water','sewage','drainage','flood','pollution','garbage','waste',
    'road','bridge','pothole','traffic','congestion','transport','bus',
    'electricity','power','outage','solar','sanitation','toilet','latrine',
    'hospital','clinic','health','disease','air','quality','dust','noise',
    'school','education','digital','internet','wifi','broadband',
    'arsenic','fluoride','contamination','groundwater','borewell',
    'farming','agriculture','crop','irrigation','pesticide','soil',
    'slum','homeless','housing','shelter','displacement','eviction',
    'fire','safety','accident','police','crime','surveillance',
  ]
  const lower = text.toLowerCase()
  return new Set(civic.filter((kw) => lower.includes(kw)))
}

interface ProblemInput {
  title: string
  description: string
  category: string
  district?: string | null
  state?: string | null
  affectedCount?: number | null
}

interface ExistingProblem extends ProblemInput {
  id: string
}

interface ScoreResult {
  score: number
  breakdown: {
    titleScore: number
    keywordScore: number
    domainScore: number
    geoScore: number
    populationScore: number
  }
}

function scorePair(incoming: ProblemInput, existing: ExistingProblem): ScoreResult {
  const titleA = tokenize(incoming.title)
  const titleB = tokenize(existing.title)
  const titleScore = jaccard(titleA, titleB)

  const kwA = extractKeywords(incoming.description)
  const kwB = extractKeywords(existing.description)
  const keywordScore = jaccard(kwA, kwB)

  const domainScore = incoming.category === existing.category ? 1 : 0

  let geoScore = 0
  const districtA = (incoming.district || '').toLowerCase().trim()
  const districtB = (existing.district || '').toLowerCase().trim()
  const stateA = (incoming.state || '').toLowerCase().trim()
  const stateB = (existing.state || '').toLowerCase().trim()

  if (districtA && districtB && districtA === districtB) {
    geoScore = 1
  } else if (stateA && stateB && stateA === stateB) {
    geoScore = 0.5
  }

  let populationScore = 0
  if (incoming.affectedCount && existing.affectedCount) {
    const ratio =
      Math.min(incoming.affectedCount, existing.affectedCount) /
      Math.max(incoming.affectedCount, existing.affectedCount)
    populationScore = ratio > 0.5 ? ratio : 0
  }

  const score =
    titleScore * 0.4 +
    keywordScore * 0.25 +
    domainScore * 0.15 +
    geoScore * 0.15 +
    populationScore * 0.05

  return { score, breakdown: { titleScore, keywordScore, domainScore, geoScore, populationScore } }
}

function labelFromScore(score: number): SimilarityLabel {
  if (score >= 0.85) return 'DUPLICATE'
  if (score >= 0.55) return 'RELATED'
  return 'UNIQUE'
}

export function checkDuplicates(
  incoming: ProblemInput,
  existingProblems: ExistingProblem[]
): DuplicateCheckResult {
  const candidates: DuplicateCandidate[] = existingProblems
    .map((existing) => {
      const { score, breakdown } = scorePair(incoming, existing)
      return {
        id: existing.id,
        title: existing.title,
        district: existing.district,
        state: existing.state,
        category: existing.category,
        affectedCount: existing.affectedCount,
        score,
        label: labelFromScore(score),
        similarityBreakdown: breakdown,
      } as DuplicateCandidate
    })
    .filter((c) => c.score >= 0.35)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)

  const topScore = candidates[0]?.score ?? 0

  return {
    score: topScore,
    label: labelFromScore(topScore),
    topMatches: candidates,
  }
}
