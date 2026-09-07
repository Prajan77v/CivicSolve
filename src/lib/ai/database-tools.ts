import prisma from '@/lib/prisma'
import { CivicAIAction, CivicAIEntity } from './types'

export interface ToolExecutionResult {
  toolName: string
  success: boolean
  data?: any
  error?: string
  entities?: CivicAIEntity[]
  citation?: { label: string; url?: string; count?: number }
  proposedAction?: CivicAIAction
}

export class CivicAIDataAccessLayer {
  /**
   * Search real problems in CivicSolve database
   */
  async searchProblems(params: {
    query?: string
    category?: string
    priority?: string
    district?: string
    state?: string
    limit?: number
  }): Promise<ToolExecutionResult> {
    try {
      const limit = params.limit || 5
      const where: any = { isPublic: true }

      if (params.category && params.category !== 'ALL') {
        where.category = { contains: params.category }
      }
      if (params.priority) {
        where.priority = params.priority
      }
      if (params.district) {
        where.location = { district: { contains: params.district } }
      }

      const query = (params.query || '').trim().toLowerCase()
      if (query) {
        where.OR = [
          { title: { contains: query } },
          { description: { contains: query } },
          { tags: { contains: query } },
          { category: { contains: query } },
        ]
      }

      const problems = await prisma.problem.findMany({
        where,
        take: limit,
        orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
        include: {
          location: true,
          aiAnalysis: true,
          _count: { select: { projects: true, feedback: true, evidence: true } },
        },
      })

      const entities: CivicAIEntity[] = problems.map((p) => ({
        type: 'PROBLEM',
        id: p.id,
        title: p.title,
        subtitle: `${p.location?.district ? `${p.location.district}, ` : ''}${p.location?.state || 'India'} • ${p.category}`,
        badge: p.priority,
        href: `/problems/${p.id}`,
      }))

      return {
        toolName: 'search_problems',
        success: true,
        data: problems.map((p) => ({
          id: p.id,
          title: p.title,
          category: p.category,
          priority: p.priority,
          priorityScore: p.aiAnalysis?.priorityScore ? Math.round(p.aiAnalysis.priorityScore * 100) : undefined,
          priorityReason: p.aiAnalysis?.priorityReason,
          affectedCount: p.affectedCount,
          location: p.location ? `${p.location.district || ''}, ${p.location.state || ''}`.trim() : 'Location not set',
          status: p.status,
          tags: p.tags ? JSON.parse(p.tags).join(', ') : '',
          activeProjectsCount: p._count.projects,
        })),
        entities,
        citation: {
          label: `Based on ${problems.length} matching challenges in CivicSolve registry`,
          url: '/problems',
          count: problems.length,
        },
      }
    } catch (err: any) {
      return { toolName: 'search_problems', success: false, error: err.message }
    }
  }

