import { Row } from '@tanstack/react-table';
import { DonorRowData } from '@/types/donor';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { DonationRowData } from '@/types/donations';
import { useState } from 'react';
import { useUser } from '@stackframe/stack';
import { deleteDonor } from '@/actions/donors.action';
import { deleteDonation } from '@/actions/donations.action';

interface DataTableActionsMenuProps {
  donorRow?: Row<DonorRowData>;
  donationRow?: Row<DonationRowData>;
}

export function DataTableActionsMenu({
  donorRow,
  donationRow,
}: DataTableActionsMenuProps) {
  const user = useUser({ or: 'redirect' });

  const [isDropdownMenuOpen, setIsDropdownMenuOpen] = useState(false);
  const [isDeleteAlertDialogOpen, setIsDeleteAlertDialogOpen] = useState(false);

  function handleDropdownMenuOpenChange() {
    setIsDropdownMenuOpen(!isDropdownMenuOpen);
  }

  function handleAlertDialogOpenChange() {
    setIsDeleteAlertDialogOpen(!isDeleteAlertDialogOpen);
  }

  async function handleOnConfirmDelete() {
    setIsDeleteAlertDialogOpen(false);
    setIsDropdownMenuOpen(false);

    if (donorRow) {
      await deleteDonor(user?.id, donorRow.original.id);
    }

    if (donationRow) {
      await deleteDonation(user?.id, donationRow.original.id);
    }
  }

  function handleOnSelect(e: Event) {
    e.preventDefault();
    setIsDeleteAlertDialogOpen(true);
  }

  return (
    <DropdownMenu
      open={isDropdownMenuOpen}
      onOpenChange={handleDropdownMenuOpenChange}
    >
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="pb-2">Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <AlertDialog
          open={isDeleteAlertDialogOpen}
          onOpenChange={handleAlertDialogOpenChange}
        >
          <AlertDialogTrigger asChild>
            <DropdownMenuItem onSelect={handleOnSelect}>
              <span className="text-destructive cursor-pointer">Delete</span>
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                entry from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive"
                onClick={handleOnConfirmDelete}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
