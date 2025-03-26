import { DataTable } from '@/components/data-table';
import { columns } from '@/app/(authenticated)/dashboard/donors/columns';

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
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
      <DataTable
        columns={columns}
        data={data}
        filterTextName="donor"
        filterName="name"
        dialogType="donor"
      />
    </div>
  );
}
