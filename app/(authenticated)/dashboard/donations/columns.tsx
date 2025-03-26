'use client';

import { ColumnDef } from '@tanstack/react-table';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { donationsTable } from '@/src/db/schema';
import { ArrowUpDown, Edit, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { DonorForm } from '@/components/donor-form';
import React from 'react';
import { Badge } from '@/components/ui/badge';

export type Donations = {
  donorName: string;
  dateReceived: Date;
  amount: number;
  donationType: string;
};

export const columns: ColumnDef<Donations>[] = [
  {
    id: 'edit',
    cell: ({ row }) => {
      const [open, setOpen] = React.useState(false);

      return (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <div className="cursor-pointer hover:underline">
              <Edit className="h-4 w-4" />
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Donor Details</DialogTitle>
              <DialogDescription>
                Enter the donor details below
              </DialogDescription>
            </DialogHeader>
            <DonorForm setOpen={setOpen} cellData={row} />
          </DialogContent>
        </Dialog>
      );
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
      return <div className="text-center">{row.getValue('donorName')}</div>;
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
      const date = new Date(row.getValue('dateReceived'));
      const formattedDate = date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

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
      return (
        <div className="text-center">
          {row.original.amount.toLocaleString('en-US', {
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
      return (
        <div className="text-center">
          <Badge variant="secondary" className="uppercase">
            {row.original.donationType}
          </Badge>
        </div>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="pb-2">Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
