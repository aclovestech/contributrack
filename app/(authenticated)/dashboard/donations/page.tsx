import { DataTable } from '@/components/data-table/data-table';
import {
  columns,
  DonationColumn,
} from '@/app/(authenticated)/dashboard/donations/columns';

export default function Donations() {
  const data: DonationColumn[] = [
    {
      donorName: 'John Doe',
      dateReceived: new Date('2023/05/03'),
      amount: '100.00',
      donationType: 'tithes',
    },
    {
      donorName: 'John Doe',
      dateReceived: new Date('2024/05/01'),
      amount: '100.00',
      donationType: 'tithes',
    },
    {
      donorName: 'John Doe',
      dateReceived: new Date('2025/05/02'),
      amount: '100.00',
      donationType: 'tithes',
    },
  ];

  return (
    <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">
      {/* add year picker component here */}
      <DataTable columns={columns} data={data} />
    </div>
  );
}
