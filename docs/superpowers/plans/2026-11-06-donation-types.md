# Donation Types Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this
> plan task-by-task.

**Goal:** Add Kingdom Builders, donation type filtering, and annual report
sections by type.

**Architecture:** Extend the existing enum and validation list. Apply the
optional type predicate to the account-scoped donations query. Share report
section grouping between the annual page and PDF.

**Tech Stack:** Next.js, PostgreSQL, Drizzle, pdfmake, node:test.

**Spec:** `docs/donation-types-design.md`

## Global Constraints

- Historical migrations 0000–0004 remain unchanged.
- No database connections, migration execution, production writes, or
  deployment.
- Preserve account predicates, archived donation exclusion, and unassigned
  donations.
- Keep the weekly summary unchanged.

## Review Focus

- Invalid type query parameters must not reach PostgreSQL as enum values.
- Changing dates or archive view must preserve the selected type.
- Empty type sections must be omitted; an empty PDF must remain readable.
- A donor appearing in multiple types must have independent section totals.
- Section and grand totals must use cent arithmetic and include unassigned
  donations.

### Task 1: Donation type and filter

**Files:** `lib/validation.ts`, `src/db/schema.ts`,
`actions/donations.action.ts`, `components/custom-date-range-picker.tsx`,
`components/donation-type-filter.tsx`,
`app/(authenticated)/dashboard/donations/page.tsx`,
`tests/business-logic.test.ts`, new migration and metadata.

**Interfaces:**
`getAllDonationsWithinRange(startDate?, endDate?, includeArchived?, donationType?)`;
type uses `DonationRowData['donationType']`.

- [x] Write and run failing validation test accepting `kingdom_builders` while
      rejecting unknown types.
- [x] Extend enum and validation; generate and review an append-only migration
      with Drizzle.
- [x] Add a server type predicate and URL-based type selector. Preserve URL
      filters in date and archive navigation.
- [x] Run tests and typecheck. Review URL preservation and invalid type parsing.

### Task 2: Annual report sections

**Files:** `types/donations.ts`, `lib/reporting.ts`,
`actions/donations.action.ts`, `lib/pdf-generator.ts`,
`app/(authenticated)/dashboard/reports/page.tsx`,
`tests/business-logic.test.ts`.

**Interfaces:** `ReportRowData` gains `donationType`;
`groupReportByDonationType(rows)` returns ordered nonempty sections with
`donationType`, `rows`, and `total`.

- [x] Write and run failing tests for independent type sections, cent totals,
      empty data, unassigned donors, and PDF subtotals/grand total.
- [x] Group annual SQL by donor name and donation type, preserving
      account/year/archive predicates.
- [x] Render matching sections and subtotals in the annual page and PDF,
      retaining the grand total and weekly summary.
- [x] Run full tests, lint, typecheck, formatting checks, and build if local
      configuration permits. Review the complete diff and document release
      commands and environment requirements.

## Verification record

- All 11 tests passed under bundled Node 24.22.1 using
  `node --import tsx --test tests/**/*.test.ts`.
- ESLint and TypeScript checks passed under Node 24.22.1; full repository
  Prettier check passed.
- Drizzle generated migration 0005 without a database connection. SQL and
  snapshot reviewed: only the enum value is added, with snapshot ancestry
  preserved.
- Independent code review: no actionable findings.
- A sample PDF with two types, the same donor in both, an unassigned donor, and
  fractional amounts rendered cleanly; inspected its PNG.
- Production build passed under Node 24.22.1 using the placeholder configuration
  from the validation workflow present at the time. No authenticated browser or
  database integration checks were performed.
- The owner reported successfully applying migration 0005 and authorized release
  to canonical `main`. The owner will verify Coolify configuration and live
  behavior manually. The agent did not access or modify the database.
- After the feature merge, the owner requested removal of the unused GitHub
  Actions validation workflow. Local validation scripts remain available.
