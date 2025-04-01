'use server';

import { db } from '@/src/db';
import { donorsTable } from '@/src/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { DonorColumns } from '@/types/donor';

export async function addDonor() {}

export async function deleteDonor() {}

export async function editDonor() {}

export async function getAllDonors(userId: string): Promise<DonorColumns[]> {
  const donors = await db
    .select()
    .from(donorsTable)
    .where(eq(donorsTable.userId, userId));

  return donors;
}
