import React from 'react';
import Container from './Container';
import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-8 mt-auto border-t border-photo-border bg-photo-primary/95 backdrop-blur-sm relative z-10">
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-photo-secondary/70 text-sm">
              &copy; {currentYear} <span className="bg-clip-text text-transparent bg-gradient-to-r from-photo-blue to-photo-pink font-semibold">Memoria</span>. All rights reserved.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center md:space-x-6 space-y-2 md:space-y-0">
            <a 
              href="mailto:enocklagatson@gmail.com" 
              className="text-photo-secondary/80 hover:text-photo-secondary text-sm transition-colors font-medium"
            >
              enocklagatson@gmail.com
            </a>
            
            <div className="text-photo-secondary/70 text-sm flex items-center">
              <span className="mr-2">Powered by</span>
              <a 
                href="https://enock-dev.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-photo-secondary/80 hover:text-photo-secondary transition-colors font-medium"
              >
                Dev Enock
              </a>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;