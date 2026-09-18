'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  donationFormSchema,
  DonationFormData,
  DONATION_TYPES,
} from '@/lib/validation';

interface DonationDetailsFormProps {
  onSubmit: (
    formData: DonationFormData,
    isEditing: boolean,
  ) => void | Promise<void>;
  initialData?: DonationFormData;
}

function formatDonationType(type: string) {
  return type
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export function DonationForm({
  onSubmit,
  initialData,
}: DonationDetailsFormProps) {
  const form = useForm<DonationFormData>({
    resolver: zodResolver(donationFormSchema),
    defaultValues: {
      dateReceived:
        initialData?.dateReceived ?? new Date().toISOString().slice(0, 10),
      amount: initialData?.amount ?? undefined,
      donationType: initialData?.donationType ?? undefined,
    },
  });

  async function handleFormSubmit(formData: DonationFormData) {
    await onSubmit(formData, Boolean(initialData));
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-5"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="dateReceived"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Date received <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} type="date" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Amount <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm">
                      CA$
                    </span>
                    <Input
                      type="number"
                      min="0.01"
                      max="99999999.99"
                      step="0.01"
                      inputMode="decimal"
                      placeholder="0.00"
                      className="pl-12"
                      {...field}
                      value={field.value ?? ''}
                      onChange={(event) => field.onChange(event.target.value)}
                    />
                  </div>
                </FormControl>
                <FormDescription>Canadian dollars.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="donationType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Donation type <span className="text-destructive">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {DONATION_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {formatDonationType(type)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting
              ? 'Saving…'
              : initialData
                ? 'Save changes'
                : 'Add donation'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
