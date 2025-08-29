// Types for better type safety
export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  salary?: string;
  description: string;
  requirements: string;
  benefits?: string;
  remote: boolean;
  status: 'ACTIVE' | 'CLOSED' | 'DRAFT' | 'FLAGGED' | 'REJECTED' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
  createdBy: {
    id: number;
    firstName: string;
    lastName: string;
  };
  employer?: {
    id: number;
    firstName: string;
    lastName: string;
  };
  _count?: {
    applications: number;
  };
  applicationsCount?: number;
  postedDate?: string;
}

export interface Application {
  id: number;
  status: 'APPLIED' | 'REVIEWED' | 'SHORTLISTED' | 'REJECTED' | 'HIRED' | 'PENDING' | 'ACCEPTED';
  coverLetter?: string;
  resumePath?: string;
  coverLetterPath?: string;
  createdAt: string;
  updatedAt: string;
  job?: Job;
  applicant?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    location?: string;
    experience?: string;
    currentRole?: string;
    expectedSalary?: string;
    availableDate?: string;
    portfolio?: string;
    linkedin?: string;
  };
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: 'ADMIN' | 'EMPLOYER' | 'APPLICANT';
  phone?: string;
  location?: string;
  experience?: string;
  currentRole?: string;
  expectedSalary?: string;
  availableDate?: string;
  portfolio?: string;
  linkedin?: string;
  createdAt: string;
  updatedAt: string;
  jobsCount?: number;
  applicationsCount?: number;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface JobsResponse {
  jobs: Job[];
  pagination: Pagination & { totalJobs: number };
}

export interface ApplicationsResponse {
  applications: Application[];
  pagination: Pagination & { totalApplications: number };
}

export interface UsersResponse {
  users: User[];
  pagination: Pagination & { totalUsers: number };
}

export interface Activity {
  id: string;
  type: 'job_posted' | 'user_registered' | 'application_submitted';
  title: string;
  description: string;
  user: string;
  createdAt: string;
  icon: string;
  color: string;
}

export interface StatsResponse {
  stats: {
    totalUsers: number;
    totalJobs: number;
    totalApplications: number;
    usersByRole: Record<string, number>;
    jobsByStatus: Record<string, number>;
    applicationsByStatus: Record<string, number>;
  };
}
