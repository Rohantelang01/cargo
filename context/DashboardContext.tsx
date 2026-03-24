"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';

type Role = 'passenger' | 'driver' | 'owner' | 'self-driver' | 'self-driver-owner';

interface DashboardContextType {
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
  refreshDashboard: () => void;
  isRefreshing: boolean;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children, initialRole }: { children: React.ReactNode, initialRole: Role }) {
  const [currentRole, setCurrentRole] = useState<Role>(initialRole);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshDashboard = useCallback(() => {
    setIsRefreshing(true);
    // This will trigger refetches in hooks that depend on this state
    setTimeout(() => setIsRefreshing(false), 1000);
  }, []);

  return (
    <DashboardContext.Provider value={{
      currentRole,
      setCurrentRole,
      refreshDashboard,
      isRefreshing
    }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}
