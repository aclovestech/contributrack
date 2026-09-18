import { formatCurrency } from '@/lib/utils';
import { WeeklyReportRowData } from '@/types/donations';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface WeeklyDonationTotalsProps {
  data: WeeklyReportRowData[];
  year: number;
}

export function WeeklyDonationTotals({
  data,
  year,
}: WeeklyDonationTotalsProps) {
  return (
    <section className="space-y-4" aria-labelledby="weekly-donation-totals">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="weekly-donation-totals" className="text-base font-semibold">
            Weekly donation totals for {year}
          </h2>
          <p className="text-muted-foreground text-sm">
            Weeks run Monday through Sunday. Archived donations are excluded;
            unassigned historical donations remain included.
          </p>
        </div>
        {data.length > 0 && (
          <p className="text-muted-foreground text-sm tabular-nums">
            {data.length} {data.length === 1 ? 'week' : 'weeks'} with donations
          </p>
        )}
      </div>
      <div className="bg-card overflow-hidden rounded-lg border">
        {data.length === 0 ? (
          <p className="text-muted-foreground p-6 text-center text-sm">
            No active donations were recorded for this year.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Week</TableHead>
                <TableHead className="text-right">Total donated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.weekStart}>
                  <TableCell>{row.weekLabel}</TableCell>
                  <TableCell className="text-right font-medium tabular-nums">
                    {formatCurrency(row.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </section>
  );
}
