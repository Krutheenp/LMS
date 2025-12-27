'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function AdminActivitiesPage() {
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">จัดการกิจกรรม</h1>
        <Button variant="success" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'ยกเลิก' : '+ เพิ่มกิจกรรมใหม่'}
        </Button>
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>เพิ่มกิจกรรมใหม่</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  ชื่อกิจกรรม
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ชื่อกิจกรรม"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  คำอธิบาย
                </label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="คำอธิบายกิจกรรม"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    คะแนนสูงสุด
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="100"
                  />
                </div>
                <div>
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
