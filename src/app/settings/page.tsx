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
import { Database, RefreshCw, Upload } from 'lucide-react';
import { handleUpdateData } from './actions';
import { useState, useRef } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useFirestore } from '@/firebase';
import { seedDatabase } from '@/lib/seed-db';

const BACKEND_BASE = process.env.NEXT_PUBLIC_BACKEND_BASE;
const SECRET_TOKEN = process.env.NEXT_PUBLIC_BACKEND_TOKEN;

// This function now calls your real backend endpoint.
export async function handleParseProspectus(file: File) {
  if (!BACKEND_BASE) {
    return { success: false, message: 'Backend service is not configured.' };
  }
  
  const formData = new FormData();
  formData.append("file", file, file.name);

  try {
    const res = await fetch(`${BACKEND_BASE}/parse/`, {
      method: "POST",
      headers: {
        "x-internal-token": SECRET_TOKEN || ''
      },
      body: formData,
    });
    const j = await res.json();
    if (!res.ok) throw new Error(j.detail || "Parse failed");
    return { success: true, message: `Successfully parsed ${file.name}.`, parsed: j.parsed };
  } catch (err: any) {
     console.error(err);
     return { success: false, message: err.message || "Parse failed" };
  }
}


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
      description: 'Fetching the latest IPO information.',
    });
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
  
  const onParseProspectus = async () => {
    if (!fileInputRef.current?.files?.length) {
      toast({
        variant: 'destructive',
        title: 'No File Selected',
        description: 'Please select a prospectus PDF file to parse.',
      });
      return;
    }
    
    const file = fileInputRef.current.files[0];
    setIsParsing(true);
    toast({
        title: 'Parsing Prospectus...',
        description: `Uploading and processing ${file.name}.`,
    });

    const result = await handleParseProspectus(file);

    if (result.success) {
        toast({
            title: 'Parsing Complete',
            description: result.message,
        });
        console.log('Parsed Data:', result.parsed);
    } else {
        toast({
            variant: 'destructive',
            title: 'Parsing Failed',
            description: result.message,
        });
    }
    setIsParsing(false);
  }

  const onSeed = async () => {
    setIsSeeding(true);
    toast({
      title: 'Seeding Database...',
      description: 'Populating Firestore with initial IPO data. This may take a moment.',
    });
    // The logic is now client-side
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
                <CardTitle>Data Management</CardTitle>
                <CardDescription>
                Our system automatically syncs with market data sources every 6 hours. This process adds newly announced IPOs and recalculates predictions for all existing ones.
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
                        <Input id="prospectus-file" type="file" accept=".pdf" ref={fileInputRef} />
                    </div>
                    <Button onClick={onParseProspectus} disabled={isParsing}>
                        <Upload className={`mr-2 h-4 w-4 ${isParsing ? 'animate-spin' : ''}`} />
                        {isParsing ? 'Parsing...' : 'Upload & Parse'}
                    </Button>
                </CardContent>
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
