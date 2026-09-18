'use client';

import { usePathname } from 'next/navigation';

import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Overview',
  '/dashboard/donors': 'Donors',
  '/dashboard/donations': 'Donations',
  '/dashboard/reports': 'Reports',
};

export function SiteHeader() {
  const pathname = usePathname();
  const title = pageTitles[pathname] ?? 'ContribuTrack';

  return (
    <header className="flex h-(--header-height) shrink-0 items-center border-b">
      <div className="flex w-full items-center gap-3 px-4 lg:px-6">
        <SidebarTrigger className="-ml-1" aria-label="Open navigation" />
        <Separator
          orientation="vertical"
          className="data-[orientation=vertical]:h-5"
        />
        <span className="text-sm font-medium">{title}</span>
      </div>
    </header>
  );
}
