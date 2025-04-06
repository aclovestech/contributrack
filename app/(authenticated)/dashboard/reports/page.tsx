import { DataTable } from '@/components/data-table/data-table';
import { stackServerApp } from '@/stack';
import { SearchParams } from '@/types/searchparams';
import { columns } from '@/app/(authenticated)/dashboard/reports/columns';
import YearSelector from '@/components/year-selector';
import {
  getAllPossibleDonationYears,
  getYearlyDonationsSummary,
} from '@/actions/donations.action';
import { PrintAnnualReport } from '@/components/print-annual-report';

export default async function Reports(props: { searchParams: SearchParams }) {
  const user = await stackServerApp.getUser({ or: 'redirect' });

  const searchParams = await props.searchParams;

  const years = await getAllPossibleDonationYears(user.id);

  if (years.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center">
        <p className="text-muted-foreground p-8">
          No data available. Add your first donation first to get started.
        </p>
      </div>
    );
  }

  const stringYears = years.map((year) => year.toString());

  let data;
  let selectedYear;

  if (!searchParams.year) {
    selectedYear = years[0];
    data = await getYearlyDonationsSummary(user.id, selectedYear);
  } else {
    selectedYear = parseInt(searchParams.year as string);
    data = await getYearlyDonationsSummary(user.id, selectedYear);
  }

  const totalDonations = data.reduce(
    (sum, donation) => sum + donation.amount,
    0,
  );

  return (
    <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">
      <div className="flex justify-between">
        <YearSelector years={stringYears} />
        <PrintAnnualReport
          data={data}
          year={selectedYear}
          total={totalDonations}
        />
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
