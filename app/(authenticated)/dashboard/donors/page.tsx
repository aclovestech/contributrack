import { DataTable } from '@/components/data-table';
import { columns } from '@/app/(authenticated)/dashboard/donors/columns';
import { TableTypeProvider } from '@/app/contexts/table-provider.context';

export default function Donors() {
  const data = [
    {
      name: 'Abc Def Ghi Jkl',
      email: 'IyOg9@example.com',
      phoneNumber: '123-456-7890',
      address: '123 Main St, Anytown, USA',
      notes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
      name: 'Bohn Doe',
      email: 'IyOg9@example.com',
      phoneNumber: '123-456-7890',
      address: '123 Main St, Anytown, USA',
      notes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
      name: 'Cohn Doe',
      email: 'IyOg9@example.com',
      phoneNumber: '123-456-7890',
      address: '123 Main St, Anytown, USA',
      notes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
      name: 'Aohn Doe',
      email: 'IyOg9@example.com',
      phoneNumber: '123-456-7890',
      address: '123 Main St, Anytown, USA',
      notes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
      name: 'Bohn Doe',
      email: 'IyOg9@example.com',
      phoneNumber: '123-456-7890',
      address: '123 Main St, Anytown, USA',
      notes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
      name: 'Cohn Doe',
      email: 'IyOg9@example.com',
      phoneNumber: '123-456-7890',
      address: '123 Main St, Anytown, USA',
      notes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
      name: 'Aohn Doe',
      email: 'IyOg9@example.com',
      phoneNumber: '123-456-7890',
      address: '123 Main St, Anytown, USA',
      notes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
      name: 'Bohn Doe',
      email: 'IyOg9@example.com',
      phoneNumber: '123-456-7890',
      address: '123 Main St, Anytown, USA',
      notes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
      name: 'Cohn Doe',
      email: 'IyOg9@example.com',
      phoneNumber: '123-456-7890',
      address: '123 Main St, Anytown, USA',
      notes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
      name: 'Cohn Doe',
      email: 'IyOg9@example.com',
      phoneNumber: '123-456-7890',
      address: '123 Main St, Anytown, USA',
      notes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
      name: 'Cohn Doe',
      email: 'IyOg9@example.com',
      phoneNumber: '123-456-7890',
      address: '123 Main St, Anytown, USA',
      notes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
      name: 'Cohn Doe',
      email: 'IyOg9@example.com',
      phoneNumber: '123-456-7890',
      address: '123 Main St, Anytown, USA',
      notes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
      name: 'Cohn Doe',
      email: 'IyOg9@example.com',
      phoneNumber: '123-456-7890',
      address: '123 Main St, Anytown, USA',
      notes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
      name: 'Cohn Doe',
      email: 'IyOg9@example.com',
      phoneNumber: '123-456-7890',
      address: '123 Main St, Anytown, USA',
      notes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
      name: 'Cohn Doe',
      email: 'IyOg9@example.com',
      phoneNumber: '123-456-7890',
      address: '123 Main St, Anytown, USA',
      notes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
  ];

  return (
    <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">
      <TableTypeProvider type="donors">
        <DataTable columns={columns} data={data} />
      </TableTypeProvider>
    </div>
  );
}
