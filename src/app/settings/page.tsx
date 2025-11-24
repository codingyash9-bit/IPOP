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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, Upload } from 'lucide-react';
import { handleUpdateData } from './actions';
import { useState } from 'react';

export default function SettingsPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [isSyncing, setIsSyncing] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
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
  
  const handleParseProspectus = async () => {
    setIsParsing(true);
    toast({
        title: 'Parsing Prospectus...',
        description: 'This is a demo. In a real app, the PDF would be processed in the backend.',
    });

    // Simulate backend processing
    await new Promise(resolve => setTimeout(resolve, 2500));

    toast({
        title: 'Parsing Complete',
        description: 'Successfully extracted data for "Innovate Corp".',
    });
    setIsParsing(false);
  }
  
  if (authLoading) {
     return (
       <div className="p-8 space-y-8">
         <div className="h-96 w-full animate-pulse rounded-lg bg-muted" />
         <div className="h-64 w-full animate-pulse rounded-lg bg-muted" />
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
            <Card>
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

            <Card>
                <CardHeader>
                    <CardTitle>Prospectus Parser</CardTitle>
                    <CardDescription>
                        Upload a Red Herring Prospectus (RHP) to automatically extract key IPO details.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="prospectus-file">PDF Document</Label>
                        <Input id="prospectus-file" type="file" accept=".pdf" />
                    </div>
                    <Button onClick={handleParseProspectus} disabled={isParsing}>
                        <Upload className={`mr-2 h-4 w-4 ${isParsing ? 'animate-spin' : ''}`} />
                        {isParsing ? 'Parsing...' : 'Upload & Parse'}
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </AppShell>
  );
}
