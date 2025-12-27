'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/shared/status-badge'
import { Button } from '@/components/ui/button'
import { formatDateTh, formatDateISO } from '@/lib/utils'

interface ActivityCardProps {
  id: string
  title: string
  description?: string
  maxScore: number
  endDate: Date | string
  submissionStatus?: 'NOT_STARTED' | 'SUBMITTED' | 'APPROVED' | 'REJECTED'
  currentScore?: number
  onSubmit?: () => void
  onView?: () => void
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  id,
  title,
  description,
  maxScore,
  endDate,
  submissionStatus = 'NOT_STARTED',
  currentScore,
  onSubmit,
  onView,
}) => {
  const isPastDeadline = new Date(endDate) < new Date()
  const completionPercentage = currentScore
    ? Math.round((currentScore / maxScore) * 100)
    : 0

  return (
    <Card className="card-hover">
      <CardHeader>
        <CardTitle className="flex justify-between items-start">
          <span className="flex-1">{title}</span>
          <StatusBadge status={submissionStatus} />
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {description && <p className="text-gray-600 text-sm">{description}</p>}

        {/* Progress Bar */}
        <div>
          <div className="flex justify-between mb-2 text-sm">
            <span>ความคืบหน้า</span>
            <span className="font-semibold">{completionPercentage}%</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Score Display */}
        <div className="flex justify-between items-center bg-gray-50 p-3 rounded">
          <span className="text-gray-600">คะแนน</span>
          <span className="font-bold">
            {currentScore || 0}/{maxScore}
          </span>
        </div>

        {/* Deadline */}
        <div className="text-sm text-gray-600">
          วันหมดเขต: {formatDateTh(endDate)}
          {isPastDeadline && (
            <span className="ml-2 text-red-500 font-semibold">(หมดเขตแล้ว)</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-4">
          {submissionStatus === 'NOT_STARTED' && !isPastDeadline && (
            <Button
              variant="primary"
              size="sm"
              className="flex-1"
              onClick={onSubmit}
            >
              ส่งงาน
            </Button>
          )}
          <Button
            variant="secondary"
            size="sm"
            className="flex-1"
            onClick={onView}
          >
            ดูรายละเอียด
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
