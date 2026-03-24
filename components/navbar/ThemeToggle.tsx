// app/components/navbar/ThemeToggle.tsx
'use client';

import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  showLabel?: boolean;
  isMobile?: boolean;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ showLabel = false, isMobile = false }) => {
  const { theme, setTheme, isDark } = useTheme();

  const themeOptions = [
    { value: 'light' as const, icon: Sun, label: 'Light' },
    { value: 'dark' as const, icon: Moon, label: 'Dark' },
    { value: 'system' as const, icon: Monitor, label: 'System' },
  ];

  if (isMobile) {
    return (
      <div className="space-y-1">
        <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Theme
        </div>
        {themeOptions.map((option) => {
          const IconComponent = option.icon;
          return (
            <button
              key={option.value}
              onClick={() => setTheme(option.value)}
              className={cn(
                'w-full flex items-center space-x-3 px-3 py-3 rounded-lg font-medium transition-all duration-200',
                theme === option.value
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              )}
            >
              <IconComponent className="w-5 h-5" />
              <span>{option.label}</span>
              {theme === option.value && (
                <div className="ml-auto w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // Desktop version - simple toggle
  const handleToggle = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const getCurrentIcon = () => {
    if (theme === 'system') {
      return Monitor;
    }
    return isDark ? Moon : Sun;
  };

  const CurrentIcon = getCurrentIcon();

  return (
    <button
      onClick={handleToggle}
      className={cn(
        'p-2 rounded-lg transition-all duration-200 hover:scale-105',
        'hover:bg-gray-100 dark:hover:bg-gray-700',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900'
      )}
      title={`Current theme: ${theme}`}
    >
      <CurrentIcon 
        className={cn(
          'w-5 h-5 transition-colors duration-200',
          theme === 'light' && 'text-yellow-500',
          theme === 'dark' && 'text-blue-400',
          theme === 'system' && 'text-gray-600 dark:text-gray-400'
        )} 
      />
      {showLabel && (
        <span className="ml-2 text-sm capitalize">{theme}</span>
      )}
    </button>
  );
};

export default ThemeToggle;