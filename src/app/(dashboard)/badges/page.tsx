'use client'

import React, { useState, useEffect } from 'react'

interface Badge {
  id: string
  name: string
  description: string
  icon: string
  requirement: string
}

interface BadgeData {
  allBadges: Badge[]
  earnedBadges: string[]
  totalBadges: number
  earnedCount: number
}

export default function BadgesPage() {
  const [badgeData, setBadgeData] = useState<BadgeData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get userId from cookie
    const getUserIdFromCookie = () => {
      const cookies = document.cookie.split(';')
      for (const cookie of cookies) {
        if (cookie.trim().startsWith('auth-token=')) {
          try {
            const token = cookie.trim().substring('auth-token='.length)
            // Decode base64 in browser using atob
            const decoded = JSON.parse(atob(token))
            return decoded.userId
          } catch (e) {
            console.error('Failed to decode user:', e)
          }
        }
      }
      return null
    }

    const fetchBadges = async () => {
      try {
        const userId = getUserIdFromCookie()
        if (!userId) {
          setLoading(false)
          return
        }

        const res = await fetch(`/api/badges?userId=${userId}`)
        const data = await res.json()

        if (data.success) {
          setBadgeData(data.data)
        }
      } catch (error) {
        console.error('Failed to fetch badges:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBadges()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!badgeData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">ไม่สามารถโหลดข้อมูลแบดจ์</p>
      </div>
    )
  }

  const isEarned = (badgeId: string) => badgeData.earnedBadges.includes(badgeId)

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">🎖️ แบดจ์ของฉัน</h1>
        <p className="text-gray-600 mt-2">
          คุณได้รับแบดจ์แล้ว {badgeData.earnedCount} จาก {badgeData.totalBadges}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">ความสำเร็จ</span>
          <span className="text-sm font-semibold text-gray-700">
            {Math.round((badgeData.earnedCount / badgeData.totalBadges) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-500"
            style={{
              width: `${(badgeData.earnedCount / badgeData.totalBadges) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {badgeData.allBadges.map((badge) => {
          const earned = isEarned(badge.id)
          return (
            <div
              key={badge.id}
              className={`rounded-lg shadow transition-all transform hover:scale-105 ${
                earned ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300' : 'bg-white'
              }`}
            >
              <div className="p-6">
                {/* Badge Icon */}
                <div className="text-6xl text-center mb-4">{badge.icon}</div>

                {/* Badge Info */}
                <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
                  {badge.name}
                </h3>
                <p className="text-sm text-gray-600 text-center mb-4">
                  {badge.description}
                </p>

                {/* Requirement */}
                <div className="bg-gray-100 rounded p-3 mb-4">
                  <p className="text-xs text-gray-700 text-center">
                    <span className="font-semibold">เงื่อนไข:</span> {badge.requirement}
                  </p>
                </div>

                {/* Status Badge */}
                <div className="text-center">
                  {earned ? (
                    <span className="inline-block bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-2 rounded-full text-sm font-bold">
                      ✓ ได้รับแล้ว
                    </span>
                  ) : (
                    <span className="inline-block bg-gray-300 text-gray-700 px-4 py-2 rounded-full text-sm font-medium">
                      🔒 ล็อก
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Earned Badges Section */}
      {badgeData.earnedCount > 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">🏆 แบดจ์ที่ได้รับ</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {badgeData.allBadges
              .filter((badge) => isEarned(badge.id))
              .map((badge) => (
                <div key={badge.id} className="text-center">
                  <div className="text-5xl mb-2">{badge.icon}</div>
                  <p className="text-xs font-semibold text-gray-700">{badge.name}</p>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Tips Section */}
      <div className="bg-blue-50 rounded-lg shadow p-6 border-l-4 border-blue-500">
        <h3 className="text-lg font-bold text-blue-900 mb-3">💡 เคล็ดลับการได้รับแบดจ์</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>✓ ส่งกิจกรรมให้มากขึ้นเพื่อได้รับแบดจ์</li>
          <li>✓ พยายามให้ได้คะแนนสูง หรือเต็ม</li>
          <li>✓ ส่งกิจกรรมให้ครบทั้งหมดเพื่อเป็น "ผู้ยอดเยี่ยม"</li>
          <li>✓ คะแนนสูง 80% ขึ้นไปนับเป็น "คะแนนสูง"</li>
        </ul>
      </div>
    </div>
  )
}
