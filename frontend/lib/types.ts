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

export interface Application {
  id: number;
  status: 'APPLIED' | 'REVIEWED' | 'SHORTLISTED' | 'REJECTED' | 'HIRED';
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
    currentuserType?: string;
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
  userType: 'ADMIN' | 'EMPLOYER' | 'APPLICANT';
  phone?: string;
  location?: string;
  experience?: string;
  currentuserType?: string;
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

export interface StatsResponse {
  stats: {
    totalUsers: number;
    totalJobs: number;
    totalApplications: number;
    usersByuserType: Record<string, number>;
    jobsByStatus: Record<string, number>;
    applicationsByStatus: Record<string, number>;
  };
}
