'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SubmissionForm } from '@/components/features/activities/submission-form'
import { StatusBadge } from '@/components/shared/status-badge'
import { Button } from '@/components/ui/button'

export default function ActivityDetailPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Button onClick={() => history.back()} variant="secondary">
        ← ย้อนกลับ
      </Button>

      {/* Activity Details */}
      <Card>
        <CardHeader>
          <CardTitle>กิจกรรมที่ 1: ส่งรายงาน</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-700">คำอธิบาย</h3>
            <p className="text-gray-600 mt-2">
              โปรแกรมนี้เป็นระบบจัดการกิจกรรมการเรียนรู้ สำหรับสมาชิก 600 คน แต่ละคนมีกิจกรรม
              50 รายการที่ต้องทำและส่ง
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700">ข้อมูลกิจกรรม</h3>
            <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
              <div>
                <span className="text-gray-600">คะแนนสูงสุด:</span>
                <p className="font-semibold">100</p>
              </div>
              <div>
                <span className="text-gray-600">สถานะ:</span>
                <div className="mt-1">
                  <StatusBadge status="NOT_STARTED" />
                </div>
              </div>
              <div>
                <span className="text-gray-600">วันเริ่มต้น:</span>
                <p className="font-semibold">27 ธันวาคม 2568</p>
              </div>
              <div>
                <span className="text-gray-600">วันหมดเขต:</span>
                <p className="font-semibold">30 ธันวาคม 2568</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submission Form */}
      <SubmissionForm
        activityId="1"
        onSubmit={async (files, notes) => {
          console.log('Submitting files:', files, 'Notes:', notes)
          alert('ส่งงานเรียบร้อย!')
        }}
      />

      {/* Previous Submission (if any) */}
      <Card>
        <CardHeader>
          <CardTitle>การส่งของคุณ</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-500 text-center py-8">
          ยังไม่มีการส่งงาน
        </CardContent>
      </Card>
    </div>
  )
}
