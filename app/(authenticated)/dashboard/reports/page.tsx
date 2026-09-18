import { DataTable } from '@/components/data-table/data-table';
import { SearchParams } from '@/types/searchparams';
import { columns } from '@/app/(authenticated)/dashboard/reports/columns';
import YearSelector from '@/components/year-selector';
import {
  getAllPossibleDonationYears,
  getYearlyDonationsSummary,
} from '@/actions/donations.action';
import { PrintAnnualReport } from '@/components/print-annual-report';
import { PageHeader } from '@/components/page-header';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function Reports(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;

  const years = await getAllPossibleDonationYears();

  if (years.length === 0) {
    return (
      <div className="flex flex-col gap-6 py-5 md:gap-8 md:py-6">
        <PageHeader
          title="Reports"
          description="See annual totals by donor and print a copy for reconciliation."
        />
        <div className="bg-card mx-4 flex min-h-48 flex-col items-center justify-center gap-4 rounded-lg border p-8 text-center lg:mx-6">
          <div>
            <p className="font-medium">No donations to report yet</p>
            <p className="text-muted-foreground mt-1 text-sm">
              Record a donation to create your first annual summary.
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard/donations">Record a donation</Link>
          </Button>
        </div>
      </div>
    );
  }

  const stringYears = years.map((year) => year.toString());

  const requestedYear =
    typeof searchParams.year === 'string'
      ? Number.parseInt(searchParams.year, 10)
      : undefined;
  const selectedYear =
    requestedYear && years.includes(requestedYear) ? requestedYear : years[0];
  const data = await getYearlyDonationsSummary(selectedYear);

  return (
    <div className="flex flex-col gap-6 py-5 md:gap-8 md:py-6">
      <PageHeader
        title="Reports"
        description="See annual totals by donor and print a copy for reconciliation."
      />
      <div className="space-y-4 px-4 lg:px-6">
        <div className="bg-card flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium">Annual donor totals</p>
            <p className="text-muted-foreground text-sm">
              Archived donations are left out. Unassigned historical donations
              remain visible.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <YearSelector years={stringYears} />
            <PrintAnnualReport data={data} year={selectedYear} />
          </div>
        </div>
        <DataTable
          columns={columns}
          data={data}
          searchPlaceholder="Search report…"
          emptyMessage="No donations recorded for this year."
        />
      </div>
    </div>
  );
}
