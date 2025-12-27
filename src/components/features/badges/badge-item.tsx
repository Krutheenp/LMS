'use client'

import React from 'react'
import { GRADE_CRITERIA } from '@/lib/constants'

interface BadgeItemProps {
  title: string
  score: number
  gradeLevel: 'A' | 'B' | 'C' | 'D' | 'F'
  animated?: boolean
}

export const BadgeItem: React.FC<BadgeItemProps> = ({
  title,
  score,
  gradeLevel,
  animated = false,
}) => {
  const grade = GRADE_CRITERIA[gradeLevel]

  return (
    <div
      className={`flex flex-col items-center justify-center ${
        animated ? 'animate-bounce-in' : ''
      }`}
    >
      <div
        className={`badge-circle w-24 h-24 ${
          gradeLevel === 'A'
            ? 'badge-gold'
            : gradeLevel === 'B'
              ? 'badge-silver'
              : gradeLevel === 'C'
                ? 'badge-bronze'
                : 'bg-gray-500'
        }`}
        style={{ backgroundColor: grade.color }}
      >
        <div className="text-center">
          <div className="text-2xl font-bold">{score}</div>
          <div className="text-xs">{gradeLevel}</div>
        </div>
      </div>
      <p className="mt-3 text-center text-sm font-semibold text-gray-700 w-full truncate">
        {title}
      </p>
    </div>
  )
}
