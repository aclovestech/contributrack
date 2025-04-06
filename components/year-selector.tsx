'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePathname, useRouter } from 'next/navigation';

interface YearSelectorProps {
  years: string[];
}

export default function YearSelector({ years }: YearSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();

  if (years.length === 0) return null;

  const options = years.map((year) => (
    <SelectItem value={year} key={year}>
      {year}
    </SelectItem>
  ));

  function handleOnSelect(value: string) {
    router.push(`${pathname}?year=${value}`);
  }

  return (
    <Select onValueChange={handleOnSelect} defaultValue={years[0]}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a year" />
      </SelectTrigger>
      <SelectContent>{options}</SelectContent>
    </Select>
  );
}
