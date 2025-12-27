'use client'

import React from 'react'
import { BadgeItem } from './badge-item'

interface BadgeGridProps {
  badges: Array<{
    id: string
    activity: { id: string; title: string }
    points: number
    earnedDate: Date
  }>
  loading?: boolean
}

export const BadgeGrid: React.FC<BadgeGridProps> = ({ badges, loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-3" />
            <div className="h-4 bg-gray-300 rounded w-20 mx-auto" />
          </div>
        ))}
      </div>
    )
  }

  if (badges.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">ยังไม่มีแบดจ์ที่ได้รับ</p>
        <p className="text-gray-400 text-sm">เริ่มทำกิจกรรมเพื่อรับแบดจ์</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
      {badges.map((badge) => (
        <BadgeItem
          key={badge.id}
          title={badge.activity.title}
          score={badge.points}
          gradeLevel={badge.points >= 90 ? 'A' : badge.points >= 80 ? 'B' : badge.points >= 70 ? 'C' : badge.points >= 60 ? 'D' : 'F'}
          animated
        />
      ))}
    </div>
  )
}
