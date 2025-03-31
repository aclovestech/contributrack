import { stackServerApp } from '@/stack';
import { redirect } from 'next/navigation';

export default async function RootPage() {
  const user = await stackServerApp.getUser({ or: 'redirect' });

  if (user) {
    redirect('/dashboard');
  }
}
