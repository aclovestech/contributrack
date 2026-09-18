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
- Donation totals use decimal-safe normalization and the same active-record
  rules for cards, tables, reports, charts, and PDFs.
- `deleted_at` is used for reversible archive/restore behavior; no historical
  migration is rewritten.

The application remains a single deployable Next.js service. Database migrations
are a separate reviewed operational action, never an implicit part of `build` or
`start`.
