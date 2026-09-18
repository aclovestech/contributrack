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
5. Confirm the health endpoint, login, donor lookup, donation entry, reports,
   and PDF generation after deployment. Compare aggregate totals with the
   recorded production baseline; do not export donor personal information.

## Coolify source and cutover

The previous Coolify application used repository `aclovestech/contributrack`,
ref `latest`, and commit setting `HEAD`; its historical deployed SHA is unknown.
A replacement Coolify application has since been created with the Railpack build
pack and has deployed successfully. The exact source ref and resolved commit for
the replacement application must still be recorded from Coolify; do not infer
them from a Git push or from the old configuration.

Before any production cutover or rollback, the owner should verify the current
source ref, resolved commit, Node/pnpm versions, build and start commands,
environment names, `/api/health` probe, restart policy, and rollback options.
The intended long-term source ref is canonical `main`, but changing Coolify's
ref is an explicit owner-controlled production action.
