import React from 'react';
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center border-2 border-dashed border-border/50 rounded-2xl bg-secondary/20">
      {icon && <div className="mb-4 text-muted-foreground/50 scale-150">{icon}</div>}
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      {description && <p className="text-sm text-muted-foreground max-w-xs mb-6">{description}</p>}
      {action && (
        <Button 
          onClick={action.onClick}
          variant="default"
          size="sm"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}
