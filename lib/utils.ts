import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Return a date in the format expected by an HTML date input using the
 * browser's local calendar date. Using `toISOString()` here can show the
 * previous day for users west of UTC late in the evening.
 */
export function getLocalDateInputValue(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function calculateTrend(current: number, previous: number) {
  if (previous === 0) {
    return {
      output: current === 0 ? '0.00%' : 'New',
      isPositive: current > 0,
    };
  }

  const trend = ((current - previous) / Math.abs(previous)) * 100;

  const isPositive = trend > 0;

  return {
    output: trend.toFixed(2) + '%',
    isPositive,
  };
}

export function formatCurrency(amount: number | string) {
  const value = typeof amount === 'string' ? Number(amount) : amount;

  return value.toLocaleString('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
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
