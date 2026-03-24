'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
}

interface UseAuthReturn {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    age: number;
    gender: string;
    adminCode?: string;
  }) => Promise<void>;
  logout: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // localStorage mein save
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Cookie mein bhi save — middleware ke liye
      document.cookie = `token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}`;
      
      setToken(data.token);
      setUser(data.user);

      if (data.user?.roles?.includes('admin')) {
        router.push('/dashboard/admin');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    age: number;
    gender: string;
    adminCode?: string;
  }): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      // localStorage mein save
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Cookie mein bhi save — middleware ke liye
      document.cookie = `token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}`;
      
      setToken(data.token);
      setUser(data.user);

      if (data.user?.roles?.includes('admin')) {
        router.push('/dashboard/admin');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    setToken(null);
    setUser(null);
    setError(null);
    
    // Cookie clear karo
    document.cookie = 'token=; path=/; max-age=0';
    
    router.push('/login');
  };

  return {
    user,
    token,
    loading,
    error,
    login,
    signup,
    logout,
  };
};