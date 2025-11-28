
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
import { Upload, Database, Server } from 'lucide-react';
import { parseProspectusAction, seedDatabaseAction } from './actions';
import { useState, useRef } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function SettingsPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [isParsing, setIsParsing] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onParseProspectus = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      toast({
        variant: 'destructive',
        title: 'No File Selected',
        description: 'Please select a PDF prospectus file to parse.',
      });
      return;
    }

    setIsParsing(true);
    toast({
      title: 'Parsing Prospectus...',
      description: `Sending "${file.name}" to the AI for analysis. This may take a moment.`,
    });

    // Convert file to Data URL
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      const result = await parseProspectusAction(dataUrl);

      if (result.success) {
        toast({
          title: 'Parsing Complete',
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">{JSON.stringify(result.data, null, 2)}</code>
            </pre>
          ),
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Parsing Failed',
          description: result.message,
        });
      }
      setIsParsing(false);
    };
    reader.onerror = () => {
        toast({
            variant: 'destructive',
            title: 'File Read Error',
            description: 'Could not read the selected file.',
        });
        setIsParsing(false);
    }
  };

  const onSeedDatabase = async () => {
    setIsSeeding(true);
    toast({
      title: 'Seeding Database...',
      description: 'Populating the Firestore database with the latest IPO data.',
    });

    const result = await seedDatabaseAction();

    if (result.success) {
      toast({
        title: 'Database Seeding Successful',
        description: result.message,
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Database Seeding Failed',
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
                    <CardTitle>Prospectus Parser</CardTitle>
                    <CardDescription>
                        Upload a Red Herring Prospectus (RHP) to automatically extract key IPO details using AI.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="prospectus-file">PDF Document</Label>
                        <Input id="prospectus-file" type="file" accept=".pdf" ref={fileInputRef} disabled={isParsing} />
                    </div>
                    <Button onClick={onParseProspectus} disabled={isParsing}>
                        <Upload className={`mr-2 h-4 w-4 ${isParsing ? 'animate-spin' : ''}`} />
                        {isParsing ? 'Parsing...' : 'Upload & Parse'}
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Database Management</CardTitle>
                    <CardDescription>
                        Use this to populate your Firestore database with the complete set of sample IPO data.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                     <Button onClick={onSeedDatabase} disabled={isSeeding}>
                        <Database className={`mr-2 h-4 w-4 ${isSeeding ? 'animate-spin' : ''}`} />
                        {isSeeding ? 'Seeding...' : 'Seed Database'}
                    </Button>
                </CardContent>
                 <CardFooter className="text-xs text-muted-foreground">
                    Note: This will overwrite any existing IPO data in your database.
                </CardFooter>
            </Card>
        </div>
      </div>
    </AppShell>
  );
}

    