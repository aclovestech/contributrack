import { pgEnum, pgTable as table } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';

export const donationTypeEnum = pgEnum('donation_type', [
  'tithes',
  'daily_seed',
  'mission_offering',
  'other',
]);

const timestamps = {
  updated_at: t.timestamp({ withTimezone: true }),
  created_at: t.timestamp({ withTimezone: true }).defaultNow().notNull(),
  deleted_at: t.timestamp({ withTimezone: true }),
};

export const usersTable = table('users', {
  id: t.uuid().defaultRandom().primaryKey(),
});

export const donorsTable = table('donors', {
  id: t.uuid().defaultRandom().primaryKey(),
  name: t.varchar({ length: 100 }).notNull(),
  email: t.varchar({ length: 254 }),
  phoneNumber: t.varchar('phone_number', { length: 20 }),
  address: t.varchar({ length: 200 }),
  notes: t.varchar({ length: 1000 }),
  userId: t
    .uuid('user_id')
    .notNull()
    .references(() => usersTable.id),
  ...timestamps,
});

export const donationsTable = table('donations', {
  id: t.uuid().defaultRandom().primaryKey(),
  dateReceived: t.timestamp('date_received', { withTimezone: true }).notNull(),
  amount: t.numeric({ precision: 10, scale: 2 }).notNull(),
  donationType: donationTypeEnum().notNull(),
  donorId: t
    .uuid('donor_id')
    .notNull()
    .references(() => donorsTable.id),
  userId: t
    .uuid('user_id')
    .notNull()
    .references(() => usersTable.id),
  ...timestamps,
});
