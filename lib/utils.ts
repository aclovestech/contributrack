import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateTrend(current: number, previous: number) {
  const trend = ((current - previous) / previous) * 100;

  const isPositive = trend > 0;

  return {
    output: trend.toFixed(2) + '%',
    isPositive,
  };
}
