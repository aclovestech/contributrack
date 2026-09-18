'use client';

import { useState } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { rankItem } from '@tanstack/match-sorter-utils';
import { cn } from '@/lib/utils';

import { DataTablePagination } from '@/components/data-table/pagination';
import { DataTableToolbar } from '@/components/data-table/toolbar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  emptyMessage?: string;
  searchPlaceholder?: string;
  toolbarActions?: React.ReactNode;
}

function getColumnClassName<TData, TValue>(column: ColumnDef<TData, TValue>) {
  return (column.meta as { className?: string } | undefined)?.className;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  emptyMessage = 'No records found.',
  searchPlaceholder = 'Search records…',
  toolbarActions,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  // TanStack Table owns this instance's lifecycle and is intentionally not
  // memoized by the React compiler.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, _columnId, value) => {
      const query = String(value ?? '').trim();
      if (!query) return true;

      return row
        .getAllCells()
        .some((cell) => rankItem(String(cell.getValue() ?? ''), query).passed);
    },
    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
    },
    state: { sorting, globalFilter },
  });

  return (
    <div className="space-y-4">
      <DataTableToolbar
        table={table}
        searchPlaceholder={searchPlaceholder}
        actions={toolbarActions}
      />
      <div className="bg-card overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={cn(getColumnClassName(header.column.columnDef))}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(getColumnClassName(cell.column.columnDef))}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-28 text-center"
                >
                  <span className="text-muted-foreground">{emptyMessage}</span>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
