# Donation types and annual reporting

Status: implementation authorized in chat, November 6, 2026; production
application requires separate approval.

## Intended behavior

- Add “Kingdom Builders” to donation entry and editing, stored as
  `kingdom_builders`.
- Add an “All donation types” / individual type selector to the donations page.
  Filter records and the range summary together on the server. Preserve the
  selection when changing dates or switching between active and archived
  records. Clearing the type returns to all types.
- Separate the annual report on screen and in the generated PDF into sections by
  donation type, with donor totals inside each section, a subtotal per type, and
  a grand total. Omit empty sections. Keep the weekly summary unchanged.

## Approach

Recommended: extend the existing enum, validated server query, and annual donor
summary. Preserve the existing Next.js, Drizzle, PostgreSQL, and pdfmake
implementation. Separate sections make the requested type separation explicit
while preserving the annual donor reconciliation workflow.

Alternative: one wide donor table with a column per type. This makes comparing a
donor's types easier, but crowds the portrait PDF and requires more layout
changes. Separate PDF files per type would require multiple exports and lose the
single report's grand total.

The section layout is the selected implementation approach.

## Data and migration plan

The current PostgreSQL `donation_type` enum contains `tithes`, `daily_seed`,
`mission_offering`, and `other`. The proposed forward migration after 0004 adds
only `kingdom_builders` using `ALTER TYPE ... ADD VALUE`. It does not rewrite
donations or their donor relationships.

Historical migrations 0000–0004 remain unchanged. Preserve the known production
0002 hash mismatch; do not rewrite its recorded hash or historical journal
entries. Any new migration metadata must only append the new migration.

The owner authorized preparing the migration in chat. Before applying it to
production, review the live schema through explicitly authorized read-only
access, verify a current backup, test on a restored non-production database
where practical, and obtain separate owner approval immediately before
application. No production database access or writes are authorized by this
proposal. Migration execution remains separate from build and start.

Apply the enum addition before deploying code that accepts the new value. If
application rollback is necessary, leave the added enum value and recorded
donations intact; do not remove the value or convert donation types.

## Correctness and validation

Keep authentication and account predicates on server queries, exclude archived
donations from reports, and retain unassigned historical donations. Group annual
totals by donor and donation type. Use integer-cent aggregation for section and
grand totals.

Verify acceptance of the new type, rejection of invalid types, filter behavior
alongside date/archive selection, and annual PDF sections with mixed types,
unassigned donors, empty data, and exact totals. Run lint, typecheck, focused
tests, formatting checks, and a production build with development configuration
if available. No migrations run as part of these checks.
