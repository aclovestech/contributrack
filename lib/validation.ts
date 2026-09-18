import { z } from 'zod';

export const DONATION_TYPES = [
  'tithes',
  'daily_seed',
  'mission_offering',
  'other',
] as const;

export const donationTypeSchema = z.enum(DONATION_TYPES, {
  error: 'Donation type is required',
});

const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;

function isValidIsoDate(value: string) {
  if (!isoDatePattern.test(value)) return false;

  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export const dateSchema = z
  .string({ error: 'Date is required' })
  .refine(isValidIsoDate, 'Enter a valid date.');

export const donorFormSchema = z.object({
  name: z
    .string({ error: 'Donor name is required' })
    .trim()
    .min(1, 'Donor name is required')
    .max(100, 'Donor name must be 100 characters or fewer.'),
  email: z
    .string()
    .trim()
    .email('Enter a valid email address.')
    .max(254, 'Email must be 254 characters or fewer.')
    .or(z.literal('')),
  phoneNumber: z
    .string()
    .trim()
    .max(20, 'Phone number must be 20 characters or fewer.')
    .or(z.literal('')),
  address: z
    .string()
    .trim()
    .max(200, 'Address must be 200 characters or fewer.')
    .or(z.literal('')),
  notes: z
    .string()
    .trim()
    .max(1000, 'Notes must be 1,000 characters or fewer.')
    .or(z.literal('')),
});

export type DonorFormData = z.infer<typeof donorFormSchema>;

export type NormalizedDonorData = Omit<
  DonorFormData,
  'email' | 'phoneNumber' | 'address' | 'notes'
> & {
  email: string | null;
  phoneNumber: string | null;
  address: string | null;
  notes: string | null;
};

export function normalizeDonorInput(input: unknown): NormalizedDonorData {
  const data = donorFormSchema.parse(input);

  return {
    ...data,
    email: data.email || null,
    phoneNumber: data.phoneNumber || null,
    address: data.address || null,
    notes: data.notes || null,
  };
}

const MAX_DONATION_CENTS = 9_999_999_999;

function isPersistableDonationAmount(value: number) {
  const cents = Math.round(value * 100);
  return cents >= 1 && cents <= MAX_DONATION_CENTS;
}

export const donationFormSchema = z.object({
  dateReceived: dateSchema,
  amount: z
    .number({ error: 'Enter a donation amount.' })
    .finite('Enter a valid donation amount.')
    .positive('Amount must be greater than zero.')
    .max(99_999_999.99, 'Amount is too large.')
    .refine(isPersistableDonationAmount, {
      message: 'Amount must be between $0.01 and $99,999,999.99.',
    }),
  donationType: donationTypeSchema,
});

export type DonationFormData = z.infer<typeof donationFormSchema>;

export function normalizeDonationInput(input: unknown) {
  const data = donationFormSchema.parse(input);

  return {
    ...data,
    // PostgreSQL numeric values are stored as strings by node-postgres. Round
    // at the cent boundary before formatting so binary floating point noise
    // cannot change a persisted amount.
    amount: (Math.round(data.amount * 100) / 100).toFixed(2),
  };
}

export const uuidSchema = z.string().uuid('Invalid record identifier.');

export const dateRangeSchema = z
  .object({
    startDate: dateSchema,
    endDate: dateSchema,
  })
  .refine(({ startDate, endDate }) => startDate <= endDate, {
    message: 'Start date cannot be after end date.',
    path: ['endDate'],
  });
