'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { DataTableActionsMenu } from '@/components/data-table/actions-menu';
import { DonationDialog } from '@/components/dialogs/donation-dialog';
import { DonationRowData } from '@/types/donations';
import { format, parseISO } from 'date-fns';
import { DataTableColumnHeader } from '@/components/data-table/column-header';

export const columns: ColumnDef<DonationRowData>[] = [
  {
    id: 'edit',
    cell: ({ row }) => {
      return <DonationDialog donationData={row} />;
    },
    enableHiding: false,
  },
  {
    accessorKey: 'donorName',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title={'Donor Name'} />;
    },
    cell: ({ row }) => {
      return <div>{row.original.donorName}</div>;
    },
    enableHiding: false,
  },
  {
    accessorKey: 'dateReceived',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title={'Date Received'} />;
    },
    cell: ({ row }) => {
      const date = row.original.dateReceived;
      const formattedDate = format(parseISO(date), 'MMMM dd, yyyy');

      return <div>{formattedDate}</div>;
    },
    enableHiding: false,
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title={'Amount'} />;
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.original.amount);
      return (
        <div>
          {amount.toLocaleString('en-US', {
            style: 'currency',
            currency: 'CAD',
          })}
        </div>
      );
    },
  },
  {
    accessorKey: 'donationType',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title={'Donation Type'} />;
    },
    cell: ({ row }) => {
      const donationType = row.original.donationType
        .split('_')
        .map((word) => word.toUpperCase())
        .join(' ');

      return (
        <Badge variant="secondary" className="uppercase">
          {donationType}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return <DataTableActionsMenu donationRow={row} />;
    },
  },
];