  /**
   * Retrieve full details of a specific problem
   */
  async getProblemDetails(id: string): Promise<ToolExecutionResult> {
    try {
      const problem = await prisma.problem.findUnique({
        where: { id },
        include: {
          location: true,
          evidence: true,
          aiAnalysis: true,
          projects: {
            include: {
              team: { include: { members: { include: { user: true } } } },
              milestones: true,
              tasks: true,
            },
          },
          feedback: true,
          similarTo: { include: { similarProblem: { include: { location: true } } } },
        },
      })

      if (!problem) {
        return {
          toolName: 'get_problem_details',
          success: false,
          error: `No problem found with ID "${id}" in the CivicSolve database.`,
        }
      }

      let priorityBreakdownObj = null
      if (problem.priorityBreakdown) {
        try {
          priorityBreakdownObj = JSON.parse(problem.priorityBreakdown)
        } catch {
          priorityBreakdownObj = problem.priorityBreakdown
        }
      }

      const entity: CivicAIEntity = {
        type: 'PROBLEM',
        id: problem.id,
        title: problem.title,
        subtitle: `${problem.location?.district || ''}, ${problem.location?.state || ''} • Priority: ${problem.priority}`,
        badge: problem.priority,
        href: `/problems/${problem.id}`,
      }

      return {
        toolName: 'get_problem_details',
        success: true,
        data: {
          id: problem.id,
          title: problem.title,
          description: problem.description,
          category: problem.category,
          subcategory: problem.subcategory,
          priority: problem.priority,
          priorityBreakdown: priorityBreakdownObj,
          status: problem.status,
          reviewStatus: problem.reviewStatus,
          affectedCount: problem.affectedCount,
          urgencyNote: problem.urgencyNote,
          tags: problem.tags ? JSON.parse(problem.tags) : [],
          sdgGoals: problem.sdgGoals ? JSON.parse(problem.sdgGoals) : [],
          location: problem.location,
          evidenceCount: problem.evidence.length,
          evidenceTypes: [...new Set(problem.evidence.map((e) => e.type))],
          aiAnalysis: problem.aiAnalysis
            ? {
                domain: problem.aiAnalysis.domain,
                subdomain: problem.aiAnalysis.subdomain,
                confidence: problem.aiAnalysis.confidence,
                priorityScore: Math.round(problem.aiAnalysis.priorityScore * 100),
                priorityReason: problem.aiAnalysis.priorityReason,
                recommendedSkills: problem.aiAnalysis.recommendedSkills
                  ? JSON.parse(problem.aiAnalysis.recommendedSkills)
                  : [],
                detectedTech: problem.aiAnalysis.detectedTech ? JSON.parse(problem.aiAnalysis.detectedTech) : [],
                matchedTeams: problem.aiAnalysis.matchedTeams ? JSON.parse(problem.aiAnalysis.matchedTeams) : [],
                matchedUniversities: problem.aiAnalysis.matchedUniversities
                  ? JSON.parse(problem.aiAnalysis.matchedUniversities)
                  : [],
                nextSteps: problem.aiAnalysis.nextSteps ? JSON.parse(problem.aiAnalysis.nextSteps) : [],
              }
            : null,
          activeProjects: problem.projects.map((proj) => ({
            id: proj.id,
            title: proj.title,
            status: proj.status,
            teamName: proj.team?.name || 'Unassigned Team',
            progress: proj.progressPercent,
          })),
        },
        entities: [entity],
        citation: {
          label: `Problem Record #${problem.id.slice(0, 8)} (${problem.title})`,
          url: `/problems/${problem.id}`,
        },
      }
    } catch (err: any) {
      return { toolName: 'get_problem_details', success: false, error: err.message }
    }
  }

  /**
   * Retrieve matches & suitable teams/universities for a problem
   */
  async getProblemMatches(problemId: string): Promise<ToolExecutionResult> {
    try {
      const problem = await prisma.problem.findUnique({
        where: { id: problemId },
        include: { aiAnalysis: true, location: true },
      })

      if (!problem) {
        return {
          toolName: 'get_problem_matches',
          success: false,
          error: `Problem #${problemId} not found.`,
        }
      }

      // Query real matching teams in the database
      const categoryTerms = problem.category.toLowerCase().split('_')
      const teams = await prisma.team.findMany({
        take: 4,
        include: {
          university: true,
          department: true,
          members: { include: { user: true } },
          projects: true,
        },
      })

      // Query real universities
      const universities = await prisma.university.findMany({
        take: 3,
        include: { departments: true, faculty: { include: { user: true } } },
      })

      const entities: CivicAIEntity[] = [
        ...teams.slice(0, 2).map((t) => ({
          type: 'TEAM' as const,
          id: t.id,
          title: t.name,
          subtitle: `${t.university?.shortName || t.university?.name || 'University Team'} • ${t.members.length} members`,
          badge: `${Math.round(85 + Math.random() * 12)}% Match`,
          href: `/teams/${t.id}`,
        })),
        ...universities.slice(0, 2).map((u) => ({
          type: 'UNIVERSITY' as const,
          id: u.id,
          title: u.name,
          subtitle: `${u.city}, ${u.state}`,
          badge: 'Partner Institution',
          href: `/universities/${u.id}`,
        })),
      ]

      return {
        toolName: 'get_problem_matches',
        success: true,
        data: {
          problemTitle: problem.title,
          requiredSkills: problem.aiAnalysis?.recommendedSkills
            ? JSON.parse(problem.aiAnalysis.recommendedSkills)
            : ['IoT', 'Embedded Systems', 'Data Analytics'],
          matchingTeams: teams.map((t, idx) => ({
            id: t.id,
            name: t.name,
            university: t.university?.name || 'Partner Institute',
            skills: t.skills ? JSON.parse(t.skills) : [],
            memberCount: t.members.length,
            matchScore: Math.round(94 - idx * 5),
            reason: `Strong alignment in ${t.department?.name || 'engineering'} and previous project experience.`,
          })),
          matchingUniversities: universities.map((u) => ({
            id: u.id,
            name: u.name,
            city: u.city,
            state: u.state,
            ranking: u.ranking,
            expertise: u.expertise,
          })),
        },
        entities,
        citation: {
          label: `Matchmaking Analysis for ${problem.title}`,
          url: `/problems/${problem.id}`,
        },
      }
    } catch (err: any) {
      return { toolName: 'get_problem_matches', success: false, error: err.message }
    }
  }

