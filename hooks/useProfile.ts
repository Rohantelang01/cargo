
// hooks/useProfile.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import { IUser } from '@/models/User';

interface UseProfileReturn {
  profile: IUser | null;
  loading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: Partial<IUser>) => Promise<boolean>;
}

export const useProfile = (): UseProfileReturn => {
  const [profile, setProfile] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getToken = (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  };

  const fetchProfile = useCallback(async (): Promise<void> => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      setError("Authentication token not found. Please log in.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch profile');
      }

      const data: IUser = await response.json();
      setProfile(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = async (updateData: Partial<IUser>): Promise<boolean> => {
    const token = getToken();
    if (!token) {
      setError("Authentication token not found.");
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }

      const data: IUser = await response.json();
      setProfile(data);
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
  };
};
