"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Home, ArrowLeft } from 'lucide-react';
import MainLayout from '@/components/layouts/MainLayout';

export default function NotFound() {
  const { isSignedIn, isLoaded } = useAuth();
  const [redirectPath, setRedirectPath] = useState('/');
  
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      setRedirectPath('/home');
    }
  }, [isLoaded, isSignedIn]);

  return (
		<MainLayout>
    <div className="min-h-screen bg-photo-primary flex flex-col items-center justify-center text-photo-secondary p-4">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-photo-indigo/5 via-transparent to-photo-rose/5 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-photo-primary via-transparent to-photo-primary/80 pointer-events-none" />
      
      <div className="relative z-10 max-w-md w-full text-center">
        <h1 className="text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-photo-blue to-photo-pink">
          404
        </h1>
        
        <h2 className="text-2xl font-semibold mt-4 mb-6">
          Page Not Found
        </h2>
        
        <p className="text-photo-secondary/70 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={redirectPath}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-photo-indigo to-photo-violet rounded-lg text-photo-secondary hover:opacity-90 transition-opacity"
          >
            <Home className="h-4 w-4" />
            <span>Go to Home</span>
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-photo-secondary/10 rounded-lg text-photo-secondary hover:bg-photo-secondary/20 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
		</MainLayout>
  );
}