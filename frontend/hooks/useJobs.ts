import { useState, useEffect } from 'react';
import { apiClient, Job, JobsResponse, JobsQueryParams, CreateJobData, UpdateJobData, Application, ApplicationsResponse } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export const useJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<JobsResponse['pagination'] | null>(null);

  const fetchJobs = async (params: JobsQueryParams = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getJobs(params);
      setJobs(response.jobs);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  return {
    jobs,
    loading,
    error,
    pagination,
    fetchJobs,
  };
};

export const useJob = (id: number) => {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJob = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getJob(id);
      setJob(response.job);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch job');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchJob();
    }
  }, [id]);

  return {
    job,
    loading,
    error,
    refetch: fetchJob,
  };
};

export const useEmployerJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<JobsResponse['pagination'] | null>(null);
  const { user } = useAuth();

  const fetchMyJobs = async (params: { page?: number; limit?: number; status?: string } = {}) => {
    if (user?.role !== 'EMPLOYER') {
      setError('Only employers can access this feature');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getMyJobs(params);
      setJobs(response.jobs);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch your jobs');
    } finally {
      setLoading(false);
    }
  };

  const createJob = async (jobData: CreateJobData) => {
    if (user?.role !== 'EMPLOYER') {
      throw new Error('Only employers can create jobs');
    }

    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.createJob(jobData);
      // Refresh the jobs list
      await fetchMyJobs();
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create job');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateJob = async (id: number, jobData: UpdateJobData) => {
    if (user?.role !== 'EMPLOYER') {
      throw new Error('Only employers can update jobs');
    }

    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.updateJob(id, jobData);
      // Refresh the jobs list
      await fetchMyJobs();
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update job');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteJob = async (id: number) => {
    if (user?.role !== 'EMPLOYER') {
      throw new Error('Only employers can delete jobs');
    }

    try {
      setLoading(true);
      setError(null);
      await apiClient.deleteJob(id);
      // Refresh the jobs list
      await fetchMyJobs();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete job');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    jobs,
    loading,
    error,
    pagination,
    fetchMyJobs,
    createJob,
    updateJob,
    deleteJob,
  };
};

export const useApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<ApplicationsResponse['pagination'] | null>(null);

  const fetchMyApplications = async (params: any = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getMyApplications(params);
      setApplications(response.applications);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  return {
    applications,
    loading,
    error,
    pagination,
    fetchMyApplications,
  };
};

export const useJobApplications = (jobId: number) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<ApplicationsResponse['pagination'] | null>(null);

  const fetchJobApplications = async (params: any = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getJobApplications(jobId, params);
      setApplications(response.applications);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch job applications');
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId: number, status: string) => {
    try {
      setLoading(true);
      setError(null);
      await apiClient.updateApplicationStatus(applicationId, status);
      // Refresh the applications list
      await fetchJobApplications();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update application status');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    applications,
    loading,
    error,
    pagination,
    fetchJobApplications,
    updateApplicationStatus,
  };
};
