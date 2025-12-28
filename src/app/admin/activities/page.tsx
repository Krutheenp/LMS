'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Activity {
  id: string
  title: string
  description: string
  maxScore: number
  gradeLevel: string
  startDate: string
  endDate: string
}

export default function AdminActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    maxScore: 100,
    gradeLevel: 'A',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
  })

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await fetch('/api/activities')
        const data = await res.json()

        if (data.success && data.data) {
          setActivities(data.data)
        }
      } catch (error) {
        console.error('Failed to fetch activities:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'maxScore' ? parseInt(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    alert('บันทึกกิจกรรมเรียบร้อย!')
    setShowForm(false)
    setFormData({
      title: '',
      description: '',
      maxScore: 100,
      gradeLevel: 'A',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
    })
  }

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
        <h1 className="text-3xl font-bold text-gray-900">📚 จัดการกิจกรรม</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition"
        >
          {showForm ? '✕ ปิด' : '+ เพิ่มกิจกรรมใหม่'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow p-6 border-l-4 border-blue-500">
          <p className="text-gray-700 text-sm font-semibold mb-1">กิจกรรมทั้งหมด</p>
          <p className="text-3xl font-bold text-blue-600">{activities.length}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow p-6 border-l-4 border-green-500">
          <p className="text-gray-700 text-sm font-semibold mb-1">กำลังเปิด</p>
          <p className="text-3xl font-bold text-green-600">
            {activities.filter((a) => new Date(a.startDate) <= new Date()).length}
          </p>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg shadow p-6 border-l-4 border-yellow-500">
          <p className="text-gray-700 text-sm font-semibold mb-1">ขณะนี้กำลังดำเนินการ</p>
          <p className="text-3xl font-bold text-yellow-600">
            {
              activities.filter(
                (a) =>
                  new Date(a.startDate) <= new Date() &&
                  new Date() <= new Date(a.endDate)
              ).length
            }
          </p>
        </div>
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <Card className="border-l-4 border-blue-500">
          <CardHeader>
            <CardTitle>เพิ่มกิจกรรมใหม่</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  ชื่อกิจกรรม
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ชื่อกิจกรรม"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  คำอธิบาย
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="คำอธิบายกิจกรรม"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    คะแนนสูงสุด
                  </label>
                  <input
                    type="number"
                    name="maxScore"
                    value={formData.maxScore}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    เกณฑ์ระดับ
                  </label>
                  <select
                    name="gradeLevel"
                    value={formData.gradeLevel}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>A</option>
                    <option>B</option>
                    <option>C</option>
                    <option>D</option>
                    <option>F</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    วันเริ่มต้น
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    วันหมดเขต
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition"
              >
                ✓ บันทึก
              </button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Activities Table */}
      <Card>
        <CardHeader>
          <CardTitle>รายการกิจกรรม</CardTitle>
        </CardHeader>
        <CardContent>
          {activities.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">ไม่มีกิจกรรม</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      #
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      ชื่อกิจกรรม
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                      คะแนน
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                      ระดับ
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                      วันเริ่ม
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                      วันสิ้นสุด
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                      การจัดการ
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((activity, index) => (
                    <tr key={activity.id} className="border-b hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm text-gray-600">{index + 1}</td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">{activity.title}</p>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                          {activity.description}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="font-bold text-blue-600">{activity.maxScore}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-block px-3 py-1 rounded-full text-sm font-bold bg-yellow-100 text-yellow-800">
                          {activity.gradeLevel}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-600">
                        {new Date(activity.startDate).toLocaleDateString('th-TH')}
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-600">
                        {new Date(activity.endDate).toLocaleDateString('th-TH')}
                      </td>
                      <td className="px-6 py-4 text-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-800 font-semibold text-sm">
                          แก้ไข
                        </button>
                        <button className="text-red-600 hover:text-red-800 font-semibold text-sm">
                          ลบ
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
