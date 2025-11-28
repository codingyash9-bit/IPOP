'use client';
import { SidebarProvider } from '../ui/sidebar';
import { AppHeader } from './header';
import { BottomNav } from './bottom-nav';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col">
        <div className="flex flex-1">
          {/* The AppSidebar component is now completely removed */}
          <div className="flex-1 flex flex-col">
            <AppHeader />
            {/* Add padding-bottom to the main content to prevent the bottom nav from overlapping it on all screen sizes */}
            <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24">{children}</main>
          </div>
        </div>
        {/* The BottomNav will be rendered here and be visible on all screen sizes */}
        <BottomNav />
      </div>
    </SidebarProvider>
  );
}
