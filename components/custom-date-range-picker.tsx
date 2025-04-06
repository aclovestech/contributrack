'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { usePathname, useRouter } from 'next/navigation';

export default function CustomDateRangePicker() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isDateInvalid, setIsDateInvalid] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  function handleStartDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    setStartDate(e.target.value);
  }

  function handleEndDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEndDate(e.target.value);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!startDate || !endDate) {
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      return setIsDateInvalid(true);
    }

    router.push(`${pathname}?startDate=${startDate}&endDate=${endDate}`);
  }

  function handleClear() {
    setStartDate('');
    setEndDate('');
    router.push(`${pathname}`);
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-1.5 md:flex-row md:items-end"
      >
        <div className="grid max-w-sm items-center gap-1.5">
          <Label htmlFor="start-date">Start Date</Label>
          <Input
            type="date"
            id="start-date"
            placeholder="YYYY-MM-DD"
            value={startDate}
            onChange={handleStartDateChange}
          />
        </div>
        <div className="grid max-w-sm items-center gap-1.5">
          <Label htmlFor="end-date">End Date</Label>
          <Input
            type="date"
            id="end-date"
            placeholder="YYYY-MM-DD"
            value={endDate}
            onChange={handleEndDateChange}
          />
        </div>
        <Button type="submit">Apply</Button>
        <Button type="button" onClick={handleClear}>
          Clear
        </Button>
      </form>
      {isDateInvalid && (
        <AlertDialog open={isDateInvalid}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Invalid Date Range</AlertDialogTitle>
              <AlertDialogDescription>
                Start date cannot be after the end date.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction asChild>
                <Button onClick={() => setIsDateInvalid(false)}>OK</Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
