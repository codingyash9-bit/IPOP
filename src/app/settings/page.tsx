'use client';
import { useAuth } from '@/hooks/use-auth';
import { LoginPage } from '@/components/auth/login-page';
import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw } from 'lucide-react';
import { handleUpdateData } from './actions';
import { useState } from 'react';

export default function SettingsPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();

  const onSync = async () => {
    setIsSyncing(true);
    const result = await handleUpdateData();
    if (result.success) {
      toast({
        title: 'Data Synced',
        description: result.message,
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Sync Failed',
        description: result.message,
      });
    }
    setIsSyncing(false);
  };
  
  if (authLoading) {
     return (
       <div className="p-8">
         <div className="h-96 w-full animate-pulse rounded-lg bg-muted" />
       </div>
     );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <AppShell>
      <div className="flex flex-col gap-8">
        <header>
          <h1 className="text-3xl font-bold font-headline tracking-tight">
            Settings
          </h1>
          <p className="text-muted-foreground">Manage your application settings and data.</p>
        </header>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>
              Manually trigger a data sync to fetch the latest IPO information from our providers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={onSync} disabled={isSyncing}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing...' : 'Sync IPO Data'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
