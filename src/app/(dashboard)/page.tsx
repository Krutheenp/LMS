'use client'

import { useState, useEffect } from 'react'

interface UserStats {
  totalScore: number
  level: string
  completedCount: number
  pendingCount: number
  totalActivities: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<UserStats>({
    totalScore: 0,
    level: 'BEGINNER',
    completedCount: 0,
    pendingCount: 0,
    totalActivities: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get user ID from cookie
    const getUserIdFromCookie = () => {
      const cookies = document.cookie.split(';')
      for (const cookie of cookies) {
        if (cookie.trim().startsWith('auth-token=')) {
          try {
            const token = cookie.trim().substring('auth-token='.length)
            const decoded = JSON.parse(atob(token))
            return decoded.userId
          } catch (e) {
            console.error('Failed to decode user:', e)
          }
        }
      }
      return null
    }

    const fetchStats = async () => {
      try {
        const userId = getUserIdFromCookie()
        if (!userId) {
          setLoading(false)
          return
        }

        // Fetch user data
        const userRes = await fetch(`/api/members/${userId}`)
        const userData = await userRes.json()

        if (userData.success) {
          const user = userData.data
          
          // Fetch submissions to count completed and pending
          const submissionsRes = await fetch(`/api/submissions?userId=${userId}`)
          const submissionsData = await submissionsRes.json()
          
          let completed = 0
          let pending = 0
          if (submissionsData.success && submissionsData.data) {
            submissionsData.data.forEach((sub: any) => {
              if (sub.status === 'APPROVED') completed++
              if (sub.status === 'SUBMITTED') pending++
            })
          }

          setStats({
            totalScore: user.totalScore,
            level: user.level,
            completedCount: completed,
            pendingCount: pending,
            totalActivities: 50,
          })
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">แดชบอร์ด</h1>

      {/* Level Badge */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">ระดับของคุณ</p>
            <p className="text-3xl font-bold">{getLevelIcon(stats.level)} {stats.level}</p>
          </div>
          <div className="text-6xl opacity-30">{getLevelIcon(stats.level)}</div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-600 font-semibold mb-2">💎 คะแนนรวม</h3>
          <p className="text-3xl font-bold text-blue-500">{stats.totalScore}</p>
          <p className="text-xs text-gray-500 mt-2">คะแนนสะสม</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-600 font-semibold mb-2">✅ เสร็จแล้ว</h3>
          <p className="text-3xl font-bold text-green-500">{stats.completedCount}/{stats.totalActivities}</p>
          <p className="text-xs text-gray-500 mt-2">กิจกรรมที่อนุมัติ</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-600 font-semibold mb-2">⏳ รอการตรวจ</h3>
          <p className="text-3xl font-bold text-yellow-500">{stats.pendingCount}</p>
          <p className="text-xs text-gray-500 mt-2">รออนุมัติ</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-600 font-semibold mb-2">📊 ความคืบหน้า</h3>
          <p className="text-3xl font-bold text-purple-500">{Math.round((stats.completedCount / stats.totalActivities) * 100)}%</p>
          <p className="text-xs text-gray-500 mt-2">สำเร็จแล้ว</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">ความคืบหน้าโดยรวม</h2>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-500"
            style={{ width: `${Math.round((stats.completedCount / stats.totalActivities) * 100)}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {stats.completedCount} จาก {stats.totalActivities} กิจกรรม ({Math.round((stats.completedCount / stats.totalActivities) * 100)}%)
        </p>
      </div>

      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">👋 ยินดีต้อนรับ!</h2>
        <p className="text-gray-700 mb-4">
          นี่คือหน้าแดชบอร์ดของคุณ ที่นี่คุณสามารถดูความคืบหน้า คะแนน และแบดจ์ของคุณได้
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <a href="/activities" className="block p-4 bg-white rounded-lg hover:shadow-md transition text-center">
            <p className="text-2xl mb-2">📋</p>
            <p className="font-semibold text-gray-900">ดูกิจกรรม</p>
          </a>
          <a href="/profile" className="block p-4 bg-white rounded-lg hover:shadow-md transition text-center">
            <p className="text-2xl mb-2">👤</p>
            <p className="font-semibold text-gray-900">โปรไฟล์</p>
          </a>
          <a href="/profile#badges" className="block p-4 bg-white rounded-lg hover:shadow-md transition text-center">
            <p className="text-2xl mb-2">🏆</p>
            <p className="font-semibold text-gray-900">แบดจ์</p>
          </a>
        </div>
      </div>
    </div>
  )
}
