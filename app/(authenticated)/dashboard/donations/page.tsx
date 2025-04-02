import { DataTable } from '@/components/data-table/data-table';
import { columns } from '@/app/(authenticated)/dashboard/donations/columns';
import {
  getAllDonations,
  getLatestDonationDateRange,
} from '@/actions/donations.action';
import { stackServerApp } from '@/stack';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Donations(props: { searchParams: SearchParams }) {
  const user = await stackServerApp.getUser({ or: 'redirect' });

  const { startDate: defaultStartDate, endDate: defaultEndDate } =
    await getLatestDonationDateRange();

  const searchParams = await props.searchParams;

  const startDate = searchParams.startDate
    ? new Date(searchParams.startDate as string)
    : defaultStartDate;
  const endDate = searchParams.endDate
    ? new Date(searchParams.endDate as string)
    : defaultEndDate;

  const donations = await getAllDonations(user.id, startDate, endDate);

  return (
    <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">
      {/* add year picker component here */}
      <DataTable columns={columns} data={donations} />
    </div>
  );
}
