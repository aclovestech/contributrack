'use server';

import { and, asc, desc, eq, gte, isNull, lte, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

import { requireCurrentUserId } from '@/lib/auth';
import { isUniqueViolation } from '@/lib/db-errors';
import {
  dateRangeSchema,
  normalizeDonationInput,
  uuidSchema,
} from '@/lib/validation';
import { getMonthName } from '@/lib/utils';
import { db } from '@/src/db';
import { donationsTable, donorsTable } from '@/src/db/schema';
import { DonationRowData, ReportRowData } from '@/types/donations';

const unassignedDonorName = 'Unassigned donor';

function revalidateDonationViews() {
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/donations');
  revalidatePath('/dashboard/reports');
}

function yearBounds(year: number) {
  if (!Number.isInteger(year) || year < 1900 || year > 2200) {
    throw new Error('Invalid report year.');
  }

  return {
    startDate: `${year}-01-01`,
    endDate: `${year}-12-31`,
  };
}

async function ensureOwnedDonor(userId: string, donorId: string | null) {
  if (donorId === null) return;

  const id = uuidSchema.parse(donorId);
  const [donor] = await db
    .select({ id: donorsTable.id })
    .from(donorsTable)
    .where(
      and(
        eq(donorsTable.id, id),
        eq(donorsTable.userId, userId),
        isNull(donorsTable.deletedAt),
      ),
    )
    .limit(1);

  if (!donor) {
    throw new Error('Select an active donor from your account.');
  }
}

/** Create an active donation for the authenticated account. */
export async function addDonation(donorId: string, input: unknown) {
  const userId = await requireCurrentUserId();
  const id = uuidSchema.parse(donorId);
  const donation = normalizeDonationInput(input);

  await ensureOwnedDonor(userId, id);

  let created;
  try {
    [created] = await db
      .insert(donationsTable)
      .values({ userId, donorId: id, ...donation })
      .returning();
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw new Error(
        'The donation could not be saved because it already exists.',
      );
    }
    throw new Error('The donation could not be created.');
  }

  if (!created) {
    throw new Error('The donation could not be created.');
  }

  revalidateDonationViews();
  return created;
}

/** Update an active donation while enforcing both record and donor ownership. */
export async function editDonation(
  donationId: string,
  donorId: string | null,
  input: unknown,
) {
  const userId = await requireCurrentUserId();
  const id = uuidSchema.parse(donationId);
  const donation = normalizeDonationInput(input);

  const donor = donorId === null ? null : uuidSchema.parse(donorId);
  await ensureOwnedDonor(userId, donor);

  const [updated] = await db
    .update(donationsTable)
    .set({ donorId: donor, ...donation, updatedAt: new Date() })
    .where(
      and(
        eq(donationsTable.id, id),
        eq(donationsTable.userId, userId),
        isNull(donationsTable.deletedAt),
      ),
    )
    .returning();

  if (!updated) {
    throw new Error('Donation not found or no longer available.');
  }

  revalidateDonationViews();
  return updated;
}

/** Archive a donation without deleting the historical row. */
export async function archiveDonation(donationId: string) {
  const userId = await requireCurrentUserId();
  const id = uuidSchema.parse(donationId);

  const [archived] = await db
    .update(donationsTable)
    .set({ deletedAt: new Date(), updatedAt: new Date() })
    .where(
      and(
        eq(donationsTable.id, id),
        eq(donationsTable.userId, userId),
        isNull(donationsTable.deletedAt),
      ),
    )
    .returning({ id: donationsTable.id });

  if (!archived) {
    throw new Error('Donation not found or already archived.');
  }

  revalidateDonationViews();
}

/** Restore an archived donation owned by the authenticated account. */
export async function restoreDonation(donationId: string) {
  const userId = await requireCurrentUserId();
  const id = uuidSchema.parse(donationId);

  const [restored] = await db
    .update(donationsTable)
    .set({ deletedAt: null, updatedAt: new Date() })
    .where(and(eq(donationsTable.id, id), eq(donationsTable.userId, userId)))
    .returning({ id: donationsTable.id });

  if (!restored) {
    throw new Error('Donation not found.');
  }

  revalidateDonationViews();
}

function activeDonationPredicate(userId: string) {
  return and(
    eq(donationsTable.userId, userId),
    isNull(donationsTable.deletedAt),
  );
}

async function resolveDateRange(
  userId: string,
  startDate?: string,
  endDate?: string,
) {
  if (startDate && endDate) {
    const parsed = dateRangeSchema.safeParse({ startDate, endDate });
    if (!parsed.success) {
      throw new Error(parsed.error.issues[0]?.message ?? 'Invalid date range.');
    }
    return parsed.data;
  }

  const [latest] = await db
    .select({ dateReceived: donationsTable.dateReceived })
    .from(donationsTable)
    .where(activeDonationPredicate(userId))
    .orderBy(desc(donationsTable.dateReceived))
    .limit(1);

  if (!latest) return null;

  const year = latest.dateReceived.slice(0, 4);
  return {
    startDate: `${year}-01-01`,
    endDate: `${year}-12-31`,
  };
}

/**
 * Return active donations for an account. The left join intentionally keeps
 * historical rows whose donor relation is null and labels them unassigned.
 * The donor ownership predicate prevents a malformed/cross-account donor id
 * from leaking another account's name.
 */
