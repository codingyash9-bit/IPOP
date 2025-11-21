import { AppShell } from '@/components/layout/app-shell';
import { IpoList } from '@/components/ipo/ipo-list';

export function Dashboard() {
  return (
    <AppShell>
      <div className="flex flex-col gap-8">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold font-headline tracking-tight">
            Upcoming IPOs
          </h1>
          <p className="text-muted-foreground">
            AI-powered insights into the next big market debuts.
          </p>
        </header>
        <IpoList />
      </div>
    </AppShell>
  );
}
