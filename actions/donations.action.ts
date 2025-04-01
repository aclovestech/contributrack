'use server';

import { db } from '@/src/db';
import { donationsTable } from '@/src/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function addDonation() {}

export async function deleteDonation() {}

export async function editDonation() {}
