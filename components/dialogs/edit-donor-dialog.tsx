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
import { useUser } from '@stackframe/stack';
import { editDonor } from '@/actions/donors.action';

interface EditDonorDialogProps {
  row: Row<DonorRowData>;
}

export function EditDonorDialog({ row }: EditDonorDialogProps) {
  const user = useUser({ or: 'redirect' });

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  async function handleOnSubmit(formData: DonorFormData) {
    const result = await editDonor(user?.id, row.original.id, formData);

    console.log(result);

    setIsDialogOpen(false);
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
