'use client'

import { useState, useCallback } from 'react'

export interface UseSubmissionOptions {
  activityId?: string
}

export function useSubmission(options: UseSubmissionOptions = {}) {
  const { activityId } = options
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submitActivity = useCallback(
    async (files: File[], notes: string) => {
      if (!activityId) throw new Error('Activity ID is required')

      setLoading(true)
      setError(null)

      try {
        // Upload files first
        const formData = new FormData()
        files.forEach((file) => formData.append('files', file))

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        const uploadData = await uploadResponse.json()
        if (!uploadData.success) throw new Error(uploadData.error)

        // Create submission
        const fileUrls = uploadData.data.map((f: any) => f.url)
        const submissionResponse = await fetch('/api/submissions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: 'current-user-id', // Should come from auth
            activityId,
            fileUrls,
            notes,
          }),
        })

        const submissionData = await submissionResponse.json()
        if (!submissionData.success) throw new Error(submissionData.error)

        return submissionData.data
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to submit'
        setError(message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [activityId]
  )

  return {
    submitActivity,
    loading,
    error,
  }
}
