'use client'

import { useState, useEffect } from 'react'

interface UserProfile {
  id: string
  email: string
  name: string
  level: string
  totalScore: number
  createdAt: string
}

interface UserStats {
  completedCount: number
  pendingCount: number
  notStartedCount: number
}

interface Badge {
  id: string
  name: string
  icon: string
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [stats, setStats] = useState<UserStats>({
    completedCount: 0,
    pendingCount: 0,
    notStartedCount: 50,
  })
  const [earnedBadges, setEarnedBadges] = useState<Badge[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUserIdFromCookie = () => {
      const cookies = document.cookie.split(';')
      for (const cookie of cookies) {
        if (cookie.trim().startsWith('auth-token=')) {
          try {
            const token = cookie.trim().substring('auth-token='.length)
            const decoded = JSON.parse(Buffer.from(token, 'base64').toString())
            return decoded.userId
          } catch (e) {
            console.error('Failed to decode user:', e)
          }
        }
      }
      return null
    }

    const fetchProfileData = async () => {
      try {
        const userId = getUserIdFromCookie()
        if (!userId) {
          setLoading(false)
          return
        }

        // Fetch user profile
        const userRes = await fetch(`/api/members/${userId}`)
        const userData = await userRes.json()

        if (userData.success) {
          const user = userData.data
          setProfile({
            id: user.id,
            email: user.email,
            name: user.name || user.email.split('@')[0],
            level: user.level || 'BEGINNER',
            totalScore: user.totalScore || 0,
            createdAt: user.createdAt || new Date().toISOString(),
          })
        }

        // Fetch submissions for stats
        const submissionsRes = await fetch(`/api/submissions?userId=${userId}`)
        const submissionsData = await submissionsRes.json()

        if (submissionsData.success && submissionsData.data) {
          let completed = 0
          let pending = 0
          submissionsData.data.forEach((sub: any) => {
            if (sub.status === 'APPROVED') completed++
            if (sub.status === 'SUBMITTED') pending++
          })

          setStats({
            completedCount: completed,
            pendingCount: pending,
            notStartedCount: 50 - completed - pending,
          })
        }

        // Fetch badges
        const badgesRes = await fetch(`/api/badges?userId=${userId}`)
        const badgesData = await badgesRes.json()

        if (badgesData.success && badgesData.data) {
          const earned = badgesData.data.allBadges.filter((badge: Badge) =>
            badgesData.data.earnedBadges.includes(badge.id)
          )
          setEarnedBadges(earned)
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfileData()
  }, [])

  const getLevelIcon = (level: string) => {
    const icons: Record<string, string> = {
      BEGINNER: '🌱',
      INTERMEDIATE: '🌿',
      ADVANCED: '🌳',
      EXPERT: '👑',
    }
    return icons[level] || '🌱'
  }

  const getLevelText = (level: string) => {
    const texts: Record<string, string> = {
      BEGINNER: 'ผู้เริ่มต้น',
      INTERMEDIATE: 'ระดับกลาง',
      ADVANCED: 'ขั้นสูง',
      EXPERT: 'ผู้เชี่ยวชาญ',
    }
    return texts[level] || 'ผู้เริ่มต้น'
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">ไม่สามารถโหลดข้อมูลโปรไฟล์</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900">👤 โปรไฟล์ของฉัน</h1>

      {/* Profile Card */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-lg p-8 border-l-4 border-blue-500">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{profile.name}</h2>
            <p className="text-gray-600">{profile.email}</p>
            <p className="text-sm text-gray-500 mt-2">
              สมาชิกตั้งแต่ {new Date(profile.createdAt).toLocaleDateString('th-TH')}
            </p>
          </div>
          <div className="text-right">
            <div className="text-6xl mb-2">{getLevelIcon(profile.level)}</div>
            <p className="text-lg font-bold text-gray-900">{getLevelText(profile.level)}</p>
          </div>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-6 text-center border-2 border-blue-200">
          <p className="text-gray-600 text-sm font-semibold mb-2">คะแนนรวม</p>
          <p className="text-4xl font-bold text-blue-600 mb-1">{profile.totalScore}</p>
          <p className="text-xs text-gray-500">จากทั้งหมด 2,500 คะแนน</p>
        </div>

        <div className="bg-green-50 rounded-lg p-6 text-center border-2 border-green-200">
          <p className="text-gray-600 text-sm font-semibold mb-2">เสร็จแล้ว</p>
          <p className="text-4xl font-bold text-green-600 mb-1">{stats.completedCount}</p>
          <p className="text-xs text-gray-500">กิจกรรมอนุมัติแล้ว</p>
        </div>

        <div className="bg-purple-50 rounded-lg p-6 text-center border-2 border-purple-200">
          <p className="text-gray-600 text-sm font-semibold mb-2">รอดำเนินการ</p>
          <p className="text-4xl font-bold text-purple-600 mb-1">{stats.pendingCount}</p>
          <p className="text-xs text-gray-500">รอการตรวจสอบ</p>
        </div>
      </div>

      {/* Progress Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">📊 ความคืบหน้า</h3>
        <div className="space-y-4">
          {/* Overall Progress */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">ความสำเร็จโดยรวม</span>
              <span className="text-sm font-semibold text-gray-700">
                {Math.round(((stats.completedCount + stats.pendingCount) / 50) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all"
                style={{
                  width: `${((stats.completedCount + stats.pendingCount) / 50) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Activity Breakdown */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">{stats.completedCount}</div>
              <p className="text-xs text-gray-600">✅ เสร็จแล้ว</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-1">{stats.pendingCount}</div>
              <p className="text-xs text-gray-600">⏳ รอจาก</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-600 mb-1">{stats.notStartedCount}</div>
              <p className="text-xs text-gray-600">🔒 ยังไม่เริ่ม</p>
            </div>
          </div>
        </div>
      </div>

      {/* Earned Badges Section */}
      {earnedBadges.length > 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg shadow p-6 border-l-4 border-yellow-400">
          <h3 className="text-lg font-bold text-gray-900 mb-4">🏆 แบดจ์ที่ได้รับ</h3>
          <div className="grid grid-cols-4 md:grid-cols-7 gap-4">
            {earnedBadges.map((badge) => (
              <div key={badge.id} className="text-center">
                <div className="text-4xl mb-2 transform hover:scale-110 transition">{badge.icon}</div>
                <p className="text-xs font-semibold text-gray-700">{badge.name}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <a
              href="/badges"
              className="text-sm font-semibold text-blue-600 hover:text-blue-800 underline"
            >
              ดูแบดจ์ทั้งหมด →
            </a>
          </div>
        </div>
      )}

      {earnedBadges.length === 0 && (
        <div className="bg-gray-50 rounded-lg shadow p-6 text-center">
          <p className="text-gray-500 mb-3">ยังไม่มีแบดจ์</p>
          <p className="text-sm text-gray-600 mb-4">
            ส่งกิจกรรมและให้ได้คะแนนสูงเพื่อรับแบดจ์
          </p>
          <a
            href="/badges"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition"
          >
            ดูเงื่อนไขการได้รับแบดจ์
          </a>
        </div>
      )}

      {/* Stats Info */}
      <div className="bg-blue-50 rounded-lg shadow p-6 border-l-4 border-blue-500">
        <h3 className="text-lg font-bold text-blue-900 mb-3">ℹ️ ข้อมูลเพิ่มเติม</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>✓ ดูรายละเอียดกิจกรรมของคุณได้ที่หน้า "กิจกรรม"</li>
          <li>✓ ติดตามความสำเร็จของคุณได้ที่หน้า "แดชบอร์ด"</li>
          <li>✓ ส่งกิจกรรมของคุณผ่านไปยังอาจารย์ผู้สอน</li>
          <li>✓ คะแนนของคุณจะถูกอัปเดตเมื่อการส่งได้รับการอนุมัติ</li>
        </ul>
      </div>
    </div>
  )
}
