'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/shared/status-badge'
import { formatDateTh } from '@/lib/utils'

interface MembersTableProps {
  members: Array<{
    id: string
    name: string
    email: string
    totalScore: number
    level: string
  }>
  onViewProfile?: (id: string) => void
  loading?: boolean
}

export const MembersTable: React.FC<MembersTableProps> = ({
  members,
  onViewProfile,
  loading = false,
}) => {
  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-gray-500">
          กำลังโหลด...
        </CardContent>
      </Card>
    )
  }

  if (members.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-gray-500">
          ไม่มีสมาชิก
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="table-header">ชื่อ</th>
              <th className="table-header">อีเมล</th>
              <th className="table-header">คะแนนรวม</th>
              <th className="table-header">ระดับ</th>
              <th className="table-header">การดำเนินการ</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id} className="table-row-hover">
                <td className="table-cell">{member.name}</td>
                <td className="table-cell text-sm">{member.email}</td>
                <td className="table-cell font-semibold">{member.totalScore}</td>
                <td className="table-cell">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                    {member.level}
                  </span>
                </td>
                <td className="table-cell">
                  <button
                    onClick={() => onViewProfile?.(member.id)}
                    className="text-blue-500 hover:underline text-sm font-semibold"
                  >
                    ดูโปรไฟล์
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
