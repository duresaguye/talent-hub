import { useState, useCallback } from 'react'
import { apiClient, User, UsersResponse, StatsResponse, Activity } from '@/lib/api'

export function useAdmin() {
  const [users, setUsers] = useState<User[]>([])
  const [stats, setStats] = useState<StatsResponse['stats'] | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<UsersResponse['pagination'] | null>(null)

  const fetchAllUsers = useCallback(async (params: {
    page?: number
    limit?: number
    role?: string
    search?: string
  } = {}) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.getAllUsers(params)
      setUsers(response.users)
      setPagination(response.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchUser = useCallback(async (id: number) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.getUser(id)
      return response.user
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updateUserRole = useCallback(async (id: number, role: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.updateUserRole(id, role)
      // Refresh users list
      await fetchAllUsers()
      return response.user
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user role')
      return null
    } finally {
      setLoading(false)
    }
  }, [fetchAllUsers])

  const deleteUser = useCallback(async (id: number) => {
    try {
      setLoading(true)
      setError(null)
      await apiClient.deleteUser(id)
      // Refresh users list
      await fetchAllUsers()
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user')
      return false
    } finally {
      setLoading(false)
    }
  }, [fetchAllUsers])

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.getStats()
      setStats(response.stats)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch statistics')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchActivities = useCallback(async (params: {
    limit?: number;
  } = {}) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.getRecentActivities(params)
      setActivities(response.activities)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch activities')
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    users,
    stats,
    activities,
    loading,
    error,
    pagination,
    fetchAllUsers,
    fetchUser,
    updateUserRole,
    deleteUser,
    fetchStats,
    fetchActivities,
  }
}
