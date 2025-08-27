'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
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
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (userData: User, authToken: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  validateToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to check if token is expired
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    console.error('Error parsing token:', error);
    return true;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  const validateToken = useCallback(async (): Promise<boolean> => {
    const storedToken = localStorage.getItem('token');
    
    if (!storedToken) {
      return false;
    }

    // Check if token is expired
    if (isTokenExpired(storedToken)) {
      console.log('Token expired, logging out');
      logout();
      return false;
    }

    try {
      // Validate token with backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${storedToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.log('Token validation failed, logging out');
        logout();
        return false;
      }

      const data = await response.json();
      
      // Update user data if it has changed
      if (data.user) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      return true;
    } catch (error) {
      console.error('Token validation error:', error);
      logout();
      return false;
    }
  }, [logout]);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken && storedUser) {
        try {
          // Check if token is expired before setting state
          if (isTokenExpired(storedToken)) {
            console.log('Stored token expired, clearing auth data');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setIsLoading(false);
            return;
          }

          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          
          // Validate token with backend
          const isValid = await validateToken();
          if (!isValid) {
            setToken(null);
            setUser(null);
          }
        } catch (error) {
          console.error('Error parsing stored user data:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, [validateToken]);

  // Set up periodic token validation
  useEffect(() => {
    if (!token) return;

    const interval = setInterval(() => {
      validateToken();
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(interval);
  }, [token, validateToken]);

  const login = (userData: User, authToken: string) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token && !!user,
    isLoading,
    validateToken,
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