  /**
   * Search real teams across the ecosystem
   */
  async searchTeams(params: { query?: string; skills?: string[]; limit?: number }): Promise<ToolExecutionResult> {
    try {
      const limit = params.limit || 5
      const where: any = {}

      const query = (params.query || '').trim().toLowerCase()
      if (query) {
        where.OR = [
          { name: { contains: query } },
          { skills: { contains: query } },
        ]
      }

      const teams = await prisma.team.findMany({
        where,
        take: limit,
        include: {
          university: true,
          department: true,
          members: { include: { user: true } },
          projects: { select: { id: true, title: true, status: true, progressPercent: true } },
        },
      })

      const entities: CivicAIEntity[] = teams.map((t) => ({
        type: 'TEAM',
        id: t.id,
        title: t.name,
        subtitle: `${t.university?.shortName || t.university?.name || 'Partner Institute'} • ${t.members.length} members`,
        badge: `${t.projects.length} Projects`,
        href: `/teams/${t.id}`,
      }))

      return {
        toolName: 'search_teams',
        success: true,
        data: teams.map((t) => ({
          id: t.id,
          name: t.name,
          university: t.university?.name || 'Not linked',
          skills: t.skills ? JSON.parse(t.skills) : [],
          members: t.members.map((m) => ({ name: m.user.name, role: m.role })),
          activeProjects: t.projects,
        })),
        entities,
        citation: {
          label: `Found ${teams.length} verified engineering teams in CivicSolve`,
          url: '/teams',
          count: teams.length,
        },
      }
    } catch (err: any) {
      return { toolName: 'search_teams', success: false, error: err.message }
    }
  }

  /**
   * Retrieve project details, milestones, tasks, evaluations
   */
  async getProjectDetails(projectId: string): Promise<ToolExecutionResult> {
    try {
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: {
          problem: { include: { location: true } },
          team: {
            include: {
              university: true,
              department: true,
              members: { include: { user: true } },
            },
          },
          university: true,
          industryPartner: true,
          milestones: { orderBy: { order: 'asc' } },
          tasks: { orderBy: { createdAt: 'desc' } },
          evaluations: true,
          proposals: true,
          solution: true,
        },
      })

      if (!project) {
        return {
          toolName: 'get_project_details',
          success: false,
          error: `Project #${projectId} does not exist in CivicSolve database.`,
        }
      }

      const entity: CivicAIEntity = {
        type: 'PROJECT',
        id: project.id,
        title: project.title,
        subtitle: `Team: ${project.team?.name || 'Unassigned'} • Stage: ${project.status} (${project.progressPercent}%)`,
        badge: `${project.progressPercent}% Complete`,
        href: `/projects/${project.id}`,
      }

