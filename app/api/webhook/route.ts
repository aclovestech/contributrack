import { NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { z } from 'zod';
import { usersTable } from '@/src/db/schema';
import { db } from '@/src/db';
import { eq } from 'drizzle-orm';

const SelectedTeamSchema = z.object({
  created_at_millis: z.number(),
  id: z.string(),
  display_name: z.string(),
  profile_image_url: z.string().nullish(),
});

const UserIDSchema = z.string().describe('The unique identifier of this user');

const UserCreatedEventPayloadSchema = z.object({
  id: UserIDSchema,
  primary_email_verified: z
    .boolean()
    .describe(
      'Whether the primary email has been verified to belong to this user',
    ),
  signed_up_at_millis: z
    .number()
    .describe(
      'The time the user signed up (the number of milliseconds since epoch, January 1, 1970, UTC)',
    ),
  has_password: z
    .boolean()
    .describe('Whether the user has a password associated with their account'),
  primary_email: z.string().nullish().describe('Primary email'),
  display_name: z
    .string()
    .nullish()
    .describe(
      'Human-readable user display name. This is not a unique identifier.',
    ),
  selected_team: SelectedTeamSchema.nullish(),
  selected_team_id: z
    .string()
    .nullish()
    .describe('ID of the team currently selected by the user'),
  profile_image_url: z
    .string()
    .nullish()
    .describe(
      'URL of the profile image for user. Can be a Base64 encoded image. Please compress and crop to a square before passing in.',
    ),
  client_metadata: z
    .record(z.string(), z.any())
    .nullish()
    .describe(
      'Client metadata. Used as a data store, accessible from the client side. Do not store information that should not be exposed to the client.',
    ),
  server_metadata: z
    .record(z.string(), z.any())
    .nullish()
    .describe(
      'Server metadata. Used as a data store, only accessible from the server side. You can store secret information related to the user here.',
    ),
});

const UserUpdatedEventPayloadSchema = UserCreatedEventPayloadSchema;

const UserDeletedEventPayloadSchema = z.object({
  id: UserIDSchema,
});

const StackAuthEventPayloadSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('user.created'),
    data: UserCreatedEventPayloadSchema,
  }),
  z.object({
    type: z.literal('user.updated'),
    data: UserUpdatedEventPayloadSchema,
  }),
  z.object({
    type: z.literal('user.deleted'),
    data: UserDeletedEventPayloadSchema,
  }),
]);

const secret = process.env.STACK_AUTH_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  const body = await request.text();

  const headers: Record<string, string> = {};
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  request.headers.forEach((value, key, parent) => {
    headers[key] = value;
  });

  const wh = new Webhook(secret);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let payload: any = {};

  try {
    payload = wh.verify(body, headers);
  } catch (e) {
    return NextResponse.json(
      { error: `Unable to verify webhook: ${(e as Error).message}` },
      { status: 500 },
    );
  }

  const parsedPayload = StackAuthEventPayloadSchema.parse(payload);

  if (parsedPayload.type === 'user.created') {
    const data = parsedPayload.data;
    await db.insert(usersTable).values({
      id: data.id,
    });
  } else if (parsedPayload.type === 'user.deleted') {
    const data = parsedPayload.data;
    await db.delete(usersTable).where(eq(usersTable.id, data.id));
  }

  return NextResponse.json({ message: 'Webhook received' });
}
