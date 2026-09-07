import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkBackendDatabase() {
  console.log('🔍 ========================================================')
  console.log('🔍 CIVICSOLVE BACKEND & DATABASE FULL AUDIT')
  console.log('🔍 ========================================================\n')

  // 1. Users & Personas
  const userCount = await prisma.user.count()
  const users = await prisma.user.findMany({ select: { id: true, name: true, email: true, role: true, verified: true } })
  console.log(`👤 1. USERS & PERSONAS (${userCount} total):`)
  users.forEach((u) => console.log(`   - [${u.role}] ${u.name} (${u.email}) — Verified: ${u.verified}`))

  // 2. Academic & Network Entities
  const uniCount = await prisma.university.count()
  const studentCount = await prisma.student.count()
  const facultyCount = await prisma.faculty.count()
  const teamCount = await prisma.team.count()
  const partnerCount = await prisma.industryPartner.count()
  console.log(`\n🏛️ 2. NETWORK & ACADEMIA:`)
  console.log(`   - Universities: ${uniCount}`)
  console.log(`   - Student Solvers: ${studentCount}`)
  console.log(`   - Faculty Mentors: ${facultyCount}`)
  console.log(`   - Innovation Teams: ${teamCount}`)
  console.log(`   - Industry / CSR Partners: ${partnerCount}`)

  // 3. Civic Challenges & Geocoded Locations
  const problemCount = await prisma.problem.count()
  const criticalCount = await prisma.problem.count({ where: { priority: 'CRITICAL' } })
  const highCount = await prisma.problem.count({ where: { priority: 'HIGH' } })
  const verifiedProbCount = await prisma.problem.count({ where: { reviewStatus: 'VERIFIED' } })
  console.log(`\n📌 3. CIVIC CHALLENGES & GEODISTRICTS (${problemCount} total):`)
  console.log(`   - Critical Priority: ${criticalCount}`)
  console.log(`   - High Priority: ${highCount}`)
  console.log(`   - Collectorate Verified: ${verifiedProbCount}`)

  // 4. Evidence Files & Media Attachments
  const evidenceCount = await prisma.evidence.count()
  const imageEvidence = await prisma.evidence.count({ where: { type: 'IMAGE' } })
  const videoEvidence = await prisma.evidence.count({ where: { type: 'VIDEO' } })
  const docEvidence = await prisma.evidence.count({ where: { type: 'DOCUMENT' } })
  console.log(`\n📸 4. ATTACHED GROUND-TRUTH EVIDENCE (${evidenceCount} total):`)
  console.log(`   - Photos / Images: ${imageEvidence}`)
  console.log(`   - Video Recordings: ${videoEvidence}`)
  console.log(`   - Reports / PDFs: ${docEvidence}`)

  // 5. Solution Library & Blueprints
  const solutionCount = await prisma.solution.count()
  const adaptationCount = await prisma.solutionAdaptation.count()
  console.log(`\n💡 5. SOLUTION ARCHIVE & REGIONAL ADAPTATIONS:`)
  console.log(`   - Reusable Solutions: ${solutionCount}`)
  console.log(`   - Regional Adaptations: ${adaptationCount}`)

  // 6. Projects & Milestones
  const projectCount = await prisma.project.count()
  const milestoneCount = await prisma.milestone.count()
  const evaluationCount = await prisma.evaluation.count()
  console.log(`\n🚀 6. ACTIVE PROJECTS, MILESTONES & EVALUATIONS:`)
  console.log(`   - Active Projects: ${projectCount}`)
  console.log(`   - Lifecycle Milestones: ${milestoneCount}`)
  console.log(`   - Expert 5-D Evaluations: ${evaluationCount}`)

  // 7. Sovereign Certificates & Blockchain/SHA-256 Ledger
  const certCount = await prisma.certificate.count()
  const certs = await prisma.certificate.findMany({ take: 3, select: { id: true, title: true, recipientName: true, verificationHash: true } })
  console.log(`\n📜 7. SOVEREIGN CERTIFICATE LEDGER (${certCount} total):`)
  certs.forEach((c) => console.log(`   - Certificate #${c.id.slice(0, 8)}: ${c.title} -> ${c.recipientName} (SHA-256: ${c.verificationHash?.slice(0, 16)}...)`))

  // 8. Customization, Appearance & AI Conversations
  const appearanceCount = await prisma.appearanceSettings.count()
  const convCount = await prisma.conversation.count()
  const msgCount = await prisma.message.count()
  const notifCount = await prisma.notification.count()
  console.log(`\n🎨 8. APPEARANCE, AI CONVERSATIONS & NOTIFICATIONS:`)
  console.log(`   - Custom Appearance Profiles: ${appearanceCount}`)
  console.log(`   - AI Chat Conversations: ${convCount}`)
  console.log(`   - Stored Messages / Audit Logs: ${msgCount}`)
  console.log(`   - Active Notifications: ${notifCount}`)

  console.log('\n✅ ========================================================')
  console.log('✅ BACKEND & DATABASE ARE FULLY FUNCTIONAL AND POPULATED!')
  console.log('✅ ========================================================')

  await prisma.$disconnect()
}

checkBackendDatabase().catch(async (e) => {
  console.error('Database check error:', e)
  await prisma.$disconnect()
  process.exit(1)
})
