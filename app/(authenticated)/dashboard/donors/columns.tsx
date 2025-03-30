'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DonorColumns } from '@/types/donor';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EditDonorDialog } from '@/components/dialogs/edit-donor-dialog';
import { DataTableActionsMenu } from '@/components/data-table/actions-menu';

export const columns: ColumnDef<DonorColumns>[] = [
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
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Phone Number',
  },
  {
    accessorKey: 'address',
    header: 'Address',
  },
  {
    accessorKey: 'notes',
    header: 'Notes',
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return <DataTableActionsMenu row={row} />;
    },
  },
];
