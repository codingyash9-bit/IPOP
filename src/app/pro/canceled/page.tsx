'use client';
import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { XCircle } from 'lucide-react';
import Link from 'next/link';

export default function CanceledPage() {
  return (
    <AppShell>
      <div className="flex items-center justify-center py-12">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50">
              <XCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
            </div>
            <CardTitle className="mt-4 text-2xl font-bold font-headline">Payment Canceled</CardTitle>
            <CardDescription>
              Your checkout process was canceled. Your account has not been upgraded. You can try again at any time.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full" variant="outline">
              <Link href="/">Back to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
