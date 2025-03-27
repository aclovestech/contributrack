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
import { Dispatch, SetStateAction } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { donorsTable } from '@/src/db/schema';
import { createInsertSchema } from 'drizzle-zod';
import { DonorColumns } from '@/app/(authenticated)/dashboard/donors/columns';

const donorFormSchema = createInsertSchema(donorsTable)
  .pick({
    name: true,
    email: true,
    phoneNumber: true,
    address: true,
    notes: true,
  })
  .transform((data) => ({
    name: data.name,
    email: data.email ?? undefined,
    phoneNumber: data.phoneNumber ?? undefined,
    address: data.address ?? undefined,
    notes: data.notes ?? undefined,
  }));

type DonorFormData = z.infer<typeof donorFormSchema>;

interface DonorFormProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  donorDetails?: DonorColumns;
}

export function DonorForm({ setOpen, donorDetails }: DonorFormProps) {
  const form = useForm<DonorFormData>({
    resolver: zodResolver(donorFormSchema),
    defaultValues: {
      name: donorDetails?.name || '',
      email: donorDetails?.email || '',
      phoneNumber: donorDetails?.phoneNumber || '',
      address: donorDetails?.address || '',
      notes: donorDetails?.notes || '',
    },
  });

  function onSubmit(values: z.infer<typeof donorFormSchema>) {
    console.log(values);
    if (values) {
      setOpen(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} autoFocus={undefined} />
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
                <Input {...field} />
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
                <Input {...field} />
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
                <Input {...field} />
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
                <Textarea {...field} className="max-h-64 min-h-32" />
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
