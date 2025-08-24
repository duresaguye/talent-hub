const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Types for better type safety
export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP';
  salary?: string;
  description: string;
  requirements?: string;
  benefits?: string;
  remote: boolean;
  status: 'ACTIVE' | 'INACTIVE' | 'DRAFT';
  postedDate: string;
  applicationsCount: number;
  employer?: {
    id: number;
    firstName: string;
    lastName: string;
    company?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface JobsResponse {
  jobs: Job[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalJobs: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface JobResponse {
  job: Job;
}

export interface CreateJobData {
  title: string;
  company: string;
  location: string;
  type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP';
  salary?: string;
  description: string;
  requirements?: string;
  benefits?: string;
  remote?: boolean;
}

export interface UpdateJobData extends Partial<CreateJobData> {}

export interface JobsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  location?: string;
  remote?: boolean;
  status?: string;
}

export interface Application {
  id: number;
  jobId: number;
  applicantId: number;
  status: 'APPLIED' | 'REVIEWED' | 'SHORTLISTED' | 'REJECTED' | 'HIRED';
  coverLetter: string;
  resumePath?: string;
  coverLetterPath?: string;
  appliedDate: string;
  job?: Job;
  applicant?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface ApplicationsResponse {
  applications: Application[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalApplications: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(`${this.baseURL}${endpoint}`, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  // Auth endpoints
  async login(credentials: { email: string; password: string }) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: any) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getProfile() {
    return this.request('/auth/me');
  }

  // Jobs endpoints - Public
  async getJobs(params: JobsQueryParams = {}): Promise<JobsResponse> {
    const queryString = new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          acc[key] = String(value);
        }
        return acc;
      }, {} as Record<string, string>)
    ).toString();
    
    return this.request(`/jobs?${queryString}`);
  }

  async getJob(id: number): Promise<JobResponse> {
    return this.request(`/jobs/${id}`);
  }

  // Jobs endpoints - Employer only
  async createJob(jobData: CreateJobData): Promise<{ message: string; job: Job }> {
    return this.request('/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
  }

  async updateJob(id: number, jobData: UpdateJobData): Promise<{ message: string; job: Job }> {
    return this.request(`/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(jobData),
    });
  }

  async deleteJob(id: number): Promise<{ message: string }> {
    return this.request(`/jobs/${id}`, {
      method: 'DELETE',
    });
  }

  async getMyJobs(params: { page?: number; limit?: number; status?: string } = {}): Promise<JobsResponse> {
    const queryString = new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          acc[key] = String(value);
        }
        return acc;
      }, {} as Record<string, string>)
    ).toString();
    
    return this.request(`/jobs/employer/my-jobs?${queryString}`);
  }

  // Applications endpoints
  async submitApplication(applicationData: FormData) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    return fetch(`${this.baseURL}/applications`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: applicationData,
    });
  }

  async getMyApplications(params: any = {}): Promise<ApplicationsResponse> {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/applications/my-applications?${queryString}`);
  }

  async getJobApplications(jobId: number, params: any = {}): Promise<ApplicationsResponse> {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/applications/job/${jobId}?${queryString}`);
  }

  async updateApplicationStatus(applicationId: number, status: string): Promise<{ message: string }> {
    return this.request(`/applications/${applicationId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
