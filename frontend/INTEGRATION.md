# Frontend-Backend Integration Guide

This guide explains how to integrate your existing Next.js frontend with the new TalentHub backend API.

## 🔗 API Base URL

Set your backend API base URL in your frontend configuration:

```typescript
// lib/config.ts or similar
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
```

## 🔐 Authentication Integration

### 1. Update Login Form

Replace the mock login logic in `app/login/page.tsx`:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Store token in localStorage or secure storage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Redirect based on user role
      if (data.user.role === 'EMPLOYER') {
        window.location.href = '/employer';
      } else if (data.user.role === 'APPLICANT') {
        window.location.href = '/applicant';
      } else if (data.user.role === 'ADMIN') {
        window.location.href = '/admin';
      }
    } else {
      alert(data.error || 'Login failed');
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('Login failed. Please try again.');
  } finally {
    setIsLoading(false);
  }
};
```

### 2. Update Registration Form

Replace the mock registration logic in `app/register/page.tsx`:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (formData.password !== formData.confirmPassword) {
    alert("Passwords don't match!");
    return;
  }

  if (!agreeToTerms) {
    alert("Please agree to the terms and conditions");
    return;
  }

  setIsLoading(true);

  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        userType: formData.userType,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      // Store token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Redirect based on user role
      if (data.user.role === 'EMPLOYER') {
        window.location.href = '/employer';
      } else {
        window.location.href = '/applicant';
      }
    } else {
      alert(data.error || 'Registration failed');
    }
  } catch (error) {
    console.error('Registration error:', error);
    alert('Registration failed. Please try again.');
  } finally {
    setIsLoading(false);
  }
};
```

## 💼 Jobs Integration

### 1. Update Jobs Page

Replace the mock data in `app/jobs/page.tsx`:

```typescript
const [jobs, setJobs] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetchJobs();
}, [searchTerm, jobType, location, currentPage]);

const fetchJobs = async () => {
  try {
    setLoading(true);
    const params = new URLSearchParams({
      page: currentPage.toString(),
      limit: '6',
      ...(searchTerm && { search: searchTerm }),
      ...(jobType !== 'all' && { type: jobType }),
      ...(location !== 'all' && { location }),
    });

    const response = await fetch(`${API_BASE_URL}/jobs?${params}`);
    const data = await response.json();

    if (response.ok) {
      setJobs(data.jobs);
      setTotalPages(data.pagination.totalPages);
    }
  } catch (error) {
    console.error('Error fetching jobs:', error);
  } finally {
    setLoading(false);
  }
};
```

### 2. Update Post Job Form

Replace the mock submission in `components/post-job-form.tsx`:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to post a job');
      return;
    }

    const response = await fetch(`${API_BASE_URL}/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: formData.title,
        company: formData.company,
        location: formData.location,
        type: formData.type,
        salary: formData.salary,
        description: formData.description,
        requirements: formData.requirements,
        benefits: formData.benefits,
        remote: formData.remote,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      alert('Job posted successfully!');
      // Reset form or redirect
      window.location.href = '/employer';
    } else {
      alert(data.error || 'Failed to post job');
    }
  } catch (error) {
    console.error('Error posting job:', error);
    alert('Failed to post job. Please try again.');
  } finally {
    setIsLoading(false);
  }
};
```

## 📝 Applications Integration

### 1. Update Application Form

Replace the mock submission in `components/application-form.tsx`:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to apply for this job');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('jobId', job.id.toString());
    formDataToSend.append('coverLetter', formData.coverLetter);
    
    if (files.resume) {
      formDataToSend.append('resume', files.resume);
    }
    
    if (files.coverLetterFile) {
      formDataToSend.append('coverLetterFile', files.coverLetterFile);
    }

    // Add additional profile data
    formDataToSend.append('phone', formData.phone);
    formDataToSend.append('location', formData.location);
    formDataToSend.append('experience', formData.experience);
    formDataToSend.append('currentRole', formData.currentRole);
    formDataToSend.append('expectedSalary', formData.expectedSalary);
    formDataToSend.append('availableDate', formData.availableDate);
    formDataToSend.append('portfolio', formData.portfolio);
    formDataToSend.append('linkedin', formData.linkedin);

    const response = await fetch(`${API_BASE_URL}/applications`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formDataToSend,
    });

    const data = await response.json();

    if (response.ok) {
      setIsSubmitted(true);
    } else {
      alert(data.error || 'Failed to submit application');
    }
  } catch (error) {
    console.error('Error submitting application:', error);
    alert('Failed to submit application. Please try again.');
  } finally {
    setIsSubmitting(false);
  }
};
```

## 🛠️ Utility Functions

### 1. Create API Client

Create `lib/api.ts` for centralized API calls:

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('token');
    
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

  // Jobs endpoints
  async getJobs(params: any = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/jobs?${queryString}`);
  }

  async getJob(id: number) {
    return this.request(`/jobs/${id}`);
  }

  async createJob(jobData: any) {
    return this.request('/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
  }

  // Applications endpoints
  async submitApplication(applicationData: FormData) {
    const token = localStorage.getItem('token');
    
    return fetch(`${this.baseURL}/applications`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: applicationData,
    });
  }

  async getMyApplications(params: any = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/applications/my-applications?${queryString}`);
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
```

### 2. Create Auth Context

Create `contexts/AuthContext.tsx` for managing authentication state:

```typescript
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing auth data on mount
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData: User, authToken: string) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

## 🔒 Protected Routes

Create a higher-order component for protected routes:

```typescript
// components/ProtectedRoute.tsx
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (requiredRole && user?.role !== requiredRole) {
      router.push('/unauthorized');
    }
  }, [isAuthenticated, user, requiredRole, router]);

  if (!isAuthenticated || (requiredRole && user?.role !== requiredRole)) {
    return null;
  }

  return <>{children}</>;
};
```

## 🚀 Environment Variables

Add to your `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## 📱 Usage Examples

### Protected Employer Route

```typescript
// app/employer/page.tsx
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function EmployerPage() {
  return (
    <ProtectedRoute requiredRole="EMPLOYER">
      <div>Employer Dashboard</div>
    </ProtectedRoute>
  );
}
```

### Using API Client

```typescript
import { apiClient } from '@/lib/api';

// In your component
const handleCreateJob = async (jobData: any) => {
  try {
    const result = await apiClient.createJob(jobData);
    console.log('Job created:', result);
  } catch (error) {
    console.error('Error creating job:', error);
  }
};
```

## 🔄 State Management

Consider using React Query or SWR for efficient data fetching and caching:

```bash
npm install @tanstack/react-query
```

This integration will connect your beautiful frontend with the powerful backend API, creating a fully functional job portal!
