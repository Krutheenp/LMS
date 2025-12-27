'use client'

import { useState, useEffect } from 'react'

interface DashboardStats {
  totalMembers: number
  totalActivities: number
  pendingReviews: number
  approvedSubmissions: number
  successRate: number
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalMembers: 0,
    totalActivities: 50,
    pendingReviews: 0,
    approvedSubmissions: 0,
    successRate: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch members count
        const membersRes = await fetch('/api/members')
        const membersData = await membersRes.json()
        const totalMembers = membersData.success ? membersData.data?.length || 600 : 600

        // Fetch submissions for stats
        const submissionsRes = await fetch('/api/submissions')
        const submissionsData = await submissionsRes.json()

        let pendingCount = 0
        let approvedCount = 0

        if (submissionsData.success && submissionsData.data) {
          submissionsData.data.forEach((sub: any) => {
            if (sub.status === 'SUBMITTED') pendingCount++
            if (sub.status === 'APPROVED') approvedCount++
          })
        }

        const successRate = totalMembers > 0 
          ? Math.round((approvedCount / (totalMembers * 50)) * 100)
          : 0

        setStats({
          totalMembers,
          totalActivities: 50,
          pendingReviews: pendingCount,
          approvedSubmissions: approvedCount,
          successRate,
        })
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">🔧 Dashboard Admin</h1>
        <p className="text-sm text-gray-600">ระบบจัดการสมาชิก กิจกรรม และงาน</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
          <h3 className="text-gray-700 font-semibold mb-2 text-sm">👥 สมาชิกทั้งหมด</h3>
          <p className="text-4xl font-bold text-blue-600">{stats.totalMembers}</p>
          <p className="text-xs text-gray-600 mt-2">คน</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-lg p-6 border-l-4 border-green-500">
          <h3 className="text-gray-700 font-semibold mb-2 text-sm">📚 กิจกรรมทั้งหมด</h3>
          <p className="text-4xl font-bold text-green-600">{stats.totalActivities}</p>
          <p className="text-xs text-gray-600 mt-2">รายการ</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg shadow-lg p-6 border-l-4 border-yellow-500">
          <h3 className="text-gray-700 font-semibold mb-2 text-sm">⏳ รอการตรวจสอบ</h3>
          <p className="text-4xl font-bold text-yellow-600">{stats.pendingReviews}</p>
          <p className="text-xs text-gray-600 mt-2">งาน</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow-lg p-6 border-l-4 border-purple-500">
          <h3 className="text-gray-700 font-semibold mb-2 text-sm">📊 อัตราความสำเร็จ</h3>
          <p className="text-4xl font-bold text-purple-600">{stats.successRate}%</p>
          <p className="text-xs text-gray-600 mt-2">{stats.approvedSubmissions} งานอนุมัติ</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <a
          href="/admin/members"
          className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow border-t-4 border-blue-500"
        >
          <div className="text-3xl mb-3">👥</div>
          <h3 className="font-bold text-gray-900 mb-1">จัดการสมาชิก</h3>
          <p className="text-sm text-gray-600">ดูและจัดการข้อมูลสมาชิก</p>
        </a>

        <a
          href="/admin/activities"
          className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow border-t-4 border-green-500"
        >
          <div className="text-3xl mb-3">📚</div>
          <h3 className="font-bold text-gray-900 mb-1">จัดการกิจกรรม</h3>
          <p className="text-sm text-gray-600">สร้าง แก้ไข ลบกิจกรรม</p>
        </a>

        <a
          href="/admin/reviews"
          className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow border-t-4 border-yellow-500"
        >
          <div className="text-3xl mb-3">✅</div>
          <h3 className="font-bold text-gray-900 mb-1">ตรวจการส่ง</h3>
          <p className="text-sm text-gray-600">ตรวจสอบและให้คะแนนงาน</p>
        </a>

        <a
          href="/"
          className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow border-t-4 border-purple-500"
        >
          <div className="text-3xl mb-3">←</div>
          <h3 className="font-bold text-gray-900 mb-1">กลับแดชบอร์ด</h3>
          <p className="text-sm text-gray-600">ไปยังแดชบอร์ดผู้ใช้</p>
        </a>
      </div>

      {/* Information Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-lg p-8 border-l-4 border-blue-500">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">🎯 ยินดีต้อนรับสู่ Admin Panel</h2>
        <p className="text-gray-700 mb-4">
          ที่นี่คุณสามารถจัดการระบบการเรียนรู้ออนไลน์ได้อย่างสมบูรณ์
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-white rounded-lg p-4">
            <h3 className="font-bold text-gray-900 mb-2">📋 คุณสามารถทำได้:</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>✓ ดูรายชื่อและข้อมูลสมาชิกทั้งหมด</li>
              <li>✓ สร้าง แก้ไข ลบกิจกรรมการเรียน</li>
              <li>✓ ตรวจสอบและให้คะแนนงานที่ส่ง</li>
              <li>✓ ดูสถิติการเรียนและความสำเร็จ</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h3 className="font-bold text-gray-900 mb-2">📊 ข้อมูลระบบ:</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>✓ สมาชิก: {stats.totalMembers} คน</li>
              <li>✓ กิจกรรม: {stats.totalActivities} รายการ</li>
              <li>✓ งานรอตรวจ: {stats.pendingReviews} รายการ</li>
              <li>✓ ความสำเร็จ: {stats.successRate}%</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">📈 สรุปกิจกรรม</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center pb-3 border-b">
            <span className="text-gray-700">งานที่อนุมัติแล้ว</span>
            <span className="text-2xl font-bold text-green-600">{stats.approvedSubmissions}</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b">
            <span className="text-gray-700">งานรอตรวจสอบ</span>
            <span className="text-2xl font-bold text-yellow-600">{stats.pendingReviews}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700">งานรวมทั้งหมด</span>
            <span className="text-2xl font-bold text-blue-600">
              {stats.approvedSubmissions + stats.pendingReviews}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
