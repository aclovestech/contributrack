'use client';

import { useState } from 'react';
import { Edit, Plus } from 'lucide-react';
import { Row } from '@tanstack/react-table';
import { toast } from 'sonner';

import { addDonor } from '@/actions/donors.action';
import { addDonation, editDonation } from '@/actions/donations.action';
import { DonorSelector } from '@/components/donor-selector';
import { DonationForm } from '@/components/donation-form';
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
import { Label } from '@/components/ui/label';
import { DonationFormData, DonorFormData } from '@/lib/validation';
import { DonorOption } from '@/types/donor';
import { DonationRowData } from '@/types/donations';

type DialogState = 'selectDonor' | 'addDonor' | 'fillInDonation';

interface DonationDialogProps {
  donationData?: Row<DonationRowData>;
}

export function DonationDialog({ donationData }: DonationDialogProps) {
  const isEditing = Boolean(donationData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogState, setDialogState] = useState<DialogState>(
    isEditing ? 'fillInDonation' : 'selectDonor',
  );
  const [selectedDonor, setSelectedDonor] = useState<DonorOption | null>(
    donationData?.original.donorId
      ? {
          id: donationData.original.donorId,
          name: donationData.original.donorName,
        }
      : null,
  );

  function resetForNextDonation() {
    setDialogState('selectDonor');
    setSelectedDonor(null);
  }

  function handleOpenChange(open: boolean) {
    setIsDialogOpen(open);
    if (!open && !isEditing) resetForNextDonation();
  }

  function handleOnDonorSelect(donor: DonorOption) {
    setSelectedDonor(donor);
    setDialogState('fillInDonation');
  }

  async function handleOnDonorAdd(formData: DonorFormData) {
    try {
      const donor = await addDonor(formData);
      setSelectedDonor({ id: donor.id, name: donor.name });
      setDialogState('fillInDonation');
      toast.success('Donor added.');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Unable to add donor.',
      );
    }
  }

  function handleOpenAddDonorDialog() {
    setDialogState('addDonor');
  }

  function handleChangeDonor() {
    setDialogState('selectDonor');
    setSelectedDonor(null);
  }

  async function handleOnDonationSubmit(
    formData: DonationFormData,
    editing: boolean,
  ) {
    try {
      if (editing && donationData) {
        await editDonation(
          donationData.original.id,
          selectedDonor?.id ?? null,
          formData,
        );
      } else {
        if (!selectedDonor) {
          toast.error('Choose a donor before saving the donation.');
          return;
        }
        await addDonation(selectedDonor.id, formData);
      }

      toast.success(editing ? 'Donation updated.' : 'Donation recorded.');
      setIsDialogOpen(false);
      if (!isEditing) resetForNextDonation();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Unable to save donation.',
      );
    }
  }

  const initialData = donationData
    ? {
        dateReceived: donationData.original.dateReceived,
        amount: Number(donationData.original.amount),
        donationType: donationData.original.donationType,
      }
    : undefined;

  const title =
    dialogState === 'selectDonor'
      ? 'Choose a donor'
      : dialogState === 'addDonor'
        ? 'Add a donor'
        : isEditing
          ? 'Edit donation'
          : 'Donation details';

  const description =
    dialogState === 'selectDonor'
      ? 'Choose who made this donation.'
      : dialogState === 'addDonor'
        ? 'Add the donor now, then continue recording the donation.'
        : 'Enter the date, amount, and type of donation.';

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {donationData ? (
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Edit donation from ${donationData.original.donorName}`}
          >
            <Edit aria-hidden="true" />
          </Button>
        ) : (
          <Button>
            <Plus aria-hidden="true" />
            Add donation
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-5 py-2">
          {dialogState === 'selectDonor' && (
            <DonorSelector
              selectedDonor={selectedDonor}
              onDonorSelect={handleOnDonorSelect}
              onAddNewDonor={handleOpenAddDonorDialog}
            />
          )}
          {dialogState === 'addDonor' && (
            <div className="space-y-4">
              <Button
                type="button"
                variant="ghost"
                className="-ml-2"
                onClick={() => setDialogState('selectDonor')}
              >
                ← Back to donor search
              </Button>
              <DonorForm onFormSubmit={handleOnDonorAdd} />
            </div>
          )}
          {dialogState === 'fillInDonation' && (
            <div className="space-y-5">
              <div className="bg-muted/50 flex items-center justify-between gap-3 rounded-lg border p-3">
                <div className="min-w-0">
                  <Label className="text-muted-foreground text-xs">Donor</Label>
                  <p className="truncate font-medium">
                    {selectedDonor?.name ?? 'Unassigned donor'}
                  </p>
                  {isEditing && !selectedDonor && (
                    <p className="text-muted-foreground text-xs">
                      This historical donation has no linked donor.
                    </p>
                  )}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleChangeDonor}
                >
                  {selectedDonor ? 'Change' : 'Assign donor'}
                </Button>
              </div>
              <DonationForm
                onSubmit={handleOnDonationSubmit}
                initialData={initialData}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
