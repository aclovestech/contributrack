import { DataTable } from '@/components/data-table';
import {
  columns,
  DonationColumn,
} from '@/app/(authenticated)/dashboard/donations/columns';
import { TableTypeProvider } from '@/app/contexts/table-provider.context';

export default function Donations() {
  const data: DonationColumn[] = [
    {
      donorName: 'John Doe',
      dateReceived: new Date(),
      amount: '100.00',
      donationType: 'tithes',
    },
    {
      donorName: 'John Doe',
      dateReceived: new Date(),
      amount: '100.00',
      donationType: 'tithes',
    },
  ];

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
      <TableTypeProvider type="donations">
        <DataTable columns={columns} data={data} />
      </TableTypeProvider>
    </div>
  );
}
