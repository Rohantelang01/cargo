import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
}

export function StatsCard({ title, value, subtitle, trend, icon }: StatsCardProps) {
  return (
    <div className="bg-secondary/50 rounded-xl p-4 border border-border/50 transition-all hover:bg-secondary/80">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className="p-2 bg-background rounded-lg text-primary">
          {icon}
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-bold tracking-tight">{value}</p>
        {subtitle && (
          <p className={`text-xs font-medium flex items-center gap-1 ${
            trend === 'up' ? 'text-green-600' : 
            trend === 'down' ? 'text-red-600' : 
            'text-muted-foreground'
          }`}>
            {trend === 'up' && '↑'}
            {trend === 'down' && '↓'}
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
