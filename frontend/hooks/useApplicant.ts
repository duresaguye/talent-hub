'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { Application, Job } from '@/lib/types';

interface ApplicantStats {
  totalApplications: number;
  pendingApplications: number;
  acceptedApplications: number;
  rejectedApplications: number;
}

export const useApplicant = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState<ApplicantStats>({
    totalApplications: 0,
    pendingApplications: 0,
    acceptedApplications: 0,
    rejectedApplications: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = async (params: {
    page?: number;
    limit?: number;
    status?: string;
  } = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getMyApplications(params);
      setApplications(response.applications);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch applications';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      setError(null);
      const pendingCount = applications.filter(app => app.status === 'PENDING').length;
      const acceptedCount = applications.filter(app => app.status === 'ACCEPTED').length;
      const rejectedCount = applications.filter(app => app.status === 'REJECTED').length;

      setStats({
        totalApplications: applications.length,
        pendingApplications: pendingCount,
        acceptedApplications: acceptedCount,
        rejectedApplications: rejectedCount,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch stats';
      setError(errorMessage);
    }
  };

  const applyToJob = async (jobId: string, applicationData: {
    coverLetter?: string;
    resumeFile?: File;
    coverLetterFile?: File;
  }) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.applyForJob({
        jobId: Number(jobId),
        coverLetter: applicationData.coverLetter,
      });
      const newApplication = response.application || response;
      setApplications(prev => [newApplication, ...prev]);
      return newApplication;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to apply to job';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const withdrawApplication = async (applicationId: string) => {
    try {
      setLoading(true);
      setError(null);
      await apiClient.withdrawApplication(applicationId);
      setApplications(prev => prev.filter(app => app.id !== Number(applicationId)));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to withdraw application';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update stats when applications change
  useEffect(() => {
    if (applications.length > 0) {
      fetchStats();
    }
  }, [applications]);

  return {
    applications,
    stats,
    loading,
    error,
    fetchApplications,
    fetchStats,
    applyToJob,
    withdrawApplication,
  };
};
