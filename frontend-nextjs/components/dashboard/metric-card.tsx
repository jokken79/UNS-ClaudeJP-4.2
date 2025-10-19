'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  className?: string;
  loading?: boolean;
}

export function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
  loading = false,
}: MetricCardProps) {
  if (loading) {
    return (
      <Card className={cn('animate-pulse', className)}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="h-4 w-24 bg-muted rounded"></div>
          <div className="h-10 w-10 bg-muted rounded-full"></div>
        </CardHeader>
        <CardContent>
          <div className="h-8 w-16 bg-muted rounded mb-2"></div>
          <div className="h-3 w-32 bg-muted rounded"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        'transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer',
        className
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center ring-4 ring-primary/5">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-3xl font-bold tracking-tight">{value}</div>

          {description && (
            <p className="text-xs text-muted-foreground">
              {description}
            </p>
          )}

          {trend && (
            <div className="flex items-center gap-2 pt-1">
              <div
                className={cn(
                  'flex items-center gap-1 text-xs font-medium rounded-full px-2 py-0.5',
                  trend.isPositive
                    ? 'text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950'
                    : 'text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-950'
                )}
              >
                {trend.isPositive ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                <span>
                  {trend.isPositive ? '+' : ''}
                  {trend.value}%
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {trend.label || 'vs mes anterior'}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Variant for small metric cards
export function MetricCardSmall({
  title,
  value,
  icon: Icon,
  className,
}: Omit<MetricCardProps, 'description' | 'trend'>) {
  return (
    <div
      className={cn(
        'flex items-center gap-4 rounded-lg border p-4 transition-all hover:shadow-md',
        className
      )}
    >
      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <h3 className="text-2xl font-bold">{value}</h3>
      </div>
    </div>
  );
}
