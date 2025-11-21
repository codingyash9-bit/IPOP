'use client';
import { SidebarProvider, Sidebar, SidebarInset } from '../ui/sidebar';
import { AppSidebar } from './sidebar';
import { AppHeader } from './header';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AppSidebar />
        <div className="flex-1">
          <AppHeader />
          <main className="p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
