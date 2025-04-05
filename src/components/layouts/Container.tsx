import { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  boxed?: boolean; // Option to add the boxed styling
  noPadding?: boolean; // Option to remove padding
  fullWidth?: boolean; // Option for wider container (max-w-8xl)
}

export default function Container({ 
  children, 
  className = '',
  boxed = false,
  noPadding = false,
  fullWidth = false
}: ContainerProps) {
  // Determine container width class
  const widthClass = fullWidth ? 'max-w-8xl' : 'max-w-7xl';

  return (
    <div className={`${widthClass} mx-auto px-4 sm:px-6 ${className}`}>
      {boxed ? (
        <div className={`${noPadding ? '' : 'p-6 md:p-8 lg:p-10'} bg-secondary/10 rounded-xl shadow-lg border border-white/5 backdrop-blur-sm overflow-hidden`}>
          {children}
        </div>
      ) : (
        children
      )}
    </div>
  );
}