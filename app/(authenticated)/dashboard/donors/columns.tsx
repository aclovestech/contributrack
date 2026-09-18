'use client';

import { ArrowUpDown } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

import { DataTableActionsMenu } from '@/components/data-table/actions-menu';
import { EditDonorDialog } from '@/components/dialogs/edit-donor-dialog';
import { Button } from '@/components/ui/button';
import { DonorRowData } from '@/types/donor';

function formatCell(value: string | null) {
  return (
    <div className="text-center break-words whitespace-pre-wrap">
      {value || '-'}
    </div>
  );
}

export function getDonorColumns(isArchived = false): ColumnDef<DonorRowData>[] {
  return [
    {
      id: 'edit',
      cell: ({ row }) => <EditDonorDialog row={row} />,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <div className="text-left">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Name
            <ArrowUpDown className="ml-2 size-4" aria-hidden="true" />
          </Button>
        </div>
      ),
      enableHiding: false,
    },
    {
      accessorKey: 'email',
      header: () => <div className="text-center">Email</div>,
      cell: ({ row }) => formatCell(row.original.email),
    },
    {
      accessorKey: 'phoneNumber',
      header: () => <div className="text-center">Phone</div>,
      cell: ({ row }) => formatCell(row.original.phoneNumber),
    },
    {
      accessorKey: 'address',
      header: () => <div className="text-center">Address</div>,
      cell: ({ row }) => formatCell(row.original.address),
    },
    {
      accessorKey: 'notes',
      header: () => <div className="text-center">Notes</div>,
      cell: ({ row }) => formatCell(row.original.notes),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <DataTableActionsMenu donorRow={row} isArchived={isArchived} />
      ),
    },
  ];
}

export const columns = getDonorColumns();
