'use client';

import { Edit } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Row } from '@tanstack/react-table';

import { editDonor } from '@/actions/donors.action';
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
import { DonorRowData } from '@/types/donor';

interface EditDonorDialogProps {
  row: Row<DonorRowData>;
}

export function EditDonorDialog({ row }: EditDonorDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  async function handleOnSubmit(formData: DonorFormData) {
    try {
      await editDonor(row.original.id, formData);
      toast.success('Donor details saved.');
      setIsDialogOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Unable to save donor.',
      );
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Edit ${row.original.name}`}
        >
          <Edit aria-hidden="true" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit donor</DialogTitle>
          <DialogDescription>
            Update the details used to identify and contact this donor.
          </DialogDescription>
        </DialogHeader>
        <DonorForm
          initialData={row.original}
          onFormSubmit={handleOnSubmit}
          onCancel={() => setIsDialogOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
