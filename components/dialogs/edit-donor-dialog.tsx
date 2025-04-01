import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Edit } from 'lucide-react';
import React from 'react';
import { Row } from '@tanstack/react-table';
import { DonorColumns } from '@/types/donor';
import { DonorForm } from '@/components/donor-form';

interface EditDonorDialogProps {
  row: Row<DonorColumns>;
}

export function EditDonorDialog({ row }: EditDonorDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const rowData = {
    name: row.original.name,
    email: row.original.email ? row.original.email : undefined,
    phoneNumber: row.original.phoneNumber
      ? row.original.phoneNumber
      : undefined,
    address: row.original.address ? row.original.address : undefined,
    notes: row.original.notes ? row.original.notes : undefined,
  };

  function handleOnSubmit() {
    console.log('submitted');
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Edit className="h-4 w-4" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Donor Details</DialogTitle>
          <DialogDescription>
            Fill in the required details for the donor.
          </DialogDescription>
        </DialogHeader>
        <DonorForm initialData={rowData} onSubmit={handleOnSubmit} />
      </DialogContent>
    </Dialog>
  );
}
