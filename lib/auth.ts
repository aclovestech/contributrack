import 'server-only';

import { stackServerApp } from '@/stack';

/**
 * Resolve the authenticated StackAuth user on the server.
 *
 * Database actions must call this helper instead of accepting an account id
 * from a browser. The redirect behavior keeps unauthenticated dashboard
 * requests consistent with the existing route protection.
 */
export async function requireCurrentUser() {
  const user = await stackServerApp.getUser({ or: 'redirect' });

  if (!user) {
    throw new Error('Authentication is required for this operation.');
  }

  return user;
}

export async function requireCurrentUserId() {
  const user = await requireCurrentUser();
  return user.id;
}
