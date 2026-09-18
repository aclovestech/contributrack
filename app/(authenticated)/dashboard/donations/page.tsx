import { DataTable } from '@/components/data-table/data-table';
import { columns } from '@/app/(authenticated)/dashboard/donations/columns';
import { getAllDonationsWithinRange } from '@/actions/donations.action';
import CustomDateRangePicker from '@/components/custom-date-range-picker';
import { SearchParams } from '@/types/searchparams';
import { PageHeader } from '@/components/page-header';
import { DonationDialog } from '@/components/dialogs/donation-dialog';

export default async function Donations(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const startDate =
    typeof searchParams.startDate === 'string'
      ? searchParams.startDate
      : undefined;
  const endDate =
    typeof searchParams.endDate === 'string' ? searchParams.endDate : undefined;
  const donations = await getAllDonationsWithinRange(startDate, endDate);

  return (
    <div className="flex flex-col gap-6 py-5 md:gap-8 md:py-6">
      <PageHeader
        title="Donations"
        description="Record gifts quickly, then review or correct them whenever you need."
        actions={<DonationDialog />}
      />
      <div className="space-y-4 px-4 lg:px-6">
        <CustomDateRangePicker
          initialStartDate={startDate}
          initialEndDate={endDate}
        />
        <DataTable
          columns={columns}
          data={donations}
          searchPlaceholder="Search donations…"
          emptyMessage="No donations found for this period."
        />
      </div>
    </div>
  );
}
