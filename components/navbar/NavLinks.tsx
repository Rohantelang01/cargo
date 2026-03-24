// app/components/navbar/NavLinks.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Info, Phone, Car, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

interface NavLink {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  adminOnly?: boolean;
}

const NavLinks: React.FC<{ isMobile?: boolean; onLinkClick?: () => void }> = ({ isMobile = false, onLinkClick }) => {
  const pathname = usePathname();
  const { user } = useAuth();

  const navLinks: NavLink[] = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Find a Ride', href: '/find-ride', icon: Car },
    { name: 'About', href: '/about', icon: Info },
    { name: 'Contact', href: '/contact', icon: Phone },
    ...(user?.roles?.includes('admin') ? [{ name: 'Admin Panel', href: '/admin-panel', icon: Shield, adminOnly: true }] : []),
  ];

  const isActiveLink = (href: string): boolean => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const linkClassName = (href: string) => {
    const isActive = isActiveLink(href);
    
    if (isMobile) {
      return cn(
        'flex items-center space-x-3 px-3 py-3 rounded-lg font-medium transition-all duration-200',
        isActive 
          ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
          : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700'
      );
    }
    
    return cn(
      'flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 relative',
      isActive 
        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
        : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700'
    );
  };

  return (
    <>
      {navLinks.map((link) => {
        const IconComponent = link.icon;
        const isActive = isActiveLink(link.href);
        
        return (
          <Link
            key={link.href}
            href={link.href}
            className={linkClassName(link.href)}
            onClick={onLinkClick}
          >
            <IconComponent className={cn(
              'transition-colors duration-200',
              isMobile ? 'w-5 h-5' : 'w-4 h-4',
              isActive ? 'text-blue-600 dark:text-blue-400' : '',
              link.adminOnly ? 'text-purple-600 dark:text-purple-400' : ''
            )} />
            <span>{link.name}</span>
            
            {/* Active indicator for desktop */}
            {!isMobile && isActive && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 dark:bg-blue-400 rounded-full" />
            )}
          </Link>
        );
      })}
    </>
  );
};

export default NavLinks;