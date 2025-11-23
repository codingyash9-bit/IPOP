'use client';
import { useAuth } from '@/hooks/use-auth';
import { LoginPage } from '@/components/auth/login-page';
import { AppShell } from '@/components/layout/app-shell';
import { IpoDetails } from '@/components/ipo/ipo-details';
import { Skeleton } from '@/components/ui/skeleton';
import { use } from 'react';

export default function IpoDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { isAuthenticated, isLoading } = useAuth();
  const { id } = use(params);

  if (isLoading) {
    return (
       <div className="p-8">
        <Skeleton className="h-12 w-1/4 mb-4" />
        <Skeleton className="h-8 w-1/2 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
          <div className="space-y-8">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <AppShell>
      <IpoDetails ipoId={id} />
    </AppShell>
  );
}