export async function getAllDonationsWithinRange(
  startDate?: string,
  endDate?: string,
): Promise<DonationRowData[]> {
  const userId = await requireCurrentUserId();
  const range = await resolveDateRange(userId, startDate, endDate);

  if (!range) return [];

  const donorName = sql<string>`COALESCE(${donorsTable.name}, ${unassignedDonorName})`;

  return db
    .select({
      id: donationsTable.id,
      donorName,
      donorId: donationsTable.donorId,
      dateReceived: donationsTable.dateReceived,
      donationType: donationsTable.donationType,
      amount: donationsTable.amount,
    })
    .from(donationsTable)
    .leftJoin(
      donorsTable,
      and(
        eq(donationsTable.donorId, donorsTable.id),
        eq(donorsTable.userId, userId),
      ),
    )
    .where(
      and(
        activeDonationPredicate(userId),
        gte(donationsTable.dateReceived, range.startDate),
        lte(donationsTable.dateReceived, range.endDate),
      ),
    )
    .orderBy(desc(donationsTable.dateReceived), asc(donorName));
}

async function aggregateForYear(
  userId: string,
  year: number,
  aggregate: 'sum' | 'count' | 'avg',
) {
  const { startDate, endDate } = yearBounds(year);
  const expression =
    aggregate === 'count'
      ? sql<number>`COUNT(${donationsTable.id})`
      : aggregate === 'avg'
        ? sql<number>`AVG(${donationsTable.amount})`
        : sql<number>`SUM(${donationsTable.amount})`;

  const [result] = await db
    .select({ total: expression.mapWith(Number) })
    .from(donationsTable)
    .where(
      and(
        activeDonationPredicate(userId),
        gte(donationsTable.dateReceived, startDate),
        lte(donationsTable.dateReceived, endDate),
      ),
    );

  return result?.total ?? 0;
}

export async function getTotalDonationsYtd() {
  const userId = await requireCurrentUserId();
  const currentYear = new Date().getFullYear();

  return {
    currentYear: await aggregateForYear(userId, currentYear, 'sum'),
    previousYear: await aggregateForYear(userId, currentYear - 1, 'sum'),
  };
}

export async function getTotalDonationCountYtd() {
  const userId = await requireCurrentUserId();
  const currentYear = new Date().getFullYear();

  return {
    currentYear: await aggregateForYear(userId, currentYear, 'count'),
    previousYear: await aggregateForYear(userId, currentYear - 1, 'count'),
  };
}

export async function getAverageDonationYtd() {
  const userId = await requireCurrentUserId();
  const currentYear = new Date().getFullYear();

  return {
    currentYear: await aggregateForYear(userId, currentYear, 'avg'),
    previousYear: await aggregateForYear(userId, currentYear - 1, 'avg'),
  };
}

export async function getTopDonorYtd() {
  const userId = await requireCurrentUserId();
  const { startDate, endDate } = yearBounds(new Date().getFullYear());

  const [topDonor] = await db
    .select({
      name: donorsTable.name,
      amount: sql<number>`SUM(${donationsTable.amount})`.mapWith(Number),
    })
    .from(donationsTable)
    .innerJoin(
      donorsTable,
      and(
        eq(donorsTable.id, donationsTable.donorId),
        eq(donorsTable.userId, userId),
      ),
    )
    .where(
      and(
        activeDonationPredicate(userId),
        gte(donationsTable.dateReceived, startDate),
        lte(donationsTable.dateReceived, endDate),
      ),
    )
    .groupBy(donationsTable.donorId, donorsTable.name)
    .orderBy(desc(sql`SUM(${donationsTable.amount})`))
    .limit(1);

  return topDonor ?? null;
}

export async function getTotalDonationsPerMonthYTD() {
  const userId = await requireCurrentUserId();
  const currentYear = new Date().getFullYear();
  const { startDate, endDate } = yearBounds(currentYear);
  const allMonths = Array.from({ length: 12 }, (_, index) => index + 1);

  const result = await db
    .select({
      month:
        sql<number>`EXTRACT(MONTH FROM ${donationsTable.dateReceived})`.mapWith(
          Number,
        ),
      totalAmount: sql<number>`SUM(${donationsTable.amount})`.mapWith(Number),
    })
    .from(donationsTable)
    .where(
      and(
        activeDonationPredicate(userId),
        gte(donationsTable.dateReceived, startDate),
        lte(donationsTable.dateReceived, endDate),
      ),
    )
    .groupBy(sql`EXTRACT(MONTH FROM ${donationsTable.dateReceived})`)
    .orderBy(sql`EXTRACT(MONTH FROM ${donationsTable.dateReceived})`);

  return allMonths.map((month) => ({
    month: getMonthName(month),
    totalAmount: result.find((item) => item.month === month)?.totalAmount ?? 0,
  }));
}

export async function getAllPossibleDonationYears() {
  const userId = await requireCurrentUserId();

  const result = await db
    .select({
      year: sql<number>`DISTINCT EXTRACT(YEAR FROM ${donationsTable.dateReceived})`.mapWith(
        Number,
      ),
    })
    .from(donationsTable)
    .where(activeDonationPredicate(userId));

  return result.map((row) => row.year).sort((a, b) => b - a);
}

export async function getYearlyDonationsSummary(
  year: number,
): Promise<ReportRowData[]> {
  const userId = await requireCurrentUserId();
  const { startDate, endDate } = yearBounds(year);
  const donorName = sql<string>`COALESCE(${donorsTable.name}, ${unassignedDonorName})`;

  return db
    .select({
      donorName,
      amount: sql<number>`SUM(${donationsTable.amount})`.mapWith(Number),
    })
    .from(donationsTable)
    .leftJoin(
      donorsTable,
      and(
        eq(donationsTable.donorId, donorsTable.id),
        eq(donorsTable.userId, userId),
      ),
    )
    .where(
      and(
        activeDonationPredicate(userId),
        gte(donationsTable.dateReceived, startDate),
        lte(donationsTable.dateReceived, endDate),
      ),
    )
    .groupBy(donorName)
    .orderBy(asc(donorName));
}
