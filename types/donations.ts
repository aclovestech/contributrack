import { donationsTable } from '@/src/db/schema';
import { Donor } from '@/types/donor';
import { DONATION_TYPES } from '@/lib/validation';

export type Donation = typeof donationsTable.$inferSelect & {
  donorId: Donor['id'] | null;
  donorName: Donor['name'] | null;
};

export type DonationRowData = {
  id: string;
  donorName: string;
  donorId: string | null;
  dateReceived: string;
  amount: string;
  donationType: (typeof DONATION_TYPES)[number];
};

export type ReportRowData = Pick<DonationRowData, 'donorName'> & {
  amount: number;
};

export { DONATION_TYPES };
