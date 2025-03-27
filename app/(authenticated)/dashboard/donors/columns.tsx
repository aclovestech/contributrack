'use client';

import { ColumnDef } from '@tanstack/react-table';
import { donorsTable } from '@/src/db/schema';
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

export type Donor = typeof donorsTable.$inferSelect;
export type DonorColumns = Pick<
  Donor,
  'name' | 'email' | 'phoneNumber' | 'address' | 'notes'
>;
export type DonorName = Pick<Donor, 'name'>;

export const columns: ColumnDef<DonorColumns>[] = [
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
            <DonorForm setOpen={setOpen} donorDetails={row.original} />
          </DialogContent>
        </Dialog>
      );
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
