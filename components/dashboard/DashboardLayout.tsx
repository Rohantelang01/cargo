"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from "@/context/AuthContext";
import { 
  LayoutDashboard, 
  Inbox, 
  MapPin, 
  History, 
  Wallet, 
  User as UserIcon,
  LogOut,
  Bell,
  Menu,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { useDashboard } from "@/context/DashboardContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const { currentRole, setCurrentRole } = useDashboard();
  const pathname = usePathname();
  const [vehicles, setVehicles] = useState<any[]>([]);

  // Fetch user's vehicles to check selfDriven status
  useEffect(() => {
    async function fetchVehicles() {
      try {
        const response = await fetch('/api/profile');
        const data = await response.json();
        setVehicles(data.user?.ownerInfo?.vehicles || []);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      }
    }
    
    if (user?.roles?.includes('owner')) {
      fetchVehicles();
    }
  }, [user]);

  // Helper function to determine user type
  const getUserDashboardType = (user: any, vehicles: any[]) => {
    const hasDriver = user?.roles?.includes('driver');
    const hasOwner = user?.roles?.includes('owner');
    
    // Check if user has self-driven vehicles
    const hasSelfDrivenVehicle = vehicles?.some((v: any) => v.selfDriven === true);
    
    // Self Driver: has both driver + owner roles AND has selfDriven vehicle
    if (hasDriver && hasOwner && hasSelfDrivenVehicle) {
      return 'self-driver';
    }
    
    // Pure Owner: has owner role but NO selfDriven vehicles (or no driver role)
    if (hasOwner && !hasSelfDrivenVehicle) {
      return 'owner';
    }
    
    // Pure Driver: has driver role but no owner role (FUTURE - not active yet)
    if (hasDriver && !hasOwner) {
      return 'driver';
    }
    
    // Default: Passenger
    return 'passenger';
  };

  const navigation = [
    { name: 'Overview', href: '/dashboard/overview', icon: LayoutDashboard },
    { name: 'Requests', href: '/dashboard/requests', icon: Inbox },
    { name: 'Active Trips', href: '/dashboard/trips', icon: MapPin },
    { name: 'History', href: '/dashboard/history', icon: History },
    { name: 'Earnings', href: '/dashboard/earnings', icon: Wallet },
  ];

  const navigationItems = useMemo(() => {
    const hasDriver = user?.roles?.includes('driver');
    const hasOwner = user?.roles?.includes('owner');
    
    // Check for selfDriven vehicles
    const hasSelfDrivenVehicle = vehicles?.some((v: any) => v.selfDriven === true);
    
    const items = [];
    
    // Always show Passenger (everyone is a passenger)
    items.push({ label: 'Passenger Mode', value: 'passenger', href: '/dashboard/passenger' });
    
    // Self Driver Mode (driver + owner + selfDriven vehicle)
    if (hasDriver && hasOwner && hasSelfDrivenVehicle) {
      items.push({ label: 'Self Driver Mode', value: 'self-driver', href: '/dashboard/self-driver' });
    }
    
    // Owner Mode (owner without selfDriven vehicles)
    if (hasOwner && !hasSelfDrivenVehicle) {
      items.push({ label: 'Owner Mode', value: 'owner', href: '/dashboard/owner' });
    }
    
    // Pure Driver Mode - HIDE FOR NOW (future feature)
    // if (hasDriver && !hasOwner) {
    //   items.push({ label: 'Driver Mode', value: 'driver', href: '/dashboard/driver' });
    // }
    
    return items;
  }, [user, vehicles]);

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-card border-r border-border">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-2xl text-primary">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">C</div>
          Cargo
        </Link>
      </div>

      <div className="px-4 mb-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between gap-2 border-border/50 bg-secondary/20">
              <span className="capitalize">
                {navigationItems.find(item => item.value === currentRole)?.label || `${currentRole} Dashboard`}
              </span>
              <ChevronRight className="w-4 h-4 rotate-90" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Switch Role</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {navigationItems.map((item) => (
              <DropdownMenuItem 
                key={item.value} 
                className="capitalize"
                onClick={() => setCurrentRole(item.value as any)}
              >
                {item.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <nav className="flex-1 px-2 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 px-2 py-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-secondary overflow-hidden shrink-0">
            <img 
              src={user?.profileImage || '/placeholder-user.jpg'} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={logout}
        >
          <LogOut className="w-5 h-5" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 h-full shrink-0">
        <SidebarContent />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header (Mobile & Desktop) */}
        <header className="h-16 flex items-center justify-between px-4 md:px-6 bg-card border-b border-border sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64">
                <SidebarContent />
              </SheetContent>
            </Sheet>
            <h2 className="text-lg font-semibold lg:hidden">Cargo</h2>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full" />
            </Button>
            <Link href="/profile">
              <Button variant="ghost" size="icon">
                <UserIcon className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-background/50">
          {children}
        </main>
      </div>
    </div>
  );
}
