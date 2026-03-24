"use client";
import { useState } from "react";

export default function ModeToggle({ onModeChange }: { onModeChange: (mode: 'testing' | 'production') => void }) {
  const [mode, setMode] = useState<'testing' | 'production'>('testing');

  const handleChange = (newMode: 'testing' | 'production') => {
    setMode(newMode);
    onModeChange(newMode);
  };

  return (
    <div className="flex items-center gap-1 sm:gap-2 bg-muted/90 backdrop-blur-sm p-1 rounded-lg w-fit">
      <button
        onClick={() => handleChange('testing')}
        className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
          mode === 'testing' 
            ? 'bg-background shadow-sm text-foreground' 
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        Testing
      </button>
      <button
        onClick={() => handleChange('production')}
        className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
          mode === 'production' 
            ? 'bg-background shadow-sm text-foreground' 
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        Demo
      </button>
    </div>
  );
}
