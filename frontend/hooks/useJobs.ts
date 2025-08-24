import { useState, useEffect } from 'react'
import { apiClient, Job, JobsResponse } from '@/lib/api'

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<JobsResponse['pagination'] | null>(null)

  const fetchJobs = async (params: {
    page?: number
    limit?: number
    search?: string
    type?: string
    location?: string
    remote?: boolean
    status?: string
  } = {}) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.getJobs(params)
      setJobs(response.jobs)
      setPagination(response.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch jobs')
    } finally {
      setLoading(false)
    }
  }

  const fetchJob = async (id: number) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.getJob(id)
      return response.job
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch job')
      return null
    } finally {
      setLoading(false)
    }
  }

  const createJob = async (jobData: {
    title: string
    company: string
    location: string
    type: string
    salary?: string
    description: string
    requirements?: string
    benefits?: string
    remote?: boolean
  }) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.createJob(jobData)
      // Refresh jobs list
      await fetchJobs()
      return response.job
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create job')
      return null
    } finally {
      setLoading(false)
    }
  }

  const updateJob = async (id: number, jobData: Partial<Job>) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.updateJob(id, jobData)
      // Refresh jobs list
      await fetchJobs()
      return response.job
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update job')
      return null
    } finally {
      setLoading(false)
    }
  }

  const deleteJob = async (id: number) => {
    try {
      setLoading(true)
      setError(null)
      await apiClient.deleteJob(id)
      // Refresh jobs list
      await fetchJobs()
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete job')
      return false
    } finally {
      setLoading(false)
    }
  }

  return {
    jobs,
    loading,
    error,
    pagination,
    fetchJobs,
    fetchJob,
    createJob,
    updateJob,
    deleteJob,
  }
}

export function useMyJobs() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<JobsResponse['pagination'] | null>(null)

  const fetchMyJobs = async (params: {
    page?: number
    limit?: number
    status?: string
  } = {}) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.getMyJobs(params)
      setJobs(response.jobs)
      setPagination(response.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch jobs')
    } finally {
      setLoading(false)
    }
  }

  return {
    jobs,
    loading,
    error,
    pagination,
    fetchMyJobs,
  }
}

export function useJob(id: number) {
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchJob = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.getJob(id)
      setJob(response.job)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch job')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchJob()
    }
  }, [id])

  return {
    job,
    loading,
    error,
    refetch: fetchJob,
  }
}
