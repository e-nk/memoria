"use client";

import React, { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navigation from '@/components/navigation/Navigation';
import Footer from '@/components/layouts/Footer';

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const { isLoaded, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If auth is loaded and user is not authenticated, redirect to home
    if (isLoaded && !isAuthenticated) {
      router.push('/');
    }
  }, [isLoaded, isAuthenticated, router]);

  // Show loading state while checking authentication
  if (!isLoaded) {
    return (
      <div className="flex flex-col min-h-screen bg-photo-primary relative">
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-photo-indigo"></div>
        </div>
      </div>
    );
  }

  // If not authenticated, don't render anything (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  // Authenticated view
  return (
    <div className="flex flex-col min-h-screen bg-photo-primary relative">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-photo-indigo/5 via-transparent to-photo-rose/5 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-photo-primary via-transparent to-photo-primary/80 pointer-events-none" />
      
      <Navigation />
      
      {/* Main content with top padding for the fixed navigation */}
      <main className="flex-grow pt-16 relative z-10">
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default AuthLayout;