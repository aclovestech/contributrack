import { donationsTable, donationTypeEnum } from '@/src/db/schema';
import { DonorName } from '@/types/donor';

export type DonationWithDonor = typeof donationsTable.$inferSelect & {
  donorName: DonorName['name'];
};
export type DonationColumn = Pick<
  DonationWithDonor,
  'donorName' | 'dateReceived' | 'amount' | 'donationType'
>;

export const DONATION_TYPES = donationTypeEnum.enumValues;
