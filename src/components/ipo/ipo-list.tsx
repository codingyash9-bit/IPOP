'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import type { Ipo } from '@/lib/types';
import { IpoCard } from './ipo-card';
import { collection } from 'firebase/firestore';
import { Skeleton } from '../ui/skeleton';

export function IpoList() {
  const firestore = useFirestore();
  const iposCollection = useMemoFirebase(() => collection(firestore, 'ipos'), [firestore]);
  const { data: ipos, isLoading } = useCollection<Ipo>(iposCollection);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Skeleton className="h-80 w-full" />
        <Skeleton className="h-80 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }
  
  if (!ipos || ipos.length === 0) {
      return (
          <div className="text-center col-span-full">
              <p className="text-muted-foreground">No IPOs found. The database might be empty.</p>
              <p className="text-sm text-muted-foreground mt-2">Consider running the database seeder script.</p>
          </div>
      )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {ipos.map((ipo) => (
        <IpoCard key={ipo.id} ipo={ipo} />
      ))}
    </div>
  );
}
