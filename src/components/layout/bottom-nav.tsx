'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LineChart, BrainCircuit, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';

const navItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/strategies', label: 'Strategies', icon: BrainCircuit },
  { href: '/analysis', label: 'Monitoring', icon: LineChart },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  if (!user) return null;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border shadow-t">
      <div className="grid h-16 grid-cols-4 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive =
            (item.href === '/' && pathname === '/') ||
            (item.href !== '/' && pathname.startsWith(item.href));

          return (
            <Link key={item.href} href={item.href} className="flex-1">
              <div
                className={cn(
                  'flex flex-col items-center justify-center h-full gap-1 p-2 text-muted-foreground transition-colors',
                  isActive && 'text-primary'
                )}
              >
                <item.icon className="w-6 h-6" />
                <span className="text-xs font-medium">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
