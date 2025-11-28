'use client';
import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function SuccessPage() {
  return (
    <AppShell>
      <div className="flex items-center justify-center py-12">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
              <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="mt-4 text-2xl font-bold font-headline">Upgrade Successful!</CardTitle>
            <CardDescription>
              Welcome to IPOP Pro. Your account has been upgraded, and you now have access to all premium features.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/">Back to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
