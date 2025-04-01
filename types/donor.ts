import { donorsTable } from '@/src/db/schema';

export type Donor = typeof donorsTable.$inferSelect;
export type DonorColumns = Pick<
  Donor,
  'id' | 'name' | 'email' | 'phoneNumber' | 'address' | 'notes'
>;
export type DonorName = Pick<Donor, 'name'>;
