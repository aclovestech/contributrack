'use client';

import { DataTableColumnHeader } from '@/components/data-table/column-header';
import { ReportRowData } from '@/types/donations';
import { ColumnDef } from '@tanstack/react-table';

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
    accessorKey: 'totalAmount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Amount" />
    ),
    cell: ({ row }) => {
      const amount = row.original.amount;
      return (
        <div>
          {amount.toLocaleString('en-US', {
            style: 'currency',
            currency: 'CAD',
          })}
        </div>
      );
    },
    sortingFn: (rowA, rowB) => {
      const amountA = rowA.original.amount;
      const amountB = rowB.original.amount;

      if (amountA === null || amountA === undefined) return -1;
      if (amountB === null || amountB === undefined) return 1;

      const a = typeof amountA === 'string' ? parseFloat(amountA) : amountA;
      const b = typeof amountB === 'string' ? parseFloat(amountB) : amountB;

      if (a > b) return 1;
      if (a < b) return -1;
      return 0;
    },
    enableHiding: false,
  },
];
