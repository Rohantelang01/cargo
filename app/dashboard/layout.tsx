"use client";

import React from 'react';
import { useAuth } from "@/context/AuthContext";
import { DashboardProvider } from "@/context/DashboardContext";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default function RootDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const initialRole = (user?.roles?.[0] as any) || 'passenger';

  return (
    <DashboardProvider initialRole={initialRole}>
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </DashboardProvider>
  );
}
