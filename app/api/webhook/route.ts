import { Webhook } from 'svix';
import { StackAuthWebhookData } from './StackAuthWebhookData';
import { usersTable } from '@/src/db/schema';
import { db } from '@/src/db';
import { eq } from 'drizzle-orm';

const secret = process.env.STACK_AUTH_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  // get the needed headers from the request
  const headers = {
    'svix-id': req.headers.get('svix-id') ?? '',
    'svix-timestamp': req.headers.get('svix-timestamp') ?? '',
    'svix-signature': req.headers.get('svix-signature') ?? '',
  };

  // get the payload
  const payload = await req.text();

  // create a new Webhook
  const sivx = new Webhook(secret);

  let msg;

  try {
    // verify the webhook
    msg = sivx.verify(payload, headers);

    // get the data from the webhook
    const { data, type: eventType } = (await JSON.parse(
      payload,
    )) as StackAuthWebhookData;

    // if the event type is user.created, insert the user into the database
    if (eventType === 'user.created') {
      await db.insert(usersTable).values({
        id: data.id,
      });
    }
    // if the event type is user.deleted, delete the user from the database
    else if (eventType === 'user.deleted') {
      await db.delete(usersTable).where(eq(usersTable.id, data.id));
    }
  } catch (error) {
    console.error(error);
    return new Response(`Error processing webhook: ${error}`, { status: 400 });
  }

  return new Response('Webhook received', { status: 200 });
}
