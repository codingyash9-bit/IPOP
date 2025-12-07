'use client';
import { AppShell } from '@/components/layout/app-shell';
import { IpoList } from '@/components/ipo/ipo-list';
import { useAuth } from '@/hooks/use-auth';
import { Skeleton } from '@/components/ui/skeleton';

export function Dashboard() {
  const { isLoading } = useAuth();

  return (
    <AppShell>
      <div className="flex flex-col gap-8">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold font-headline tracking-tight">
            IPO Dashboard
          </h1>
          <p className="text-muted-foreground">
            AI-powered analysis of live, recent, and upcoming IPOs.
          </p>
        </header>
        {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Skeleton className="h-80 w-full" />
                <Skeleton className="h-80 w-full" />
                <Skeleton className="h-80 w-full" />
            </div>
        ) : (
            <IpoList />
        )}
      </div>
    </AppShell>
  );
}
