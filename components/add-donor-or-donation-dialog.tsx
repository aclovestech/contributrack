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
import { useTableType } from '@/app/contexts/table-provider.context';

export function AddDonorOrDonationDialog() {
  const [open, setOpen] = React.useState(false);

  const tableType = useTableType();
  const { dialogTitle, dialogDescription } =
    tableType === 'donors'
      ? {
          dialogTitle: 'Add Donor',
          dialogDescription: 'Enter donor details below',
        }
      : {
          dialogTitle: 'Add Donation',
          dialogDescription: 'Enter donation details below',
        };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <PlusIcon />
          <span className="hidden lg:inline">{dialogTitle}</span>
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
