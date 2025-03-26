import { DataTable } from '@/components/data-table';
import { columns } from '@/app/(authenticated)/dashboard/donations/columns';

export default function Donations() {
  const data = [
    {
      donorName: 'John Doe',
      dateReceived: new Date(),
      amount: 100,
      donationType: 'tithes',
    },
    {
      donorName: 'John Doe',
      dateReceived: new Date(),
      amount: 100,
      donationType: 'tithes',
    },
  ];

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
      <DataTable
        columns={columns}
        data={data}
        filterTextName="donation"
        filterName="donorName"
        dialogType="donation"
      />
    </div>
  );
}
