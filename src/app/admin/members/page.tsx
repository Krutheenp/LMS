'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Member {
  id: string
  name: string
  email: string
  totalScore: number
  level: string
  createdAt: string
}

export default function AdminMembersPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const itemsPerPage = 20

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await fetch('/api/members')
        const data = await res.json()

        if (data.success && data.data) {
          setMembers(data.data)
          setFilteredMembers(data.data)
        }
      } catch (error) {
        console.error('Failed to fetch members:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMembers()
  }, [])

  // Handle search
  useEffect(() => {
    const filtered = members.filter(
      (member) =>
        member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredMembers(filtered)
    setPage(1)
  }, [searchTerm, members])

  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      BEGINNER: 'bg-green-100 text-green-800',
      INTERMEDIATE: 'bg-blue-100 text-blue-800',
      ADVANCED: 'bg-purple-100 text-purple-800',
      EXPERT: 'bg-yellow-100 text-yellow-800',
    }
    return colors[level] || 'bg-gray-100 text-gray-800'
  }

  const getLevelText = (level: string) => {
    const texts: Record<string, string> = {
      BEGINNER: '🌱 ผู้เริ่มต้น',
      INTERMEDIATE: '🌿 ระดับกลาง',
      ADVANCED: '🌳 ขั้นสูง',
      EXPERT: '👑 ผู้เชี่ยวชาญ',
    }
    return texts[level] || 'ไม่ระบุ'
  }

  // Calculate statistics
  const stats = {
    total: members.length,
    beginner: members.filter((m) => m.level === 'BEGINNER').length,
    intermediate: members.filter((m) => m.level === 'INTERMEDIATE').length,
    advanced: members.filter((m) => m.level === 'ADVANCED').length,
    expert: members.filter((m) => m.level === 'EXPERT').length,
  }

  // Pagination
  const startIdx = (page - 1) * itemsPerPage
  const paginatedMembers = filteredMembers.slice(
    startIdx,
    startIdx + itemsPerPage
  )
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage)

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">👥 จัดการสมาชิก</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition">
          + เพิ่มสมาชิกใหม่
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow">
        <input
          type="text"
          placeholder="🔍 ค้นหาชื่อหรืออีเมล..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow p-6 border-l-4 border-blue-500">
          <p className="text-gray-700 text-sm font-semibold mb-1">สมาชิกทั้งหมด</p>
          <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow p-6 border-l-4 border-green-500">
          <p className="text-gray-700 text-sm font-semibold mb-1">ผู้เริ่มต้น</p>
          <p className="text-3xl font-bold text-green-600">{stats.beginner}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg shadow p-6 border-l-4 border-yellow-500">
          <p className="text-gray-700 text-sm font-semibold mb-1">ระดับกลาง</p>
          <p className="text-3xl font-bold text-yellow-600">{stats.intermediate}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow p-6 border-l-4 border-purple-500">
          <p className="text-gray-700 text-sm font-semibold mb-1">ขั้นสูง</p>
          <p className="text-3xl font-bold text-purple-600">{stats.advanced}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg shadow p-6 border-l-4 border-orange-500">
          <p className="text-gray-700 text-sm font-semibold mb-1">ผู้เชี่ยวชาญ</p>
          <p className="text-3xl font-bold text-orange-600">{stats.expert}</p>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredMembers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">ไม่พบสมาชิก</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      ชื่อ
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      อีเมล
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                      คะแนน
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                      ระดับ
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                      วันที่เข้าร่วม
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                      การจัดการ
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedMembers.map((member) => (
                    <tr
                      key={member.id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">
                          {member.name || member.email.split('@')[0]}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-600 text-sm">{member.email}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="font-bold text-blue-600">
                          {member.totalScore}/2500
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getLevelColor(
                            member.level
                          )}`}
                        >
                          {getLevelText(member.level)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-600">
                        {member.createdAt
                          ? new Date(member.createdAt).toLocaleDateString(
                              'th-TH'
                            )
                          : '-'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <a
                          href={`/admin/members/${member.id}`}
                          className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                        >
                          ดูรายละเอียด
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 p-4 border-t bg-gray-50">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 hover:bg-gray-200"
                >
                  ←
                </button>
                <span className="text-sm font-semibold text-gray-700">
                  หน้า {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 hover:bg-gray-200"
                >
                  →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
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
