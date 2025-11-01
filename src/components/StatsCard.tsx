import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  className?: string;
  gradient?: boolean;
}

export function StatsCard({ title, value, subtitle, icon, className, gradient }: StatsCardProps) {
  return (
    <Card
      className={cn(
        'p-6 bg-gradient-card border-border/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-glow',
        gradient && 'bg-gradient-primary',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-2">{title}</p>
          <p className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-2">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className="ml-4 text-primary opacity-50">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