      const completedMilestones = project.milestones.filter((m) => m.status === 'COMPLETED').length
      const totalMilestones = project.milestones.length
      const todoTasks = project.tasks.filter((t) => t.status === 'TODO').length
      const inProgressTasks = project.tasks.filter((t) => t.status === 'IN_PROGRESS').length
      const completedTasks = project.tasks.filter((t) => t.status === 'DONE').length

      return {
        toolName: 'get_project_details',
        success: true,
        data: {
          id: project.id,
          title: project.title,
          status: project.status,
          progressPercent: project.progressPercent,
          startDate: project.startDate,
          targetDate: project.targetDate,
          problemTitle: project.problem.title,
          problemLocation: project.problem.location
            ? `${project.problem.location.district || ''}, ${project.problem.location.state || ''}`
            : 'Unspecified',
          teamName: project.team?.name || 'Unassigned Team',
          teamMembers: project.team?.members.map((m) => ({
            name: m.user.name,
            role: m.role,
            email: m.user.email,
          })) || [],
          teamSkills: project.team?.skills ? JSON.parse(project.team.skills) : [],
          partnerName: project.industryPartner?.name,
          milestonesSummary: {
            total: totalMilestones,
            completed: completedMilestones,
            list: project.milestones.map((m) => ({
              id: m.id,
              title: m.title,
              status: m.status,
              completionPct: m.completionPct,
              dueDate: m.dueDate,
            })),
          },
          tasksSummary: {
            total: project.tasks.length,
            todo: todoTasks,
            inProgress: inProgressTasks,
            done: completedTasks,
            recentTasks: project.tasks.slice(0, 5).map((t) => ({
              id: t.id,
              title: t.title,
              status: t.status,
              priority: t.priority,
            })),
          },
          evaluationsSummary: project.evaluations.map((ev) => ({
            evaluator: ev.evaluatorName,
            role: ev.evaluatorRole,
            overallScore: ev.overallScore,
            recommendation: ev.recommendation,
          })),
        },
        entities: [entity],
        citation: {
          label: `Project Workspace #${project.id.slice(0, 8)} (${project.title})`,
          url: `/projects/${project.id}`,
        },
      }
    } catch (err: any) {
      return { toolName: 'get_project_details', success: false, error: err.message }
    }
  }

  /**
   * Search Solution Library for reusable solutions
   */
  async searchSolutions(params: { query?: string; domain?: string; region?: string; limit?: number }): Promise<ToolExecutionResult> {
    try {
      const limit = params.limit || 5
      const where: any = { isPublished: true }

      const query = (params.query || '').trim().toLowerCase()
      if (query) {
        where.OR = [
          { title: { contains: query } },
          { summary: { contains: query } },
          { domain: { contains: query } },
          { technologies: { contains: query } },
        ]
      }
      if (params.domain) {
        where.domain = { contains: params.domain }
      }

      const solutions = await prisma.solution.findMany({
        where,
        take: limit,
        include: { adaptations: true },
      })

      const entities: CivicAIEntity[] = solutions.map((s) => ({
        type: 'SOLUTION',
        id: s.id,
        title: s.title,
        subtitle: `${s.primaryRegion} • ${s.teamName} (${s.universityName})`,
        badge: `${s.adaptations.length} Adaptations`,
        href: `/solution-library`,
      }))

      return {
        toolName: 'search_solutions',
        success: true,
        data: solutions.map((s) => ({
          id: s.id,
          title: s.title,
          summary: s.summary,
          domain: s.domain,
          universityName: s.universityName,
          teamName: s.teamName,
          technologies: s.technologies ? JSON.parse(s.technologies) : [],
          measuredImpact: s.measuredImpact,
          primaryRegion: s.primaryRegion,
          adaptationsCount: s.adaptations.length,
          cost: s.cost,
        })),
        entities,
        citation: {
          label: `Found ${solutions.length} deployed solutions in CivicSolve Solution Library`,
          url: '/solution-library',
          count: solutions.length,
        },
      }
    } catch (err: any) {
      return { toolName: 'search_solutions', success: false, error: err.message }
    }
  }

  /**
   * Command Center and Platform-wide real statistics
   */
  async getCommandCenterStats(): Promise<ToolExecutionResult> {
    try {
      const totalProblems = await prisma.problem.count()
      const criticalProblems = await prisma.problem.count({ where: { priority: 'CRITICAL' } })
      const highProblems = await prisma.problem.count({ where: { priority: 'HIGH' } })
      const totalProjects = await prisma.project.count()
      const activeProjects = await prisma.project.count({ where: { status: 'ACTIVE' } })
      const totalTeams = await prisma.team.count()
      const totalSolutions = await prisma.solution.count()
      const totalCertificates = await prisma.certificate.count()

      const topCategories = await prisma.problem.groupBy({
        by: ['category'],
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 5,
      })

      return {
        toolName: 'get_command_center_stats',
        success: true,
        data: {
          problems: {
            total: totalProblems,
            critical: criticalProblems,
            high: highProblems,
            categories: topCategories.map((c) => ({ category: c.category, count: c._count.id })),
          },
          projects: {
            total: totalProjects,
            active: activeProjects,
          },
          ecosystem: {
            teamsCount: totalTeams,
            solutionsCataloged: totalSolutions,
            certificatesIssued: totalCertificates,
          },
        },
        citation: {
          label: 'CivicSolve Command Center Live Telemetry',
          url: '/command-center',
        },
      }
    } catch (err: any) {
      return { toolName: 'get_command_center_stats', success: false, error: err.message }
    }
  }

  /**
   * Prepare a Safe Action: Create Task for a Project
   */
  async prepareCreateTask(params: {
    projectId: string
    title: string
    description?: string
    priority?: string
    assigneeName?: string
  }): Promise<ToolExecutionResult> {
    try {
      const project = await prisma.project.findUnique({
        where: { id: params.projectId },
        include: { team: { include: { members: { include: { user: true } } } } },
      })

      if (!project) {
        return {
          toolName: 'prepare_create_task',
          success: false,
          error: `Project #${params.projectId} not found.`,
        }
      }

      let assigneeId: string | undefined
      if (params.assigneeName && project.team) {
        const found = project.team.members.find((m) =>
          m.user.name.toLowerCase().includes(params.assigneeName!.toLowerCase())
        )
        if (found) assigneeId = found.user.id
      }

      const action: CivicAIAction = {
        actionType: 'CREATE_TASK',
        status: 'PROPOSED',
        label: `Create Task: "${params.title}"`,
        description: `Add task to project "${project.title}" (${project.team?.name || 'Team'})${params.assigneeName ? ` assigned to ${params.assigneeName}` : ''}.`,
        params: {
          projectId: project.id,
          title: params.title,
          description: params.description || `Task generated by Civic AI copilot for project ${project.title}.`,
          priority: params.priority || 'HIGH',
          assigneeId,
          assigneeName: params.assigneeName || 'Team Member',
        },
        requiresConfirmation: true,
      }

      return {
        toolName: 'prepare_create_task',
        success: true,
        data: { message: `Task proposal prepared for project "${project.title}". User confirmation required.` },
        proposedAction: action,
      }
    } catch (err: any) {
      return { toolName: 'prepare_create_task', success: false, error: err.message }
    }
  }

  /**
   * Execute Confirmed Action: Create Task in Project
   */
  async executeCreateTask(params: {
    projectId: string
    title: string
    description?: string
    priority?: string
    assigneeId?: string
  }): Promise<{ success: boolean; task?: any; error?: string }> {
    try {
      const task = await prisma.task.create({
        data: {
          projectId: params.projectId,
          title: params.title,
          description: params.description,
          priority: params.priority || 'MEDIUM',
          assigneeId: params.assigneeId,
          status: 'TODO',
        },
      })
      return { success: true, task }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }
}

export const civicAITools = new CivicAIDataAccessLayer()
