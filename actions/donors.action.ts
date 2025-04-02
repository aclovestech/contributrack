'use server';

import { db } from '@/src/db';
import { donorsTable } from '@/src/db/schema';
import { and, eq } from 'drizzle-orm';
import { DonorRowData } from '@/types/donor';
import { DonorFormData } from '@/components/donor-form';
import { revalidatePath } from 'next/cache';

export async function addDonor(userId: string, formData: DonorFormData) {
  const result = await db
    .insert(donorsTable)
    .values({
      userId: userId,
      name: formData.name,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      address: formData.address,
      notes: formData.notes,
    })
    .returning();

  revalidatePath('/dashboard/donors');

  return result;
}

export async function editDonor(
  userId: string,
  donorId: string,
  formData: DonorFormData,
) {
  const result = await db
    .update(donorsTable)
    .set({
      name: formData.name,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      address: formData.address,
      notes: formData.notes,
    })
    .where(and(eq(donorsTable.userId, userId), eq(donorsTable.id, donorId)))
    .returning();

  revalidatePath('/dashboard/donors');

  return result;
}

export async function deleteDonor(userId: string, donorId: string) {
  await db
    .delete(donorsTable)
    .where(and(eq(donorsTable.userId, userId), eq(donorsTable.id, donorId)));

  revalidatePath('/dashboard/donors');
}

export async function getAllDonors(userId: string): Promise<DonorRowData[]> {
  const donors = await db
    .select()
    .from(donorsTable)
    .where(eq(donorsTable.userId, userId));

  return donors;
}
