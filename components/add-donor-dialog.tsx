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

export function AddDonorDialog() {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <PlusIcon />
          <span className="hidden lg:inline">Add donor</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Donor Details</DialogTitle>
          <DialogDescription>Enter the donor details below</DialogDescription>
        </DialogHeader>
        <DonorForm setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
