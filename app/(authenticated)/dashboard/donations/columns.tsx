'use client';

import { format, parseISO } from 'date-fns';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';

import { DataTableActionsMenu } from '@/components/data-table/actions-menu';
import { DataTableColumnHeader } from '@/components/data-table/column-header';
import { DonationDialog } from '@/components/dialogs/donation-dialog';
import { formatCurrency } from '@/lib/utils';
import { DonationRowData } from '@/types/donations';

function formatDonationType(type: string) {
  return type
    .split('_')
    .map((word) => word.toUpperCase())
    .join(' ');
}

export function getDonationColumns(
  isArchived = false,
): ColumnDef<DonationRowData>[] {
  return [
    {
      id: 'edit',
      cell: ({ row }) => <DonationDialog donationData={row} />,
      enableHiding: false,
    },
    {
      accessorKey: 'donorName',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Donor name" />
      ),
      cell: ({ row }) => {
        const isUnassigned = row.original.donorId === null;
        return (
          <div className={isUnassigned ? 'text-muted-foreground italic' : ''}>
            {row.original.donorName}
          </div>
        );
      },
      enableHiding: false,
    },
    {
      accessorKey: 'dateReceived',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Date received" />
      ),
      cell: ({ row }) => (
        <div>{format(parseISO(row.original.dateReceived), 'MMMM d, yyyy')}</div>
      ),
      enableHiding: false,
    },
    {
      accessorKey: 'amount',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Amount" />
      ),
      cell: ({ row }) => (
        <div className="font-medium">{formatCurrency(row.original.amount)}</div>
      ),
    },
    {
      accessorKey: 'donationType',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Donation type" />
      ),
      cell: ({ row }) => (
        <Badge variant="secondary">
          {formatDonationType(row.original.donationType)}
        </Badge>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <DataTableActionsMenu donationRow={row} isArchived={isArchived} />
      ),
    },
  ];
}

export const columns = getDonationColumns();
