import { ipos } from '@/lib/ipo-data';
import { IpoCard } from './ipo-card';

export function IpoList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {ipos.map((ipo) => (
        <IpoCard key={ipo.id} ipo={ipo} />
      ))}
    </div>
  );
}
