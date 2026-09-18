'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CustomDateRangePickerProps {
  initialStartDate?: string;
  initialEndDate?: string;
}

export default function CustomDateRangePicker({
  initialStartDate = '',
  initialEndDate = '',
}: CustomDateRangePickerProps) {
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [error, setError] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setStartDate(initialStartDate);
    setEndDate(initialEndDate);
  }, [initialEndDate, initialStartDate]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!startDate || !endDate) {
      setError('Choose both a start date and an end date.');
      return;
    }

    if (startDate > endDate) {
      setError('Start date cannot be after the end date.');
      return;
    }

    setError('');
    router.push(
      `${pathname}?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`,
    );
  }

  function handleClear() {
    setStartDate('');
    setEndDate('');
    setError('');
    router.push(pathname);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card rounded-lg border p-4"
      aria-label="Filter donations by date"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="grid min-w-0 flex-1 gap-1.5">
          <Label htmlFor="start-date">From</Label>
          <Input
            type="date"
            id="start-date"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
          />
        </div>
        <div className="grid min-w-0 flex-1 gap-1.5">
          <Label htmlFor="end-date">To</Label>
          <Input
            type="date"
            id="end-date"
            value={endDate}
            onChange={(event) => setEndDate(event.target.value)}
          />
        </div>
        <div className="flex gap-2 sm:shrink-0">
          <Button type="submit">Apply dates</Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleClear}
            disabled={!startDate && !endDate}
          >
            Clear
          </Button>
        </div>
      </div>
      <p className="text-muted-foreground mt-2 text-xs">
        Leave the dates blank to show the latest year with donations.
      </p>
      {error && (
        <p className="text-destructive mt-2 text-sm" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
