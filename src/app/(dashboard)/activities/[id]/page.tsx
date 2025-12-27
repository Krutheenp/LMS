'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/shared/status-badge'

interface Activity {
  id: string
  title: string
  description: string
  maxScore: number
  gradeLevel: string
  startDate: string
  endDate: string
}

interface Submission {
  id: string
  status: string
  score?: number
  feedback?: string
  submittedAt?: string
}

export default function ActivityDetailPage() {
  const router = useRouter()
  const params = useParams()
  const activityId = params?.id as string

  const [activity, setActivity] = useState<Activity | null>(null)
  const [submission, setSubmission] = useState<Submission | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    const getUserIdFromCookie = () => {
      const cookies = document.cookie.split(';')
      for (const cookie of cookies) {
        if (cookie.trim().startsWith('auth-token=')) {
          try {
            const token = cookie.trim().substring('auth-token='.length)
            const decoded = JSON.parse(Buffer.from(token, 'base64').toString())
            return decoded.userId
          } catch (e) {
            console.error('Failed to decode user:', e)
          }
        }
      }
      return null
    }

    const fetchData = async () => {
      try {
        if (!activityId) return

        const userId = getUserIdFromCookie()
        if (!userId) {
          setLoading(false)
          return
        }

        // Fetch activity details
        const activityRes = await fetch(`/api/activities/${activityId}`)
        const activityData = await activityRes.json()

        if (activityData.success) {
          setActivity(activityData.data)
        }

        // Fetch user's submission for this activity
        const submissionsRes = await fetch(`/api/submissions?userId=${userId}`)
        const submissionsData = await submissionsRes.json()

        if (submissionsData.success && submissionsData.data) {
          const userSubmission = submissionsData.data.find(
            (s: any) => s.activityId === activityId
          )
          if (userSubmission) {
            setSubmission(userSubmission)
          }
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [activityId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      alert('กรุณาเลือกไฟล์')
      return
    }

    setSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('notes', notes)
      formData.append('activityId', activityId)

      // Get userId from cookie
      const cookies = document.cookie.split(';')
      let userId = ''
      for (const cookie of cookies) {
        if (cookie.trim().startsWith('auth-token=')) {
          try {
            const token = cookie.trim().substring('auth-token='.length)
            const decoded = JSON.parse(Buffer.from(token, 'base64').toString())
            userId = decoded.userId
          } catch (e) {
            console.error('Failed to decode user:', e)
          }
        }
      }

      formData.append('userId', userId)

      const res = await fetch('/api/submissions', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (data.success) {
        alert('ส่งงานเรียบร้อย!')
        // Refresh submission data
        const submissionsRes = await fetch(`/api/submissions?userId=${userId}`)
        const submissionsData = await submissionsRes.json()
        if (submissionsData.success && submissionsData.data) {
          const userSubmission = submissionsData.data.find(
            (s: any) => s.activityId === activityId
          )
          if (userSubmission) {
            setSubmission(userSubmission)
          }
        }
        setFile(null)
        setNotes('')
      } else {
        alert('เกิดข้อผิดพลาด: ' + data.message)
      }
    } catch (error) {
      console.error('Submit error:', error)
      alert('เกิดข้อผิดพลาดในการส่งงาน')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!activity) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">ไม่พบกิจกรรมนี้</p>
        <button
          onClick={() => router.back()}
          className="text-blue-600 hover:text-blue-800 underline"
        >
          ← ย้อนกลับ
        </button>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    } catch {
      return dateString
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <button
        onClick={() => router.back()}
        className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-2"
      >
        ← ย้อนกลับ
      </button>

      {/* Activity Details */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{activity.title}</CardTitle>
              <p className="text-sm text-gray-600 mt-2">
                ระดับ: {activity.gradeLevel}
              </p>
            </div>
            {submission && <StatusBadge status={submission.status} />}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">📝 คำอธิบาย</h3>
            <p className="text-gray-600">{activity.description}</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700 mb-3">📊 ข้อมูลกิจกรรม</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">คะแนนสูงสุด</p>
                <p className="text-2xl font-bold text-blue-600">{activity.maxScore}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">สถานะ</p>
                <p className="text-lg font-bold text-purple-600">
                  {submission ? submission.status === 'APPROVED' ? '✓ อนุมัติ' : submission.status === 'SUBMITTED' ? '⏳ รอตรวจ' : 'ยังไม่ส่ง' : '🔒 ยังไม่ส่ง'}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">เริ่มต้น</p>
                <p className="text-sm font-bold text-green-600">{formatDate(activity.startDate)}</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">หมดเขต</p>
                <p className="text-sm font-bold text-orange-600">{formatDate(activity.endDate)}</p>
              </div>
            </div>
          </div>

          {submission && submission.score !== null && (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border-l-4 border-yellow-400">
              <p className="text-sm text-gray-700 mb-1">คะแนนที่ได้</p>
              <p className="text-3xl font-bold text-orange-600">
                {submission.score}/{activity.maxScore}
              </p>
              {submission.feedback && (
                <div className="mt-3">
                  <p className="text-sm font-semibold text-gray-700 mb-1">💬 ความเห็นจากอาจารย์</p>
                  <p className="text-gray-600">{submission.feedback}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submission Form - Show only if not approved */}
      {!submission || submission.status !== 'APPROVED' ? (
        <Card>
          <CardHeader>
            <CardTitle>📤 ส่งงาน</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  เลือกไฟล์
                </label>
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
                {file && <p className="text-sm text-green-600 mt-2">✓ เลือกไฟล์: {file.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  หมายเหตุ (ไม่บังคับ)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="เขียนหมายเหตุเพิ่มเติม..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  rows={4}
                />
              </div>

              <button
                type="submit"
                disabled={submitting || !file}
                className={`w-full py-3 rounded-lg font-semibold text-white transition ${
                  submitting || !file
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {submitting ? 'กำลังส่ง...' : '✓ ส่งงาน'}
              </button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>✅ งานของคุณได้รับการอนุมัติแล้ว</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              คุณได้ส่งงานนี้เรียบร้อยและได้รับการอนุมัติแล้ว
            </p>
          </CardContent>
        </Card>
      )}

      {/* Submission History */}
      {submission && (
        <Card>
          <CardHeader>
            <CardTitle>📋 ประวัติการส่ง</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-600 mb-1">สถานะ</p>
                  <p className="font-semibold text-gray-900">
                    {submission.status === 'APPROVED' && '✓ อนุมัติ'}
                    {submission.status === 'SUBMITTED' && '⏳ รอตรวจ'}
                    {submission.status === 'NOT_STARTED' && '🔒 ยังไม่ส่ง'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">วันที่ส่ง</p>
                  <p className="font-semibold text-gray-900">
                    {submission.submittedAt
                      ? formatDate(submission.submittedAt)
                      : '-'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
