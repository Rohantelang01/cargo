// app/components/navbar/MobileMenu.tsx
'use client';

import React from 'react';
import { X } from 'lucide-react';
import NavLinks from './NavLinks';
import UserProfile from './UserProfile';
import ThemeToggle from './ThemeToggle';
import { cn } from '@/lib/utils';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Mobile Menu Panel */}
      <div className={cn(
        'fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-900 shadow-xl z-50 transform transition-transform duration-300 ease-in-out md:hidden',
        isOpen ? 'translate-x-0' : 'translate-x-full'
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">RideShareX</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-6">
              {/* Navigation Links */}
              <div className="space-y-1">
                <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Navigation
                </div>
                <NavLinks isMobile onLinkClick={onClose} />
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <ThemeToggle isMobile />
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Account
                </div>
                <UserProfile isMobile onActionClick={onClose} />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              © 2025 RideShareX. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;