import { ReactNode } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import AuthLayout from '@/components/layouts/AuthLayout';
import { Providers } from '../providers';

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <Providers>
      <AuthProvider>
        <AuthLayout>
          {children}
        </AuthLayout>
      </AuthProvider>
    </Providers>
  );
}