import { Job, Application, User, Pagination, JobsResponse, ApplicationsResponse, UsersResponse, StatsResponse } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// API Client class
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Auth methods
  async login(email: string, password: string) {
    const response = await this.request<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    this.token = response.token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  }

  async register(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: 'APPLICANT' | 'EMPLOYER';
  }) {
    const response = await this.request<{ token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    this.token = response.token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  }

  logout() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  // Jobs methods
  async getJobs(params: {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
    location?: string;
    remote?: boolean;
    status?: string;
  } = {}): Promise<JobsResponse> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString());
      }
    });
    
    return this.request<JobsResponse>(`/jobs?${searchParams.toString()}`);
  }

  async getJob(id: number): Promise<{ job: Job }> {
    return this.request<{ job: Job }>(`/jobs/${id}`);
  }

  async createJob(jobData: {
    title: string;
    company: string;
    location: string;
    type: string;
    salary?: string;
    description: string;
    requirements?: string;
    benefits?: string;
    remote?: boolean;
  }): Promise<{ message: string; job: Job }> {
    return this.request<{ message: string; job: Job }>('/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
  }

  async updateJob(id: number, jobData: Partial<Job>): Promise<{ message: string; job: Job }> {
    return this.request<{ message: string; job: Job }>(`/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(jobData),
    });
  }

  async deleteJob(id: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/jobs/${id}`, {
      method: 'DELETE',
    });
  }

  async getMyJobs(params: {
    page?: number;
    limit?: number;
    status?: string;
  } = {}): Promise<JobsResponse> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString());
      }
    });
    
    return this.request<JobsResponse>(`/jobs/employer/my-jobs?${searchParams.toString()}`);
  }

  // Applications methods
  async applyForJob(applicationData: {
    jobId: number;
    coverLetter?: string;
    phone?: string;
    location?: string;
    experience?: string;
    currentRole?: string;
    expectedSalary?: string;
    availableDate?: string;
    portfolio?: string;
    linkedin?: string;
  }, files?: { resume?: File; coverLetterFile?: File }): Promise<{ message: string; application: Application }> {
    const formData = new FormData();
    
    // Add text data
    Object.entries(applicationData).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        formData.append(key, value.toString());
      }
    });
    
    // Add files
    if (files?.resume) {
      formData.append('resume', files.resume);
    }
    if (files?.coverLetterFile) {
      formData.append('coverLetterFile', files.coverLetterFile);
    }
    
    const url = `${this.baseURL}/applications`;
    const headers: HeadersInit = {};
    
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }
    
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  async getMyApplications(params: {
    page?: number;
    limit?: number;
    status?: string;
  } = {}): Promise<ApplicationsResponse> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString());
      }
    });
    
    return this.request<ApplicationsResponse>(`/applications/my-applications?${searchParams.toString()}`);
  }

  async getJobApplications(jobId: number, params: {
    page?: number;
    limit?: number;
    status?: string;
  } = {}): Promise<ApplicationsResponse> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString());
      }
    });
    
    return this.request<ApplicationsResponse>(`/applications/job/${jobId}?${searchParams.toString()}`);
  }

  async updateApplicationStatus(id: number, status: string): Promise<{ message: string; application: Application }> {
    return this.request<{ message: string; application: Application }>(`/applications/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async getApplication(id: number): Promise<{ application: Application }> {
    return this.request<{ application: Application }>(`/applications/${id}`);
  }

  // Users methods
  async getProfile(): Promise<{ user: User }> {
    return this.request<{ user: User }>('/users/profile');
  }

  async updateProfile(profileData: Partial<User>): Promise<{ message: string; user: User }> {
    return this.request<{ message: string; user: User }>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async changePassword(passwords: { currentPassword: string; newPassword: string }): Promise<{ message: string }> {
    return this.request<{ message: string }>('/users/change-password', {
      method: 'PUT',
      body: JSON.stringify(passwords),
    });
  }

  // Admin methods
  async getAllUsers(params: {
    page?: number;
    limit?: number;
    role?: string;
    search?: string;
  } = {}): Promise<UsersResponse> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString());
      }
    });
    
    return this.request<UsersResponse>(`/users?${searchParams.toString()}`);
  }

  async getUser(id: number): Promise<{ user: User }> {
    return this.request<{ user: User }>(`/users/${id}`);
  }

  async updateUserRole(id: number, role: string): Promise<{ message: string; user: User }> {
    return this.request<{ message: string; user: User }>(`/users/${id}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
  }

  async deleteUser(id: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  async getStats(): Promise<StatsResponse> {
    return this.request<StatsResponse>('/users/stats/overview');
  }
}

// Create and export the API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// Export types for use in components
export type { Job, Application, User, Pagination, JobsResponse, ApplicationsResponse, UsersResponse, StatsResponse };
