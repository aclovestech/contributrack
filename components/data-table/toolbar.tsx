'use client';

import { ReactNode, useState } from 'react';
import { Table } from '@tanstack/react-table';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchPlaceholder: string;
  actions?: ReactNode;
}

export function DataTableToolbar<TData>({
  table,
  searchPlaceholder,
  actions,
}: DataTableToolbarProps<TData>) {
  const [filter, setFilter] = useState('');
  const isFiltered = Boolean(table.getState().globalFilter);

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setFilter(value);
    table.setGlobalFilter(value);
  }

  function handleResetFilter() {
    setFilter('');
    table.setGlobalFilter('');
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <Input
          type="search"
          placeholder={searchPlaceholder}
          value={filter}
          onChange={handleInputChange}
          className="h-10 w-full max-w-sm"
          aria-label={searchPlaceholder}
        />
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={handleResetFilter}
            className="h-10 shrink-0 px-2 sm:px-3"
          >
            Clear
            <X aria-hidden="true" />
          </Button>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
