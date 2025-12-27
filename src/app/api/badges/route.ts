import { db } from '@/lib/db'

interface Badge {
  id: string
  name: string
  description: string
  icon: string
  requirement: string
}

interface UserBadges {
  userId: string
  badges: Badge[]
  earnedBadges: string[]
}

// Badge definitions
const BADGES: Badge[] = [
  {
    id: 'first_submission',
    name: 'การเริ่มต้น',
    description: 'ส่งกิจกรรมครั้งแรก',
    icon: '🌱',
    requirement: 'ส่งอย่างน้อย 1 กิจกรรม',
  },
  {
    id: 'five_submissions',
    name: 'ผู้มีความตั้งใจ',
    description: 'ส่งกิจกรรมถึง 5 ครั้ง',
    icon: '⭐',
    requirement: 'ส่งอย่างน้อย 5 กิจกรรม',
  },
  {
    id: 'ten_submissions',
    name: 'ผู้บุกเบิก',
    description: 'ส่งกิจกรรมถึง 10 ครั้ง',
    icon: '🎯',
    requirement: 'ส่งอย่างน้อย 10 กิจกรรม',
  },
  {
    id: 'twenty_submissions',
    name: 'นักเรียนรุ่นจริง',
    description: 'ส่งกิจกรรมถึง 20 ครั้ง',
    icon: '🏆',
    requirement: 'ส่งอย่างน้อย 20 กิจกรรม',
  },
  {
    id: 'all_approved',
    name: 'ผู้ยอดเยี่ยม',
    description: 'อนุมัติทั้งหมด',
    icon: '👑',
    requirement: 'อนุมัติ 50 กิจกรรม',
  },
  {
    id: 'perfect_score',
    name: 'สมบูรณ์แบบ',
    description: 'ได้คะแนนเต็มในกิจกรรม',
    icon: '💯',
    requirement: 'ได้คะแนนเต็มอย่างน้อย 1 ครั้ง',
  },
  {
    id: 'high_score',
    name: 'ผู้ยอดนิยม',
    description: 'ได้คะแนนสูงกว่า 80%',
    icon: '🌟',
    requirement: 'ได้คะแนนสูง 10 ครั้ง',
  },
]

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const userId = url.searchParams.get('userId')

    if (!userId) {
      return Response.json({
        success: false,
        message: 'userId is required',
      })
    }

    // Get all badges
    const allBadges = BADGES

    // Get user submissions
    const submissions = db
      .prepare('SELECT * FROM Submission WHERE userId = ?')
      .all(userId) as any[]

    // Calculate earned badges
    const earnedBadges: string[] = []

    // Check first_submission (ส่งอย่างน้อย 1 ครั้ง)
    if (submissions.length >= 1) {
      earnedBadges.push('first_submission')
    }

    // Check five_submissions (ส่งอย่างน้อย 5 ครั้ง)
    if (submissions.length >= 5) {
      earnedBadges.push('five_submissions')
    }

    // Check ten_submissions (ส่งอย่างน้อย 10 ครั้ง)
    if (submissions.length >= 10) {
      earnedBadges.push('ten_submissions')
    }

    // Check twenty_submissions (ส่งอย่างน้อย 20 ครั้ง)
    if (submissions.length >= 20) {
      earnedBadges.push('twenty_submissions')
    }

    // Check all_approved (อนุมัติ 50 ครั้ง)
    const approvedCount = submissions.filter((s) => s.status === 'APPROVED').length
    if (approvedCount === 50) {
      earnedBadges.push('all_approved')
    }

    // Check perfect_score (ได้คะแนนเต็ม)
    const perfectScoreCount = submissions.filter((s) => {
      if (!s.score) return false
      // Get activity max score
      const activity = db
        .prepare('SELECT maxScore FROM Activity WHERE id = ?')
        .get(s.activityId) as any
      return activity && s.score === activity.maxScore
    }).length
    if (perfectScoreCount >= 1) {
      earnedBadges.push('perfect_score')
    }

    // Check high_score (ได้คะแนนสูง 10 ครั้ง)
    const highScoreCount = submissions.filter((s) => {
      if (!s.score) return false
      // Get activity max score
      const activity = db
        .prepare('SELECT maxScore FROM Activity WHERE id = ?')
        .get(s.activityId) as any
      return activity && s.score / activity.maxScore >= 0.8
    }).length
    if (highScoreCount >= 10) {
      earnedBadges.push('high_score')
    }

    return Response.json({
      success: true,
      data: {
        userId,
        allBadges,
        earnedBadges,
        totalBadges: allBadges.length,
        earnedCount: earnedBadges.length,
      },
    })
  } catch (error) {
    console.error('Error fetching badges:', error)
    return Response.json({
      success: false,
      message: 'Failed to fetch badges',
    })
  }
}
