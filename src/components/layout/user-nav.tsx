'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/use-auth';
import { LogOut, Zap } from 'lucide-react';
import { createStripeCheckoutSession } from '@/app/actions/stripe';
import { useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';

export function UserNav() {
  const { user, logout } = useAuth();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  if (!user) {
    return null;
  }
  
  const userInitials = user.name
    ?.split(' ')
    .map((n) => n[0])
    .join('') || 'U';

  const handleUpgradeClick = () => {
    startTransition(async () => {
      const result = await createStripeCheckoutSession();
      if (result.error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error,
        });
      }
      // If successful, the user is redirected to Stripe by the server action.
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.avatarUrl} alt={`@${user.name}`} />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleUpgradeClick} disabled={isPending}>
            <Zap className="mr-2 h-4 w-4" />
            <span>{isPending ? "Redirecting..." : "Upgrade to Pro"}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
