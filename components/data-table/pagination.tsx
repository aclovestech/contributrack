import { Table } from '@tanstack/react-table';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

const PAGE_SIZE_OPTIONS = [10, 20, 30, 40, 50] as const;

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  const paginationState = table.getState().pagination;
  const currentPage = paginationState.pageIndex + 1;
  const pageCount = table.getPageCount();
  const rowCount = table.getFilteredRowModel().rows.length;
  const visibleRowCount = table.getPaginationRowModel().rows.length;

  return (
    <div className="flex flex-col items-center justify-between gap-4 px-2 md:flex-row">
      <div className="text-muted-foreground text-sm">
        {visibleRowCount} of {rowCount} row(s) displayed.
      </div>

      <div className="flex flex-col items-center gap-2 md:flex-row">
        <p className="text-sm font-medium whitespace-nowrap">Rows per page</p>
        <Select
          value={`${paginationState.pageSize}`}
          onValueChange={(value) => table.setPageSize(Number(value))}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={paginationState.pageSize} />
          </SelectTrigger>
          <SelectContent>
            {PAGE_SIZE_OPTIONS.map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            aria-label="Go to first page"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label="Go to previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label="Go to next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            aria-label="Go to last page"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="text-sm font-medium whitespace-nowrap">
          Page {currentPage} of {pageCount}
        </div>
      </div>
    </div>
  );
}
