'use client';

import { Table } from '@tanstack/react-table';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTableViewOptions } from '@/components/data-table/view-options';
import { AddDonorDialog } from '@/components/dialogs/add-donor-dialog';
import { usePathname } from 'next/navigation';
import { DonationDialog } from '@/components/dialogs/donation-dialog';
import { useState } from 'react';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const [filter, setFilter] = useState('');
  const isFiltered = table.getState().columnFilters.length > 0;

  const currentPage = usePathname().split('/')[2];

  let columnToFilter: string | undefined;
  let placeholder;

  switch (currentPage) {
    case 'donors': {
      columnToFilter = 'name';
      placeholder = 'name';
      break;
    }
    case 'donations': {
      columnToFilter = 'donorName';
      placeholder = 'donor name';
      break;
    }
    case 'reports': {
      break;
    }
  }

  return (
    <div className="flex items-center justify-between">
      {columnToFilter && (
        <div className="flex flex-1 items-center space-x-2">
          <Input
            placeholder={`Filter ${placeholder}`}
            value={
              (table.getColumn(columnToFilter)?.getFilterValue() as string) ??
              ''
            }
            onChange={(event) =>
              table
                .getColumn(columnToFilter)
                ?.setFilterValue(event.target.value)
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
      )}
      <div className="flex items-center space-x-2">
        {currentPage !== 'donations' && <DataTableViewOptions table={table} />}
        {currentPage === 'donors' && <AddDonorDialog />}
        {currentPage === 'donations' && <DonationDialog />}
      </div>
    </div>
  );
}
