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

    // Use UTC to avoid timezone issues.
    const today = new Date();
    const todayUtc = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));

    // This robustly parses YYYY-MM-DD into a UTC date.
    const parseDate = (dateString: string): Date => {
      const parts = dateString.split('-').map(Number);
      // Ensure we have 3 parts (year, month, day)
      if (parts.length === 3) {
        const [year, month, day] = parts;
        // JavaScript months are 0-indexed, so subtract 1 from the month.
        return new Date(Date.UTC(year, month - 1, day));
      }
      // Return an invalid date if the format is wrong
      return new Date(NaN);
    };

    const liveIpos = ipos.filter(ipo => {
      const ipoDate = parseDate(ipo.ipoDate);
      return ipoDate.getTime() < todayUtc.getTime();
    });
    
    const upcomingIpos = ipos.filter(ipo => {
        const ipoDate = parseDate(ipo.ipoDate);
        return ipoDate.getTime() >= todayUtc.getTime();
    });
    
    // Sort both lists by date
    liveIpos.sort((a, b) => parseDate(b.ipoDate).getTime() - parseDate(a.ipoDate).getTime());
    upcomingIpos.sort((a, b) => parseDate(a.ipoDate).getTime() - parseDate(b.ipoDate).getTime());

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
    <Tabs defaultValue="upcoming" className="w-full">
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
