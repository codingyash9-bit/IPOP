'use client';

import { SidebarTrigger } from '../ui/sidebar';
import { UserNav } from './user-nav';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
      {/* The SidebarTrigger is now hidden on mobile and only visible on md screens, but the sidebar itself is hidden there. This effectively hides the trigger. A better implementation would be to keep the sidebar for desktop */}
      <div className="hidden md:hidden">
        <SidebarTrigger />
      </div>
      <div className="flex w-full items-center justify-end gap-4">
        <UserNav />
      </div>
    </header>
  );
}
