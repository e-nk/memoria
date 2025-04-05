// context/AuthContext.tsx
"use client";

import { createContext, useContext, ReactNode } from 'react';
import { useConvexAuth } from '@/hooks/useConvexAuth';

interface AuthContextProps {
  isLoaded: boolean;
  isAuthenticated: boolean;
  userId: string | null;
  userDetails: any | null;
}

const AuthContext = createContext<AuthContextProps>({
  isLoaded: false,
  isAuthenticated: false,
  userId: null,
  userDetails: null,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const { isLoaded, isAuthenticated, user } = useConvexAuth();

  const value = {
    isLoaded,
    isAuthenticated,
    userId: user?._id || null,
    userDetails: user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}