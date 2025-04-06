import { pgEnum, pgTable as table } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';

export const donationTypeEnum = pgEnum('donation_type', [
  'tithes',
  'daily_seed',
  'mission_offering',
  'other',
]);

const timestamps = {
  updatedAt: t.timestamp('updated_at', { withTimezone: true }),
  createdAt: t.timestamp('created_at', { withTimezone: true }).defaultNow(),
  deletedAt: t.timestamp('deleted_at', { withTimezone: true }),
};

export const usersTable = table('users', {
  id: t.uuid().defaultRandom().primaryKey(),
});

export const donorsTable = table(
  'donors',
  {
    id: t.uuid().defaultRandom().primaryKey(),
    name: t.varchar({ length: 100 }).notNull(),
    email: t.varchar({ length: 254 }),
    phoneNumber: t.varchar('phone_number', { length: 20 }),
    address: t.varchar({ length: 200 }),
    notes: t.varchar({ length: 1000 }),
    userId: t
      .uuid('user_id')
      .references(() => usersTable.id, { onDelete: 'set null' }),
    ...timestamps,
  },
  (table) => ({
    donorNameUniquePerUser: t
      .unique('donor_name_unique_per_user')
      .on(table.name, table.userId),
  }),
);

export const donationsTable = table('donations', {
  id: t.uuid().defaultRandom().primaryKey(),
  dateReceived: t.date('date_received', { mode: 'string' }).notNull(),
  amount: t.numeric({ precision: 10, scale: 2 }).notNull(),
  donationType: donationTypeEnum().notNull(),
  donorId: t
    .uuid('donor_id')
    .references(() => donorsTable.id, { onDelete: 'set null' }),
  userId: t
    .uuid('user_id')
    .references(() => usersTable.id, { onDelete: 'set null' }),
  ...timestamps,
});
