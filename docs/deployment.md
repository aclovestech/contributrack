# Deployment and operations

## Current deployment shape

The application is a single Next.js service built and started by Coolify using
Railpack. The repository declares Node.js 24.x and pnpm 10.30.3; the expected
application commands are `pnpm install --frozen-lockfile`, `pnpm build`, and
`pnpm start`. The repository does not run Drizzle migrations as part of `build`
or `start`; migration execution is a separate, reviewed operational step.

The health endpoint is `GET /api/health`. It performs only `SELECT 1` and
returns `{ "status": "ok" }` or HTTP 503 with `{ "status": "error" }`; it never
returns donor data or configuration values. Configure a Coolify health probe to
use this path only after verifying the desired interval and restart policy in
Coolify.

## Environment variables

Required names are listed in `.env.example`:

- `DATABASE_URL` — PostgreSQL connection string used by server-side Drizzle
  queries.
- `NEXT_PUBLIC_STACK_PROJECT_ID` — StackAuth project identifier.
- `NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY` — StackAuth browser-safe key.
- `STACK_SECRET_SERVER_KEY` — private StackAuth server key.
- `STACK_AUTH_WEBHOOK_SECRET` — private Svix/StackAuth webhook signature key.
- `NEXT_PUBLIC_STACK_API_URL` and `NEXT_PUBLIC_STACK_EXTRA_REQUEST_HEADERS` —
  optional StackAuth overrides.

Keep real values in Coolify's environment configuration, never in Git or support
messages. Publicly prefixed values are still configuration, not a reason to
commit an environment file.

## Safe release checklist

1. Validate the candidate commit locally and in CI (`lint`, `typecheck`, focused
   tests, format check, and production build).
2. Review the Git diff for accidental migration, environment, or generated-file
   changes.
3. If the release includes a database migration or data write, stop for the
   production approval gate: inspect the live schema, create a current backup,
   restore it into an isolated database, and record the restore verification.
4. Apply an approved migration manually through the documented release process;
   never add it to `build`, `start`, or an automatic webhook.
5. Confirm the health endpoint, login, donor lookup, donation entry, annual and
   weekly reports, and PDF generation after deployment. Compare aggregate totals
   with the recorded production baseline; do not export donor personal
   information.

## Coolify source and cutover

### Kingdom Builders release

Migration `0005_add_kingdom_builders.sql` adds one enum value to
`public.donation_type`. It preserves existing donation values, amounts, donor
relationships, and historical migration records. The known production 0002
migration hash mismatch must remain recorded as-is.

Before release:

1. Validate the reviewed application commit with Node 24 and non-production
   configuration. Verify the current Coolify source and rollback settings.
2. Review the live enum and migration history through authorized read-only
   access. Confirm that this migration is the expected pending change; the
   Drizzle migration command applies all pending migrations.
3. Verify a current backup and test the migration and application against an
   isolated restored database where practical, including saving/editing Kingdom
   Builders donations, filtering, and annual PDF reconciliation.
4. Obtain the owner's approval immediately before production application.
5. In a controlled checkout of the reviewed commit with dependencies installed,
   supply `DATABASE_URL` securely to the release shell, verify the intended
   database target, and run `pnpm exec drizzle-kit migrate`. Drizzle Kit is a
   development dependency, so a production image that omits development
   dependencies may not contain this command. A configured Coolify application
   does not automatically provide its secrets to a local terminal.
6. Deploy the validated application commit after the enum addition, and verify
   the donation form, type filter, annual sections, subtotals, and grand total.

If using an environment file instead of injected variables, explicitly load that
secured file with Node 24:

```bash
node --env-file=/secure/path/release.env ./node_modules/drizzle-kit/bin.cjs migrate
```

Do not commit that file. A local `.env` or `.env.local` is not required when the
release process already supplies `DATABASE_URL`. Build and start never apply
this migration. If rolling back the application, retain the added enum value and
any donations recorded with it.

### Current source

The previous Coolify application used repository `aclovestech/contributrack`,
ref `latest`, and commit setting `HEAD`; its historical deployed SHA is unknown.
A replacement Coolify application has since been created with the Railpack build
pack and is now confirmed by the owner to deploy canonical `main` at commit
`95825256bb36befd7c7ba74a36ec1a60ea4dacb3`. The previous application's
historical deployed SHA remains unknown. Treat the confirmed SHA as the current
production baseline; later repository commits require a deliberate deployment.

Before any production cutover or rollback, the owner should verify the current
source ref, resolved commit, Node/pnpm versions, build and start commands,
environment names, `/api/health` probe, restart policy, and rollback options.
The active source ref is canonical `main`. Any later source-ref, commit,
runtime, environment, health-check, restart-policy, or rollback change remains
an explicit owner-controlled production action.
