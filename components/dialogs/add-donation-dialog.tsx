'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { DonorName } from '@/types/donor';
import { DonorSelector } from '@/components/donor-selector';
import { DonorForm } from '@/components/donor-form';
import { DonationForm } from '@/components/donation-form';

type DialogState = 'loading' | 'selectDonor' | 'addDonor' | 'addDonation';
type DialogTitleState =
  | 'Select a Donor'
  | 'Add New Donation'
  | 'Add Donor Details';
type DialogDescriptionState =
  | 'Choose the donor who made the donation.'
  | 'Fill in the required details of the donor.'
  | 'Fill in the required details for the donation.';

export function AddDonationDialog() {
  const [dialogState, setDialogState] = useState<DialogState>('selectDonor');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState<DonorName | null>(null);
  const [isAddDonorFormOpen, setIsAddDonorFormOpen] = useState(false);
  const [dialogTitle, setDialogTitle] =
    useState<DialogTitleState>('Select a Donor');
  const [dialogDescription, setDialogDescription] =
    useState<DialogDescriptionState>('Choose the donor who made the donation.');

  function handleResetDialogState() {
    console.log('reset');
    setIsDialogOpen(!isDialogOpen);
    if (dialogState !== 'selectDonor') {
      setTimeout(() => {
        setDialogTitle('Select a Donor');
        setDialogDescription('Choose the donor who made the donation.');
        setDialogState('selectDonor');
        setSelectedDonor(null);
        setIsAddDonorFormOpen(false);
      }, 300);
    }
  }

  function handleOnDonorSelect(donorName: string) {
    setSelectedDonor({ name: donorName });
    setDialogState('addDonation');
    setDialogTitle('Add New Donation');
    setDialogDescription('Fill in the required details for the donation.');
  }

  function handleOnDonorAdd() {
    console.log('submitted');
    setDialogState('addDonation');
    setDialogTitle('Add New Donation');
    setDialogDescription('Fill in the required details for the donation.');
  }

  function handleOpenAddDonorDialog() {
    setDialogState('addDonor');
    setDialogTitle('Add Donor Details');
    setDialogDescription('Fill in the required details of the donor.');
    setIsAddDonorFormOpen(true);
  }

  function handleEditDonor() {
    setDialogState('selectDonor');
    setDialogTitle('Select a Donor');
    setDialogDescription('Choose the donor who made the donation.');
    setSelectedDonor(null);
    setIsAddDonorFormOpen(false);
  }

  function DialogBody() {
    let body;

    if (dialogState === 'loading') {
      body = (
        <div className="flex h-40 items-center justify-center">
          <p>Loading donors...</p>
        </div>
      );
    } else if (dialogState === 'selectDonor') {
      body = (
        <DonorSelector
          selectedDonor={selectedDonor}
          onDonorSelect={handleOnDonorSelect}
          onAddNewDonor={handleOpenAddDonorDialog}
        />
      );
    } else if (dialogState === 'addDonor') {
      body = <DonorForm onSubmit={handleOnDonorAdd} />;
    } else if (dialogState === 'addDonation' && selectedDonor) {
      body = (
        <DonationForm
          selectedDonor={selectedDonor}
          onEditDonor={handleEditDonor}
          onSubmit={handleResetDialogState}
        />
      );
    }

    return body;
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleResetDialogState}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus />
          <span>Add Donation</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <DialogBody />
        </div>
      </DialogContent>
    </Dialog>
  );
}
