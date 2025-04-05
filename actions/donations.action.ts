'use server';

import { DonationFormData } from '@/components/donation-form';
import { db } from '@/src/db';
import { donationsTable, donorsTable } from '@/src/db/schema';
import { DonationRowData } from '@/types/donations';
import { and, desc, eq, gte, lte, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { number } from 'zod';

export async function addDonation(
  userId: string,
  donorName: string,
  formData: DonationFormData,
) {
  const donor = await db
    .select({ id: donorsTable.id })
    .from(donorsTable)
    .where(
      and(eq(donorsTable.userId, userId), eq(donorsTable.name, donorName)),
    );

  if (!donor) return;

  const donation = await db
    .insert(donationsTable)
    .values({
      userId: userId,
      donorId: donor[0].id,
      dateReceived: formData.dateReceived,
      amount: formData.amount.toFixed(2),
      donationType: formData.donationType,
    })
    .returning();

  revalidatePath('/dashboard/donations');

  return donation;
}

export async function editDonation(
  userId: string,
  donorName: string,
  donationId: string,
  formData: DonationFormData,
) {
  const donor = await db
    .select({ id: donorsTable.id })
    .from(donorsTable)
    .where(
      and(eq(donorsTable.userId, userId), eq(donorsTable.name, donorName)),
    );

  if (!donor) return;

  const donation = await db
    .update(donationsTable)
    .set({
      donorId: donor[0].id,
      dateReceived: formData.dateReceived,
      amount: formData.amount.toFixed(2),
      donationType: formData.donationType,
    })
    .where(
      and(eq(donationsTable.userId, userId), eq(donationsTable.id, donationId)),
    )
    .returning();

  revalidatePath('/dashboard/donations');

  return donation;
}

export async function deleteDonation(userId: string, donationId: string) {
  await db
    .delete(donationsTable)
    .where(
      and(eq(donationsTable.userId, userId), eq(donationsTable.id, donationId)),
    );

  revalidatePath('/dashboard/donations');
}

export async function getAllDonationsWithinRange(
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
        lte(donationsTable.dateReceived, endDate),
      ),
    )
    .orderBy(desc(donationsTable.dateReceived))
    .innerJoin(donorsTable, eq(donationsTable.donorId, donorsTable.id));

  return donations;
}

export async function getTotalDonationsYtd(userId: string) {
  const currentYearToCheck = new Date().getFullYear();

  const currentYearResult = await db
    .select({
      total: sql<number>`SUM(${donationsTable.amount})`.mapWith(Number),
    })
    .from(donationsTable)
    .where(
      and(
        eq(donationsTable.userId, userId),
        and(
          gte(donationsTable.dateReceived, `${currentYearToCheck}-01-01`),
          lte(donationsTable.dateReceived, `${currentYearToCheck}-12-31`),
        ),
      ),
    );

  const previousYearResult = await db
    .select({
      total: sql<number>`SUM(${donationsTable.amount})`.mapWith(Number),
    })
    .from(donationsTable)
    .where(
      and(
        eq(donationsTable.userId, userId),
        and(
          gte(donationsTable.dateReceived, `${currentYearToCheck - 1}-01-01`),
          lte(donationsTable.dateReceived, `${currentYearToCheck - 1}-12-31`),
        ),
      ),
    );

  return {
    currentYear: currentYearResult[0].total || 0.0,
    previousYear: previousYearResult[0].total || 0.0,
  };
}

export async function getTotalDonationCountYtd(userId: string) {
  const currentYearToCheck = new Date().getFullYear();

  const currentYearResult = await db
    .select({
      total: sql<number>`COUNT(${donationsTable.id})`.mapWith(Number),
    })
    .from(donationsTable)
    .where(
      and(
        eq(donationsTable.userId, userId),
        and(
          gte(donationsTable.dateReceived, `${currentYearToCheck}-01-01`),
          lte(donationsTable.dateReceived, `${currentYearToCheck}-12-31`),
        ),
      ),
    );

  const previousYearResult = await db
    .select({
      total: sql<number>`COUNT(${donationsTable.id})`.mapWith(Number),
    })
    .from(donationsTable)
    .where(
      and(
        eq(donationsTable.userId, userId),
        and(
          gte(donationsTable.dateReceived, `${currentYearToCheck - 1}-01-01`),
          lte(donationsTable.dateReceived, `${currentYearToCheck - 1}-12-31`),
        ),
      ),
    );

  return {
    currentYear: currentYearResult[0].total || 0,
    previousYear: previousYearResult[0].total || 0,
  };
}

export async function getAverageDonationYtd(userId: string) {
  const currentYearToCheck = new Date().getFullYear();

  const currentYearResult = await db
    .select({
      total: sql<number>`AVG(${donationsTable.amount})`.mapWith(Number),
    })
    .from(donationsTable)
    .where(
      and(
        eq(donationsTable.userId, userId),
        and(
          gte(donationsTable.dateReceived, `${currentYearToCheck}-01-01`),
          lte(donationsTable.dateReceived, `${currentYearToCheck}-12-31`),
        ),
      ),
    );

  const previousYearResult = await db
    .select({
      total: sql<number>`AVG(${donationsTable.amount})`.mapWith(Number),
    })
    .from(donationsTable)
    .where(
      and(
        eq(donationsTable.userId, userId),
        and(
          gte(donationsTable.dateReceived, `${currentYearToCheck - 1}-01-01`),
          lte(donationsTable.dateReceived, `${currentYearToCheck - 1}-12-31`),
        ),
      ),
    );

  return {
    currentYear: currentYearResult[0].total || 0.0,
    previousYear: previousYearResult[0].total || 0.0,
  };
}
