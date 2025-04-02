'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Edit, Plus } from 'lucide-react';
import { DonorName } from '@/types/donor';
import { DonorSelector } from '@/components/donor-selector';
import { DonorForm, DonorFormData } from '@/components/donor-form';
import { DonationForm } from '@/components/donation-form';
import { Label } from '@/components/ui/label';
import { Row } from '@tanstack/react-table';
import { DonationColumn } from '@/types/donations';

type DialogState = 'loading' | 'selectDonor' | 'addDonor' | 'fillInDonation';

type DialogTitleState =
  | 'Select a Donor'
  | 'Add Donor Details'
  | 'Donation Details';

type DialogDescriptionState =
  | 'Choose the donor who made the donation.'
  | 'Fill in the required details of the donor.'
  | 'Fill in the required details for the donation.';

interface DonationDialogProps {
  donationData?: Row<DonationColumn>;
}

export function DonationDialog({ donationData }: DonationDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogState, setDialogState] = useState<DialogState>('selectDonor');
  const [selectedDonor, setSelectedDonor] = useState<DonorName | null>(null);
  const [dialogContent, setDialogContent] = useState({
    title: 'Select a Donor' as DialogTitleState,
    description:
      'Choose the donor who made the donation.' as DialogDescriptionState,
  });

  useEffect(() => {
    if (donationData) {
      const { original } = donationData;
      setDialogState('fillInDonation');
      setSelectedDonor({ name: original.donorName });
      setDialogContent({
        title: 'Donation Details',
        description: 'Fill in the required details for the donation.',
      });
    }
  }, []);

  function handleResetDialogState() {
    setIsDialogOpen(!isDialogOpen);
    if (dialogState !== 'fillInDonation' || !donationData) {
      setDialogContent({
        title: 'Select a Donor',
        description: 'Choose the donor who made the donation.',
      });
      setDialogState('selectDonor');
      setSelectedDonor(null);
    }
  }

  function handleOnDonorSelect(donorName: string) {
    setSelectedDonor({ name: donorName });
    setDialogState('fillInDonation');
    setDialogContent({
      title: 'Donation Details',
      description: 'Fill in the required details for the donation.',
    });
  }

  function handleOnDonorAdd(formData: DonorFormData) {
    setSelectedDonor({ name: formData.name });
    setDialogState('fillInDonation');
    setDialogContent({
      title: 'Donation Details',
      description: 'Fill in the required details for the donation.',
    });
  }

  function handleOpenAddDonorDialog() {
    setDialogState('addDonor');
    setDialogContent({
      title: 'Add Donor Details',
      description: 'Fill in the required details of the donor.',
    });
  }

  function handleEditDonor() {
    setDialogState('selectDonor');
    setDialogContent({
      title: 'Select a Donor',
      description: 'Choose the donor who made the donation.',
    });
    setSelectedDonor(null);
  }

  function DialogBody() {
    let body;
    let rowData;

    if (donationData) {
      rowData = {
        dateReceived: donationData?.original.dateReceived
          .toISOString()
          .split('T')[0],
        amount: parseFloat(donationData?.original.amount),
        donationType: donationData?.original.donationType,
      };
    }

    switch (dialogState) {
      case 'loading':
        body = (
          <div className="flex h-40 items-center justify-center">
            <p>Loading donors...</p>
          </div>
        );
        break;
      case 'selectDonor':
        body = (
          <DonorSelector
            selectedDonor={selectedDonor}
            onDonorSelect={handleOnDonorSelect}
            onAddNewDonor={handleOpenAddDonorDialog}
          />
        );
        break;
      case 'addDonor':
        body = <DonorForm onFormSubmit={handleOnDonorAdd} />;
        break;
      case 'fillInDonation':
        body = (
          <div className="space-y-6">
            <div className="bg-muted/50 flex flex-row items-center justify-between rounded-md border p-3">
              <div>
                <Label className="text-muted-foreground text-xs">
                  Donor Name
                </Label>
                <p className="font-semibold">{selectedDonor?.name}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleEditDonor}
                className="mt-2 sm:mt-0"
              >
                Change Donor
              </Button>
            </div>
            <DonationForm
              onSubmit={handleResetDialogState}
              initialData={rowData ? rowData : undefined}
            />
          </div>
        );
        break;
      default:
        body = <p>Invalid dialog state.</p>; // Handle unexpected states
    }

    return body;
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleResetDialogState}>
      <DialogTrigger asChild>
        {donationData ? (
          <div className="cursor-pointer hover:underline">
            <Edit className="h-4 w-4" />
          </div>
        ) : (
          <Button variant="outline">
            <Plus />
            <span>Add Donation</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{dialogContent.title}</DialogTitle>
          <DialogDescription>{dialogContent.description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <DialogBody />
        </div>
      </DialogContent>
    </Dialog>
  );
}
