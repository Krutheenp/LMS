'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface SubmissionFormProps {
  activityId: string
  onSubmit: (files: File[], notes: string) => Promise<void>
  loading?: boolean
}

export const SubmissionForm: React.FC<SubmissionFormProps> = ({
  activityId,
  onSubmit,
  loading = false,
}) => {
  const [files, setFiles] = useState<File[]>([])
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await onSubmit(files, notes)
      setFiles([])
      setNotes('')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>ส่งงาน</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File Upload */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              อัปโหลดไฟล์
            </label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="block w-full p-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500"
            />
            {files.length > 0 && (
              <div className="mt-3 space-y-2">
                {files.map((file, idx) => (
                  <div key={idx} className="bg-gray-50 p-2 rounded flex justify-between">
                    <span className="text-sm text-gray-700">{file.name}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setFiles(files.filter((_, i) => i !== idx))
                      }
                      className="text-red-500 text-sm"
                    >
                      ลบ
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              หมายเหตุ (ตัวเลือก)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="เขียนหมายเหตุเพิ่มเติม..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="success"
            className="w-full"
            loading={isSubmitting}
            disabled={files.length === 0}
          >
            ส่งงาน
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
