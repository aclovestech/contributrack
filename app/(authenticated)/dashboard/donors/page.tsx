import { DataTable } from '@/components/data-table/data-table';
import { columns } from '@/app/(authenticated)/dashboard/donors/columns';
import { DonorColumns } from '@/types/donor';
import { getAllDonors } from '@/actions/donors.action';
import { stackServerApp } from '@/stack';

export default async function Donors() {
  const user = await stackServerApp.getUser({ or: 'redirect' });

  let donors;

  donors = await getAllDonors(user?.id);

  console.log(donors[0]);

  return (
    <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">
      <DataTable columns={columns} data={donors} />
    </div>
  );
}
