'use client';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { SidebarLogo } from '../icons';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Settings, LineChart, TestTube, Badge } from 'lucide-react';

const menuItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/analysis', label: 'Monitoring', icon: LineChart },
  { href: '/strategies', label: 'Strategies', icon: TestTube, pro: true },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar
      variant="sidebar"
      collapsible="icon"
      className="hidden md:flex border-r border-border/50 bg-sidebar text-sidebar-foreground"
    >
      <SidebarHeader>
        <SidebarLogo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.label}
              >
                <Link href={item.href}>
                  <item.icon />
                  <div className="flex items-center justify-between w-full">
                    <span>{item.label}</span>
                    {item.pro && (
                      <div className="text-xs font-bold uppercase bg-primary text-primary-foreground rounded-sm px-1.5 py-0.5">
                        Pro
                      </div>
                    )}
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
