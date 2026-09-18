# ContribuTrack

ContribuTrack is a small donation-management application for a church
administrator. It helps record donations, maintain donor records, review totals,
and print an annual donor-total report for reconciliation.

The project is intentionally optimized for a simple, reliable workflow rather
than a feature-heavy dashboard. It uses Next.js App Router, TypeScript,
PostgreSQL, Drizzle ORM, StackAuth, and pdfmake.

## Start locally

1. Install Node.js and the pnpm version declared in `package.json`.
2. Install dependencies:

   ```bash
   pnpm install --frozen-lockfile
   ```

3. Copy `.env.example` to `.env.local` and provide development-only values.
4. Start the development server:

   ```bash
   pnpm dev
   ```

Use a local or restored test PostgreSQL database. Do not point local tooling at
production except for an explicitly approved, read-only investigation.

## Validation

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Data and migration safety

Production contains real donor and donation data. The rebuild baseline is
`release/v1.0.0`; historical Drizzle migrations `0000` through `0004` are
preserved exactly. Production migration 0002 has a known hash mismatch, and some
historical donations have no donor relationship. Both facts are recorded in
[`docs/production-baseline.md`](docs/production-baseline.md) and must be handled
without rewriting history or inventing data.

Production migrations and data changes are never automatic. A current backup
must be restored and verified before any such operation, followed by explicit
owner approval.

## Documentation

- [`AGENTS.md`](AGENTS.md) — durable instructions for coding agents.
- [`docs/architecture.md`](docs/architecture.md) — application boundaries and
  target architecture.
- [`docs/development.md`](docs/development.md) — setup, validation, and local
  database workflow.
- [`docs/production-baseline.md`](docs/production-baseline.md) — source, schema,
  backup, and deployment facts.

## Deployment

The repository is deployed through Coolify using Nixpacks. The historical
configuration was observed using ref `latest` and commit setting `HEAD`; the
historical deployed SHA is unknown. Do not infer deployment success from a Git
push. Coolify should be deliberately changed to a validated canonical `main`
commit only during the planned production cutover.
