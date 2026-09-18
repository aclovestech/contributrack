'use client';

import { DataTable } from '@/components/data-table/data-table';
import { DonationRowData } from '@/types/donations';

import { getDonationColumns } from './columns';

interface DonationsTableProps {
  data: DonationRowData[];
  isArchived: boolean;
}

/**
 * Column definitions contain client-only cells and must be created inside the
 * client boundary instead of being invoked by the server page.
 */
export function DonationsTable({ data, isArchived }: DonationsTableProps) {
  return (
    <DataTable
      columns={getDonationColumns(isArchived)}
      data={data}
      searchPlaceholder={
        isArchived ? 'Search archived donations…' : 'Search donations…'
      }
      emptyMessage={
        isArchived
          ? 'No archived donations for this period.'
          : 'No donations found for this period.'
      }
    />
  );
}
