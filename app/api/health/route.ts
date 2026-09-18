import { sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/src/db';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/** A data-free readiness check suitable for a Coolify health probe. */
export async function GET() {
  try {
    await db.execute(sql`select 1`);

    return NextResponse.json(
      { status: 'ok' },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch {
    // Keep connection details out of logs and the response. Coolify only needs
    // the status code to decide whether the process is ready.
    console.error('Health check failed');

    return NextResponse.json(
      { status: 'error' },
      {
        status: 503,
        headers: { 'Cache-Control': 'no-store' },
      },
    );
  }
}
