'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { Job } from '@/lib/types';

interface EmployerStats {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  pendingApplications: number;
}

export const useEmployer = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [stats, setStats] = useState<EmployerStats>({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    pendingApplications: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async (params: {
    page?: number;
    limit?: number;
    status?: string;
  } = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getEmployerJobs(params);
      setJobs(response.jobs);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch jobs';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      setError(null);
      // Calculate stats from jobs data
      const activeJobs = jobs.filter(job => job.status === 'ACTIVE').length;
      const totalApplications = jobs.reduce((sum, job) => sum + (job._count?.applications || 0), 0);
      const pendingApplications = jobs.reduce((sum, job) => {
        // This would need to be calculated from actual application data
        return sum + Math.floor((job._count?.applications || 0) * 0.3); // Estimate 30% pending
      }, 0);

      setStats({
        totalJobs: jobs.length,
        activeJobs,
        totalApplications,
        pendingApplications,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch stats';
      setError(errorMessage);
    }
  };

  const createJob = async (jobData: {
    title: string;
    description: string;
    requirements: string;
    location: string;
    type: string;
    salary?: string;
    company: string;
    remote: boolean;
  }) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.createJob(jobData);
      const newJob = response.job || response;
      setJobs(prev => [newJob, ...prev]);
      return newJob;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create job';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateJob = async (id: string, jobData: Partial<Job>) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.updateJob(Number(id), jobData);
      const updatedJob = response.job || response;
      setJobs(prev => prev.map(job => job.id === Number(id) ? updatedJob : job));
      return updatedJob;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update job';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteJob = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await apiClient.deleteJob(Number(id));
      setJobs(prev => prev.filter(job => job.id !== Number(id)));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete job';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update stats when jobs change
  useEffect(() => {
    if (jobs.length > 0) {
      fetchStats();
    }
  }, [jobs]);

  return {
    jobs,
    stats,
    loading,
    error,
    fetchJobs,
    fetchStats,
    createJob,
    updateJob,
    deleteJob,
  };
};
