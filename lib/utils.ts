import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateTrend(current: number, previous: number) {
  if (previous === 0) {
    return {
      output: current > 0 ? 'New' : '0.00%',
      isPositive: current > 0,
    };
  }

  const trend = ((current - previous) / previous) * 100;

  const isPositive = trend > 0;

  return {
    output: trend.toFixed(2) + '%',
    isPositive,
  };
}

export function getMonthName(monthNumber: number) {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return monthNames[monthNumber - 1] || 'Invalid Month';
}
