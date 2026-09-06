import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { aiProvider } from '@/lib/ai'

const STAGE_ORDER = [
  'SUBMITTED',
  'AI_ANALYZED',
  'MATCHED',
  'TEAM_FORMED',
  'PROPOSAL',
  'PROTOTYPE',
  'PILOT',
  'DEPLOYED',
  'IMPACT_VERIFIED',
  'CERTIFIED',
]

const STANDARD_MILESTONES = [
  { title: 'Problem Discovery & Stakeholder Mapping', type: 'DISCOVERY', order: 1 },
  { title: 'Technical Research & Feasibility Analysis', type: 'RESEARCH', order: 2 },
  { title: 'Solution Architecture & Civic Proposal', type: 'PROPOSAL', order: 3 },
  { title: 'Functional Prototype Development', type: 'PROTOTYPE', order: 4 },
  { title: 'Community Pilot & Field Testing', type: 'PILOT', order: 5 },
  { title: 'Full Deployment & Municipal Handover', type: 'DEPLOYMENT', order: 6 },
  { title: 'Impact Verification & Certification Audit', type: 'IMPACT', order: 7 },
]

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const { problemId, targetStage } = body

    if (!problemId || !targetStage) {
      return NextResponse.json(
        { error: 'problemId and targetStage are required', success: false },
        { status: 400 }
      )
    }

    const targetIdx = STAGE_ORDER.indexOf(targetStage.toUpperCase())
    if (targetIdx === -1) {
      return NextResponse.json(
        {
          error: `Invalid targetStage: ${targetStage}. Must be one of: ${STAGE_ORDER.join(', ')}`,
          success: false,
        },
        { status: 400 }
      )
    }

    let problem = await prisma.problem.findUnique({
      where: { id: problemId },
      include: {
        location: true,
        aiAnalysis: true,
        projects: {
          include: {
            milestones: { orderBy: { order: 'asc' } },
            team: { include: { members: { include: { user: true } } } },
            proposals: true,
            deployments: { include: { impactMetrics: true } },
            certificates: true,
          },
        },
      },
    })

    if (!problem) {
      return NextResponse.json(
        { error: 'Problem not found', success: false },
        { status: 404 }
      )
    }

    const appliedSteps: string[] = []

    // 1. Ensure AI Analysis if target >= AI_ANALYZED
    if (targetIdx >= 1 && !problem.aiAnalysis) {
      const aiResult = await aiProvider.analyzeProblem({
        title: problem.title,
        description: problem.description,
        category: problem.category,
        location: problem.location?.district || problem.location?.address || undefined,
        affectedCount: problem.affectedCount || undefined,
      })

      const newAnalysis = await prisma.problemAIAnalysis.create({
        data: {
          problemId: problem.id,
          domain: aiResult.domain,
          subdomain: aiResult.subdomain || null,
          confidence: aiResult.confidence,
          priorityScore: aiResult.priorityScore,
          priorityReason: aiResult.priorityReason,
          affectedEstimate: aiResult.affectedEstimate || problem.affectedCount,
          duplicateRisk: aiResult.duplicateRisk,
          detectedTech: JSON.stringify(aiResult.detectedTech || []),
          recommendedSkills: JSON.stringify(aiResult.recommendedSkills || []),
          sdgAlignment: JSON.stringify(aiResult.sdgAlignment || []),
          matchedUniversities: JSON.stringify(aiResult.matchedUniversities || []),
          matchedTeams: JSON.stringify(aiResult.matchedTeams || []),
          matchedIndustry: JSON.stringify(aiResult.matchedIndustry || []),
          nextSteps: JSON.stringify(aiResult.nextSteps || []),
        },
      })
      problem.aiAnalysis = newAnalysis
      appliedSteps.push('Generated AI Multi-Domain Analysis')
    }

    // 2. Ensure Project exists if target >= TEAM_FORMED
    let project = problem.projects[0]
    if (targetIdx >= 3 && !project) {
      const team = (await prisma.team.findFirst({
        include: { members: true },
      })) || (await prisma.team.create({
        data: {
          name: 'Civic Innovation Taskforce',
          skills: JSON.stringify(['IoT', 'Full-Stack', 'Data Science']),
          size: 4,
          verified: true,
        },
        include: { members: true },
      }))

      const newProject = await prisma.project.create({
        data: {
          problemId: problem.id,
          title: `Project: ${problem.title}`,
          teamId: team.id,
          universityId: team.universityId || null,
          status: 'ACTIVE',
          progressPercent: 15,
          milestones: {
            create: STANDARD_MILESTONES.map((m) => ({
              title: m.title,
              type: m.type,
              order: m.order,
              status: m.order === 1 ? 'IN_PROGRESS' : 'PENDING',
              completionPct: m.order === 1 ? 50 : 0,
            })),
          },
        },
        include: {
          milestones: { orderBy: { order: 'asc' } },
          team: { include: { members: { include: { user: true } } } },
          proposals: true,
          deployments: { include: { impactMetrics: true } },
          certificates: true,
        },
      })
      project = newProject
      appliedSteps.push('Created Project with 7 Civic Milestones linked to Innovation Team')
    }

    // 3. Milestone and Entity state progression
    if (project) {
      let progressPct = 15

      // Proposal Stage (Index 4)
      if (targetIdx >= 4) {
        progressPct = 35
        // Mark Discovery & Research completed
        await prisma.milestone.updateMany({
          where: { projectId: project.id, order: { in: [1, 2] } },
          data: { status: 'COMPLETED', completionPct: 100, completedAt: new Date() },
        })

        // Ensure Proposal record exists
        const existingProposal = await prisma.proposal.findFirst({
          where: { projectId: project.id },
        })
        if (!existingProposal) {
          await prisma.proposal.create({
            data: {
              projectId: project.id,
              title: `Technical Architecture for ${problem.title}`,
              understanding: `In-depth analysis of civic pain point in ${problem.location?.district || 'target sector'}.`,
              solution: `Deploy scalable IoT telemetry combined with automated municipal dispatch.`,
              technology: JSON.stringify(['React', 'Next.js', 'Node.js', 'PostgreSQL', 'LoRaWAN Sensors']),
              implementationPlan: 'Phase 1: Lab bench. Phase 2: Pilot in Ward 4. Phase 3: City-wide rollout.',
              estimatedCost: 350000,
              expectedImpact: `Direct relief to ${problem.affectedCount || 5000} residents.`,
              timeline: '6 months end-to-end',
              teamMembers: JSON.stringify(['Team Lead', 'Firmware Engineer', 'UX Specialist']),
              status: targetIdx >= 5 ? 'APPROVED' : 'SUBMITTED',
              reviewedAt: targetIdx >= 5 ? new Date() : null,
              reviewNotes: targetIdx >= 5 ? 'Approved with highest recommendation by Evaluation Board' : null,
            },
          })
          appliedSteps.push('Drafted & Submitted Comprehensive Solution Proposal')
        } else if (targetIdx >= 5 && existingProposal.status !== 'APPROVED') {
          await prisma.proposal.update({
            where: { id: existingProposal.id },
            data: { status: 'APPROVED', reviewedAt: new Date() },
          })
        }
      }

      // Prototype Stage (Index 5)
      if (targetIdx >= 5) {
        progressPct = 55
        await prisma.milestone.updateMany({
          where: { projectId: project.id, order: 3 },
          data: { status: 'COMPLETED', completionPct: 100, completedAt: new Date() },
        })
        await prisma.milestone.updateMany({
          where: { projectId: project.id, order: 4 },
          data: { status: 'IN_PROGRESS', completionPct: 75 },
        })
        appliedSteps.push('Built and benchmarked functional prototype')
      }

      // Pilot Stage (Index 6)
      if (targetIdx >= 6) {
        progressPct = 75
        await prisma.milestone.updateMany({
          where: { projectId: project.id, order: 4 },
          data: { status: 'COMPLETED', completionPct: 100, completedAt: new Date() },
        })
        await prisma.milestone.updateMany({
          where: { projectId: project.id, order: 5 },
          data: { status: 'IN_PROGRESS', completionPct: 80 },
        })
        appliedSteps.push('Deployed on-ground community pilot in Ward')
      }

      // Deployed Stage (Index 7)
      if (targetIdx >= 7) {
        progressPct = 90
        await prisma.milestone.updateMany({
          where: { projectId: project.id, order: { in: [5, 6] } },
          data: { status: 'COMPLETED', completionPct: 100, completedAt: new Date() },
        })

        // Ensure Deployment record exists
        let deployment = await prisma.deployment.findFirst({
          where: { projectId: project.id },
        })

        if (!deployment) {
          deployment = await prisma.deployment.create({
            data: {
              projectId: project.id,
              location: problem.location?.district
                ? `${problem.location.district}, ${problem.location.state || ''}`
                : 'Primary Civic Testbed',
              description: `Production municipal deployment providing live monitoring and resolution for ${problem.title}.`,
              status: 'ACTIVE',
              impactMetrics: {
                create: [
                  {
                    metricName: 'Response Latency',
                    beforeValue: '72 hours',
                    afterValue: '2.5 hours',
                    unit: 'hours',
                    verified: targetIdx >= 8,
                  },
                  {
                    metricName: 'Citizen Grievance Resolution Rate',
                    beforeValue: '24%',
                    afterValue: '93%',
                    unit: '%',
                    verified: targetIdx >= 8,
                  },
                  {
                    metricName: 'Active Beneficiaries',
                    beforeValue: '0',
                    afterValue: String(problem.affectedCount || 5200),
                    unit: 'citizens',
                    verified: targetIdx >= 8,
                  },
                ],
              },
            },
          })
          appliedSteps.push('Commissioned active field deployment with telemetry metrics')
        }
      }

      // Impact Verified Stage (Index 8)
      if (targetIdx >= 8) {
        progressPct = 96
        await prisma.milestone.updateMany({
          where: { projectId: project.id, order: 7 },
          data: { status: 'COMPLETED', completionPct: 100, completedAt: new Date() },
        })

        // Mark all metrics verified
        const deployment = await prisma.deployment.findFirst({
          where: { projectId: project.id },
        })
        if (deployment) {
          await prisma.impactMetric.updateMany({
            where: { deploymentId: deployment.id },
            data: { verified: true },
          })
        }
        appliedSteps.push('Third-party verified real-world impact metrics')
      }

      // Certified Stage (Index 9)
      if (targetIdx >= 9) {
        progressPct = 100

        // Ensure certificate is issued
        const existingCert = await prisma.certificate.findFirst({
          where: { projectId: project.id },
        })

        if (!existingCert) {
          // Identify certificate recipient: team member or problem submitter
          const recipientId =
            project.team?.members[0]?.userId ||
            problem.submittedById ||
            (await prisma.user.findFirst())?.id

          if (recipientId) {
            const certCode = `CS-2026-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
            await prisma.certificate.create({
              data: {
                certificateId: certCode,
                userId: recipientId,
                type: 'NATIONAL_CIVIC_EXCELLENCE',
                problemTitle: problem.title,
                role: 'LEAD_INNOVATOR',
                projectId: project.id,
                impactSummary: `Successfully engineered and deployed field solution benefiting ${problem.affectedCount || 5000}+ citizens.`,
                issuedBy: 'CivicSolve Platform & Ministry of Education',
                verified: true,
              },
            })
            appliedSteps.push('Issued National Civic Excellence Certificate with tamper-proof QR code')
          }
        }
      }

      // Update project progress
      await prisma.project.update({
        where: { id: project.id },
        data: {
          progressPercent: progressPct,
          status: targetIdx >= 9 ? 'COMPLETED' : 'ACTIVE',
          ...(targetIdx >= 9 ? { completedAt: new Date() } : {}),
        },
      })
    }

    // 4. Update Problem status
    const updatedProblem = await prisma.problem.update({
      where: { id: problemId },
      data: { status: targetStage.toUpperCase() },
      include: {
        location: true,
        aiAnalysis: true,
        projects: {
          include: {
            milestones: { orderBy: { order: 'asc' } },
            team: true,
            proposals: true,
            deployments: { include: { impactMetrics: true } },
            certificates: true,
          },
        },
      },
    })

    return NextResponse.json({
      data: {
        problem: updatedProblem,
        stage: targetStage.toUpperCase(),
        appliedSteps,
      },
      message: `Problem successfully advanced to ${targetStage.toUpperCase()}`,
      success: true,
    })
  } catch (error) {
    console.error('Error running demo journey:', error)
    return NextResponse.json(
      { error: 'Failed to advance demo journey', success: false },
      { status: 500 }
    )
  }
}
