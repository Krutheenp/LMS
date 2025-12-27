'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MembersTable } from '@/components/features/admin/members-table'
import { Button } from '@/components/ui/button'

export default function AdminMembersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)

  // Mock data
  const mockMembers = Array.from({ length: 50 }).map((_, i) => ({
    id: `member-${i + 1}`,
    name: `สมาชิกที่ ${i + 1}`,
    email: `member${i + 1}@example.com`,
    totalScore: Math.floor(Math.random() * 2500),
    level: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'][
      Math.floor(Math.random() * 4)
    ],
  }))

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">จัดการสมาชิก</h1>
        <Button variant="success">+ เพิ่มสมาชิกใหม่</Button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow">
        <input
          type="text"
          placeholder="ค้นหาชื่อหรืออีเมล..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setPage(1)
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600 text-sm">สมาชิกทั้งหมด</p>
            <p className="text-3xl font-bold text-blue-500 mt-2">600</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600 text-sm">ผู้เริ่มต้น</p>
            <p className="text-3xl font-bold text-green-500 mt-2">150</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600 text-sm">ระดับกลาง</p>
            <p className="text-3xl font-bold text-yellow-500 mt-2">250</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600 text-sm">ผู้เชี่ยวชาญ</p>
            <p className="text-3xl font-bold text-purple-500 mt-2">50</p>
          </CardContent>
        </Card>
      </div>

      {/* Members Table */}
      <MembersTable
        members={mockMembers}
        onViewProfile={(id) => alert('View profile: ' + id)}
      />

      {/* Pagination */}
      <div className="flex justify-center gap-2">
        <Button
          variant="secondary"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          ← ก่อนหน้า
        </Button>
        <span className="px-4 py-2 bg-white rounded">หน้า {page}</span>
        <Button variant="secondary" onClick={() => setPage(page + 1)}>
          ถัดไป →
        </Button>
      </div>
    </div>
  )
}
