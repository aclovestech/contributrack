'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DonorRowData } from '@/types/donor';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EditDonorDialog } from '@/components/dialogs/edit-donor-dialog';
import { DataTableActionsMenu } from '@/components/data-table/actions-menu';

function formatCell(value: string | null) {
  return (
    <div className="text-center wrap-break-word whitespace-pre-wrap">
      {value ? value : '-'}
    </div>
  );
}

export const columns: ColumnDef<DonorRowData>[] = [
  {
    id: 'edit',
    cell: ({ row }) => {
      return <EditDonorDialog row={row} />;
    },
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <div
          className="text-left"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          <Button variant="ghost">
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    enableHiding: false,
  },
  {
    accessorKey: 'email',
    header: () => <div className="text-center">Email</div>,
    cell: ({ row }) => {
      return formatCell(row.original.email);
    },
  },
  {
    accessorKey: 'phoneNumber',
    header: () => <div className="text-center">Phone Number</div>,
    cell: ({ row }) => {
      return formatCell(row.original.phoneNumber);
    },
  },
  {
    accessorKey: 'address',
    header: () => <div className="text-center">Address</div>,
    cell: ({ row }) => {
      return formatCell(row.original.address);
    },
  },
  {
    accessorKey: 'notes',
    header: () => <div className="text-center">Notes</div>,
    cell: ({ row }) => {
      return formatCell(row.original.notes);
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return <DataTableActionsMenu donorRow={row} />;
    },
  },
];
