'use client';

import { DataTableColumnHeader } from '@/components/data-table/column-header';
import { ReportRowData } from '@/types/donations';
import { ColumnDef } from '@tanstack/react-table';
import { formatCurrency } from '@/lib/utils';

export const columns: ColumnDef<ReportRowData>[] = [
  {
    accessorKey: 'donorName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Donor Name" />
    ),
    cell: ({ row }) => <div>{row.original.donorName}</div>,
    enableHiding: false,
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Amount" />
    ),
    cell: ({ row }) => {
      return (
        <div className="font-medium">{formatCurrency(row.original.amount)}</div>
      );
    },
    sortingFn: (rowA, rowB) => rowA.original.amount - rowB.original.amount,
    enableHiding: false,
  },
];
