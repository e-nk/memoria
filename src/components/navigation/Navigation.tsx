"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import { Home, DiscAlbum, Image, Search, Menu, X } from 'lucide-react';

import Container from '../layouts/Container';

const Navigation = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navigationItems = [
    {
      name: 'Home',
      href: '/home',
      icon: <Home className="h-4 w-4" />
    },
    {
      name: 'My Albums',
      href: '/home/albums',
      icon: <DiscAlbum className="h-4 w-4" />
    },
    {
      name: 'Explore',
      href: '/home/explore',
      icon: <Search className="h-4 w-4" />
    }
  ];

  const isActive = (path: string) => {
    if (path === '/home' && pathname === '/home') {
      return true;
    }
    return pathname.startsWith(path) && path !== '/home';
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 py-3 transition-all duration-300 ${
      isScrolled ? 'bg-photo-primary/95 backdrop-blur-sm shadow-md' : 'bg-photo-primary/80 backdrop-blur-sm'
    }`}>
      <Container>
        <div className="flex items-center justify-between">
          <Link href="/home" className="flex items-center">
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-photo-blue to-photo-pink">Memoria</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navigationItems.map(item => (
              <Link 
                key={item.name}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  isActive(item.href) 
                    ? 'bg-photo-secondary/10 text-photo-secondary' 
                    : 'text-photo-secondary/70 hover:text-photo-secondary hover:bg-photo-secondary/5'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
            
            <div className="ml-4 pl-4 border-l border-photo-secondary/10">
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-8 h-8"
                  }
                }}
              />
            </div>
          </div>

          {/* Mobile Navigation Toggle */}
          <div className="flex items-center gap-4 md:hidden">
            <UserButton 
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  userButtonAvatarBox: "w-8 h-8"
                }
              }}
            />
            <button 
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg text-photo-secondary/80 hover:text-photo-secondary transition-colors"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="mt-4 py-3 px-2 bg-photo-darkgray/80 backdrop-blur-md rounded-xl md:hidden">
            <div className="flex flex-col space-y-2">
              {navigationItems.map(item => (
                <Link 
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.href) 
                      ? 'bg-photo-secondary/10 text-photo-secondary' 
                      : 'text-photo-secondary/70 hover:text-photo-secondary hover:bg-photo-secondary/5'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </Container>
    </nav>
  );
};

export default Navigation;