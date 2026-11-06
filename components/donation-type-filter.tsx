'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatDonationType } from '@/lib/utils';
import { DONATION_TYPES } from '@/lib/validation';

export function DonationTypeFilter({
  value,
}: {
  value?: (typeof DONATION_TYPES)[number];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function selectType(type: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (type === 'all') params.delete('donationType');
    else params.set('donationType', type);
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <div className="grid gap-1.5 sm:max-w-xs">
      <Label htmlFor="donation-type-filter">Donation type</Label>
      <Select value={value ?? 'all'} onValueChange={selectType}>
        <SelectTrigger id="donation-type-filter" className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All donation types</SelectItem>
          {DONATION_TYPES.map((type) => (
            <SelectItem key={type} value={type}>
              {formatDonationType(type)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
