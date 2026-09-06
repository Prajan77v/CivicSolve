import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding CivicSolve database...')

  // Clear in reverse order
  await prisma.auditLog.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.leaderboardScore.deleteMany()
  await prisma.certificateVerification.deleteMany()
  await prisma.certificate.deleteMany()
  await prisma.communityFeedback.deleteMany()
  await prisma.message.deleteMany()
  await prisma.projectUpdate.deleteMany()
  await prisma.impactMetric.deleteMany()
  await prisma.deployment.deleteMany()
  await prisma.fundingSupport.deleteMany()
  await prisma.mentorship.deleteMany()
  await prisma.proposal.deleteMany()
  await prisma.task.deleteMany()
  await prisma.milestone.deleteMany()
  await prisma.project.deleteMany()
  await prisma.problemSimilarity.deleteMany()
  await prisma.problemAIAnalysis.deleteMany()
  await prisma.problemEvidence.deleteMany()
  await prisma.problemLocation.deleteMany()
  await prisma.problem.deleteMany()
  await prisma.teamMember.deleteMany()
  await prisma.team.deleteMany()
  await prisma.student.deleteMany()
  await prisma.faculty.deleteMany()
  await prisma.department.deleteMany()
  await prisma.organization.deleteMany()
  await prisma.university.deleteMany()
  await prisma.user.deleteMany()

  const pw = await bcrypt.hash('password123', 10)

  // Universities
  const iitb = await prisma.university.create({ data: { name: 'Indian Institute of Technology Bombay', shortName: 'IIT Bombay', city: 'Mumbai', state: 'Maharashtra', expertise: JSON.stringify(['IoT', 'AI/ML', 'Water Technology', 'Smart Cities', 'Embedded Systems']), ranking: 1, verified: true } })
  const bits = await prisma.university.create({ data: { name: 'BITS Pilani', shortName: 'BITS Pilani', city: 'Pilani', state: 'Rajasthan', expertise: JSON.stringify(['Environmental Engineering', 'Data Analytics', 'Renewable Energy', 'Healthcare Tech']), ranking: 3, verified: true } })
  const nitt = await prisma.university.create({ data: { name: 'National Institute of Technology Trichy', shortName: 'NIT Trichy', city: 'Tiruchirappalli', state: 'Tamil Nadu', expertise: JSON.stringify(['Civil Engineering', 'Water Management', 'Transportation', 'Structural Engineering']), ranking: 5, verified: true } })
  const iitd = await prisma.university.create({ data: { name: 'Indian Institute of Technology Delhi', shortName: 'IIT Delhi', city: 'New Delhi', state: 'Delhi', expertise: JSON.stringify(['Air Quality', 'Urban Planning', 'Public Health', 'Policy Tech', 'Biotechnology']), ranking: 2, verified: true } })
  const iiith = await prisma.university.create({ data: { name: 'IIIT Hyderabad', shortName: 'IIIT Hyderabad', city: 'Hyderabad', state: 'Telangana', expertise: JSON.stringify(['Machine Learning', 'Computer Vision', 'NLP', 'Smart Agriculture', 'Data Science']), ranking: 7, verified: true } })

  // Departments
  const cseIITB = await prisma.department.create({ data: { name: 'Computer Science & Engineering', universityId: iitb.id, expertise: JSON.stringify(['IoT', 'AI/ML', 'Embedded Systems']) } })
  const ceIITB = await prisma.department.create({ data: { name: 'Civil & Environmental Engineering', universityId: iitb.id, expertise: JSON.stringify(['Water Technology', 'Smart Infrastructure']) } })
  const cseBITS = await prisma.department.create({ data: { name: 'Computer Science', universityId: bits.id, expertise: JSON.stringify(['Data Analytics', 'ML', 'Healthcare Tech']) } })
  const ceNITT = await prisma.department.create({ data: { name: 'Civil Engineering', universityId: nitt.id, expertise: JSON.stringify(['Transportation', 'Water Management', 'Structural Engineering']) } })
  const cseIITD = await prisma.department.create({ data: { name: 'Computer Science', universityId: iitd.id, expertise: JSON.stringify(['AI', 'Data Science', 'Policy Tech']) } })
  const cseIIITH = await prisma.department.create({ data: { name: 'Computer Science & Engineering', universityId: iiith.id, expertise: JSON.stringify(['ML', 'Computer Vision', 'NLP']) } })

  // Organizations
  const tcs = await prisma.organization.create({ data: { name: 'Tata Consultancy Services', type: 'INDUSTRY', sector: 'Technology', expertise: JSON.stringify(['IoT', 'Cloud', 'AI', 'Smart Cities']), city: 'Mumbai', state: 'Maharashtra', verified: true } })
  const wipro = await prisma.organization.create({ data: { name: 'Wipro EcoEnergy', type: 'INDUSTRY', sector: 'Energy & Environment', expertise: JSON.stringify(['Water Treatment', 'Renewable Energy', 'Environmental Monitoring']), city: 'Bengaluru', state: 'Karnataka', verified: true } })
  const jal = await prisma.organization.create({ data: { name: 'Jal Jeevan Mission NGO', type: 'NGO', sector: 'Water & Sanitation', expertise: JSON.stringify(['Rural Water Access', 'Community Mobilization', 'Water Testing']), city: 'New Delhi', state: 'Delhi', verified: true } })
  const smartCity = await prisma.organization.create({ data: { name: 'Smart City Solutions', type: 'STARTUP', sector: 'Urban Tech', expertise: JSON.stringify(['Traffic Management', 'Smart Lighting', 'Urban IoT']), city: 'Pune', state: 'Maharashtra', verified: true } })
  const agriTech = await prisma.organization.create({ data: { name: 'AgriBridge Technologies', type: 'STARTUP', sector: 'AgriTech', expertise: JSON.stringify(['Precision Farming', 'IoT Sensors', 'Drone Tech']), city: 'Hyderabad', state: 'Telangana', verified: true } })
  const healthFirst = await prisma.organization.create({ data: { name: 'HealthFirst Foundation', type: 'NGO', sector: 'Healthcare', expertise: JSON.stringify(['Telemedicine', 'Rural Healthcare', 'Medical Devices']), city: 'Chennai', state: 'Tamil Nadu', verified: true } })

  // Users
  const adminUser = await prisma.user.create({ data: { email: 'admin@civicsolve.in', name: 'Platform Admin', password: pw, role: 'ADMIN', verified: true, bio: 'CivicSolve platform administrator' } })
  const govUser = await prisma.user.create({ data: { email: 'collector@maharashtra.gov.in', name: 'Rajesh Patil', password: pw, role: 'GOVERNMENT', verified: true, bio: 'District Collector, Pune Division, Maharashtra' } })
  const citizen1 = await prisma.user.create({ data: { email: 'priya.sharma@gmail.com', name: 'Priya Sharma', password: pw, role: 'CITIZEN', verified: true, bio: 'Social activist and resident of Nashik. Passionate about rural water access.' } })
  const citizen2 = await prisma.user.create({ data: { email: 'mohan.kumar@gmail.com', name: 'Mohan Kumar', password: pw, role: 'CITIZEN', verified: true, bio: 'Cotton farmer from Vidarbha region, Maharashtra.' } })
  const citizen3 = await prisma.user.create({ data: { email: 'fatima.sheikh@gmail.com', name: 'Fatima Sheikh', password: pw, role: 'CITIZEN', verified: false } })

  const fUser1 = await prisma.user.create({ data: { email: 'prof.desai@iitb.ac.in', name: 'Prof. Anita Desai', password: pw, role: 'FACULTY', verified: true, bio: 'Professor of Environmental Engineering, IIT Bombay. 15+ years in water technology.' } })
  const fUser2 = await prisma.user.create({ data: { email: 'prof.krishna@bits.ac.in', name: 'Dr. Ravi Krishna', password: pw, role: 'FACULTY', verified: true, bio: 'Associate Professor, Data Science & Healthcare Analytics, BITS Pilani.' } })
  const fUser3 = await prisma.user.create({ data: { email: 'prof.menon@nitt.edu', name: 'Dr. Suresh Menon', password: pw, role: 'FACULTY', verified: true, bio: 'Professor, Civil Engineering & Transportation, NIT Trichy.' } })
  const fUser4 = await prisma.user.create({ data: { email: 'prof.gupta@iitd.ac.in', name: 'Prof. Vikram Gupta', password: pw, role: 'FACULTY', verified: true, bio: 'Professor, Air Quality Research & Public Policy, IIT Delhi.' } })

  const faculty1 = await prisma.faculty.create({ data: { userId: fUser1.id, universityId: iitb.id, departmentId: ceIITB.id, specializations: JSON.stringify(['IoT', 'Water Technology', 'Environmental Monitoring']), designation: 'Professor' } })
  const faculty2 = await prisma.faculty.create({ data: { userId: fUser2.id, universityId: bits.id, departmentId: cseBITS.id, specializations: JSON.stringify(['Data Analytics', 'ML', 'Healthcare']), designation: 'Associate Professor' } })
  const faculty3 = await prisma.faculty.create({ data: { userId: fUser3.id, universityId: nitt.id, departmentId: ceNITT.id, specializations: JSON.stringify(['Transportation', 'Civil Engineering', 'Urban Planning']), designation: 'Professor' } })
  const faculty4 = await prisma.faculty.create({ data: { userId: fUser4.id, universityId: iitd.id, departmentId: cseIITD.id, specializations: JSON.stringify(['Air Quality', 'Data Science', 'Public Policy']), designation: 'Professor' } })

  const sUsers = await Promise.all([
    prisma.user.create({ data: { email: 'arun.kumar@iitb.ac.in', name: 'Arun Kumar', password: pw, role: 'STUDENT', verified: true, bio: 'B.Tech CSE final year, IIT Bombay. IoT and smart cities enthusiast.' } }),
    prisma.user.create({ data: { email: 'divya.patel@bits.ac.in', name: 'Divya Patel', password: pw, role: 'STUDENT', verified: true, bio: 'M.Tech Data Science, BITS Pilani. Healthcare analytics researcher.' } }),
    prisma.user.create({ data: { email: 'rahul.singh@nitt.edu', name: 'Rahul Singh', password: pw, role: 'STUDENT', verified: true, bio: 'B.Tech Civil, NIT Trichy. Transportation and urban planning.' } }),
    prisma.user.create({ data: { email: 'meera.nair@iitd.ac.in', name: 'Meera Nair', password: pw, role: 'STUDENT', verified: true, bio: 'PhD, Air Quality Research, IIT Delhi.' } }),
    prisma.user.create({ data: { email: 'karthik.r@iiith.ac.in', name: 'Karthik Rajan', password: pw, role: 'STUDENT', verified: true, bio: 'M.Tech ML, IIIT Hyderabad. Agricultural AI researcher.' } }),
    prisma.user.create({ data: { email: 'sneha.joshi@iitb.ac.in', name: 'Sneha Joshi', password: pw, role: 'STUDENT', verified: true, bio: 'B.Tech Electrical, IIT Bombay.' } }),
    prisma.user.create({ data: { email: 'amit.verma@bits.ac.in', name: 'Amit Verma', password: pw, role: 'STUDENT', verified: true, bio: 'B.Tech CSE, BITS Pilani.' } }),
    prisma.user.create({ data: { email: 'pooja.iyer@nitt.edu', name: 'Pooja Iyer', password: pw, role: 'STUDENT', verified: true, bio: 'M.Tech Environmental Engineering, NIT Trichy.' } }),
    prisma.user.create({ data: { email: 'rohan.malhotra@iitd.ac.in', name: 'Rohan Malhotra', password: pw, role: 'STUDENT', verified: true, bio: 'B.Tech CS, IIT Delhi.' } }),
    prisma.user.create({ data: { email: 'ananya.das@iiith.ac.in', name: 'Ananya Das', password: pw, role: 'STUDENT', verified: true, bio: 'M.Tech Computer Vision, IIIT Hyderabad.' } }),
  ])

  const studentProfiles = await Promise.all([
    prisma.student.create({ data: { userId: sUsers[0].id, universityId: iitb.id, departmentId: cseIITB.id, skills: JSON.stringify(['IoT', 'Embedded Systems', 'Python', 'Water Management']), yearOfStudy: 4, impactScore: 185, problemsSolved: 7, deploymentsCount: 4, peopleImpacted: 2350 } }),
    prisma.student.create({ data: { userId: sUsers[1].id, universityId: bits.id, departmentId: cseBITS.id, skills: JSON.stringify(['Data Analytics', 'ML', 'Healthcare', 'Python', 'R']), yearOfStudy: 2, impactScore: 120, problemsSolved: 4, deploymentsCount: 2, peopleImpacted: 1200 } }),
    prisma.student.create({ data: { userId: sUsers[2].id, universityId: nitt.id, departmentId: ceNITT.id, skills: JSON.stringify(['Transportation', 'Civil Engineering', 'AutoCAD', 'GIS']), yearOfStudy: 3, impactScore: 95, problemsSolved: 3, deploymentsCount: 1, peopleImpacted: 800 } }),
    prisma.student.create({ data: { userId: sUsers[3].id, universityId: iitd.id, departmentId: cseIITD.id, skills: JSON.stringify(['Air Quality', 'Data Science', 'Environmental Science', 'Python']), yearOfStudy: 3, impactScore: 140, problemsSolved: 5, deploymentsCount: 2, peopleImpacted: 15000 } }),
    prisma.student.create({ data: { userId: sUsers[4].id, universityId: iiith.id, departmentId: cseIIITH.id, skills: JSON.stringify(['Machine Learning', 'Computer Vision', 'Drone Tech', 'Agriculture AI']), yearOfStudy: 2, impactScore: 162, problemsSolved: 5, deploymentsCount: 3, peopleImpacted: 3800 } }),
    prisma.student.create({ data: { userId: sUsers[5].id, universityId: iitb.id, departmentId: cseIITB.id, skills: JSON.stringify(['Embedded Systems', 'Circuit Design', 'IoT', 'Arduino']), yearOfStudy: 3, impactScore: 75, problemsSolved: 2, deploymentsCount: 1, peopleImpacted: 600 } }),
    prisma.student.create({ data: { userId: sUsers[6].id, universityId: bits.id, departmentId: cseBITS.id, skills: JSON.stringify(['Full Stack', 'React', 'Node.js', 'Mobile Dev']), yearOfStudy: 4, impactScore: 80, problemsSolved: 3, deploymentsCount: 1, peopleImpacted: 450 } }),
    prisma.student.create({ data: { userId: sUsers[7].id, universityId: nitt.id, departmentId: ceNITT.id, skills: JSON.stringify(['Environmental Engineering', 'Water Treatment', 'Chemistry']), yearOfStudy: 2, impactScore: 60, problemsSolved: 2, deploymentsCount: 0, peopleImpacted: 300 } }),
    prisma.student.create({ data: { userId: sUsers[8].id, universityId: iitd.id, departmentId: cseIITD.id, skills: JSON.stringify(['AI', 'NLP', 'Data Science', 'Policy']), yearOfStudy: 4, impactScore: 90, problemsSolved: 3, deploymentsCount: 1, peopleImpacted: 700 } }),
    prisma.student.create({ data: { userId: sUsers[9].id, universityId: iiith.id, departmentId: cseIIITH.id, skills: JSON.stringify(['Computer Vision', 'Deep Learning', 'Python', 'TensorFlow']), yearOfStudy: 2, impactScore: 65, problemsSolved: 2, deploymentsCount: 0, peopleImpacted: 200 } }),
  ])

  // Teams
  const team1 = await prisma.team.create({ data: { name: 'AquaTech Innovators', universityId: iitb.id, departmentId: cseIITB.id, skills: JSON.stringify(['IoT', 'Water Technology', 'Embedded Systems', 'Data Analytics']), size: 4, verified: true, matchScore: 0.92 } })
  const team2 = await prisma.team.create({ data: { name: 'GreenPath Solutions', universityId: bits.id, departmentId: cseBITS.id, skills: JSON.stringify(['Environmental Engineering', 'Data Science', 'Mobile Dev']), size: 3, verified: true, matchScore: 0.88 } })
  const team3 = await prisma.team.create({ data: { name: 'TrafficFlow AI', universityId: nitt.id, departmentId: ceNITT.id, skills: JSON.stringify(['Traffic Management', 'Computer Vision', 'Urban Planning', 'GIS']), size: 5, verified: true, matchScore: 0.85 } })
  const team4 = await prisma.team.create({ data: { name: 'AirGuard Lab', universityId: iitd.id, departmentId: cseIITD.id, skills: JSON.stringify(['Air Quality Monitoring', 'IoT Sensors', 'Data Science', 'Public Health']), size: 4, verified: true, matchScore: 0.90 } })
  const team5 = await prisma.team.create({ data: { name: 'FarmSense AI', universityId: iiith.id, departmentId: cseIIITH.id, skills: JSON.stringify(['Machine Learning', 'Drone Tech', 'Computer Vision', 'Agriculture Tech']), size: 3, verified: true, matchScore: 0.87 } })
  const team6 = await prisma.team.create({ data: { name: 'SmartGrid Pioneers', universityId: nitt.id, departmentId: ceNITT.id, skills: JSON.stringify(['Power Systems', 'IoT', 'Smart Grids', 'Energy']), size: 4, verified: false, matchScore: 0.78 } })
  const team7 = await prisma.team.create({ data: { name: 'HealthBridge', universityId: bits.id, departmentId: cseBITS.id, skills: JSON.stringify(['Healthcare Tech', 'ML', 'Telemedicine', 'Mobile']), size: 4, verified: true, matchScore: 0.83 } })
  const team8 = await prisma.team.create({ data: { name: 'WasteWise', universityId: iitb.id, departmentId: ceIITB.id, skills: JSON.stringify(['Waste Management', 'IoT', 'Route Optimization', 'Community']), size: 3, verified: true, matchScore: 0.80 } })
  const team9 = await prisma.team.create({ data: { name: 'FloodShield', universityId: nitt.id, departmentId: ceNITT.id, skills: JSON.stringify(['Flood Monitoring', 'Hydrology', 'IoT Sensors', 'Early Warning']), size: 5, verified: true, matchScore: 0.86 } })
  const team10 = await prisma.team.create({ data: { name: 'EduReach', universityId: iiith.id, departmentId: cseIIITH.id, skills: JSON.stringify(['EdTech', 'Offline Learning', 'Low Bandwidth', 'Content Design']), size: 3, verified: false, matchScore: 0.75 } })

  await prisma.teamMember.createMany({ data: [
    { teamId: team1.id, userId: sUsers[0].id, role: 'LEADER' },
    { teamId: team1.id, userId: sUsers[5].id, role: 'MEMBER' },
    { teamId: team2.id, userId: sUsers[1].id, role: 'LEADER' },
    { teamId: team2.id, userId: sUsers[7].id, role: 'MEMBER' },
    { teamId: team3.id, userId: sUsers[2].id, role: 'LEADER' },
    { teamId: team4.id, userId: sUsers[3].id, role: 'LEADER' },
    { teamId: team5.id, userId: sUsers[4].id, role: 'LEADER' },
    { teamId: team5.id, userId: sUsers[9].id, role: 'MEMBER' },
    { teamId: team7.id, userId: sUsers[6].id, role: 'MEMBER' },
    { teamId: team9.id, userId: sUsers[8].id, role: 'MEMBER' },
  ]})

  // Problems
  const p1 = await prisma.problem.create({ data: { title: 'Severe Groundwater Contamination in Nashik Rural Villages', description: 'Over 2,500 residents across 6 villages in Nashik district face severe groundwater contamination with arsenic and fluoride levels 3-4x above safe limits. Multiple children have developed dental fluorosis. Contamination stems from agricultural runoff and an unmonitored industrial unit upstream.', category: 'WATER', subcategory: 'Groundwater Quality', priority: 'CRITICAL', status: 'IMPACT_VERIFIED', submittedById: citizen1.id, affectedCount: 2500, tags: JSON.stringify(['water', 'contamination', 'health', 'rural', 'arsenic']), sdgGoals: JSON.stringify(['6', '3', '11']) } })
  await prisma.problemLocation.create({ data: { problemId: p1.id, address: 'Sinnar Taluka, Nashik', district: 'Nashik', state: 'Maharashtra', pincode: '422103', lat: 19.8488, lng: 74.0025 } })
  await prisma.problemAIAnalysis.create({ data: { problemId: p1.id, domain: 'Water Management', subdomain: 'Groundwater Quality', confidence: 0.94, priorityScore: 0.97, priorityReason: 'CRITICAL: Immediate health risk to 2,500+ residents including children. Arsenic and fluoride levels are 3-4x WHO safe limits. Ongoing health deterioration confirmed by district health officer.', affectedEstimate: 2500, duplicateRisk: 0.08, detectedTech: JSON.stringify(['IoT Water Sensors', 'Water Quality Monitoring', 'GIS Mapping', 'Filtration Systems']), recommendedSkills: JSON.stringify(['Environmental Engineering', 'IoT', 'Water Treatment', 'Community Health', 'GIS']), sdgAlignment: JSON.stringify(['6', '3', '11']), matchedUniversities: JSON.stringify([{name:'IIT Bombay',score:0.92,reason:'Strong IoT and water tech'},{name:'NIT Trichy',score:0.87,reason:'Civil engineering expertise'}]), matchedTeams: JSON.stringify([{name:'AquaTech Innovators',score:0.95,skills:['IoT','Water Technology']},{name:'WasteWise',score:0.71,skills:['IoT']}]), matchedIndustry: JSON.stringify([{name:'Wipro EcoEnergy',score:0.91,type:'INDUSTRY'},{name:'Jal Jeevan Mission NGO',score:0.96,type:'NGO'}]), nextSteps: JSON.stringify(['Conduct immediate water quality testing', 'Deploy IoT sensors for real-time monitoring', 'Design low-cost filtration solution', 'Community awareness program']) } })

  const p2 = await prisma.problem.create({ data: { title: 'Chronic Traffic Gridlock at Pune-Nashik Highway Junction', description: 'The Dehu Road intersection on Pune-Nashik highway experiences 2-3 hour daily gridlocks. 45,000 vehicles use this junction daily. Emergency vehicles are frequently delayed. AI signal management and route optimization are urgently needed.', category: 'TRAFFIC', subcategory: 'Signal Management', priority: 'HIGH', status: 'PROTOTYPE', submittedById: citizen2.id, affectedCount: 45000, tags: JSON.stringify(['traffic', 'congestion', 'AI signals', 'smart city']), sdgGoals: JSON.stringify(['11', '13', '9']) } })
  await prisma.problemLocation.create({ data: { problemId: p2.id, address: 'Dehu Road, Pune-Nashik Highway', district: 'Pune', state: 'Maharashtra', lat: 18.7176, lng: 73.7679 } })
  await prisma.problemAIAnalysis.create({ data: { problemId: p2.id, domain: 'Urban Mobility', subdomain: 'Traffic Management', confidence: 0.91, priorityScore: 0.83, priorityReason: 'HIGH: 45,000 vehicles affected daily. Emergency vehicle delays pose life-threatening risks. Compound air quality impact.', affectedEstimate: 45000, duplicateRisk: 0.22, detectedTech: JSON.stringify(['Computer Vision', 'AI Signal Control', 'Edge Computing', 'IoT Sensors']), recommendedSkills: JSON.stringify(['Computer Vision', 'Traffic Engineering', 'AI/ML', 'Edge Computing']), sdgAlignment: JSON.stringify(['11', '13']), matchedUniversities: JSON.stringify([{name:'NIT Trichy',score:0.85},{name:'IIIT Hyderabad',score:0.82}]), matchedTeams: JSON.stringify([{name:'TrafficFlow AI',score:0.91},{name:'FarmSense AI',score:0.67}]), matchedIndustry: JSON.stringify([{name:'Smart City Solutions',score:0.93,type:'STARTUP'},{name:'TCS',score:0.78,type:'INDUSTRY'}]), nextSteps: JSON.stringify(['Deploy computer vision at 3 key intersections', 'Build AI signal timing model', 'Integrate emergency vehicle priority', 'Pilot for 3 months']) } })

  const p3 = await prisma.problem.create({ data: { title: 'Hazardous Air Quality in Delhi Okhla Industrial Corridor', description: 'PM2.5 levels in Okhla-Badarpur corridor consistently exceed 300 μg/m³ (WHO limit: 15). Over 1.2 million residents exposed daily. Industrial emissions, vehicle exhaust, and crop stubble burning compound the problem. Real-time hyperlocal monitoring urgently needed.', category: 'AIR_QUALITY', subcategory: 'Industrial Pollution', priority: 'CRITICAL', status: 'PILOT', submittedById: citizen3.id, affectedCount: 1200000, tags: JSON.stringify(['air quality', 'PM2.5', 'Delhi', 'industrial', 'health']), sdgGoals: JSON.stringify(['3', '11', '13']) } })
  await prisma.problemLocation.create({ data: { problemId: p3.id, address: 'Okhla Industrial Area, South Delhi', district: 'South Delhi', state: 'Delhi', lat: 28.5494, lng: 77.2683 } })
  await prisma.problemAIAnalysis.create({ data: { problemId: p3.id, domain: 'Environmental Health', subdomain: 'Air Quality Monitoring', confidence: 0.97, priorityScore: 0.99, priorityReason: 'CRITICAL: 1.2M residents exposed to air 20x above WHO safe limits. Direct public health emergency.', affectedEstimate: 1200000, duplicateRisk: 0.15, detectedTech: JSON.stringify(['IoT Air Sensors', 'Predictive Modeling', 'Real-time Dashboard', 'Mobile Alerts']), recommendedSkills: JSON.stringify(['Environmental Science', 'IoT', 'Data Science', 'Public Health', 'Policy']), sdgAlignment: JSON.stringify(['3', '11', '13']), matchedUniversities: JSON.stringify([{name:'IIT Delhi',score:0.95},{name:'BITS Pilani',score:0.80}]), matchedTeams: JSON.stringify([{name:'AirGuard Lab',score:0.96},{name:'SmartGrid Pioneers',score:0.62}]), matchedIndustry: JSON.stringify([{name:'TCS',score:0.88,type:'INDUSTRY'},{name:'Wipro EcoEnergy',score:0.85,type:'INDUSTRY'}]), nextSteps: JSON.stringify(['Deploy 50 hyperlocal IoT sensors', 'Build real-time data pipeline', 'Create public alert dashboard', 'Integrate with health department alerts']) } })

  const p4 = await prisma.problem.create({ data: { title: 'Irregular Irrigation and Crop Failure in Vidarbha Cotton Belt', description: 'Farmers in 23 villages of Vidarbha lose 40-60% of cotton and soybean crops annually due to irregular irrigation and lack of real-time soil moisture data. Financial distress has led to farmer suicides. A smart irrigation system with soil sensors can drastically improve yield.', category: 'AGRICULTURE', subcategory: 'Smart Irrigation', priority: 'HIGH', status: 'DEPLOYED', submittedById: citizen2.id, affectedCount: 3800, tags: JSON.stringify(['agriculture', 'irrigation', 'IoT', 'Vidarbha', 'farmer']), sdgGoals: JSON.stringify(['2', '15', '8']) } })
  await prisma.problemLocation.create({ data: { problemId: p4.id, address: 'Yavatmal District, Vidarbha', district: 'Yavatmal', state: 'Maharashtra', lat: 20.3888, lng: 78.1204 } })
  await prisma.problemAIAnalysis.create({ data: { problemId: p4.id, domain: 'Agriculture Technology', subdomain: 'Precision Irrigation', confidence: 0.89, priorityScore: 0.88, priorityReason: 'HIGH: Direct link to farmer suicides and 3,800+ livelihoods. Crop losses are economically devastating. Technology solution is feasible.', affectedEstimate: 3800, duplicateRisk: 0.12, detectedTech: JSON.stringify(['IoT Soil Sensors', 'Weather API Integration', 'Mobile App', 'Drip Irrigation Control', 'ML Crop Modeling']), recommendedSkills: JSON.stringify(['Agriculture Engineering', 'IoT', 'Machine Learning', 'Mobile Development', 'Agronomy']), sdgAlignment: JSON.stringify(['2', '15', '8']), matchedUniversities: JSON.stringify([{name:'IIIT Hyderabad',score:0.87},{name:'IIT Bombay',score:0.83}]), matchedTeams: JSON.stringify([{name:'FarmSense AI',score:0.92},{name:'AquaTech Innovators',score:0.75}]), matchedIndustry: JSON.stringify([{name:'AgriBridge Technologies',score:0.96,type:'STARTUP'},{name:'Wipro EcoEnergy',score:0.72,type:'INDUSTRY'}]), nextSteps: JSON.stringify(['Soil analysis in pilot villages', 'Deploy IoT sensor network', 'Develop farmer mobile app', 'Train agricultural extension workers']) } })

  const p5 = await prisma.problem.create({ data: { title: 'Overflowing Municipal Waste in Aurangabad — Inefficient Collection', description: 'Aurangabad generates 450 tonnes of solid waste daily but only 60% reaches processing facility. Irregular collection, no bin sensors, and no route optimization cause open dumping near residential areas leading to disease outbreaks.', category: 'WASTE', subcategory: 'Municipal Solid Waste', priority: 'HIGH', status: 'TEAM_FORMED', submittedById: citizen1.id, affectedCount: 380000, tags: JSON.stringify(['waste', 'municipal', 'IoT bins', 'route optimization']), sdgGoals: JSON.stringify(['11', '12', '3']) } })
  await prisma.problemLocation.create({ data: { problemId: p5.id, address: 'Aurangabad Municipal Corporation', district: 'Aurangabad', state: 'Maharashtra', lat: 19.8762, lng: 75.3433 } })
  await prisma.problemAIAnalysis.create({ data: { problemId: p5.id, domain: 'Urban Sanitation', subdomain: 'Waste Collection Optimization', confidence: 0.88, priorityScore: 0.81, priorityReason: 'HIGH: 380,000 residents affected. Disease outbreak risk from open dumping.', affectedEstimate: 380000, duplicateRisk: 0.18, detectedTech: JSON.stringify(['IoT Smart Bins', 'GPS Tracking', 'Route Optimization', 'Mobile App']), recommendedSkills: JSON.stringify(['IoT', 'Operations Research', 'Mobile Dev', 'Community Engagement']), sdgAlignment: JSON.stringify(['11', '12']), matchedUniversities: JSON.stringify([{name:'IIT Bombay',score:0.82},{name:'BITS Pilani',score:0.78}]), matchedTeams: JSON.stringify([{name:'WasteWise',score:0.88},{name:'SmartGrid Pioneers',score:0.70}]), matchedIndustry: JSON.stringify([{name:'Smart City Solutions',score:0.84,type:'STARTUP'},{name:'TCS',score:0.75,type:'INDUSTRY'}]), nextSteps: JSON.stringify(['Map existing waste collection routes', 'Design IoT bin sensor prototype', 'Develop route optimization algorithm', 'Pilot in 2 wards']) } })

  const p6 = await prisma.problem.create({ data: { title: 'Flood Early Warning System for Coastal Villages in Kendrapara, Odisha', description: 'Over 18 coastal villages in Kendrapara district, Odisha face annual flooding during monsoon, displacing 12,000+ residents. Current warning systems are manual and unreliable. An automated river level monitoring + early warning system can save lives.', category: 'INFRASTRUCTURE', subcategory: 'Flood Warning', priority: 'CRITICAL', status: 'MATCHED', submittedById: citizen3.id, affectedCount: 12000, tags: JSON.stringify(['flood', 'early warning', 'coastal', 'Odisha', 'IoT']), sdgGoals: JSON.stringify(['11', '13', '15']) } })
  await prisma.problemLocation.create({ data: { problemId: p6.id, address: 'Kendrapara District Coast', district: 'Kendrapara', state: 'Odisha', lat: 20.4986, lng: 86.4194 } })
  await prisma.problemAIAnalysis.create({ data: { problemId: p6.id, domain: 'Disaster Management', subdomain: 'Flood Early Warning', confidence: 0.92, priorityScore: 0.95, priorityReason: 'CRITICAL: Annual displacement of 12,000 residents. Risk to life is direct. Technology solution exists.', affectedEstimate: 12000, duplicateRisk: 0.05, detectedTech: JSON.stringify(['IoT Water Level Sensors', 'SMS Alert System', 'Predictive Modeling', 'GIS']), recommendedSkills: JSON.stringify(['Hydrology', 'IoT', 'Disaster Management', 'GIS', 'Communication Systems']), sdgAlignment: JSON.stringify(['11', '13']), matchedUniversities: JSON.stringify([{name:'NIT Trichy',score:0.88},{name:'IIT Bombay',score:0.80}]), matchedTeams: JSON.stringify([{name:'FloodShield',score:0.93},{name:'AquaTech Innovators',score:0.77}]), matchedIndustry: JSON.stringify([{name:'TCS',score:0.82,type:'INDUSTRY'},{name:'Smart City Solutions',score:0.71,type:'STARTUP'}]), nextSteps: JSON.stringify(['Install river level monitoring stations', 'Create SMS alert network', 'Build predictive flood model', 'Train local disaster response teams']) } })

  const p7 = await prisma.problem.create({ data: { title: 'Unmanageable OPD Queues at Government Hospitals in Amravati', description: 'Government hospitals in Amravati see 800-1200 OPD patients daily with 4-6 hour wait times. No digital queue system exists. Patients arrive at 4 AM to secure tokens. Elderly and seriously ill patients stand for hours. Smart queue management with digital tokens can transform patient experience.', category: 'HEALTH', subcategory: 'Hospital Queue Management', priority: 'HIGH', status: 'PROPOSAL', submittedById: citizen1.id, affectedCount: 8000, tags: JSON.stringify(['healthcare', 'queue', 'OPD', 'government hospital']), sdgGoals: JSON.stringify(['3', '10', '11']) } })
  await prisma.problemLocation.create({ data: { problemId: p7.id, address: 'Civil Hospital, Amravati', district: 'Amravati', state: 'Maharashtra', lat: 20.9320, lng: 77.7523 } })
  await prisma.problemAIAnalysis.create({ data: { problemId: p7.id, domain: 'Healthcare Technology', subdomain: 'Queue Management', confidence: 0.85, priorityScore: 0.79, priorityReason: 'HIGH: 8,000 patients/day facing dignity and health risks from prolonged waits.', affectedEstimate: 8000, duplicateRisk: 0.20, detectedTech: JSON.stringify(['Queue Management System', 'SMS Gateway', 'Mobile App', 'Digital Displays']), recommendedSkills: JSON.stringify(['Healthcare IT', 'Mobile Development', 'UX Design', 'System Integration']), sdgAlignment: JSON.stringify(['3', '10']), matchedUniversities: JSON.stringify([{name:'BITS Pilani',score:0.88},{name:'IIIT Hyderabad',score:0.81}]), matchedTeams: JSON.stringify([{name:'HealthBridge',score:0.91},{name:'EduReach',score:0.62}]), matchedIndustry: JSON.stringify([{name:'HealthFirst Foundation',score:0.90,type:'NGO'},{name:'TCS',score:0.80,type:'INDUSTRY'}]), nextSteps: JSON.stringify(['Map current patient journey', 'Design digital queue system', 'Pilot in 1 OPD department', 'Measure wait time reduction']) } })

  const p8 = await prisma.problem.create({ data: { title: 'Non-functional Streetlights Across 40% of Bhopal Ward Areas', description: 'RWA survey found 42% of streetlights across 12 Bhopal wards non-functional. Manual reporting takes 3-7 days for response. Women and elderly feel unsafe. IoT monitoring for real-time fault detection and automated work orders needed.', category: 'INFRASTRUCTURE', subcategory: 'Smart Lighting', priority: 'MEDIUM', status: 'AI_ANALYZED', submittedById: citizen2.id, affectedCount: 95000, tags: JSON.stringify(['streetlight', 'IoT', 'safety', 'municipal']), sdgGoals: JSON.stringify(['11', '7']) } })
  await prisma.problemLocation.create({ data: { problemId: p8.id, district: 'Bhopal', state: 'Madhya Pradesh', lat: 23.2599, lng: 77.4126 } })
  await prisma.problemAIAnalysis.create({ data: { problemId: p8.id, domain: 'Smart Infrastructure', subdomain: 'Smart Lighting', confidence: 0.83, priorityScore: 0.65, priorityReason: 'MEDIUM: 95,000 residents affected by safety risk. Infrastructure issue with straightforward IoT solution.', affectedEstimate: 95000, duplicateRisk: 0.15, detectedTech: JSON.stringify(['IoT Sensors', 'Predictive Maintenance', 'Cloud Dashboard', 'Mobile Reporting']), recommendedSkills: JSON.stringify(['IoT', 'Electrical Engineering', 'Data Analytics', 'Urban Planning']), sdgAlignment: JSON.stringify(['11', '7']), matchedUniversities: JSON.stringify([{name:'IIT Bombay',score:0.80},{name:'NIT Trichy',score:0.76}]), matchedTeams: JSON.stringify([{name:'SmartGrid Pioneers',score:0.84},{name:'AquaTech Innovators',score:0.72}]), matchedIndustry: JSON.stringify([{name:'Smart City Solutions',score:0.86,type:'STARTUP'},{name:'TCS',score:0.78,type:'INDUSTRY'}]), nextSteps: JSON.stringify(['Conduct streetlight census', 'Design IoT monitoring sensor', 'Build automated fault reporting system', 'Pilot in 2 wards']) } })

  // More problems with various statuses
  const p9 = await prisma.problem.create({ data: { title: 'Lack of Safe Drinking Water in Tribal Schools, Jharkhand', description: 'Over 340 government schools in tribal areas of Jharkhand lack safe drinking water. Students consume contaminated water. A solar-powered water purification system can solve this for 85,000 students.', category: 'EDUCATION', subcategory: 'School Infrastructure', priority: 'HIGH', status: 'SUBMITTED', submittedById: citizen3.id, affectedCount: 85000, tags: JSON.stringify(['education', 'water', 'tribal', 'school', 'solar']), sdgGoals: JSON.stringify(['4', '6', '10']) } })
  await prisma.problemLocation.create({ data: { problemId: p9.id, district: 'Ranchi', state: 'Jharkhand', lat: 23.3441, lng: 85.3096 } })

  const p10 = await prisma.problem.create({ data: { title: 'Disabled-Inaccessible Public Transport Stops in Chennai', description: 'Only 8% of Chennai\'s 3,200 bus stops have wheelchair ramps. Over 180,000 differently-abled residents face daily exclusion from public transport. Infrastructure improvements and a mobile accessibility app can dramatically improve inclusion.', category: 'TRANSPORT', subcategory: 'Accessibility', priority: 'MEDIUM', status: 'MATCHED', submittedById: citizen1.id, affectedCount: 180000, tags: JSON.stringify(['accessibility', 'transport', 'disability', 'inclusion', 'Chennai']), sdgGoals: JSON.stringify(['10', '11', '3']) } })
  await prisma.problemLocation.create({ data: { problemId: p10.id, district: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707 } })

  const p11 = await prisma.problem.create({ data: { title: 'Untreated Industrial Effluent into Mula-Mutha River, Pune', description: '47 industrial units along Mula-Mutha river discharge untreated effluent. The river provides water to 2M Pune residents. BOD levels are 8x permissible limits. A distributed effluent monitoring network can enable regulatory enforcement.', category: 'WATER', subcategory: 'River Pollution', priority: 'CRITICAL', status: 'AI_ANALYZED', submittedById: citizen2.id, affectedCount: 2000000, tags: JSON.stringify(['water pollution', 'industrial effluent', 'river', 'Pune']), sdgGoals: JSON.stringify(['6', '14', '11']) } })
  await prisma.problemLocation.create({ data: { problemId: p11.id, district: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567 } })

  const p12 = await prisma.problem.create({ data: { title: 'Post-Harvest Crop Loss Due to Inadequate Cold Storage in Punjab', description: 'Farmers in 6 Punjab districts lose 25-35% of perishable crops post-harvest. A solar micro-cold-storage network with farmer app can reduce losses by 80%.', category: 'AGRICULTURE', subcategory: 'Post-Harvest Management', priority: 'HIGH', status: 'SUBMITTED', submittedById: citizen2.id, affectedCount: 45000, tags: JSON.stringify(['agriculture', 'cold storage', 'solar', 'farmer']), sdgGoals: JSON.stringify(['2', '12', '8']) } })
  await prisma.problemLocation.create({ data: { problemId: p12.id, district: 'Ludhiana', state: 'Punjab', lat: 30.9010, lng: 75.8573 } })

  const p13 = await prisma.problem.create({ data: { title: 'Mental Health Support Gap in Rural Kerala Interior Districts', description: 'Only 12 psychiatrists serve 3.2M rural Kerala residents. Stress from job loss and isolation post-pandemic increased untreated mental conditions by 40%. A telepsychiatry platform with community health workers can extend access.', category: 'HEALTH', subcategory: 'Mental Health', priority: 'HIGH', status: 'PROPOSAL', submittedById: citizen1.id, affectedCount: 3200000, tags: JSON.stringify(['mental health', 'telemedicine', 'rural', 'Kerala']), sdgGoals: JSON.stringify(['3', '10']) } })
  await prisma.problemLocation.create({ data: { problemId: p13.id, district: 'Wayanad', state: 'Kerala', lat: 11.6854, lng: 76.1320 } })

  const p14 = await prisma.problem.create({ data: { title: 'School Dropout Rate Spike Due to COVID Learning Loss in Uttar Pradesh', description: 'School dropout rates rose to 28% (from 14% pre-COVID) in 8 UP districts. An AI-powered adaptive learning app that works on basic smartphones without reliable internet can bridge learning gaps.', category: 'EDUCATION', subcategory: 'Learning Recovery', priority: 'HIGH', status: 'TEAM_FORMED', submittedById: citizen3.id, affectedCount: 420000, tags: JSON.stringify(['education', 'dropout', 'AI learning', 'UP', 'COVID']), sdgGoals: JSON.stringify(['4', '10', '1']) } })
  await prisma.problemLocation.create({ data: { problemId: p14.id, district: 'Gorakhpur', state: 'Uttar Pradesh', lat: 26.7606, lng: 83.3732 } })

  const p15 = await prisma.problem.create({ data: { title: 'Energy Theft and Transmission Loss in Rajasthan Rural Grid', description: 'Rural feeders in Barmer and Jaisalmer suffer 32-38% losses from energy theft and faults. Smart metering with tamper detection can reduce losses by 60-70% for 180,000 households.', category: 'ENERGY', subcategory: 'Smart Metering', priority: 'MEDIUM', status: 'MATCHED', submittedById: citizen2.id, affectedCount: 180000, tags: JSON.stringify(['energy', 'smart meter', 'theft', 'rural', 'Rajasthan']), sdgGoals: JSON.stringify(['7', '9', '11']) } })
  await prisma.problemLocation.create({ data: { problemId: p15.id, district: 'Barmer', state: 'Rajasthan', lat: 25.7458, lng: 71.3922 } })

  // Projects for deployed/advanced problems
  const proj1 = await prisma.project.create({ data: { problemId: p1.id, title: 'IoT Water Quality Monitoring & Filtration for Nashik Villages', teamId: team1.id, universityId: iitb.id, industryPartnerId: jal.id, status: 'COMPLETED', startDate: new Date('2025-03-01'), targetDate: new Date('2025-09-30'), completedAt: new Date('2025-09-15'), progressPercent: 100 } })

  await prisma.milestone.createMany({ data: [
    { projectId: proj1.id, title: 'Problem Discovery & Validation', type: 'DISCOVERY', status: 'COMPLETED', completionPct: 100, order: 1, completedAt: new Date('2025-03-15'), reviewNotes: 'Validated by District Health Officer' },
    { projectId: proj1.id, title: 'Root Cause Analysis & Research', type: 'RESEARCH', status: 'COMPLETED', completionPct: 100, order: 2, completedAt: new Date('2025-04-10'), reviewNotes: 'Identified 3 contamination sources' },
    { projectId: proj1.id, title: 'Solution Design & Proposal', type: 'PROPOSAL', status: 'COMPLETED', completionPct: 100, order: 3, completedAt: new Date('2025-04-30') },
    { projectId: proj1.id, title: 'Hardware Prototype (IoT Sensor + Filter Unit)', type: 'PROTOTYPE', status: 'COMPLETED', completionPct: 100, order: 4, completedAt: new Date('2025-06-15') },
    { projectId: proj1.id, title: 'Village-Level Pilot (3 Villages)', type: 'PILOT', status: 'COMPLETED', completionPct: 100, order: 5, completedAt: new Date('2025-08-01') },
    { projectId: proj1.id, title: 'Full Deployment (6 Villages)', type: 'DEPLOYMENT', status: 'COMPLETED', completionPct: 100, order: 6, completedAt: new Date('2025-09-15') },
    { projectId: proj1.id, title: 'Impact Measurement & Verification', type: 'IMPACT', status: 'COMPLETED', completionPct: 100, order: 7, completedAt: new Date('2025-10-01'), reviewNotes: 'Contamination reduced by 87%' },
  ]})

  const deploy1 = await prisma.deployment.create({ data: { projectId: proj1.id, deployedAt: new Date('2025-09-15'), location: 'Sinnar Taluka, Nashik — 6 Villages', description: 'Deployed 24 IoT water quality sensors and 6 community filtration units across 6 villages.', status: 'ACTIVE' } })
  await prisma.impactMetric.createMany({ data: [
    { deploymentId: deploy1.id, metricName: 'Water Contamination Incidents', beforeValue: '38', afterValue: '4', unit: 'per month', verified: true },
    { deploymentId: deploy1.id, metricName: 'Community Health Satisfaction', beforeValue: '31%', afterValue: '87%', unit: 'satisfaction score', verified: true },
    { deploymentId: deploy1.id, metricName: 'Fluoride Level in Water', beforeValue: '4.2 mg/L', afterValue: '0.9 mg/L', unit: 'mg/L', verified: true },
    { deploymentId: deploy1.id, metricName: 'Families with Safe Water Access', beforeValue: '140', afterValue: '620', unit: 'families', verified: true },
  ]})

  await prisma.mentorship.create({ data: { projectId: proj1.id, facultyId: faculty1.id, status: 'COMPLETED', notes: 'Prof. Desai mentored on water treatment technology and IoT sensor calibration.' } })
  await prisma.fundingSupport.create({ data: { projectId: proj1.id, organizationId: jal.id, type: 'FUNDING', amount: 850000, description: 'Funded under Jal Jeevan Mission', status: 'CONFIRMED' } })
  await prisma.projectUpdate.createMany({ data: [
    { projectId: proj1.id, content: 'Project initiated. Team conducted first site visit. Water samples collected.', type: 'UPDATE', createdAt: new Date('2025-03-05'), authorId: sUsers[0].id },
    { projectId: proj1.id, content: 'Lab results confirmed: arsenic 4.2x WHO limit, fluoride 3.8x. Root cause traced to industrial unit.', type: 'MILESTONE', createdAt: new Date('2025-03-20'), authorId: sUsers[0].id },
    { projectId: proj1.id, content: 'Prototype IoT sensor node deployed. Real-time data streaming to cloud dashboard.', type: 'MILESTONE', createdAt: new Date('2025-05-15'), authorId: sUsers[0].id },
    { projectId: proj1.id, content: '🎉 Full deployment complete! 6 villages now have access to safe drinking water. Fluoride within WHO limits!', type: 'MILESTONE', createdAt: new Date('2025-09-16'), authorId: sUsers[0].id },
  ]})

  const proj4 = await prisma.project.create({ data: { problemId: p4.id, title: 'AI-Powered Smart Irrigation for Vidarbha Cotton Farmers', teamId: team5.id, universityId: iiith.id, industryPartnerId: agriTech.id, status: 'COMPLETED', startDate: new Date('2025-04-01'), targetDate: new Date('2025-11-30'), completedAt: new Date('2025-11-20'), progressPercent: 100 } })

  const deploy4 = await prisma.deployment.create({ data: { projectId: proj4.id, deployedAt: new Date('2025-10-01'), location: 'Yavatmal District — 8 Villages, 320 Farms', description: 'IoT soil sensors installed across 320 farms. Mobile app serving 3,800 farmers.', status: 'ACTIVE' } })
  await prisma.impactMetric.createMany({ data: [
    { deploymentId: deploy4.id, metricName: 'Crop Yield Improvement', beforeValue: '35%', afterValue: '72%', unit: 'yield efficiency', verified: true },
    { deploymentId: deploy4.id, metricName: 'Water Usage per Acre', beforeValue: '8,500 liters', afterValue: '4,200 liters', unit: 'liters/acre', verified: true },
    { deploymentId: deploy4.id, metricName: 'Average Farmer Income', beforeValue: '₹42,000', afterValue: '₹78,000', unit: 'per season', verified: true },
    { deploymentId: deploy4.id, metricName: 'Farmer Suicides in Region', beforeValue: '12', afterValue: '3', unit: 'per year', verified: true },
  ]})

  const proj2 = await prisma.project.create({ data: { problemId: p2.id, title: 'AI Traffic Signal Control for Pune Highway Junction', teamId: team3.id, universityId: nitt.id, industryPartnerId: smartCity.id, status: 'ACTIVE', startDate: new Date('2025-06-01'), targetDate: new Date('2026-03-31'), progressPercent: 55 } })
  await prisma.milestone.createMany({ data: [
    { projectId: proj2.id, title: 'Problem Validation & Site Survey', type: 'DISCOVERY', status: 'COMPLETED', completionPct: 100, order: 1, completedAt: new Date('2025-06-20') },
    { projectId: proj2.id, title: 'AI Traffic Model Development', type: 'PROTOTYPE', status: 'COMPLETED', completionPct: 100, order: 2, completedAt: new Date('2025-08-30') },
    { projectId: proj2.id, title: 'Camera & Edge Device Deployment', type: 'PILOT', status: 'IN_PROGRESS', completionPct: 65, order: 3 },
    { projectId: proj2.id, title: 'Full Junction Rollout', type: 'DEPLOYMENT', status: 'PENDING', completionPct: 0, order: 4 },
  ]})

  const proj3 = await prisma.project.create({ data: { problemId: p3.id, title: 'Hyperlocal Air Quality Monitoring Network — Delhi Industrial Corridor', teamId: team4.id, universityId: iitd.id, industryPartnerId: tcs.id, status: 'ACTIVE', startDate: new Date('2025-05-01'), targetDate: new Date('2026-02-28'), progressPercent: 68 } })
  await prisma.mentorship.create({ data: { projectId: proj3.id, facultyId: faculty4.id, status: 'ACTIVE' } })
  await prisma.mentorship.create({ data: { projectId: proj2.id, facultyId: faculty3.id, status: 'ACTIVE' } })

  // Certificates
  const cert1 = await prisma.certificate.create({ data: { userId: sUsers[0].id, type: 'OUTSTANDING_SOLVER', problemTitle: 'Groundwater Contamination in Nashik Villages', role: 'Team Leader — AquaTech Innovators', projectId: proj1.id, impactSummary: 'Provided safe drinking water to 2,500+ residents. Reduced contamination incidents by 89%. Deployed IoT monitoring across 6 villages.', issuedBy: 'CivicSolve Platform & Ministry of Jal Shakti', issuedAt: new Date('2025-10-15') } })
  const cert2 = await prisma.certificate.create({ data: { userId: sUsers[4].id, type: 'OUTSTANDING_SOLVER', problemTitle: 'Smart Irrigation for Vidarbha Cotton Farmers', role: 'Team Leader — FarmSense AI', projectId: proj4.id, impactSummary: 'Improved crop yield by 106% for 3,800 farmers. Reduced water usage by 51%. Average farmer income doubled.', issuedBy: 'CivicSolve Platform & Ministry of Agriculture', issuedAt: new Date('2025-12-01') } })
  const cert3 = await prisma.certificate.create({ data: { userId: fUser1.id, type: 'INNOVATION_EXCELLENCE', problemTitle: 'Groundwater Contamination in Nashik Villages', role: 'Faculty Mentor', projectId: proj1.id, impactSummary: 'Mentored AquaTech Innovators from prototype to deployment. Critical guidance on water treatment technology.', issuedBy: 'CivicSolve Platform', issuedAt: new Date('2025-10-15') } })
  const cert4 = await prisma.certificate.create({ data: { userId: sUsers[3].id, type: 'CERTIFIED_SOLVER', problemTitle: 'Air Quality Monitoring — Delhi Industrial Corridor', role: 'Team Leader — AirGuard Lab', impactSummary: 'Designed hyperlocal PM2.5 monitoring network serving 120,000 residents with real-time air quality data.', issuedBy: 'CivicSolve Platform', issuedAt: new Date('2026-01-10') } })
  const cert5 = await prisma.certificate.create({ data: { userId: sUsers[1].id, type: 'COMMUNITY_IMPACT', problemTitle: 'Healthcare Analytics for Rural Communities', role: 'Data Science Lead — GreenPath Solutions', impactSummary: 'Delivered data insights improving healthcare delivery for 15,000 rural residents.', issuedBy: 'CivicSolve Platform', issuedAt: new Date('2026-01-20') } })

  // Leaderboard
  await prisma.leaderboardScore.createMany({ data: [
    { userId: sUsers[0].id, totalScore: 185, problemsSolved: 7, prototypesBuilt: 5, deployments: 4, peopleImpacted: 2350, badges: JSON.stringify(['Outstanding Solver', 'IoT Expert', 'Rural Champion', 'Water Guardian']) },
    { userId: sUsers[4].id, totalScore: 162, problemsSolved: 5, prototypesBuilt: 4, deployments: 3, peopleImpacted: 3800, badges: JSON.stringify(['Outstanding Solver', 'AgriTech Pioneer', 'Farmer Champion']) },
    { userId: sUsers[3].id, totalScore: 145, problemsSolved: 5, prototypesBuilt: 3, deployments: 2, peopleImpacted: 15000, badges: JSON.stringify(['Air Quality Champion', 'Public Health Hero']) },
    { userId: sUsers[1].id, totalScore: 120, problemsSolved: 4, prototypesBuilt: 2, deployments: 2, peopleImpacted: 1200, badges: JSON.stringify(['Healthcare Innovator', 'Data Wizard']) },
    { userId: sUsers[2].id, totalScore: 95, problemsSolved: 3, prototypesBuilt: 2, deployments: 1, peopleImpacted: 800, badges: JSON.stringify(['Traffic Solver', 'Urban Planner']) },
    { userId: sUsers[8].id, totalScore: 90, problemsSolved: 3, prototypesBuilt: 1, deployments: 1, peopleImpacted: 700, badges: JSON.stringify(['AI Innovator']) },
    { userId: sUsers[6].id, totalScore: 80, problemsSolved: 3, prototypesBuilt: 2, deployments: 1, peopleImpacted: 450, badges: JSON.stringify(['Tech Builder']) },
    { userId: sUsers[5].id, totalScore: 75, problemsSolved: 2, prototypesBuilt: 2, deployments: 1, peopleImpacted: 600, badges: JSON.stringify(['Hardware Hacker']) },
    { userId: sUsers[9].id, totalScore: 65, problemsSolved: 2, prototypesBuilt: 1, deployments: 0, peopleImpacted: 200, badges: JSON.stringify(['Rising Star']) },
    { userId: sUsers[7].id, totalScore: 60, problemsSolved: 2, prototypesBuilt: 1, deployments: 0, peopleImpacted: 300, badges: JSON.stringify(['Environmental Advocate']) },
    { userId: fUser1.id, totalScore: 210, problemsSolved: 8, prototypesBuilt: 6, deployments: 5, peopleImpacted: 8000, badges: JSON.stringify(['Master Mentor', 'Innovation Excellence', 'Water Guardian']) },
    { userId: fUser4.id, totalScore: 150, problemsSolved: 5, prototypesBuilt: 4, deployments: 3, peopleImpacted: 50000, badges: JSON.stringify(['Air Quality Champion', 'Research Leader']) },
  ]})

  // Notifications
  await prisma.notification.createMany({ data: [
    { userId: sUsers[0].id, title: 'Certificate Issued! 🎓', message: 'Your Outstanding Problem Solver certificate for the Nashik water project has been issued. View it now.', type: 'SUCCESS', link: '/certificates/' + cert1.certificateId },
    { userId: sUsers[0].id, title: 'New Problem Match', message: 'A new CRITICAL water contamination problem in Amravati matches your IoT expertise (95% match).', type: 'AI', link: '/problems' },
    { userId: sUsers[3].id, title: 'Pilot Phase Update', message: 'Your air quality monitoring pilot has reached 75% completion. 3 more sensors need calibration.', type: 'INFO', link: '/projects/' + proj3.id },
    { userId: sUsers[4].id, title: 'Impact Verified! 🌟', message: 'The Vidarbha irrigation project impact has been officially verified. Farmer incomes increased by 86%.', type: 'SUCCESS', link: '/projects/' + proj4.id },
    { userId: citizen1.id, title: 'Problem Resolved!', message: 'Your Nashik water contamination report has been fully resolved! 2,500 people now have safe water.', type: 'SUCCESS', link: '/problems/' + p1.id },
    { userId: citizen1.id, title: 'AI Analysis Complete', message: 'Your hospital queue problem has been analyzed. Priority: HIGH. 3 universities matched.', type: 'AI', read: true, link: '/problems/' + p7.id },
    { userId: fUser1.id, title: 'Mentorship Request', message: 'Team WasteWise has requested you as mentor for the Aurangabad waste management project.', type: 'INFO' },
    { userId: govUser.id, title: 'Critical Problems Alert', message: '3 new CRITICAL priority problems require government validation in Maharashtra.', type: 'WARNING', link: '/command-center' },
    { userId: sUsers[1].id, title: 'Team Invitation', message: 'HealthBridge team has invited you to collaborate on the hospital queue management problem.', type: 'INFO' },
    { userId: adminUser.id, title: 'New University Registration', message: 'NIT Warangal has requested platform registration. Approval needed.', type: 'INFO' },
  ]})

  // Community Feedback
  await prisma.communityFeedback.createMany({ data: [
    { problemId: p1.id, userId: citizen1.id, rating: 5, comment: 'This solution has transformed our village. Our children are no longer getting sick from the water.' },
    { problemId: p1.id, rating: 5, comment: 'Excellent work by the IIT Bombay team. Very professional.' },
    { problemId: p4.id, userId: citizen2.id, rating: 5, comment: 'Mere khet ka paani bahut accha ho gaya. Fasal bhi zyada aayi. Bahut shukriya.' },
    { problemId: p2.id, rating: 4, comment: 'Traffic is better during peak hours since the AI signals were installed.' },
    { problemId: p3.id, rating: 4, comment: 'Finally we can see real-time air quality data for our neighbourhood!' },
    { problemId: p5.id, rating: 3, comment: 'Collection is still irregular but better than before. Hope the app launches soon.' },
  ]})

  console.log('✅ CivicSolve seeded successfully!')
  console.log('\n📊 Summary:')
  console.log('  5 Universities, 6 Departments')
  console.log('  6 Organizations, 10 Teams')
  console.log('  20 Users (all roles)')
  console.log('  15 Problems with AI analyses')
  console.log('  4 Projects (2 deployed, 2 active)')
  console.log('  5 Certificates')
  console.log('  10+ Notifications')
  console.log('\n🔑 Demo Logins:')
  console.log('  admin@civicsolve.in / password123')
  console.log('  arun.kumar@iitb.ac.in / password123 (Student)')
  console.log('  priya.sharma@gmail.com / password123 (Citizen)')
  console.log('  prof.desai@iitb.ac.in / password123 (Faculty)')
  console.log('  collector@maharashtra.gov.in / password123 (Government)')
}

main()
  .catch(e => { console.error('Seed error:', e); process.exit(1) })
  .finally(() => prisma.$disconnect())
