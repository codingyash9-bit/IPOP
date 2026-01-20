'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import type { Ipo } from '@/lib/types';
import { IpoCard } from './ipo-card';
import { collection } from 'firebase/firestore';
import { Skeleton } from '../ui/skeleton';
import { useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


export function IpoList() {
  const firestore = useFirestore();
  const iposCollection = useMemoFirebase(() => collection(firestore, 'ipos'), [firestore]);
  const { data: ipos, isLoading } = useCollection<Ipo>(iposCollection);

  const { liveIpos, upcomingIpos } = useMemo(() => {
    if (!ipos) {
      return { liveIpos: [], upcomingIpos: [] };
    }

    // Use toISOString().slice(0, 10) to get a reliable 'YYYY-MM-DD' UTC date string.
    // This avoids all timezone and local time issues.
    const todayString = new Date().toISOString().slice(0, 10);

    const liveIpos = ipos.filter(ipo => ipo.ipoDate < todayString);
    const upcomingIpos = ipos.filter(ipo => ipo.ipoDate >= todayString);

    // Sort both lists by date string directly
    liveIpos.sort((a, b) => b.ipoDate.localeCompare(a.ipoDate));
    upcomingIpos.sort((a, b) => a.ipoDate.localeCompare(b.ipoDate));

    return { liveIpos, upcomingIpos };
  }, [ipos]);


  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <Skeleton className="h-10 w-64 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Skeleton className="h-80 w-full" />
            <Skeleton className="h-80 w-full" />
            <Skeleton className="h-80 w-full" />
          </div>
        </div>
      </div>
    );
  }
  
  if (!ipos || ipos.length === 0) {
      return (
          <div className="text-center col-span-full py-16 bg-muted/50 rounded-lg">
              <h3 className="text-xl font-semibold">Database is Empty</h3>
              <p className="text-muted-foreground mt-2">No IPO data was found.</p>
              <p className="text-sm text-muted-foreground mt-2">Please go to the Settings page and click the "Seed Database" button to populate the application with sample data.</p>
          </div>
      )
  }

  return (
    <Tabs defaultValue="live" className="w-full">
      <TabsList className="grid w-full grid-cols-2 max-w-sm mx-auto">
        <TabsTrigger value="upcoming">Upcoming IPOs</TabsTrigger>
        <TabsTrigger value="live">Live & Listed</TabsTrigger>
      </TabsList>
      <TabsContent value="upcoming">
        <div className="mt-6">
            {upcomingIpos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcomingIpos.map((ipo) => (
                        <IpoCard key={ipo.id} ipo={ipo} />
                    ))}
                </div>
            ) : (
                 <p className="text-muted-foreground text-center py-8">No upcoming IPOs at the moment. Check back soon!</p>
            )}
        </div>
      </TabsContent>
      <TabsContent value="live">
         <div className="mt-6">
             {liveIpos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {liveIpos.map((ipo) => (
                        <IpoCard key={ipo.id} ipo={ipo} />
                    ))}
                </div>
            ) : (
                <p className="text-muted-foreground text-center py-8">No recently listed IPOs found.</p>
            )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
