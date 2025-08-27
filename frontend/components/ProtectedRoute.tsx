'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string; // e.g. 'APPLICANT' | 'EMPLOYER' | 'ADMIN'
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole,
  fallback = null
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return; // wait for auth to load

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (requiredRole) {
      const have = (user?.role || '').toUpperCase();
      const need = requiredRole.toUpperCase();
      if (have !== need) {
        router.push('/unauthorized');
        return;
      }
    }
  }, [isAuthenticated, user, requiredRole, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return fallback;

  if (requiredRole) {
    const have = (user?.role || '').toUpperCase();
    const need = requiredRole.toUpperCase();
    if (have !== need) return fallback;
  }

  return <>{children}</>;
};