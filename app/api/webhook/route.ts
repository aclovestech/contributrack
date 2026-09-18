import { NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { z } from 'zod';
import { eq } from 'drizzle-orm';

import { db } from '@/src/db';
import { usersTable } from '@/src/db/schema';

const selectedTeamSchema = z.object({
  created_at_millis: z.number(),
  id: z.string(),
  display_name: z.string(),
  profile_image_url: z.string().nullish(),
});

const userIdSchema = z.string().min(1);

const userPayloadSchema = z.object({
  id: userIdSchema,
  primary_email_verified: z.boolean(),
  signed_up_at_millis: z.number(),
  has_password: z.boolean(),
  primary_email: z.string().nullish(),
  display_name: z.string().nullish(),
  selected_team: selectedTeamSchema.nullish(),
  selected_team_id: z.string().nullish(),
  profile_image_url: z.string().nullish(),
  client_metadata: z.record(z.string(), z.unknown()).nullish(),
  server_metadata: z.record(z.string(), z.unknown()).nullish(),
});

const stackAuthEventSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('user.created'), data: userPayloadSchema }),
  z.object({ type: z.literal('user.updated'), data: userPayloadSchema }),
  z.object({
    type: z.literal('user.deleted'),
    data: z.object({ id: userIdSchema }),
  }),
]);

// StackAuth events are small JSON documents. Reject unexpectedly large bodies
// before signature verification and parsing so this public endpoint cannot be
// used to make the application hold arbitrary request data in memory.
const MAX_WEBHOOK_BODY_BYTES = 256 * 1024;

export const runtime = 'nodejs';

function isBodyTooLarge(request: Request) {
  const contentLength = request.headers.get('content-length');
  if (!contentLength) return false;

  const parsedLength = Number(contentLength);
  return Number.isFinite(parsedLength) && parsedLength > MAX_WEBHOOK_BODY_BYTES;
}

async function readBodyWithinLimit(request: Request) {
  if (!request.body) return '';

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      totalBytes += value.byteLength;
      if (totalBytes > MAX_WEBHOOK_BODY_BYTES) {
        await reader.cancel();
        return null;
      }

      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const bodyBytes = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    bodyBytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return new TextDecoder().decode(bodyBytes);
}

export async function POST(request: Request) {
  const secret = process.env.STACK_AUTH_WEBHOOK_SECRET;

  if (!secret) {
    return NextResponse.json(
      { error: 'Webhook is not configured.' },
      { status: 503 },
    );
  }

  if (isBodyTooLarge(request)) {
    return NextResponse.json(
      { error: 'Webhook payload is too large.' },
      { status: 413 },
    );
  }

  const body = await readBodyWithinLimit(request);
  if (body === null) {
    return NextResponse.json(
      { error: 'Webhook payload is too large.' },
      { status: 413 },
    );
  }

  let payload: unknown;

  try {
    payload = new Webhook(secret).verify(
      body,
      Object.fromEntries(request.headers.entries()),
    );
  } catch {
    // Do not echo signature or provider details to callers. A bad signature is
    // a client error and should not trigger repeated provider retries as a 500.
    return NextResponse.json(
      { error: 'Invalid webhook signature.' },
      { status: 400 },
    );
  }

  const parsed = stackAuthEventSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid webhook payload.' },
      { status: 400 },
    );
  }

  try {
    if (parsed.data.type === 'user.deleted') {
      // The database foreign keys intentionally SET NULL so historical donors
      // and donations survive account deletion.
      await db.delete(usersTable).where(eq(usersTable.id, parsed.data.data.id));
    } else {
      // StackAuth may retry events or deliver an update before the create event;
      // both cases are safe with an idempotent insert.
      await db
        .insert(usersTable)
        .values({ id: parsed.data.data.id })
        .onConflictDoNothing({ target: usersTable.id });
    }
  } catch {
    return NextResponse.json(
      { error: 'Unable to process webhook.' },
      { status: 500 },
    );
  }

  return NextResponse.json({ message: 'Webhook received' });
}
