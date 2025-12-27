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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        alert('เพิ่มกิจกรรมเรียบร้อย!')
        setShowForm(false)
        // Refresh activities
        const updatedRes = await fetch('/api/activities')
        const updatedData = await updatedRes.json()
        if (updatedData.success) {
          setActivities(updatedData.data)
        }
        // Reset form
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
      } else {
        alert('เกิดข้อผิดพลาดในการเพิ่มกิจกรรม')
      }
    } catch (error) {
      console.error('Error creating activity:', error)
      alert('เกิดข้อผิดพลาด')
    }
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
          className={`px-6 py-2 rounded-lg font-semibold text-white transition ${
            showForm
              ? 'bg-gray-600 hover:bg-gray-700'
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {showForm ? '✕ ยกเลิก' : '+ เพิ่มกิจกรรมใหม่'}
        </button>
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <Card className="border-l-4 border-green-500">
          <CardHeader>
            <CardTitle>📝 เพิ่มกิจกรรมใหม่</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  ชื่อกิจกรรม
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ชื่อกิจกรรม"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  คำอธิบาย
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="คำอธิบายกิจกรรม"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    คะแนนสูงสุด
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.maxScore}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxScore: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="100"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    ระดับ
                  </label>
                  <select
                    value={formData.gradeLevel}
                    onChange={(e) =>
                      setFormData({ ...formData, gradeLevel: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="F">F</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    วันหมดเขต
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition"
                >
                  ✓ บันทึก
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-2 rounded-lg font-semibold transition"
                >
                  ยกเลิก
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg shadow p-6 border-l-4 border-blue-500">
          <p className="text-gray-700 text-sm font-semibold">กิจกรรมทั้งหมด</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{activities.length}</p>
        </div>
        <div className="bg-purple-50 rounded-lg shadow p-6 border-l-4 border-purple-500">
          <p className="text-gray-700 text-sm font-semibold">ระดับ A</p>
          <p className="text-3xl font-bold text-purple-600 mt-2">
            {activities.filter((a) => a.gradeLevel === 'A').length}
          </p>
        </div>
        <div className="bg-green-50 rounded-lg shadow p-6 border-l-4 border-green-500">
          <p className="text-gray-700 text-sm font-semibold">ระดับ B</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {activities.filter((a) => a.gradeLevel === 'B').length}
          </p>
        </div>
        <div className="bg-orange-50 rounded-lg shadow p-6 border-l-4 border-orange-500">
          <p className="text-gray-700 text-sm font-semibold">ระดับ C</p>
          <p className="text-3xl font-bold text-orange-600 mt-2">
            {activities.filter((a) => a.gradeLevel === 'C').length}
          </p>
        </div>
      </div>

      {/* Activities List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
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
                  วันหมดเขต
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                  การจัดการ
                </th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity) => (
                <tr
                  key={activity.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {activity.title}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {activity.description.substring(0, 60)}...
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-bold text-blue-600">
                      {activity.maxScore}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-block bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {activity.gradeLevel}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">
                    {new Date(activity.endDate).toLocaleDateString('th-TH')}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="text-blue-600 hover:text-blue-800 font-semibold text-sm mr-3">
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
        {activities.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">ไม่มีกิจกรรม</p>
          </div>
        )}
      </div>
    </div>
  )
}
                  <label className="block text-gray-700 font-semibold mb-2">
                    เกณฑ์ระดับ
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>A</option>
                    <option>B</option>
                    <option>C</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    วันเริ่มต้น
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    วันหมดเขต
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <Button type="submit" variant="success" className="w-full">
                บันทึก
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Activities Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="table-header">#</th>
                <th className="table-header">ชื่อกิจกรรม</th>
                <th className="table-header">คะแนน</th>
                <th className="table-header">วันเริ่มต้น</th>
                <th className="table-header">วันหมดเขต</th>
                <th className="table-header">การดำเนินการ</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 20 }).map((_, i) => (
                <tr key={i} className="table-row-hover">
                  <td className="table-cell">{i + 1}</td>
                  <td className="table-cell">กิจกรรมที่ {i + 1}</td>
                  <td className="table-cell">100</td>
                  <td className="table-cell text-sm">27 ธ.ค. 2568</td>
                  <td className="table-cell text-sm">30 ธ.ค. 2568</td>
                  <td className="table-cell space-x-2">
                    <button className="text-blue-500 hover:underline text-sm">
                      แก้ไข
                    </button>
                    <button className="text-red-500 hover:underline text-sm">
                      ลบ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
