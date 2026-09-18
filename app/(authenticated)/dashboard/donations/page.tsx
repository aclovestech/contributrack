import { getAllDonationsWithinRange } from '@/actions/donations.action';
import CustomDateRangePicker from '@/components/custom-date-range-picker';
import { SearchParams } from '@/types/searchparams';
import { PageHeader } from '@/components/page-header';
import { DonationDialog } from '@/components/dialogs/donation-dialog';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { DonationsTable } from './donations-table';

export default async function Donations(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const startDate =
    typeof searchParams.startDate === 'string'
      ? searchParams.startDate
      : undefined;
  const endDate =
    typeof searchParams.endDate === 'string' ? searchParams.endDate : undefined;
  const showArchived = searchParams.archived === '1';
  const donations = await getAllDonationsWithinRange(
    startDate,
    endDate,
    showArchived,
  );

  return (
    <div className="flex flex-col gap-6 py-5 md:gap-8 md:py-6">
      <PageHeader
        title={showArchived ? 'Archived donations' : 'Donations'}
        description={
          showArchived
            ? 'Review donations you have archived and restore one when needed.'
            : 'Record gifts quickly, then review or correct them whenever you need.'
        }
        actions={
          <>
            <Button asChild variant="outline">
              <Link
                href={
                  showArchived
                    ? '/dashboard/donations'
                    : '/dashboard/donations?archived=1'
                }
              >
                {showArchived ? 'Back to donations' : 'View archived'}
              </Link>
            </Button>
            {!showArchived && <DonationDialog />}
          </>
        }
      />
      <div className="space-y-4 px-4 lg:px-6">
        <CustomDateRangePicker
          key={`${startDate ?? ''}:${endDate ?? ''}:${showArchived ? 'archived' : 'active'}`}
          initialStartDate={startDate}
          initialEndDate={endDate}
          showArchived={showArchived}
        />
        <DonationsTable data={donations} isArchived={showArchived} />
      </div>
    </div>
  );
}
