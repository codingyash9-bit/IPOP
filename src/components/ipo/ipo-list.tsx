'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import type { Ipo } from '@/lib/types';
import { IpoCard } from './ipo-card';
import { collection } from 'firebase/firestore';
import { Skeleton } from '../ui/skeleton';
import { useMemo } from 'react';
import { Rocket } from 'lucide-react';

export function IpoList() {
  const firestore = useFirestore();
  const iposCollection = useMemoFirebase(() => collection(firestore, 'ipos'), [firestore]);
  const { data: ipos, isLoading } = useCollection<Ipo>(iposCollection);

  const { liveIpos, upcomingIpos } = useMemo(() => {
    if (!ipos) {
      return { liveIpos: [], upcomingIpos: [] };
    }
    const now = new Date();
    // Set time to 00:00:00 to compare dates only, not time
    now.setHours(0, 0, 0, 0);

    const liveIpos = ipos.filter(ipo => new Date(ipo.ipoDate) < now);
    const upcomingIpos = ipos.filter(ipo => new Date(ipo.ipoDate) >= now);
    
    // Sort both lists by date
    liveIpos.sort((a, b) => new Date(b.ipoDate).getTime() - new Date(a.ipoDate).getTime());
    upcomingIpos.sort((a, b) => new Date(a.ipoDate).getTime() - new Date(b.ipoDate).getTime());

    return { liveIpos, upcomingIpos };
  }, [ipos]);


  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <Skeleton className="h-8 w-48 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Skeleton className="h-80 w-full" />
            <Skeleton className="h-80 w-full" />
          </div>
        </div>
        <div>
          <Skeleton className="h-8 w-48 mb-4" />
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
    <div className="space-y-12">
        <section>
             <h2 className="text-2xl font-bold font-headline mb-4 flex items-center gap-2">
                <Rocket className="text-primary"/>
                Upcoming IPOs
            </h2>
            {upcomingIpos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcomingIpos.map((ipo) => (
                        <IpoCard key={ipo.id} ipo={ipo} />
                    ))}
                </div>
            ) : (
                 <p className="text-muted-foreground">No upcoming IPOs at the moment. Check back soon!</p>
            )}
        </section>
        <section>
            <h2 className="text-2xl font-bold font-headline mb-4">Live & Recently Listed</h2>
             {liveIpos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {liveIpos.map((ipo) => (
                        <IpoCard key={ipo.id} ipo={ipo} />
                    ))}
                </div>
            ) : (
                <p className="text-muted-foreground">No recently listed IPOs found.</p>
            )}
        </section>
    </div>
  );
}
