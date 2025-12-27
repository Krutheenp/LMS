'use client'

import { useState, useCallback } from 'react'

export interface UseActivityOptions {
  initialPage?: number
  limit?: number
}

export function useActivities(options: UseActivityOptions = {}) {
  const { initialPage = 1, limit = 10 } = options
  const [activities, setActivities] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(initialPage)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchActivities = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(
        `/api/activities?page=${page}&limit=${limit}`
      )
      const data = await response.json()

      if (!data.success) throw new Error(data.error)

      setActivities(data.data)
      setTotal(data.total)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch')
    } finally {
      setLoading(false)
    }
  }, [page, limit])

  return {
    activities,
    total,
    page,
    setPage,
    loading,
    error,
    fetchActivities,
  }
}
