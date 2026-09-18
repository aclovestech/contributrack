# Production baseline and safety record

This document records the facts that anchor the rebuild. It intentionally does
not contain donor names, contact details, addresses, notes, account emails, or
secrets.

## Chosen source baseline

The rebuild starts from `release/v1.0.0` at commit `f1aacea`. This lineage
contains the later application work and migration sequence through 0004. The
`develop` branch is an ancestor of it. `main` and the local `latest` tag point
to an older lineage containing only migrations 0000 and 0001, even though that
lineage has some later dependency and UI commits. Valuable changes from every
line are reviewed deliberately; the release branch is not a blanket approval of
every behavior it contains.

## Production database facts

The production migration table is `drizzle.__drizzle_migrations` and contains
five records. Records 0000, 0001, 0003, and 0004 match the repository migration
hashes and timestamps. Record 0002 has the same migration timestamp as
`drizzle/0002_organic_machine_man.sql` but its stored 64-character hash differs
from the repository hash. This is a known historical inconsistency. Do not
rewrite the journal or edit the historical migration to hide it.

The live schema has validated primary keys, `ON DELETE SET NULL` foreign keys
for donation/donor and account relationships, and the validated unique
constraint `donor_name_unique_per_user`. Existing donations whose donor
relationship was nulled are valid historical records and must remain available
to the owning account as unassigned donations.

## Branch reconciliation decision

- `release/v1.0.0` at `f1aacea` is the chosen application and migration baseline
  for the rebuild.
- `develop` at `4b3c212` is an ancestor of that release line and contributes no
  later independent work that needs to be carried forward separately.
- `main` and the local `latest` tag point at `e77c7ed`. That line has the older
  migration history, but its later dependency, reporting, and UI commits were
  reviewed; compatible dependency/tooling improvements and corrected behavior
  are carried forward deliberately rather than by merging the branch blindly.
- The current rebuild work is isolated on a temporary `codex/rebuild/*` branch.
  Historical branches remain untouched until the rebuilt application is
  validated and the canonical `main` transition is approved.

## Baseline values

The owner should keep the non-sensitive snapshot collected during the Phase 0
database review (row counts, annual totals, min/max dates, null-donor count, and
account-scoped counts) outside the repository or in an access-controlled
operations record. Future validation should compare aggregates, not export
personal donor fields.

## Backup gate

There is no verified automated production backup/restore process currently
recorded. Before any production schema or data-changing operation:

1. Confirm the exact Coolify PostgreSQL service/database and retention settings.
2. Create a new logical backup using an owner-controlled secure location.
3. Restore it into an isolated test database without changing production.
4. Verify table/row counts, migration records, representative aggregate totals,
   and application read-only queries against the restored copy.
5. Record the backup timestamp, storage location, restore result, and rollback
   procedure, without putting credentials in Git or chat.

Repository-only work is not blocked by this gate. It becomes mandatory again
immediately before a production migration, data repair, or other production
write.

## Deployment uncertainty

Coolify is configured to use repository `aclovestech/contributrack`, ref
`latest`, and commit setting `HEAD`. The historical deployed commit is unknown,
and a later redeploy is not evidence of the old deployment. The owner must
verify the current running commit, runtime versions, commands, environment
variable names, health checks, restart behavior, and rollback options in Coolify
before production cutover. A push to `main` must not be treated as a deployment
signal until Coolify is intentionally changed to `main`.
