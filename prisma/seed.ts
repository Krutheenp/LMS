import { PrismaClient } from '@prisma/client'

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
      password: 'admin123', // In production, hash this
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
        password: 'password123', // In production, hash this
        name: `สมาชิกที่ ${i}`,
        role: 'MEMBER',
        totalScore: Math.floor(Math.random() * 2500),
        level: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'][
          Math.floor(Math.random() * 4)
        ] as any,
      },
    })
    members.push(member)

    if (i % 100 === 0) console.log(`  ✓ ${i}/600`)
  }

  // Create 50 activities
  const activities = []
  console.log('📝 Creating 50 activities...')
  for (let i = 1; i <= 50; i++) {
    const activity = await prisma.activity.create({
      data: {
        title: `กิจกรรมที่ ${i}`,
        description: `คำอธิบายสำหรับกิจกรรมที่ ${i}`,
        maxScore: Math.floor(Math.random() * 50) + 50, // 50-100
        gradeLevel: ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)] as any,
        startDate: new Date('2024-12-01'),
        endDate: new Date('2025-01-31'),
      },
    })
    activities.push(activity)
  }

  // Create submissions and badges for some members
  console.log('📝 Creating submissions and badges...')
  for (let i = 0; i < Math.min(100, members.length); i++) {
    const member = members[i]

    for (let j = 0; j < Math.min(10, activities.length); j++) {
      const activity = activities[j]
      const score = Math.floor(Math.random() * 50) + 50 // 50-100

      // Create submission
      await prisma.submission.create({
        data: {
          userId: member.id,
          activityId: activity.id,
          status: ['NOT_STARTED', 'SUBMITTED', 'APPROVED', 'REJECTED'][
            Math.floor(Math.random() * 4)
          ] as any,
          submittedDate: new Date(),
          approvalDate: new Date(),
          score: score,
          comments: 'ดีมาก',
          fileUrl: '/uploads/file1.pdf',
        },
      })

      // Create badge if approved
      if (Math.random() > 0.5) {
        await prisma.badge.create({
          data: {
            userId: member.id,
            activityId: activity.id,
            points: score,
            earnedDate: new Date(),
          },
        })
      }
    }
  }

  console.log('✅ Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
