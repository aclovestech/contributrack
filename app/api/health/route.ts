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
  } catch (error) {
    console.error('Health check failed', error);

    return NextResponse.json(
      { status: 'error' },
      {
        status: 503,
        headers: { 'Cache-Control': 'no-store' },
      },
    );
  }
}
