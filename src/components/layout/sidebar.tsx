'use client';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from '@/components/ui/sidebar';
import { SidebarLogo } from '../icons';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Home,
  Settings,
  LineChart,
  BrainCircuit,
  PanelLeftClose,
  PanelRightClose,
} from 'lucide-react';
import { TooltipProvider } from '../ui/tooltip';

const menuItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/strategies', label: 'Strategies', icon: BrainCircuit },
  { href: '/analysis', label: 'Monitoring', icon: LineChart },
  { href: '/settings', label: 'Settings', icon: Settings },
];

function SidebarCollapseButton() {
  const { state, toggleSidebar } = useSidebar();
  const CollapseIcon = state === 'expanded' ? PanelLeftClose : PanelRightClose;
  return (
    <SidebarMenuButton
      onClick={toggleSidebar}
      tooltip={state === 'expanded' ? 'Collapse' : 'Expand'}
      className="hidden md:flex justify-center"
    >
      <CollapseIcon />
    </SidebarMenuButton>
  );
}

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <TooltipProvider>
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
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarCollapseButton />
        </SidebarFooter>
      </Sidebar>
    </TooltipProvider>
  );
}
