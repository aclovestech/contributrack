'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DonorRowData } from '@/types/donor';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EditDonorDialog } from '@/components/dialogs/edit-donor-dialog';
import { DataTableActionsMenu } from '@/components/data-table/actions-menu';

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
    header: 'Email',
    cell: ({ row }) => {
      if (row.original.email === null) {
        return <div className="text-center">-</div>;
      }
    },
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Phone Number',
    cell: ({ row }) => {
      if (row.original.phoneNumber === null) {
        return <div className="text-center">-</div>;
      }
    },
  },
  {
    accessorKey: 'address',
    header: 'Address',
    cell: ({ row }) => {
      if (row.original.address === null) {
        return <div className="text-center">-</div>;
      }
    },
  },
  {
    accessorKey: 'notes',
    header: 'Notes',
    cell: ({ row }) => {
      if (row.original.notes === null) {
        return <div className="text-center">-</div>;
      }
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return <DataTableActionsMenu row={row} />;
    },
  },
];
