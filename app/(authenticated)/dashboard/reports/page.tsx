import { DataTable } from '@/components/data-table/data-table';
import { stackServerApp } from '@/stack';
import { SearchParams } from '@/types/searchparams';
import { columns } from '@/app/(authenticated)/dashboard/reports/columns';
import YearSelector from '@/components/year-selector';
import {
  getAllPossibleDonationYears,
  getYearlyDonationsSummary,
} from '@/actions/donations.action';

export default async function Reports(props: { searchParams: SearchParams }) {
  const user = await stackServerApp.getUser({ or: 'redirect' });

  const searchParams = await props.searchParams;

  const years = await getAllPossibleDonationYears(user.id);
  const stringYears = years.map((year) => year.toString());

  let data;

  if (!searchParams.year) {
    data = await getYearlyDonationsSummary(user.id, years[0]);
  } else {
    const year = parseInt(searchParams.year as string);
    data = await getYearlyDonationsSummary(user.id, year);
  }

  return (
    <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">
      <YearSelector years={stringYears} />
      <DataTable columns={columns} data={data} />
    </div>
  );
}
