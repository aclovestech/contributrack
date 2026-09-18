'use client';

import { DataTable } from '@/components/data-table/data-table';
import { ReportRowData } from '@/types/donations';

import { columns } from './columns';

interface ReportsTableProps {
  data: ReportRowData[];
}

/** Create report columns inside the client boundary used by DataTable. */
export function ReportsTable({ data }: ReportsTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      searchPlaceholder="Search report…"
      emptyMessage="No donations recorded for this year."
    />
  );
}
