import { Rocket } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center justify-center gap-2 text-lg font-bold font-headline text-primary">
      <Rocket className="h-6 w-6" />
      <span>IPOP</span>
    </div>
  );
}

export function SidebarLogo() {
  return (
    <div className="flex items-center gap-2 text-lg font-bold font-headline text-sidebar-foreground">
      <Rocket className="h-6 w-6 text-sidebar-primary" />
      <div className="duration-200 group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:w-0 transition-all ease-in-out">
        IPOP
      </div>
    </div>
  );
}
