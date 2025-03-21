import * as React from 'react';
import {
  Receipt,
  Home,
  Users,
  CircleDollarSign,
  ReceiptText,
} from 'lucide-react';

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
import { Link } from '@tanstack/react-router';

const data = {
  user: {
    name: 'kc.canada',
    email: '',
    avatar: '',
  },
  navMain: [
    {
      title: 'Overview',
      url: '/dashboard/',
      icon: Home,
      isActive: true,
    },
    {
      title: 'Donors',
      url: '/dashboard/donors',
      icon: Users,
    },
    {
      title: 'Donations',
      url: '/dashboard/donations',
      icon: CircleDollarSign,
    },
    {
      title: 'Reports',
      url: '/dashboard/reports',
      icon: ReceiptText,
    },
  ],
  navSecondary: [],
  projects: [],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/dashboard">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Receipt className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">ContribuTrack</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
