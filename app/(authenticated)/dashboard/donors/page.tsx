import { getAllDonors } from '@/actions/donors.action';
import { AddDonorDialog } from '@/components/dialogs/add-donor-dialog';
import { PageHeader } from '@/components/page-header';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SearchParams } from '@/types/searchparams';
import { DonorsTable } from './donors-table';

export default async function Donors({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const showArchived = params.archived === '1';
  const donors = await getAllDonors(showArchived);

  return (
    <div className="flex flex-col gap-6 py-5 md:gap-8 md:py-6">
      <PageHeader
        title={showArchived ? 'Archived donors' : 'Donors'}
        description={
          showArchived
            ? 'Review donors you have archived and restore one when needed.'
            : 'Keep one clear record for each person or household who gives.'
        }
        actions={
          <>
            {!showArchived && (
              <Button asChild variant="outline">
                <Link href="/dashboard/donations">Record donation</Link>
              </Button>
            )}
            <Button asChild variant="outline">
              <Link
                href={
                  showArchived
                    ? '/dashboard/donors'
                    : '/dashboard/donors?archived=1'
                }
              >
                {showArchived ? 'Back to donors' : 'View archived'}
              </Link>
            </Button>
            {!showArchived && <AddDonorDialog />}
          </>
        }
      />
      <div className="px-4 lg:px-6">
        <DonorsTable data={donors} isArchived={showArchived} />
      </div>
    </div>
  );
}
