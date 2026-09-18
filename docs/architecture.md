# Architecture

ContribuTrack uses the Next.js App Router with TypeScript, React, Tailwind,
shadcn/ui primitives, StackAuth, Drizzle ORM, and PostgreSQL. Authenticated
routes live under `app/(authenticated)/dashboard`; server actions in `actions/`
perform account-scoped reads and writes; reusable UI lives in `components/`.

The target shape keeps this stack and makes the boundaries explicit:

- Server pages load data through server-side query/action functions.
- A single authentication helper resolves the current StackAuth user and is the
  only source of account authority for database operations.
- Query helpers apply the active-record and ownership predicates consistently.
- Form schemas are shared as pure validation modules and are enforced again on
  the server.
- The authenticated dashboard is explicitly dynamic, and the database client is
  marked server-only so account-scoped data and database code cannot be reused
  through a framework cache or accidentally bundled into browser code.
- Donation totals use decimal-safe normalization and the same active-record
  rules for cards, tables, annual and weekly reports, charts, and PDFs.
- The StackAuth webhook is signature-verified, bounded to a small JSON payload,
  and returns generic mutation failures without exposing database details.
- `deleted_at` is used for reversible archive/restore behavior; no historical
  migration is rewritten.

The application remains a single deployable Next.js service. Database migrations
are a separate reviewed operational action, never an implicit part of `build` or
`start`.
