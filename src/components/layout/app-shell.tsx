'use client';
import { SidebarProvider } from '../ui/sidebar';
import { AppSidebar } from './sidebar';
import { AppHeader } from './header';
import { BottomNav } from './bottom-nav';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col">
        <div className="flex flex-1">
          <AppSidebar />
          <div className="flex-1 flex flex-col">
            <AppHeader />
            {/* Add padding-bottom to the main content to prevent the bottom nav from overlapping it */}
            <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 md:pb-8">{children}</main>
          </div>
        </div>
        {/* The BottomNav will be rendered here and be visible only on mobile */}
        <BottomNav />
        <footer className="p-4 text-center text-xs text-muted-foreground border-t hidden md:block">
          Disclaimer: All information provided is for educational purposes only. This is not financial advice.
        </footer>
      </div>
    </SidebarProvider>
  );
}
