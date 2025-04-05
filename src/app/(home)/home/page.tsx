"use client";

import { useEffect, useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useAuth } from '@/context/AuthContext';
import Container from '@/components/layouts/Container';
import HomeHeader from '@/components/home/HomeHeader';
import UsersList from '@/components/home/UsersList';

export default function HomePage() {
  const { isLoaded, userDetails } = useAuth();
  const [loading, setLoading] = useState(true);

  // Fetch all users from Convex
  const users = useQuery(api.users.getAllUsers);
  
  // Update loading state when data is loaded
  useEffect(() => {
    if (isLoaded && users !== undefined) {
      setLoading(false);
    }
  }, [isLoaded, users]);

  return (
    <div className="py-8">
      <Container>
        <HomeHeader 
          userName={userDetails?.name || 'User'}
        />
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-photo-secondary mb-4">All Users</h2>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-photo-indigo"></div>
            </div>
          ) : (
            <UsersList users={users || []} />
          )}
        </div>
      </Container>
    </div>
  );
}