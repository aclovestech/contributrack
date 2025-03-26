import { DonorForm } from '@/components/donor-form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PlusIcon } from 'lucide-react';
import React from 'react';

interface AddDonorOrDonationDialogProps {
  dialogType: 'donor' | 'donation';
}

export function AddDonorOrDonationDialog({
  dialogType,
}: AddDonorOrDonationDialogProps) {
  const [open, setOpen] = React.useState(false);

  const dialogTitle = dialogType === 'donor' ? 'Donor' : 'Donation';
  const dialogDescription =
    dialogType === 'donor'
      ? 'Enter the donor details below'
      : 'Enter the donation details below';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <PlusIcon />
          <span className="hidden lg:inline">Add {dialogType}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        <DonorForm setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
