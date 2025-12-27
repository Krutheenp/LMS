'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BadgeGrid } from '@/components/features/badges/badge-grid'
import { StatusBadge } from '@/components/shared/status-badge'

export default function AdminMemberDetailPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Button onClick={() => history.back()} variant="secondary">
        ← ย้อนกลับ
      </Button>

      {/* Member Info */}
      <Card>
        <CardHeader>
          <CardTitle>สมาชิกที่ 1</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600 text-sm">ชื่อ-นามสกุล</p>
            <p className="font-semibold">สมาชิกทดสอบ</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">อีเมล</p>
            <p className="font-semibold">member@example.com</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">คะแนนรวม</p>
            <p className="font-semibold">0/2500</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">ระดับ</p>
            <p className="font-semibold">🌱 ผู้เริ่มต้น</p>
          </div>
        </CardContent>
      </Card>

      {/* Badges */}
      <Card>
        <CardHeader>
          <CardTitle>แบดจ์ที่ได้รับ</CardTitle>
        </CardHeader>
        <CardContent>
          <BadgeGrid badges={[]} />
        </CardContent>
      </Card>

      {/* Activities Table */}
      <Card>
        <CardHeader>
          <CardTitle>รายการกิจกรรม</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="table-header">กิจกรรม</th>
                  <th className="table-header">สถานะ</th>
                  <th className="table-header">คะแนน</th>
                  <th className="table-header">วันที่ส่ง</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i} className="table-row-hover">
                    <td className="table-cell">กิจกรรมที่ {i + 1}</td>
                    <td className="table-cell">
                      <StatusBadge status="NOT_STARTED" />
                    </td>
                    <td className="table-cell">-</td>
                    <td className="table-cell">-</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
