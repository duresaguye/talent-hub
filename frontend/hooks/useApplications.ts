import { useState, useCallback } from 'react'
import { apiClient, Application, ApplicationsResponse } from '@/lib/api'

export function useApplications() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<ApplicationsResponse['pagination'] | null>(null)

  const fetchMyApplications = useCallback(async (params: {
    page?: number
    limit?: number
    status?: string
  } = {}) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.getMyApplications(params)
      setApplications(response.applications)
      setPagination(response.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch applications')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchJobApplications = useCallback(async (jobId: number, params: {
    page?: number
    limit?: number
    status?: string
  } = {}) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.getJobApplications(jobId, params)
      setApplications(response.applications)
      setPagination(response.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch job applications')
    } finally {
      setLoading(false)
    }
  }, [])

  const applyForJob = useCallback(async (applicationData: {
    jobId: number
    coverLetter?: string
    phone?: string
    location?: string
    experience?: string
    currentRole?: string
    expectedSalary?: string
    availableDate?: string
    portfolio?: string
    linkedin?: string
  }, files?: { resume?: File; coverLetterFile?: File }) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.applyForJob(applicationData, files)
      return response.application
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit application')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updateApplicationStatus = useCallback(async (id: number, status: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.updateApplicationStatus(id, status)
      // Refresh applications list
      await fetchJobApplications(Number(response.application.job?.id))
      return response.application
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update application status')
      return null
    } finally {
      setLoading(false)
    }
  }, [fetchJobApplications])

  const getApplication = useCallback(async (id: number) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.getApplication(id)
      return response.application
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch application')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    applications,
    loading,
    error,
    pagination,
    fetchMyApplications,
    fetchJobApplications,
    applyForJob,
    updateApplicationStatus,
    getApplication,
  }
}
