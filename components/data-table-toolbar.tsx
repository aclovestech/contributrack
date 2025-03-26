'use client';

import { Table } from '@tanstack/react-table';
import { PlusIcon, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTableViewOptions } from '@/components/data-table-view-options';
import { AddDonorOrDonationDialog } from '@/components/add-donor-or-donation-dialog';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filterTextName: string;
  filterName: string;
  dialogType: 'donor' | 'donation';
}

export function DataTableToolbar<TData>({
  table,
  filterTextName,
  filterName,
  dialogType,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder={`Filter ${filterTextName}...`}
          value={
            (table.getColumn(filterName)?.getFilterValue() as string) ?? ''
          }
          onChange={(event) =>
            table.getColumn(filterName)?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X />
          </Button>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <DataTableViewOptions table={table} />
        <AddDonorOrDonationDialog dialogType={dialogType} />
      </div>
    </div>
  );
}
