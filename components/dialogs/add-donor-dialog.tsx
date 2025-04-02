'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import React, { useState } from 'react';
import { DonorForm, DonorFormData } from '@/components/donor-form';
import { addDonor } from '@/actions/donors.action';
import { useUser } from '@stackframe/stack';

export function AddDonorDialog() {
  const user = useUser({ or: 'redirect' });

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  async function handleFormSubmit(formData: DonorFormData) {
    await addDonor(user?.id, formData);

    setIsDialogOpen(false);
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus />
          <span>Add Donor</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Donor Details</DialogTitle>
          <DialogDescription>
            Fill in the required details for the donor.
          </DialogDescription>
        </DialogHeader>
        <DonorForm onFormSubmit={handleFormSubmit} />
      </DialogContent>
    </Dialog>
  );
}
