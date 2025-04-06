import { DataTable } from '@/components/data-table/data-table';
import { columns } from '@/app/(authenticated)/dashboard/donations/columns';
import { getAllDonationsWithinRange } from '@/actions/donations.action';
import { stackServerApp } from '@/stack';
import CustomDateRangePicker from '@/components/custom-date-range-picker';
import { SearchParams } from '@/types/searchparams';

export default async function Donations(props: { searchParams: SearchParams }) {
  const user = await stackServerApp.getUser({ or: 'redirect' });

  const searchParams = await props.searchParams;

  let donations;

  if (!searchParams.startDate || !searchParams.endDate) {
    donations = await getAllDonationsWithinRange(user.id);
  } else {
    const startDate = searchParams.startDate as string;
    const endDate = searchParams.endDate as string;

    donations = await getAllDonationsWithinRange(user.id, startDate, endDate);
  }

  return (
    <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">
      <CustomDateRangePicker />
      <DataTable columns={columns} data={donations} />
    </div>
  );
}
