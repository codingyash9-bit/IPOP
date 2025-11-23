'use client';
import { SidebarProvider, Sidebar, SidebarInset } from '../ui/sidebar';
import { AppSidebar } from './sidebar';
import { AppHeader } from './header';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col">
        <div className="flex flex-1">
          <AppSidebar />
          <div className="flex-1 flex flex-col">
            <AppHeader />
            <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
          </div>
        </div>
        <footer className="p-4 text-center text-xs text-muted-foreground border-t">
          Disclaimer: All information provided is for educational purposes only. This is not financial advice.
        </footer>
      </div>
    </SidebarProvider>
  );
}
