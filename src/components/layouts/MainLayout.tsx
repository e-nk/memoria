import React, { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  fullHeight?: boolean;
}

const MainLayout = ({ 
  children, 
  showHeader = true, 
  showFooter = true,
  fullHeight = true
}: LayoutProps) => {
  return (
    <div className={`flex flex-col ${fullHeight ? 'min-h-screen' : ''} bg-photo-primary relative`}>
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-photo-indigo/5 via-transparent to-photo-rose/5 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-photo-primary via-transparent to-photo-primary/80 pointer-events-none" />
      
      {showHeader && <Header />}
      <main className="flex-grow relative z-10">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

export default MainLayout;