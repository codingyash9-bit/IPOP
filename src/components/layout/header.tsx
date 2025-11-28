'use client';

import { UserNav } from './user-nav';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
      {/* The SidebarTrigger is no longer needed and has been removed */}
      <div className="flex w-full items-center justify-end gap-4">
        <UserNav />
      </div>
    </header>
  );
}
