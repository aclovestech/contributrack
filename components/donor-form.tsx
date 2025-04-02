'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
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
import { Textarea } from '@/components/ui/textarea';
import { donorsTable } from '@/src/db/schema';
import { createInsertSchema } from 'drizzle-zod';
import { DonorRowData } from '@/types/donor';

export const insertDonorSchema = createInsertSchema(donorsTable, {
  name: z.string().min(1, 'Donor name is required').max(100),
  email: z
    .string()
    .email('Invalid email address')
    .max(254)
    .optional()
    .or(z.literal(''))
    .transform((value) => (value === '' ? null : value)),
  phoneNumber: z
    .string()
    .max(20)
    .optional()
    .or(z.literal(''))
    .transform((value) => (value === '' ? null : value)),
  address: z
    .string()
    .max(200)
    .optional()
    .or(z.literal(''))
    .transform((value) => (value === '' ? null : value)),
  notes: z
    .string()
    .max(1000)
    .optional()
    .or(z.literal(''))
    .transform((value) => (value === '' ? null : value)),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  userId: true,
});
export type DonorFormData = z.infer<typeof insertDonorSchema>;

interface DonorFormProps {
  onFormSubmit: (formData: DonorFormData) => void;
  initialData?: DonorRowData;
}

export function DonorForm({ initialData, onFormSubmit }: DonorFormProps) {
  const form = useForm<DonorFormData>({
    resolver: zodResolver(insertDonorSchema),
    defaultValues: {
      name: initialData?.name ? initialData.name : '',
      email: initialData?.email ? initialData?.email : '',
      phoneNumber: initialData?.phoneNumber ? initialData?.phoneNumber : '',
      address: initialData?.address ? initialData?.address : '',
      notes: initialData?.notes ? initialData?.notes : '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Name <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value ?? ''}
                  className="max-h-64 min-h-32"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-center">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
}
