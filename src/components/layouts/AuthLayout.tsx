"use client";

import React, { ReactNode } from 'react';
import Navigation from '@/components/navigation/Navigation';
import Footer from '@/components/layouts/Footer';

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
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