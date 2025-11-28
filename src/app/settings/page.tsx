
'use client';
import { useAuth } from '@/hooks/use-auth';
import { LoginPage } from '@/components/auth/login-page';
import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Database, RefreshCw, Upload, Clock, Server } from 'lucide-react';
import { handleUpdateData } from './actions';
import { useState, useRef } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useFirestore } from '@/firebase';
import { seedDatabase } from '@/lib/seed-db';

export default function SettingsPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const firestore = useFirestore();
  const [isSyncing, setIsSyncing] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onSync = async () => {
    setIsSyncing(true);
    toast({
      title: 'Syncing Data...',
      description: 'Checking for new IPOs and updating data. This may take up to a minute.',
    });
    
    const result = await handleUpdateData();
    
    if (result.success) {
      toast({
        title: 'Data Sync Complete',
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
  
  const onParseProspectus = async () => {
    toast({
        variant: 'destructive',
        title: 'Feature Not Implemented',
        description: 'Automatic prospectus parsing requires a dedicated document processing backend and is not available in this demo.',
    });
  }

  const onSeed = async () => {
    setIsSeeding(true);
    toast({
      title: 'Seeding Database...',
      description: 'Populating Firestore with initial IPO data. This may take a moment.',
    });
    const result = await seedDatabase(firestore);
    if (result.success) {
      toast({
        title: 'Database Seeded',
        description: result.message,
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Seeding Failed',
        description: result.message,
      });
    }
    setIsSeeding(false);
  };
  
  if (authLoading) {
     return (
       <AppShell>
        <div className="space-y-8 p-4 sm:p-6 lg:p-8">
            <div className="space-y-2">
                <Skeleton className="h-9 w-1/4" />
                <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
                <Skeleton className="h-56" />
                <Skeleton className="h-56" />
            </div>
        </div>
       </AppShell>
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
                    <CardTitle>Manual Data Sync</CardTitle>
                    <CardDescription>
                       Manually trigger the backend process to check for new IPOs from our data provider and run the AI analysis.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={onSync} disabled={isSyncing}>
                    <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
                    {isSyncing ? 'Syncing...' : 'Sync IPO Data Manually'}
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
                        <Input id="prospectus-file" type="file" accept=".pdf" ref={fileInputRef} disabled />
                    </div>
                    <Button onClick={onParseProspectus} disabled={isParsing || true}>
                        <Upload className={`mr-2 h-4 w-4 ${isParsing ? 'animate-spin' : ''}`} />
                        {isParsing ? 'Parsing...' : 'Upload & Parse (Disabled)'}
                    </Button>
                </CardContent>
            </Card>

            <Card className="md:col-span-2">
                <CardHeader>
                    <CardTitle>Automation in Production</CardTitle>
                    <CardDescription>
                        In a production environment, the data sync process would typically be automated using scheduled jobs.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-muted-foreground">
                    <div className="flex items-start gap-4">
                        <Clock className="w-5 h-5 mt-1 text-primary" />
                        <div>
                            <h4 className="font-semibold text-foreground">Scheduled Sync</h4>
                            <p>For a production app, you would configure a cron job (e.g., using Google Cloud Scheduler) to trigger this sync action periodically, ensuring the IPO data is always fresh.</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-4">
                        <Server className="w-5 h-5 mt-1 text-primary" />
                        <div>
                            <h4 className="font-semibold text-foreground">Real-time Updates</h4>
                            <p>The frontend is connected to Firestore with a real-time listener (`useCollection`), so any updates made by the backend are instantly reflected in the app without needing a page refresh.</p>
                        </div>
                    </div>
                </CardContent>
                 <CardFooter>
                    <a href="https://console.cloud.google.com/cloudscheduler" target="_blank" rel="noopener noreferrer">
                        <Button variant="outline">Go to Cloud Scheduler</Button>
                    </a>
                </CardFooter>
            </Card>


             <Card className="md:col-span-2">
                <CardHeader>
                    <CardTitle>Database Administration</CardTitle>
                    <CardDescription>
                        Use this one-time action to populate your empty Firestore database with the initial set of sample IPOs.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={onSeed} disabled={isSeeding} variant="destructive">
                        <Database className={`mr-2 h-4 w-4 ${isSeeding ? 'animate-spin' : ''}`} />
                        {isSeeding ? 'Seeding...' : 'Seed Database'}
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </AppShell>
  );
}
