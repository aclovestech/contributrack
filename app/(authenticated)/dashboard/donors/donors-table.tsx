'use client';

import { DataTable } from '@/components/data-table/data-table';
import { DonorRowData } from '@/types/donor';

import { getDonorColumns } from './columns';

interface DonorsTableProps {
  data: DonorRowData[];
  isArchived: boolean;
}

/**
 * Column definitions contain client-only cells and must be created inside the
 * client boundary instead of being invoked by the server page.
 */
export function DonorsTable({ data, isArchived }: DonorsTableProps) {
  return (
    <DataTable
      columns={getDonorColumns(isArchived)}
      data={data}
      searchPlaceholder={
        isArchived ? 'Search archived donors…' : 'Search donors…'
      }
      emptyMessage={
        isArchived
          ? 'No archived donors.'
          : 'No donors yet. Add the first donor to get started.'
      }
    />
  );
}
