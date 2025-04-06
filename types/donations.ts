import { donationsTable, donationTypeEnum } from '@/src/db/schema';
import { Donor } from '@/types/donor';

export type Donation = typeof donationsTable.$inferSelect & {
  donorId: Donor['id'];
  donorName: Donor['name'];
};
export type DonationRowData = Pick<
  Donation,
  'id' | 'donorName' | 'donorId' | 'dateReceived' | 'amount' | 'donationType'
>;

export type ReportRowData = Pick<DonationRowData, 'donorName'> & {
  amount: number;
};

export const DONATION_TYPES = donationTypeEnum.enumValues;
