"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { LayoutDashboard, Users, BookOpenCheck, Car, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/common/LoadingSpinner";

const navItems = [
  {
    href: "/dashboard/admin",
    label: "Overview",
    icon: LayoutDashboard,
  },
  {
    href: "/dashboard/admin/users",
    label: "Users",
    icon: Users,
  },
  {
    href: "/dashboard/admin/bookings",
    label: "Bookings",
    icon: BookOpenCheck,
  },
  {
    href: "/dashboard/admin/drivers",
    label: "Drivers",
    icon: Car,
  },
];

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isAdmin = useMemo(() => {
    return !!user?.roles?.includes("admin");
  }, [user?.roles]);

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    if (!isAdmin) {
      router.push("/dashboard/passenger");
    }
  }, [isAdmin, isLoading, router, user]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="flex">
        <aside className="hidden md:flex w-64 shrink-0 border-r bg-background min-h-screen sticky top-0">
          <div className="flex w-full flex-col p-4 gap-2">
            <div className="px-2 py-3">
              <div className="text-sm font-semibold text-foreground">Admin</div>
              <div className="text-xs text-muted-foreground truncate">{user.email}</div>
            </div>

            <nav className="flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto pt-4">
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => logout()}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <header className="md:hidden sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
            <div className="flex items-center justify-between px-4 h-12">
              <div className="text-sm font-semibold">Admin Dashboard</div>
              <Button variant="destructive" size="sm" onClick={() => logout()}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
            <div className="flex gap-1 px-2 pb-2 overflow-x-auto">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "whitespace-nowrap rounded-md px-3 py-1.5 text-xs border",
                      isActive
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-muted-foreground border-border"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </header>

          <main className="p-4 md:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
