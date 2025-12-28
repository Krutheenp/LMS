'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

const FILTER_OPTIONS = [
  { value: 'all', label: 'ทั้งหมด' },
  { value: 'APPROVED', label: 'เสร็จแล้ว' },
  { value: 'SUBMITTED', label: 'รอดำเนินการ' },
  { value: 'NOT_STARTED', label: 'ยังไม่เริ่ม' },
]

interface Activity {
  id: string
  title: string
  description: string
  maxScore: number
  endDate: string
  gradeLevel: string
}

interface Submission {
  id: string
  status: string
  score?: number
}

export default function ActivitiesPage() {
  const [filter, setFilter] = useState('all')
  const [activities, setActivities] = useState<Activity[]>([])
  const [submissions, setSubmissions] = useState<Record<string, Submission>>({})
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    // Get userId from cookie
    const getUserIdFromCookie = () => {
      const cookies = document.cookie.split(';')
      for (const cookie of cookies) {
        if (cookie.trim().startsWith('auth-token=')) {
          try {
            const token = cookie.trim().substring('auth-token='.length)
            const decoded = JSON.parse(atob(token))
            return decoded.userId
          } catch (e) {
            console.error('Failed to decode user:', e)
          }
        }
      }
      return null
    }

    const id = getUserIdFromCookie()
    setUserId(id)

    if (id) {
      fetchActivitiesAndSubmissions(id)
    }
  }, [])

  const fetchActivitiesAndSubmissions = async (userId: string) => {
    try {
      // Fetch all activities
      const activitiesRes = await fetch('/api/activities')
      const activitiesData = await activitiesRes.json()
      
      if (activitiesData.success && activitiesData.data) {
        setActivities(activitiesData.data)
      }

      // Fetch user submissions
      const submissionsRes = await fetch(`/api/submissions?userId=${userId}`)
      const submissionsData = await submissionsRes.json()
      
      if (submissionsData.success && submissionsData.data) {
        const submissionMap: Record<string, Submission> = {}
        submissionsData.data.forEach((sub: any) => {
          submissionMap[sub.activityId] = sub
        })
        setSubmissions(submissionMap)
      }
    } catch (error) {
      console.error('Failed to fetch activities:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      APPROVED: 'bg-green-100 text-green-800',
      SUBMITTED: 'bg-yellow-100 text-yellow-800',
      NOT_STARTED: 'bg-gray-100 text-gray-800',
      REJECTED: 'bg-red-100 text-red-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      APPROVED: '✅ อนุมัติแล้ว',
      SUBMITTED: '⏳ รอการตรวจ',
      NOT_STARTED: '⭕ ยังไม่เริ่ม',
      REJECTED: '❌ ไม่ผ่าน',
    }
    return labels[status] || status
  }

  const getGradeColor = (grade: string) => {
    const colors: Record<string, string> = {
      A: '#fbbf24', // gold
      B: '#d1d5db', // silver
      C: '#d97706', // bronze
      D: '#9ca3af', // gray
      F: '#ef4444', // red
    }
    return colors[grade] || '#gray'
  }

  const filteredActivities = filter === 'all' 
    ? activities 
    : activities.filter(activity => {
        const submission = submissions[activity.id]
        return submission && submission.status === filter
      })

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">📋 กิจกรรม ({filteredActivities.length}/{activities.length})</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 bg-white p-4 rounded-lg shadow">
        {FILTER_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => setFilter(option.value)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === option.value 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Activities List */}
      <div className="grid gap-4">
        {filteredActivities.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600 text-lg">ไม่มีกิจกรรมที่ตรงกับตัวกรอง</p>
          </div>
        ) : (
          filteredActivities.map((activity) => {
            const submission = submissions[activity.id]
            const status = submission?.status || 'NOT_STARTED'
            
            return (
              <a
                key={activity.id}
                href={`/activities/${activity.id}`}
                className="block bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{activity.title}</h3>
                      <span 
                        className="inline-block w-8 h-8 rounded-full text-center leading-8 text-white font-bold"
                        style={{ backgroundColor: getGradeColor(activity.gradeLevel) }}
                      >
                        {activity.gradeLevel}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{activity.description}</p>
                    
                    <div className="flex flex-wrap gap-4 text-sm">
                      <span className="text-gray-600">
                        📅 ปิด: {new Date(activity.endDate).toLocaleDateString('th-TH')}
                      </span>
                      <span className="text-gray-600">
                        💯 คะแนน: {submission?.score || '-'}/{activity.maxScore}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
                      {getStatusLabel(status)}
                    </span>
                    {submission?.score && (
                      <p className="text-2xl font-bold text-blue-600 mt-2">{submission.score}%</p>
                    )}
                  </div>
                </div>
              </a>
            )
          })
        )}
      </div>
    </div>
  )
}
