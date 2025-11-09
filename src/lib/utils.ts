import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}

export function generateBatchId(productType: string) {
  const date = new Date()
  const dateStr = date.toISOString().split('T')[0].replace(/-/g, '')
  const productCode = productType.toUpperCase().substring(0, 4)
  const randomSuffix = Math.random().toString(36).substring(2, 5).toUpperCase()
  
  return `GB${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}-${dateStr}-${productCode}-${randomSuffix}`
}

export function calculateProgress(stagesCompleted: number, totalStages: number = 5) {
  return Math.round((stagesCompleted / totalStages) * 100)
}

export function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case 'normal':
    case 'stable':
    case 'completed':
      return 'success'
    case 'warning':
      return 'warning'
    case 'critical':
    case 'error':
      return 'critical'
    case 'active':
    case 'info':
      return 'info'
    default:
      return 'muted'
  }
}