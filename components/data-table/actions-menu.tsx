'use client';

import { useState } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { Row } from '@tanstack/react-table';
import { toast } from 'sonner';

import { archiveDonor, restoreDonor } from '@/actions/donors.action';
import { archiveDonation, restoreDonation } from '@/actions/donations.action';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DonationRowData } from '@/types/donations';
import { DonorRowData } from '@/types/donor';

interface DataTableActionsMenuProps {
  donorRow?: Row<DonorRowData>;
  donationRow?: Row<DonationRowData>;
}

export function DataTableActionsMenu({
  donorRow,
  donationRow,
}: DataTableActionsMenuProps) {
  const [isDeleteAlertDialogOpen, setIsDeleteAlertDialogOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const isDonor = Boolean(donorRow);
  const recordLabel =
    donorRow?.original.name ?? donationRow?.original.donorName;
  const entityLabel = isDonor ? 'donor' : 'donation';

  async function handleOnConfirmArchive() {
    setIsPending(true);

    try {
      if (donorRow) {
        await archiveDonor(donorRow.original.id);
      } else if (donationRow) {
        await archiveDonation(donationRow.original.id);
      }

      toast.success(
        `${entityLabel[0].toUpperCase()}${entityLabel.slice(1)} archived.`,
      );
      setIsDeleteAlertDialogOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : `Unable to archive this ${entityLabel}.`,
      );
    } finally {
      setIsPending(false);
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Actions for ${recordLabel}`}
          >
            <MoreHorizontal aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>More actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onSelect={(event) => {
              event.preventDefault();
              setIsDeleteAlertDialogOpen(true);
            }}
          >
            Archive {entityLabel}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog
        open={isDeleteAlertDialogOpen}
        onOpenChange={setIsDeleteAlertDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive this {entityLabel}?</AlertDialogTitle>
            <AlertDialogDescription>
              {isDonor
                ? `“${recordLabel}” will be hidden from active donor lists. Existing donations are kept for reporting.`
                : 'The donation will be removed from active totals and reports. You can restore it later.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Keep it</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={(event) => {
                event.preventDefault();
                void handleOnConfirmArchive();
              }}
              disabled={isPending}
            >
              {isPending ? 'Archiving…' : 'Archive'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// Keep restore actions discoverable to future archive-management UI without
// exposing them in the active tables yet.
export const restoreArchivedDonor = restoreDonor;
export const restoreArchivedDonation = restoreDonation;
