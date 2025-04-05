"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Container from './Container';
import { SignInButton, UserButton, useAuth } from '@clerk/nextjs';
import { Home } from 'lucide-react';

const Header = () => {
  const { isSignedIn } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Handle scroll events to add background when scrolled
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300 ${
      isScrolled ? 'bg-photo-primary/90 backdrop-blur-sm shadow-md' : 'bg-transparent'
    }`}>
      <Container>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-photo-purple">Memoria</span>
          </Link>

          {/* Navigation and Auth */}
          <div className="flex items-center gap-4">
            {isSignedIn && (
              <Link 
                href="/home" 
                className="flex items-center gap-2 px-4 py-2 text-photo-secondary hover:text-photo-indigo transition-colors"
              >
                <Home className="h-4 w-4" />
                <span>Explore Photos</span>
              </Link>
            )}
            
            {isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <SignInButton mode="modal">
                <button className="px-4 py-2 text-black bg-photo-secondary rounded-md">
                  Login
                </button>
              </SignInButton>
            )}
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;