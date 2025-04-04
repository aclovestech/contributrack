'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTableActionsMenu } from '@/components/data-table/actions-menu';
import { DonationDialog } from '@/components/dialogs/donation-dialog';
import { DonationRowData } from '@/types/donations';
import { format, parseISO } from 'date-fns';

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
      return (
        <div
          className="text-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          <Button variant="ghost">
            Donor Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      return <div className="text-center">{row.original.donorName}</div>;
    },
    enableHiding: false,
  },
  {
    accessorKey: 'dateReceived',
    header: ({ column }) => {
      return (
        <div
          className="text-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          <Button variant="ghost">
            Date Received
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const date = row.original.dateReceived;
      const formattedDate = format(parseISO(date), 'MMMM dd, yyyy');

      return <div className="text-center">{formattedDate}</div>;
    },

    enableHiding: false,
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => {
      return (
        <div
          className="text-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          <Button variant="ghost">
            Amount
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.original.amount);
      return (
        <div className="text-center">
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
      return (
        <div
          className="text-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          <Button variant="ghost">
            Donation Type
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const donationType = row.original.donationType
        .split('_')
        .map((word) => word.toUpperCase())
        .join(' ');

      return (
        <div className="text-center">
          <Badge variant="secondary" className="uppercase">
            {donationType}
          </Badge>
        </div>
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
