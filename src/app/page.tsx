'use client';
import { useAuth } from '@/hooks/use-auth';
import { Dashboard } from '@/components/dashboard';
import { LoginPage } from '@/components/auth/login-page';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
        <div className="p-8">
            <div className="flex flex-col gap-2 mb-8">
                <Skeleton className="h-9 w-1/3" />
                <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Skeleton className="h-80 w-full" />
                <Skeleton className="h-80 w-full" />
                <Skeleton className="h-80 w-full" />
            </div>
      </div>
    );
  }

  return isAuthenticated ? <Dashboard /> : <LoginPage />;
}
