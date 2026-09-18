# ContribuTrack agent guide

ContribuTrack is a small Next.js donation-management application for one primary
church administrator. Keep the product simple, readable, and forgiving. The
routine workflows are finding or creating a donor, recording or correcting a
donation, reviewing records, and producing annual donor totals for comparison
with the administrator's own calculations.

## Source and data baseline

- The rebuild baseline is `release/v1.0.0` (currently worked on in a dedicated
  `codex/rebuild/*` branch until it is validated).
- PostgreSQL production data is real and must be preserved.
- Drizzle migrations `0000` through `0004` are historical records. Never edit,
  reorder, regenerate, or replace them. Add only forward migrations after a
  reviewed plan and explicit production approval.
- Production migration 0002 has a known hash mismatch in
  `drizzle.__drizzle_migrations`; document it, but never rewrite the journal to
  make the hash match.
- Some production donations have `donor_id = NULL` because the historical donor
  relationship was nulled. Preserve those donations and represent them as an
  unassigned donor in the application. Do not infer or invent a donor.

## Safety rules

- Never run migrations, destructive SQL, data repair, or production writes from
  a normal development command.
- Production migrations must be explicitly reviewed, tested against a restored
  non-production database where practical, preceded by a verified current
  backup, and approved by the project owner immediately before application.
- Keep migration execution separate from `build` and `start`; deployment must
  not silently change the database.
- Authentication and ownership are server responsibilities. Never accept a
  client-supplied account/user id as authority for a database operation.
- Keep StackAuth, PostgreSQL, Drizzle, pdfmake, and Nixpacks unless evidence and
  an approved plan justify a change.
- Do not commit secrets, `.env` files, donor personal information, database
  URLs, or StackAuth keys.

## Development conventions

- Use the App Router and server components by default. Add client components
  only for interaction.
- Keep database access in server-side modules and scope every query by the
  authenticated account. Exclude archived records from active lists, totals, and
  reports.
- Prefer archival (`deleted_at`) over hard deletion. User-facing language should
  say “Archive” or “Restore”; users should not need to know the term soft
  delete.
- Preserve report correctness and the donor-total PDF workflow.
- Use focused tests for money/date calculations, report totals, ownership
  predicates, webhook idempotency, and data transformations. Avoid tests that
  merely duplicate framework or component-library behavior.
- Use Conventional Commits. Keep commits small and logically scoped. Validate
  before merging into `main`; `main` is production-affecting even though the
  current Coolify configuration points at `latest`.

## Useful commands

```bash
pnpm install --frozen-lockfile
pnpm dev
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

`DATABASE_URL`, StackAuth configuration, and other environment variables are
required for the corresponding runtime paths. Use a local or restored test
database for development and tests; never point local tooling at production
unless a read-only investigation is explicitly required.

## Deployment context

The repository is deployed through Coolify/Nixpacks. The last known production
configuration used ref `latest` with commit setting `HEAD`; the historical
deployed SHA is unknown. Do not assume a push to `main` deploys production.
Before the eventual cutover, the owner must verify Coolify's current source,
runtime, environment, health-check, and rollback settings, then change the ref
to a validated canonical `main` commit deliberately.
