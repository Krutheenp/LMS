const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing data
  await prisma.badge.deleteMany()
  await prisma.submission.deleteMany()
  await prisma.activityProgress.deleteMany()
  await prisma.activity.deleteMany()
  await prisma.user.deleteMany()

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: 'admin123',
      name: 'Admin User',
      role: 'ADMIN',
      totalScore: 0,
      level: 'BEGINNER',
    },
  })
  console.log('✅ Created admin user:', admin.email)

  // Create 600 members
  const members = []
  console.log('📝 Creating 600 members...')
  for (let i = 1; i <= 600; i++) {
    const member = await prisma.user.create({
      data: {
        email: `member${i}@example.com`,
        password: 'password123',
        name: `สมาชิกที่ ${i}`,
        role: 'MEMBER',
        totalScore: Math.floor(Math.random() * 2500),
        level: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'][
          Math.floor(Math.random() * 4)
        ],
      },
    })
    members.push(member)

    if (i % 100 === 0) console.log(`  ✓ ${i}/600`)
  }
  console.log('✅ Created 600 members')

  // Create 50 activities
  const activities = []
  console.log('📝 Creating 50 activities...')
  for (let i = 1; i <= 50; i++) {
    const activity = await prisma.activity.create({
      data: {
        title: `กิจกรรมที่ ${i}`,
        description: `คำอธิบายกิจกรรมที่ ${i} - นี่คือกิจกรรมการเรียนรู้`,
        maxScore: 100,
        gradeLevel: ['A', 'B', 'C', 'D', 'F'][Math.floor(Math.random() * 5)],
        startDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000),
      },
    })
    activities.push(activity)

    if (i % 10 === 0) console.log(`  ✓ ${i}/50`)
  }
  console.log('✅ Created 50 activities')

  // Create submissions for some members (sample data)
  console.log('📝 Creating sample submissions...')
  let submissionCount = 0
  for (let i = 0; i < Math.min(100, members.length); i++) {
    for (let j = 0; j < 5; j++) {
      const activityIndex = Math.floor(Math.random() * activities.length)
      try {
        const submission = await prisma.submission.upsert({
          where: {
            userId_activityId: {
              userId: members[i].id,
              activityId: activities[activityIndex].id,
            },
          },
          update: {},
          create: {
            userId: members[i].id,
            activityId: activities[activityIndex].id,
            status: ['NOT_STARTED', 'SUBMITTED', 'APPROVED', 'REJECTED'][
              Math.floor(Math.random() * 4)
            ],
            submittedDate: Math.random() > 0.5 ? new Date() : null,
            approvalDate: Math.random() > 0.7 ? new Date() : null,
            score: Math.random() > 0.5 ? Math.floor(Math.random() * 100) : null,
            comments: 'Good work!',
            fileUrls: '[]',
          },
        })
        submissionCount++
      } catch (e) {
        // Skip duplicate
      }
    }
    if (i % 20 === 0) console.log(`  ✓ Processed ${i}/100 members`)
  }
  console.log(`✅ Created ${submissionCount} sample submissions`)

  // Create some badges
  console.log('📝 Creating badges...')
  let badgeCount = 0
  for (let i = 0; i < Math.min(50, members.length); i++) {
    for (let j = 0; j < 3; j++) {
      const activityIndex = Math.floor(Math.random() * activities.length)
      try {
        const badge = await prisma.badge.upsert({
          where: {
            userId_activityId: {
              userId: members[i].id,
              activityId: activities[activityIndex].id,
            },
          },
          update: {},
          create: {
            userId: members[i].id,
            activityId: activities[activityIndex].id,
            earnedDate: new Date(),
            points: Math.floor(Math.random() * 100) + 50,
          },
        })
        badgeCount++
      } catch (e) {
        // Skip duplicate
      }
    }
  }
  console.log(`✅ Created ${badgeCount} badges`)

  // Create activity progress
  console.log('📝 Creating activity progress...')
  let progressCount = 0
  for (let i = 0; i < Math.min(200, members.length); i++) {
    for (let j = 0; j < 10; j++) {
      const activityIndex = Math.floor(Math.random() * activities.length)
      try {
        const progress = await prisma.activityProgress.upsert({
          where: {
            userId_activityId: {
              userId: members[i].id,
              activityId: activities[activityIndex].id,
            },
          },
          update: {
            completionPercentage: Math.floor(Math.random() * 100),
            lastUpdated: new Date(),
          },
          create: {
            userId: members[i].id,
            activityId: activities[activityIndex].id,
            completionPercentage: Math.floor(Math.random() * 100),
            lastUpdated: new Date(),
          },
        })
        progressCount++
      } catch (e) {
        // Skip duplicate
      }
    }
  }
  console.log(`✅ Created ${progressCount} progress records`)

  console.log('\n🎉 Database seeding complete!')
  console.log(`
  📊 Summary:
  - 1 Admin user
  - 600 Members
  - 50 Activities
  - ${submissionCount} Submissions
  - ${badgeCount} Badges
  - ${progressCount} Progress records
  
  🔐 Test Credentials:
  - Admin: admin@example.com / admin123
  - Member: member1@example.com / password123
  `)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
