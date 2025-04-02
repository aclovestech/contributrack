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
import { DonorRowData } from '@/types/donor';
import { DonorForm, DonorFormData } from '@/components/donor-form';

interface EditDonorDialogProps {
  row: Row<DonorRowData>;
}

export function EditDonorDialog({ row }: EditDonorDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  function handleOnSubmit(formData: DonorFormData) {
    setIsOpen(false);
    console.log(formData);
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
        <DonorForm
          initialData={row.original as DonorRowData}
          onFormSubmit={handleOnSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}
