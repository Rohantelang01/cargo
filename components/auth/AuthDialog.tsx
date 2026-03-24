// app/components/auth/AuthDialog.tsx
'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import { cn } from '@/lib/utils';

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

const AuthDialog: React.FC<AuthDialogProps> = ({ 
  isOpen, 
  onClose, 
  initialMode = 'login' 
}) => {
  const [currentMode, setCurrentMode] = useState<'login' | 'signup'>(initialMode);

  const handleSuccess = () => {
    onClose();
  };

  const switchToLogin = () => {
    setCurrentMode('login');
  };

  const switchToSignup = () => {
    setCurrentMode('signup');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className={cn(
            'relative bg-white dark:bg-gray-900 rounded-2xl shadow-xl',
            'w-full max-w-md max-h-[90vh] overflow-y-auto',
            'transform transition-all duration-300 ease-out',
            'animate-in fade-in-0 zoom-in-95'
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors z-10"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>

          {/* Content */}
          <div className="p-6">
            {currentMode === 'login' ? (
              <LoginForm 
                onSuccess={handleSuccess}
                onSwitchToSignup={switchToSignup}
              />
            ) : (
              <SignupForm 
                onSuccess={handleSuccess}
                onSwitchToLogin={switchToLogin}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthDialog;