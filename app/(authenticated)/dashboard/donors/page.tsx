import { DataTable } from '@/components/data-table/data-table';
import { columns } from '@/app/(authenticated)/dashboard/donors/columns';
import { getAllDonors } from '@/actions/donors.action';
import { AddDonorDialog } from '@/components/dialogs/add-donor-dialog';
import { PageHeader } from '@/components/page-header';

export default async function Donors() {
  const donors = await getAllDonors();

  return (
    <div className="flex flex-col gap-6 py-5 md:gap-8 md:py-6">
      <PageHeader
        title="Donors"
        description="Keep one clear record for each person or household who gives."
        actions={<AddDonorDialog />}
      />
      <div className="px-4 lg:px-6">
        <DataTable
          columns={columns}
          data={donors}
          searchPlaceholder="Search donors…"
          emptyMessage="No donors yet. Add the first donor to get started."
        />
      </div>
    </div>
  );
}
