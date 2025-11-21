'use client';
import { useAuth } from '@/hooks/use-auth';
import { Dashboard } from '@/components/dashboard';
import { LoginPage } from '@/components/auth/login-page';

export default function Home() {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Dashboard /> : <LoginPage />;
}
