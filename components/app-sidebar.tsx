'use client';

import * as React from 'react';
import {
  IconDashboard,
  IconFileAnalytics,
  IconFileDollar,
  IconInnerShadowTop,
  IconUsers,
} from '@tabler/icons-react';

import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

import Link from 'next/link';
import { Toggle } from '@/components/ui/toggle';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

const data = {
  navMain: [
    {
      title: 'Overview',
      url: '/dashboard',
      icon: IconDashboard,
    },
    {
      title: 'Donors',
      url: '/dashboard/donors',
      icon: IconUsers,
    },
    {
      title: 'Donations',
      url: '/dashboard/donations',
      icon: IconFileDollar,
    },
    {
      title: 'Reports',
      url: '/dashboard/reports',
      icon: IconFileAnalytics,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { theme, setTheme } = useTheme();

  function handleOnToggleClick() {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/dashboard">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">ContribuTrack</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center gap-2">
          <NavUser />
          <Toggle
            onClick={handleOnToggleClick}
            variant={'outline'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun /> : <Moon />}
          </Toggle>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
