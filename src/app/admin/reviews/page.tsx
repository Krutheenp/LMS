'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Submission {
  id: string
  userId: string
  activityId: string
  status: string
  submittedAt: string
  memberName?: string
  activityTitle?: string
  score?: number
  feedback?: string
}

export default function AdminReviewsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'SUBMITTED' | 'APPROVED' | 'REJECTED'>(
    'SUBMITTED'
  )
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(
    null
  )
  const [score, setScore] = useState('')
  const [feedback, setFeedback] = useState('')
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await fetch('/api/submissions')
        const data = await res.json()

        if (data.success && data.data) {
          setSubmissions(data.data)
        }
      } catch (error) {
        console.error('Failed to fetch submissions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSubmissions()
  }, [])

  const filteredSubmissions =
    filter === 'all'
      ? submissions
      : submissions.filter((s) => s.status === filter)

  const stats = {
    pending: submissions.filter((s) => s.status === 'SUBMITTED').length,
    approved: submissions.filter((s) => s.status === 'APPROVED').length,
    rejected: submissions.filter((s) => s.status === 'REJECTED').length,
  }

  const handleApprove = async (submission: Submission) => {
    setProcessing(true)
    try {
      const res = await fetch(`/api/submissions/${submission.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'APPROVED',
          score: parseInt(score) || 0,
          feedback,
        }),
      })

      if (res.ok) {
        alert('อนุมัติแล้ว!')
        setSubmissions(
          submissions.map((s) =>
            s.id === submission.id
              ? {
                  ...s,
                  status: 'APPROVED',
                  score: parseInt(score),
                  feedback,
                }
              : s
          )
        )
        setSelectedSubmission(null)
        setScore('')
        setFeedback('')
      }
    } catch (error) {
      console.error('Error approving submission:', error)
      alert('เกิดข้อผิดพลาด')
    } finally {
      setProcessing(false)
    }
  }

  const handleReject = async (submission: Submission) => {
    setProcessing(true)
    try {
      const res = await fetch(`/api/submissions/${submission.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'REJECTED',
          feedback,
        }),
      })

      if (res.ok) {
        alert('ปฏิเสธแล้ว!')
        setSubmissions(
          submissions.map((s) =>
            s.id === submission.id
              ? { ...s, status: 'REJECTED', feedback }
              : s
          )
        )
        setSelectedSubmission(null)
        setScore('')
        setFeedback('')
      }
    } catch (error) {
      console.error('Error rejecting submission:', error)
      alert('เกิดข้อผิดพลาด')
    } finally {
      setProcessing(false)
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
      <h1 className="text-3xl font-bold text-gray-900">✅ ตรวจการส่ง</h1>

      {/* Queue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-yellow-50 rounded-lg shadow p-6 border-l-4 border-yellow-500">
          <p className="text-gray-700 text-sm font-semibold mb-1">รอการตรวจสอบ</p>
          <p className="text-4xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-green-50 rounded-lg shadow p-6 border-l-4 border-green-500">
          <p className="text-gray-700 text-sm font-semibold mb-1">อนุมัติแล้ว</p>
          <p className="text-4xl font-bold text-green-600">{stats.approved}</p>
        </div>
        <div className="bg-red-50 rounded-lg shadow p-6 border-l-4 border-red-500">
          <p className="text-gray-700 text-sm font-semibold mb-1">ปฏิเสธ</p>
          <p className="text-4xl font-bold text-red-600">{stats.rejected}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 bg-white p-4 rounded-lg shadow">
        {(['SUBMITTED', 'APPROVED', 'REJECTED', 'all'] as const).map(
          (status) => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === status
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {status === 'SUBMITTED' && '⏳ รอตรวจ'}
              {status === 'APPROVED' && '✓ อนุมัติ'}
              {status === 'REJECTED' && '✕ ปฏิเสธ'}
              {status === 'all' && '📋 ทั้งหมด'}
            </button>
          )
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Submissions List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>คิวงานส่งที่รอการตรวจสอบ ({filteredSubmissions.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredSubmissions.length === 0 ? (
                <p className="text-center text-gray-500 py-8">ไม่มีงาน</p>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {filteredSubmissions.map((submission) => (
                    <div
                      key={submission.id}
                      onClick={() => setSelectedSubmission(submission)}
                      className={`border rounded-lg p-4 cursor-pointer transition ${
                        selectedSubmission?.id === submission.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">
                            ID: {submission.id}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            สมาชิก: {submission.memberName || 'ไม่พบชื่อ'}
                          </p>
                          <p className="text-sm text-gray-600">
                            กิจกรรม: {submission.activityTitle || 'ไม่พบชื่อ'}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            ส่งเมื่อ:{' '}
                            {new Date(submission.submittedAt).toLocaleString(
                              'th-TH'
                            )}
                          </p>
                        </div>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white ${
                            submission.status === 'APPROVED'
                              ? 'bg-green-500'
                              : submission.status === 'REJECTED'
                              ? 'bg-red-500'
                              : 'bg-yellow-500'
                          }`}
                        >
                          {submission.status === 'APPROVED' && '✓ อนุมัติ'}
                          {submission.status === 'REJECTED' && '✕ ปฏิเสธ'}
                          {submission.status === 'SUBMITTED' && '⏳ รอตรวจ'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Review Panel */}
        {selectedSubmission && (
          <Card className="border-l-4 border-blue-500">
            <CardHeader>
              <CardTitle>📋 ตรวจสอบงาน</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  ID:
                </label>
                <p className="text-gray-900">{selectedSubmission.id}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  สมาชิก:
                </label>
                <p className="text-gray-900">
                  {selectedSubmission.memberName || 'ไม่พบชื่อ'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  กิจกรรม:
                </label>
                <p className="text-gray-900">
                  {selectedSubmission.activityTitle || 'ไม่พบชื่อ'}
                </p>
              </div>

              {selectedSubmission.status === 'SUBMITTED' && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      คะแนน:
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={score}
                      onChange={(e) => setScore(e.target.value)}
                      placeholder="0-100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ความเห็น:
                    </label>
                    <textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="เขียนความเห็น..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={4}
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <button
                      onClick={() => handleApprove(selectedSubmission)}
                      disabled={processing || !score}
                      className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-2 rounded-lg font-semibold transition"
                    >
                      {processing ? 'กำลังบันทึก...' : '✓ อนุมัติ'}
                    </button>
                    <button
                      onClick={() => handleReject(selectedSubmission)}
                      disabled={processing}
                      className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-2 rounded-lg font-semibold transition"
                    >
                      {processing ? 'กำลังบันทึก...' : '✕ ปฏิเสธ'}
                    </button>
                  </div>
                </>
              )}

              {selectedSubmission.status === 'APPROVED' && (
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm text-green-800">
                    <span className="font-bold">✓ อนุมัติแล้ว</span>
                  </p>
                  {selectedSubmission.score && (
                    <p className="text-sm text-green-700 mt-1">
                      คะแนน: {selectedSubmission.score}
                    </p>
                  )}
                  {selectedSubmission.feedback && (
                    <p className="text-sm text-green-700 mt-1">
                      {selectedSubmission.feedback}
                    </p>
                  )}
                </div>
              )}

              {selectedSubmission.status === 'REJECTED' && (
                <div className="bg-red-50 p-3 rounded-lg">
                  <p className="text-sm text-red-800">
                    <span className="font-bold">✕ ปฏิเสธแล้ว</span>
                  </p>
                  {selectedSubmission.feedback && (
                    <p className="text-sm text-red-700 mt-1">
                      {selectedSubmission.feedback}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

      {/* Grading Modal would go here */}
    </div>
  )
}
