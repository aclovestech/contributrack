# Local development

## Requirements

- Node.js version declared by the repository's `engines` field.
- pnpm version declared by `packageManager`.
- A local or restored PostgreSQL database.
- StackAuth development configuration for authenticated pages.

Install dependencies with:

```bash
pnpm install --frozen-lockfile
```

Copy the names from `.env.example` into a local `.env.local` and fill them with
development credentials. Never commit the file or paste its values into issue
reports or chat.

## Validation

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

The build may require non-production StackAuth environment variables because the
application is authenticated. A missing local configuration should produce a
clear setup error; it must never cause a deployment to run a migration.
`pnpm build` checks the three StackAuth build variables before invoking Next.js;
the values themselves are never printed.

The production build explicitly uses Next.js's Webpack path
(`next build --webpack`) because it is the most deterministic validation path
for this repository. Turbopack remains available for local development through
`pnpm dev`.

Run `pnpm audit --prod` when reviewing dependency changes. The lockfile keeps
same-major security overrides for transitive `shell-quote`, `js-cookie`,
Browserslist, and `bn.js` findings. The current StackAuth release still brings
`uuid` 9.x and `elliptic`; do not force a major `uuid` override or replace
StackAuth's crypto dependency without a compatibility review and explicit
approval.

## Database workflow

Drizzle schema and migrations live in `src/db/schema.ts` and `drizzle/`.
Historical migrations 0000–0004 are immutable. Use a disposable local/restored
database for schema experiments. Generate a new forward migration only after
reviewing the live schema and production impact. Do not run `drizzle-kit push`
against production. Production migration execution is an explicit, owner-
approved release step with a fresh verified backup.

### Generating and applying migrations

After updating the Drizzle schema, generate a forward migration with:

```bash
pnpm exec drizzle-kit generate --name=add_kingdom_builders
```

Generation compares the schema with the existing migration snapshots; it does
not require a database connection. Review the generated SQL, snapshot, and
appended journal entry before applying anything.

`drizzle.config.ts` reads `DATABASE_URL` from the process environment. The
installed Drizzle CLI also loads a root `.env` file automatically, but does not
automatically load Next.js's `.env.local`. This checkout initially contains only
`.env.example`, which supplies no runtime configuration.

For a disposable local/restored database, create an ignored `.env.local` with
development configuration and load it explicitly when applying migrations:

```bash
node --env-file=.env.local ./node_modules/drizzle-kit/bin.cjs migrate
```

Use Node 24 and install dependencies before running this command. Alternatively,
when `DATABASE_URL` is already supplied to the release process environment:

```bash
pnpm exec drizzle-kit migrate
```

Both commands apply **all pending migrations** to that configured database. Do
not use a production URL for local development. Production uses the separate
approval and backup process in `docs/deployment.md`.

## Application conventions

Server actions obtain the authenticated StackAuth user themselves and scope
every query by that account. Client code passes record identifiers and form
values, never an account id. Active lists/reports ignore archived rows. A
donation with no donor relationship is retained and shown as “Unassigned donor”.
The authenticated dashboard is forced dynamic, and `src/db/index.ts` is
server-only. Public webhook requests are signature-verified and capped at 256
KiB before parsing; mutation failures returned to the browser use generic
messages rather than database details.
