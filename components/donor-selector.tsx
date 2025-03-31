import { useState } from 'react';
import { Check, ChevronsUpDown, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils'; // Make sure you have this utility
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
import { DonorName } from '@/types/donor';

const MOCK_DONORS: DonorName[] = [
  {
    name: 'Alice Wonderland',
  },
  {
    name: 'Bob The Builder',
  },
];

interface DonorSelectorProps {
  selectedDonor: DonorName | null;
  onDonorSelect: (donorName: string) => void;
  onAddNewDonor: () => void;
}

export function DonorSelector({
  selectedDonor,
  onDonorSelect,
  onAddNewDonor,
}: DonorSelectorProps) {
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  const donors = MOCK_DONORS;

  return (
    <div className="space-y-2">
      <p className="text-muted-foreground text-sm">
        Select an existing donor or add a new one.
      </p>
      <Popover open={isSelectorOpen} onOpenChange={setIsSelectorOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={isSelectorOpen}
            className="w-full justify-between"
          >
            {selectedDonor ? selectedDonor.name : 'Select donor...'}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="max-h-[--radix-popover-content-available-height] w-[--radix-popover-trigger-width] p-0">
          <Command>
            <CommandInput placeholder="Search donor..." />
            <CommandList>
              <CommandEmpty>
                <div className="flex flex-col py-4 text-center text-sm">
                  No donor found.
                  <Button
                    variant="link"
                    className="ml-1 h-auto p-1 underline"
                    onClick={() => {
                      setIsSelectorOpen(false);
                      onAddNewDonor();
                    }}
                  >
                    Add New Donor?
                  </Button>
                </div>
              </CommandEmpty>
              <CommandGroup>
                {donors.map((donor) => (
                  <CommandItem
                    key={donor.name}
                    value={donor.name} // Search uses this value
                    onSelect={(currentValue) => {
                      // currentValue is the display value (donor.name)
                      const selected = donors.find(
                        (d) =>
                          d.name.toLowerCase() === currentValue.toLowerCase(),
                      );
                      if (selected) {
                        onDonorSelect(selected.name);
                      }
                      setIsSelectorOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        selectedDonor?.name === donor.name
                          ? 'opacity-100'
                          : 'opacity-0',
                      )}
                    />
                    {donor.name}
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    setIsSelectorOpen(false);
                    onAddNewDonor();
                  }}
                  className="cursor-pointer"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add New Donor
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Alternative explicit Add New Donor Button */}
      {/* <Button variant="outline" className="w-full" onClick={onAddNewDonor}>
        <UserPlus className="mr-2 h-4 w-4" /> Add New Donor
      </Button> */}
    </div>
  );
}
