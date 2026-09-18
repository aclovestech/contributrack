'use client';

import { Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { addDonor } from '@/actions/donors.action';
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
import { DonorFormData } from '@/lib/validation';

export function AddDonorDialog() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  async function handleFormSubmit(formData: DonorFormData) {
    try {
      await addDonor(formData);
      toast.success('Donor added.');
      setIsDialogOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Unable to add donor.',
      );
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus aria-hidden="true" />
          Add donor
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add a donor</DialogTitle>
          <DialogDescription>
            Add the donor once, then select them when recording a donation.
          </DialogDescription>
        </DialogHeader>
        <DonorForm onFormSubmit={handleFormSubmit} />
      </DialogContent>
    </Dialog>
  );
}
