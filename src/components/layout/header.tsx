'use client';

import { UserNav } from './user-nav';
import { Logo } from '../icons';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
      <div className="flex-1 flex justify-center">
        <UserNav />
      </div>
      <Logo />
    </header>
  );
}
