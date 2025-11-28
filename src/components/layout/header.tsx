'use client';

import { UserNav } from './user-nav';
import { Logo } from '../icons';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 grid h-16 w-full grid-cols-3 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <div className="flex items-center justify-start">
        <UserNav />
      </div>
      <div className="flex items-center justify-center">
        <Logo />
      </div>
      <div className="flex items-center justify-end" />
    </header>
  );
}
