import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔄 Enriching projects, milestones, tasks, and teams...')

  // Find users
  const users = await prisma.user.findMany()
  const userByEmail: Record<string, string> = {}
  users.forEach((u) => {
    userByEmail[u.email] = u.id
  })

  // Find organizations
  const orgs = await prisma.organization.findMany()
  const orgByName: Record<string, string> = {}
  orgs.forEach((o) => {
    orgByName[o.name] = o.id
  })

  // Find faculty
  const facultyList = await prisma.faculty.findMany({ include: { user: true } })
  const facultyByUserEmail: Record<string, string> = {}
  facultyList.forEach((f) => {
    facultyByUserEmail[f.user.email] = f.id
  })

  // Find teams
  const teams = await prisma.team.findMany()
  const teamByName: Record<string, any> = {}
  teams.forEach((t) => {
    teamByName[t.name] = t
  })

  // Find problems
  const problems = await prisma.problem.findMany()

  const pNashik = problems.find((p) => p.title.includes('Nashik'))!
  const pPune = problems.find((p) => p.title.includes('Pune-Nashik'))!
  const pDelhi = problems.find((p) => p.title.includes('Okhla'))!
  const pVidarbha = problems.find((p) => p.title.includes('Vidarbha'))!
  const pAurangabad = problems.find((p) => p.title.includes('Aurangabad'))
  const pKendrapara = problems.find((p) => p.title.includes('Kendrapara'))
  const pAmravati = problems.find((p) => p.title.includes('Amravati'))

  // 1. Proj 1: Nashik Water (COMPLETED)
  const proj1 = await prisma.project.findFirst({ where: { problemId: pNashik.id } })
  if (proj1) {
    await prisma.project.update({
      where: { id: proj1.id },
      data: { status: 'COMPLETED', progressPercent: 100 },
    })
  }

  // 2. Proj 2: Pune Traffic (PROTOTYPE)
  let proj2 = await prisma.project.findFirst({ where: { problemId: pPune.id } })
  if (proj2) {
    await prisma.project.update({
      where: { id: proj2.id },
      data: { status: 'PROTOTYPE', progressPercent: 55 },
    })
  }

  // 3. Proj 3: Delhi Air Quality (PILOT)
  let proj3 = await prisma.project.findFirst({ where: { problemId: pDelhi.id } })
  if (proj3) {
    await prisma.project.update({
      where: { id: proj3.id },
      data: { status: 'PILOT', progressPercent: 72 },
    })
  }

  // 4. Proj 4: Vidarbha Smart Irrigation (DEPLOYED)
  let proj4 = await prisma.project.findFirst({ where: { problemId: pVidarbha.id } })
  if (proj4) {
    await prisma.project.update({
      where: { id: proj4.id },
      data: { status: 'DEPLOYED', progressPercent: 88 },
    })
  }

  // 5. Proj 5: Amravati OPD Queues (PROPOSAL)
  if (pAmravati && teamByName['HealthBridge']) {
    const existing = await prisma.project.findFirst({ where: { problemId: pAmravati.id } })
    if (!existing) {
      await prisma.project.create({
        data: {
          problemId: pAmravati.id,
          title: 'Smart Hospital OPD Queue & Real-Time Patient Dispatch',
          teamId: teamByName['HealthBridge'].id,
          universityId: teamByName['HealthBridge'].universityId,
          industryPartnerId: orgByName['HealthFirst Foundation'] || null,
          status: 'PROPOSAL',
          startDate: new Date('2025-08-01'),
          targetDate: new Date('2026-06-30'),
          progressPercent: 28,
        },
      })
    }
  }

  // 6. Proj 6: Aurangabad Waste Management (PROTOTYPE)
  if (pAurangabad && teamByName['WasteWise']) {
    const existing = await prisma.project.findFirst({ where: { problemId: pAurangabad.id } })
    if (!existing) {
      await prisma.project.create({
        data: {
          problemId: pAurangabad.id,
          title: 'IoT Sensor Smart Bins & Dynamic Municipal Collection Logistics',
          teamId: teamByName['WasteWise'].id,
          universityId: teamByName['WasteWise'].universityId,
          industryPartnerId: orgByName['Smart City Solutions'] || null,
          status: 'PROTOTYPE',
          startDate: new Date('2025-07-15'),
          targetDate: new Date('2026-04-30'),
          progressPercent: 48,
        },
      })
    }
  }

  // 7. Proj 7: Kendrapara Flood Warning (PILOT)
  if (pKendrapara && teamByName['FloodShield']) {
    const existing = await prisma.project.findFirst({ where: { problemId: pKendrapara.id } })
    if (!existing) {
      await prisma.project.create({
        data: {
          problemId: pKendrapara.id,
          title: 'Automated River Level Sensor Grid & Early Warning SMS Network',
          teamId: teamByName['FloodShield'].id,
          universityId: teamByName['FloodShield'].universityId,
          industryPartnerId: orgByName['Tata Consultancy Services'] || null,
          status: 'PILOT',
          startDate: new Date('2025-05-10'),
          targetDate: new Date('2026-03-31'),
          progressPercent: 65,
        },
      })
    }
  }

  // Define 7 pipeline milestone templates
  const milestoneTemplates = [
    { type: 'DISCOVERY', title: 'Problem Discovery & Field Validation', order: 1 },
    { type: 'RESEARCH', title: 'Root Cause Analysis & Field Research', order: 2 },
    { type: 'PROPOSAL', title: 'Solution Architecture & Proposal Submission', order: 3 },
    { type: 'PROTOTYPE', title: 'Hardware & Software Lab Prototype', order: 4 },
    { type: 'PILOT', title: 'Community Field Pilot & Testing', order: 5 },
    { type: 'DEPLOYMENT', title: 'Full Deployment & Municipal Integration', order: 6 },
    { type: 'IMPACT', title: 'Impact Measurement & Third-Party Verification', order: 7 },
  ]

  const allProjects = await prisma.project.findMany({
    include: { milestones: true, tasks: true, mentorships: true, fundingSupport: true },
  })

  for (const prj of allProjects) {
    // If fewer than 7 milestones, remove and rebuild canonical 7
    if (prj.milestones.length < 7) {
      await prisma.milestone.deleteMany({ where: { projectId: prj.id } })

      let completedCount = 0
      if (prj.status === 'COMPLETED') completedCount = 7
      else if (prj.status === 'DEPLOYED') completedCount = 5
      else if (prj.status === 'PILOT') completedCount = 4
      else if (prj.status === 'PROTOTYPE') completedCount = 3
      else if (prj.status === 'PROPOSAL') completedCount = 2
      else completedCount = 1

      for (let i = 0; i < 7; i++) {
        const tmpl = milestoneTemplates[i]
        let mStatus = 'PENDING'
        let mPct = 0
        let compAt: Date | null = null
        let reviewNotes: string | null = null

        if (i < completedCount) {
          mStatus = 'COMPLETED'
          mPct = 100
          compAt = new Date(Date.now() - (7 - i) * 20 * 24 * 60 * 60 * 1000)
          reviewNotes = `Stage ${i + 1} deliverables verified and approved by technical evaluation panel.`
        } else if (i === completedCount) {
          mStatus = 'IN_PROGRESS'
          mPct = 50
          reviewNotes = 'Currently under active execution and peer review.'
        } else {
          mStatus = 'PENDING'
          mPct = 0
        }

        await prisma.milestone.create({
          data: {
            projectId: prj.id,
            title: tmpl.title,
            type: tmpl.type,
            order: tmpl.order,
            status: mStatus,
            completionPct: mPct,
            completedAt: compAt,
            dueDate: new Date(Date.now() + (i - completedCount + 1) * 30 * 24 * 60 * 60 * 1000),
            reviewNotes,
          },
        })
      }
    }

    // Seed tasks if empty
    const currentTasks = await prisma.task.count({ where: { projectId: prj.id } })
    if (currentTasks === 0) {
      const teamMembers = prj.teamId
        ? await prisma.teamMember.findMany({ where: { teamId: prj.teamId } })
        : []
      const assignee1 = teamMembers[0]?.userId || userByEmail['arun.kumar@iitb.ac.in']
      const assignee2 = teamMembers[1]?.userId || userByEmail['sneha.joshi@iitb.ac.in'] || assignee1

      const sampleTasks = [
        {
          title: 'Calibrate optical sensor arrays under field conditions',
          description: 'Run 48-hour continuous drift tests and log telemetry with low-power edge microcontroller.',
          status: 'DONE',
          priority: 'HIGH',
          assigneeId: assignee1,
        },
        {
          title: 'Implement MQTT pub/sub data bridge to cloud aggregator',
          description: 'Ensure TLS encryption, payload compaction, and intermittent offline queuing.',
          status: 'DONE',
          priority: 'MEDIUM',
          assigneeId: assignee2,
        },
        {
          title: 'Conduct baseline stakeholder field survey in target wards',
          description: 'Collect 120 survey responses from primary beneficiaries and local civic representatives.',
          status: 'IN_PROGRESS',
          priority: 'CRITICAL',
          assigneeId: assignee1,
        },
        {
          title: 'Assemble weather-proof IP67 enclosure for outdoor units',
          description: '3D print and vacuum-cast secondary seals for monsoon moisture resistance.',
          status: 'IN_PROGRESS',
          priority: 'HIGH',
          assigneeId: assignee2,
        },
        {
          title: 'Perform compliance audit with municipal digital standards',
          description: 'Review data schemas against National Urban Innovation Stack (NUIS) protocols.',
          status: 'TODO',
          priority: 'MEDIUM',
          assigneeId: assignee1,
        },
        {
          title: 'Draft final impact evaluation and third-party audit brief',
          description: 'Compile pre/post metric differentials, beneficiary signatures, and photo logs.',
          status: 'TODO',
          priority: 'LOW',
          assigneeId: assignee2,
        },
      ]

      for (const t of sampleTasks) {
        await prisma.task.create({
          data: {
            projectId: prj.id,
            title: t.title,
            description: t.description,
            status: t.status,
            priority: t.priority,
            assigneeId: t.assigneeId,
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          },
        })
      }
    }

    // Ensure mentorship
    const currentMentorships = await prisma.mentorship.count({ where: { projectId: prj.id } })
    if (currentMentorships === 0) {
      const facultyId =
        facultyByUserEmail['prof.desai@iitb.ac.in'] ||
        facultyByUserEmail['dr.ravi.krishna@bits.ac.in'] ||
        facultyList[0]?.id
      if (facultyId) {
        await prisma.mentorship.create({
          data: {
            projectId: prj.id,
            facultyId,
            status: 'ACTIVE',
            notes: 'Weekly technical advisory and academic oversight for milestone verification.',
          },
        })
      }
    }

    // Ensure funding support
    const currentFunding = await prisma.fundingSupport.count({ where: { projectId: prj.id } })
    if (currentFunding === 0 && prj.industryPartnerId) {
      await prisma.fundingSupport.create({
        data: {
          projectId: prj.id,
          organizationId: prj.industryPartnerId,
          type: 'GRANT',
          amount: 650000,
          description: 'Corporate Social Responsibility (CSR) grant for prototype fabrication and deployment.',
          status: 'CONFIRMED',
        },
      })
    }
  }

  // Ensure every team has at least 2 members
  const allTeams = await prisma.team.findMany({
    include: { members: true },
  })

  const studentUsers = await prisma.user.findMany({ where: { role: 'STUDENT' } })

  for (let i = 0; i < allTeams.length; i++) {
    const tm = allTeams[i]
    if (tm.members.length === 0) {
      const u1 = studentUsers[i % studentUsers.length]
      const u2 = studentUsers[(i + 1) % studentUsers.length]
      await prisma.teamMember.createMany({
        data: [
          { teamId: tm.id, userId: u1.id, role: 'LEADER' },
          { teamId: tm.id, userId: u2.id, role: 'MEMBER' },
        ],
      })
      await prisma.team.update({
        where: { id: tm.id },
        data: { size: 3, verified: true, matchScore: 0.85 + (i % 10) * 0.01 },
      })
    }
  }

  console.log('✅ Data enrichment completed successfully!')
}

main()
  .catch((e) => {
    console.error('Error enriching data:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
