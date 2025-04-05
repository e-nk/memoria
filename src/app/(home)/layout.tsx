import { ReactNode } from 'react';
import AuthLayout from '@/components/layouts/AuthLayout';
import { Providers } from '../providers';

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <Providers>
      <AuthLayout>
        {children}
      </AuthLayout>
    </Providers>
  );
}