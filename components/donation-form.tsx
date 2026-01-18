'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createInsertSchema } from 'drizzle-zod';
import { donationsTable } from '@/src/db/schema';
import { donationTypeEnum } from '@/src/db/schema';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { DONATION_TYPES } from '@/types/donations';

export const insertDonationSchema = createInsertSchema(donationsTable, {
  dateReceived: z.string().min(1, { message: 'Date is required' }),
  amount: z.number().positive('Amount must be positive').finite(),
  donationType: z.enum(donationTypeEnum.enumValues, {
    message: 'Donation type is required',
  }),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  donorId: true,
  userId: true,
});
export type DonationFormData = z.infer<typeof insertDonationSchema>;

interface DonationDetailsFormProps {
  onSubmit: (formData: DonationFormData, isEditing: boolean) => void;
  initialData?: DonationFormData;
}

export function DonationForm({
  onSubmit,
  initialData,
}: DonationDetailsFormProps) {
  const form = useForm<DonationFormData>({
    resolver: zodResolver(insertDonationSchema),
    defaultValues: {
      dateReceived: initialData
        ? initialData.dateReceived
        : new Date().toISOString().split('T')[0],
      amount: initialData ? initialData.amount : 0.0,
      donationType: initialData ? initialData.donationType : undefined,
    },
  });

  function handleFormSubmit(formData: DonationFormData) {
    const isEditing = !!initialData;
    onSubmit(formData, isEditing);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-6"
      >
        <div className="grid grid-cols-2 gap-4">
          {/* Date Received */}
          <FormField
            control={form.control}
            name="dateReceived"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Date Received <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} type="date" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Amount */}
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Amount <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="text-muted-foreground absolute inset-y-0 left-0 flex items-center pl-3 text-sm">
                      CA$
                    </span>
                    <Input
                      type="number"
                      placeholder="0.00"
                      step="0.01"
                      min="0.01"
                      className="pl-12"
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) => {
                        const value = e.target.value === '' ? undefined : parseFloat(e.target.value);
                        field.onChange(isNaN(value as number) ? undefined : value);
                      }}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Donation Type */}
          <FormField
            control={form.control}
            name="donationType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Donation Type <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder="Select donation type"
                        className="capitalize"
                      />
                    </SelectTrigger>

                    <SelectContent>
                      {DONATION_TYPES.map((type) => (
                        <SelectItem
                          key={type}
                          value={type}
                          className="capitalize"
                        >
                          {type
                            .replace(/_/g, ' ')
                            .replace(/\b\w/g, (char) => char.toUpperCase())}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex items-center justify-center">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
}
