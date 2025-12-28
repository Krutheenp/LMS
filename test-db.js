const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testDatabase() {
  try {
    console.log('🧪 Testing Database Connection...\n');

    // Test User count
    const userCount = await prisma.user.count();
    console.log(`✅ Users: ${userCount}`);

    // Test Activity count
    const activityCount = await prisma.activity.count();
    console.log(`✅ Activities: ${activityCount}`);

    // Test Submission count
    const submissionCount = await prisma.submission.count();
    console.log(`✅ Submissions: ${submissionCount}`);

    // Test Badge count
    const badgeCount = await prisma.badge.count();
    console.log(`✅ Badges: ${badgeCount}`);

    // Get sample activity
    const sampleActivity = await prisma.activity.findFirst({ include: { submissions: true } });
    console.log(`\n📝 Sample Activity:`);
    console.log(`   - Title: ${sampleActivity?.title}`);
    console.log(`   - Grade Level: ${sampleActivity?.gradeLevel}`);
    console.log(`   - Submissions: ${sampleActivity?.submissions?.length || 0}`);

    // Get sample user
    const sampleUser = await prisma.user.findFirst();
    console.log(`\n👤 Sample User:`);
    console.log(`   - Email: ${sampleUser?.email}`);
    console.log(`   - Role: ${sampleUser?.role}`);
    console.log(`   - Level: ${sampleUser?.level}`);
    console.log(`   - Score: ${sampleUser?.totalScore}`);

    console.log(`\n✅ Database Connection Successful!`);
  } catch (error) {
    console.error('❌ Database Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();
