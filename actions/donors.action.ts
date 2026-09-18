'use server';

import { and, asc, eq, isNotNull, isNull } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

import { requireCurrentUserId } from '@/lib/auth';
import { isUniqueViolation } from '@/lib/db-errors';
import { normalizeDonorInput, uuidSchema } from '@/lib/validation';
import { db } from '@/src/db';
import { donorsTable } from '@/src/db/schema';
import { DonorOption, DonorRowData } from '@/types/donor';

function revalidateDonorViews() {
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/donors');
  revalidatePath('/dashboard/donations');
  revalidatePath('/dashboard/reports');
}

/** Create a donor for the authenticated StackAuth account. */
export async function addDonor(input: unknown): Promise<DonorRowData> {
  const userId = await requireCurrentUserId();
  const donor = normalizeDonorInput(input);

  let created;
  try {
    [created] = await db
      .insert(donorsTable)
      .values({ userId, ...donor })
      .returning({
        id: donorsTable.id,
        name: donorsTable.name,
        email: donorsTable.email,
        phoneNumber: donorsTable.phoneNumber,
        address: donorsTable.address,
        notes: donorsTable.notes,
      });
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw new Error('A donor with that name already exists.');
    }
    throw new Error('The donor could not be created.');
  }

  if (!created) {
    throw new Error('The donor could not be created.');
  }

  revalidateDonorViews();
  return created;
}

/** Update an account-owned donor, including one currently in the archive. */
export async function editDonor(
  donorId: string,
  input: unknown,
): Promise<DonorRowData> {
  const userId = await requireCurrentUserId();
  const id = uuidSchema.parse(donorId);
  const donor = normalizeDonorInput(input);

  let updated;
  try {
    [updated] = await db
      .update(donorsTable)
      .set({ ...donor, updatedAt: new Date() })
      .where(and(eq(donorsTable.id, id), eq(donorsTable.userId, userId)))
      .returning({
        id: donorsTable.id,
        name: donorsTable.name,
        email: donorsTable.email,
        phoneNumber: donorsTable.phoneNumber,
        address: donorsTable.address,
        notes: donorsTable.notes,
      });
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw new Error('A donor with that name already exists.');
    }
    throw new Error('The donor could not be updated.');
  }

  if (!updated) {
    throw new Error('Donor not found or no longer available.');
  }

  revalidateDonorViews();
  return updated;
}

/**
 * Archive a donor instead of deleting it. Existing donations remain intact and
 * continue to be included in totals; the donor is simply hidden from active
 * donor lists and new-donation selection.
 */
export async function archiveDonor(donorId: string) {
  const userId = await requireCurrentUserId();
  const id = uuidSchema.parse(donorId);

  let archived;
  try {
    [archived] = await db
      .update(donorsTable)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(
        and(
          eq(donorsTable.id, id),
          eq(donorsTable.userId, userId),
          isNull(donorsTable.deletedAt),
        ),
      )
      .returning({ id: donorsTable.id });
  } catch {
    throw new Error('The donor could not be archived.');
  }

  if (!archived) {
    throw new Error('Donor not found or already archived.');
  }

  revalidateDonorViews();
}

/** Restore an archived donor owned by the authenticated account. */
export async function restoreDonor(donorId: string) {
  const userId = await requireCurrentUserId();
  const id = uuidSchema.parse(donorId);

  let restored;
  try {
    [restored] = await db
      .update(donorsTable)
      .set({ deletedAt: null, updatedAt: new Date() })
      .where(and(eq(donorsTable.id, id), eq(donorsTable.userId, userId)))
      .returning({ id: donorsTable.id });
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw new Error(
        'That donor cannot be restored while another active donor has the same name.',
      );
    }
    throw new Error('The donor could not be restored.');
  }

  if (!restored) {
    throw new Error('Donor not found.');
  }

  revalidateDonorViews();
}

/** Return account-owned donors, optionally limited to archived records. */
export async function getAllDonors(
  includeArchived = false,
): Promise<DonorRowData[]> {
  const userId = await requireCurrentUserId();
  const visibility = includeArchived
    ? isNotNull(donorsTable.deletedAt)
    : isNull(donorsTable.deletedAt);

  return db
    .select({
      id: donorsTable.id,
      name: donorsTable.name,
      email: donorsTable.email,
      phoneNumber: donorsTable.phoneNumber,
      address: donorsTable.address,
      notes: donorsTable.notes,
    })
    .from(donorsTable)
    .where(and(eq(donorsTable.userId, userId), visibility))
    .orderBy(asc(donorsTable.name));
}

/** Return only the id/name pair needed by the donation form. */
export async function getDonorsForSelection(): Promise<DonorOption[]> {
  const userId = await requireCurrentUserId();

  return db
    .select({ id: donorsTable.id, name: donorsTable.name })
    .from(donorsTable)
    .where(and(eq(donorsTable.userId, userId), isNull(donorsTable.deletedAt)))
    .orderBy(asc(donorsTable.name));
}

// Kept as a small compatibility helper for any existing client code while the
// UI migrates to id/name donor options. It remains account-scoped server-side.
export async function getDonorNames(): Promise<string[]> {
  const donors = await getDonorsForSelection();
  return donors.map((donor) => donor.name);
}
