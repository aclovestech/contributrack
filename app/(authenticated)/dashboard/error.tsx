'use client';

import { useEffect } from 'react';

import { Button } from '@/components/ui/button';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Keep only the framework-safe digest in browser logs. The full error may
    // contain database or provider details and should not be exposed client-side.
    console.error('Dashboard page failed', error.digest ?? 'unknown');
  }, [error]);

  return (
    <div className="flex min-h-64 flex-col items-center justify-center gap-4 px-6 text-center">
      <div>
        <h2 className="text-lg font-semibold">We couldn’t load this page</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Try again. If the problem continues, check the connection and contact
          the person who maintains ContribuTrack.
        </p>
      </div>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  );
}
