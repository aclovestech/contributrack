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
import { DonorColumns } from '@/app/(authenticated)/dashboard/donors/columns';

interface EditDonorDialogProps {
  row: Row<DonorColumns>;
}

export function EditDonorDialog({ row }: EditDonorDialogProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
        {/* add donor form here */}
      </DialogContent>
    </Dialog>
  );
}
