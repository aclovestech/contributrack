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
  isArchived?: boolean;
}

export function DataTableActionsMenu({
  donorRow,
  donationRow,
  isArchived = false,
}: DataTableActionsMenuProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const isDonor = Boolean(donorRow);
  const recordLabel =
    donorRow?.original.name ?? donationRow?.original.donorName ?? 'record';
  const entityLabel = isDonor ? 'donor' : 'donation';
  const verb = isArchived ? 'restore' : 'archive';

  async function handleConfirm() {
    setIsPending(true);

    try {
      if (donorRow) {
        if (isArchived) await restoreDonor(donorRow.original.id);
        else await archiveDonor(donorRow.original.id);
      } else if (donationRow) {
        if (isArchived) await restoreDonation(donationRow.original.id);
        else await archiveDonation(donationRow.original.id);
      }

      toast.success(
        `${entityLabel[0].toUpperCase()}${entityLabel.slice(1)} ${verb}d.`,
      );
      setIsConfirmOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : `Unable to ${verb} this ${entityLabel}.`,
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
            className={
              isArchived ? undefined : 'text-destructive focus:text-destructive'
            }
            onSelect={(event) => {
              event.preventDefault();
              setIsConfirmOpen(true);
            }}
          >
            {isArchived ? 'Restore' : 'Archive'} {entityLabel}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isArchived ? 'Restore' : 'Archive'} this {entityLabel}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isArchived
                ? `“${recordLabel}” will return to the active ${entityLabel} list.`
                : isDonor
                  ? `“${recordLabel}” will be hidden from active donor lists. Existing donations are kept for reporting.`
                  : 'The donation will be removed from active totals and reports. You can restore it later.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={
                isArchived
                  ? undefined
                  : 'bg-destructive hover:bg-destructive/90'
              }
              onClick={(event) => {
                event.preventDefault();
                void handleConfirm();
              }}
              disabled={isPending}
            >
              {isPending
                ? `${isArchived ? 'Restoring' : 'Archiving'}…`
                : isArchived
                  ? 'Restore'
                  : 'Archive'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
