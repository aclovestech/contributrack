'use server';

import { db } from '@/src/db';
import { donationsTable, donorsTable } from '@/src/db/schema';
import { DonationRowData } from '@/types/donations';
import { and, desc, eq, gte, lt } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function addDonation() {}

export async function editDonation() {}

export async function deleteDonation() {}

export async function getAllDonations(
  userId: string,
  startDate: Date,
  endDate: Date,
): Promise<DonationRowData[]> {
  const donations = await db
    .select({
      id: donationsTable.id,
      donorName: donorsTable.name,
      donorId: donorsTable.id,
      dateReceived: donationsTable.dateReceived,
      donationType: donationsTable.donationType,
      amount: donationsTable.amount,
    })
    .from(donationsTable)
    .where(
      and(
        eq(donationsTable.userId, userId),
        gte(donationsTable.dateReceived, startDate),
        lt(donationsTable.dateReceived, endDate),
      ),
    )
    .orderBy(desc(donationsTable.dateReceived))
    .innerJoin(donorsTable, eq(donationsTable.donorId, donorsTable.id));

  return donations;
}

export async function getLatestDonationDateRange() {
  let startDate = new Date();
  let endDate = new Date();

  const latestDateReceived = await db
    .select({ year: donationsTable.dateReceived })
    .from(donationsTable)
    .limit(1)
    .orderBy(desc(donationsTable.dateReceived));

  const year = latestDateReceived[0].year.getFullYear();

  startDate = new Date(year, 0, 1);
  endDate = new Date(year, 12, 31);

  return { startDate, endDate };
}
