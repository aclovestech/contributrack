'use client';

import { useEffect, useState } from 'react';
import { Check, ChevronsUpDown, Loader2, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

import { getDonorsForSelection } from '@/actions/donors.action';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { DonorOption } from '@/types/donor';

interface DonorSelectorProps {
  selectedDonor: DonorOption | null;
  onDonorSelect: (donor: DonorOption) => void;
  onAddNewDonor: () => void;
}

export function DonorSelector({
  selectedDonor,
  onDonorSelect,
  onAddNewDonor,
}: DonorSelectorProps) {
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [donors, setDonors] = useState<DonorOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchDonors() {
      try {
        const result = await getDonorsForSelection();
        if (isMounted) setDonors(result);
      } catch (error) {
        if (isMounted) {
          toast.error(
            error instanceof Error ? error.message : 'Unable to load donors.',
          );
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void fetchDonors();
    return () => {
      isMounted = false;
    };
  }, []);

  function handleAddNewDonor() {
    setIsSelectorOpen(false);
    onAddNewDonor();
  }

  function handleOnSelect(value: string) {
    const donor = donors.find((item) => item.id === value);
    if (donor) onDonorSelect(donor);
    setIsSelectorOpen(false);
  }

  return (
    <div className="space-y-3">
      <p className="text-muted-foreground text-sm">
        Choose an existing donor or add a new one.
      </p>
      <Popover open={isSelectorOpen} onOpenChange={setIsSelectorOpen} modal>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={isSelectorOpen}
            className="h-11 w-full justify-between"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="text-muted-foreground flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                Loading donors…
              </span>
            ) : (
              (selectedDonor?.name ?? 'Choose a donor')
            )}
            <ChevronsUpDown
              className="text-muted-foreground size-4"
              aria-hidden="true"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[--radix-popover-trigger-width] p-0"
          align="start"
        >
          <Command>
            <CommandInput placeholder="Search by donor name…" />
            <CommandList>
              <CommandEmpty>No active donor found.</CommandEmpty>
              <CommandGroup>
                {donors.map((donor) => (
                  <CommandItem
                    key={donor.id}
                    value={donor.id}
                    keywords={[donor.name]}
                    onSelect={handleOnSelect}
                  >
                    <Check
                      className={cn(
                        'mr-2 size-4',
                        selectedDonor?.id === donor.id
                          ? 'opacity-100'
                          : 'opacity-0',
                      )}
                      aria-hidden="true"
                    />
                    {donor.name}
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup>
                <CommandItem onSelect={handleAddNewDonor}>
                  <UserPlus className="mr-2 size-4" aria-hidden="true" />
                  Add a new donor
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
