'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/shared/status-badge'

export default function AdminReviewsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">ตรวจสอบงาน</h1>

      {/* Queue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600 text-sm">รอการตรวจสอบ</p>
            <p className="text-3xl font-bold text-yellow-500 mt-2">12</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600 text-sm">อนุมัติแล้ว</p>
            <p className="text-3xl font-bold text-green-500 mt-2">245</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600 text-sm">ปฏิเสธ</p>
            <p className="text-3xl font-bold text-red-500 mt-2">3</p>
          </CardContent>
        </Card>
      </div>

      {/* Submissions Queue */}
      <Card>
        <CardHeader>
          <CardTitle>คิวงานส่งที่รอการตรวจสอบ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="border border-gray-200 rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <h4 className="font-semibold text-gray-900">
                    สมาชิกที่ {i + 1} - กิจกรรมที่ {i + 1}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    ส่งเมื่อ 27 ธันวาคม 2568 เวลา 14:30
                  </p>
                  <div className="mt-2">
                    <a href="#" className="text-blue-500 text-sm hover:underline">
                      📄 ดูไฟล์แนบ
                    </a>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => alert('Approve')}
                  >
                    อนุมัติ
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => alert('Reject')}
                  >
                    ปฏิเสธ
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Grading Modal would go here */}
    </div>
  )
}
