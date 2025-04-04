'use server';

import { db } from '@/src/db';
import { donationsTable, donorsTable } from '@/src/db/schema';
import { DonationRowData } from '@/types/donations';
import { and, desc, eq, gt, gte, lt, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function addDonation() {}

export async function editDonation() {}

export async function deleteDonation() {}

export async function getAllDonations(
  userId: string,
  startDate?: string,
  endDate?: string,
): Promise<DonationRowData[]> {
  if (!startDate || !endDate) {
    const latestDateReceived = await db
      .select({
        year: sql<number>`EXTRACT(YEAR FROM ${donationsTable.dateReceived})`,
      })
      .from(donationsTable)
      .limit(1)
      .orderBy(desc(donationsTable.dateReceived));

    const year = latestDateReceived[0].year;

    startDate = `${year}-01-01`;
    endDate = `${year}-12-31`;

    console.log(startDate, endDate);
  }

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

export async function getLatestAndOldestDates(userId: string) {
  const result = await db
    .select({
      oldest: sql<Date>`MIN(${donationsTable.dateReceived})`,
      latest: sql<Date>`MAX(${donationsTable.dateReceived})`,
    })
    .from(donationsTable)
    .where(eq(donationsTable.userId, userId));

  return {
    oldest: new Date(result[0].oldest),
    latest: new Date(result[0].latest),
  };
}
