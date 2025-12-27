'use client'

import React from 'react'
import { SUBMISSION_STATUS } from '@/lib/constants'

interface StatusBadgeProps {
  status: 'NOT_STARTED' | 'SUBMITTED' | 'APPROVED' | 'REJECTED'
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusInfo = SUBMISSION_STATUS[status]

  return (
    <span
      className="px-3 py-1 rounded-full text-sm font-semibold text-white"
      style={{ backgroundColor: statusInfo.color }}
    >
      {statusInfo.label}
    </span>
  )
}
