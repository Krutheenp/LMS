import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Calculate percentage
 */
export function calculatePercentage(current: number, total: number): number {
  if (total === 0) return 0
  return Math.round((current / total) * 100)
}

/**
 * Get grade from percentage
 */
export function getGradeFromPercentage(percentage: number): string {
  if (percentage >= 90) return 'A'
  if (percentage >= 80) return 'B'
  if (percentage >= 70) return 'C'
  if (percentage >= 60) return 'D'
  return 'F'
}

/**
 * Format date to readable string (Thai)
 */
export function formatDateTh(date: Date | string): string {
  const d = new Date(date)
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    locale: 'th-TH',
  }
  return new Intl.DateTimeFormat('th-TH', options).format(d)
}

/**
 * Format date to ISO string (YYYY-MM-DD)
 */
export function formatDateISO(date: Date | string): string {
  const d = new Date(date)
  return d.toISOString().split('T')[0]
}

/**
 * Check if date is in the past
 */
export function isPastDate(date: Date | string): boolean {
  return new Date(date) < new Date()
}

/**
 * Check if date is coming soon (within 7 days)
 */
export function isComingSoon(date: Date | string): boolean {
  const d = new Date(date)
  const now = new Date()
  const daysUntil = (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  return daysUntil > 0 && daysUntil <= 7
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Slugify string
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
}

/**
 * Generate random ID
 */
export function generateId(prefix = ''): string {
  return `${prefix}${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Sleep (for async operations)
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Deep clone object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}
