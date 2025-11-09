'use client'

import { cn } from '@/lib/utils'
import { Badge } from './ui/badge'

interface StatusBadgeProps {
  status: 'normal' | 'warning' | 'critical' | 'stable' | 'info'
  children: React.ReactNode
  className?: string
}

export function StatusBadge({ status, children, className }: StatusBadgeProps) {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'normal':
        return 'bg-success/20 text-success border-success/30 hover:bg-success/30'
      case 'warning':
        return 'bg-warning/20 text-warning border-warning/30 hover:bg-warning/30'
      case 'critical':
        return 'bg-critical/20 text-critical border-critical/30 hover:bg-critical/30'
      case 'stable':
        return 'bg-info/20 text-info border-info/30 hover:bg-info/30'
      case 'info':
        return 'bg-primary/20 text-primary border-primary/30 hover:bg-primary/30'
      default:
        return 'bg-muted/20 text-muted-foreground border-muted/30'
    }
  }

  return (
    <Badge 
      className={cn(
        'px-2 py-1 text-xs font-medium border transition-colors duration-200',
        getStatusStyles(status),
        className
      )}
    >
      {children}
    </Badge>
  )
}