"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Container from '@/components/layouts/Container';
import UserHeader from '@/components/user/UserHeader';
import AlbumsList from '@/components/user/AlbumsList';

export default function UserPage() {
  const params = useParams();
  const userId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch user data from Convex
  const user = useQuery(api.users.getUserById, { userId });
  
  // Fetch user's albums from Convex
  const albumsData = useQuery(
    api.albums.getAlbumsByUser, 
    user ? { 
      userId, 
      includePrivate: false, // Only show public albums to other users
      limit: 50 
    } : "skip"
  );
  
  const albums = albumsData?.page || [];
  
  // Update loading state when data is loaded
  useEffect(() => {
    if (user !== undefined) {
      if (user) {
        if (albumsData !== undefined) {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }
  }, [user, albumsData]);

  // Handle errors
  useEffect(() => {
    if (!loading && !user) {
      setError('User not found');
    }
  }, [loading, user]);

  if (loading) {
    return (
      <div className="py-8">
        <Container>
          <div className="flex justify-center items-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-photo-indigo"></div>
          </div>
        </Container>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="py-8">
        <Container>
          <div className="py-12 text-center">
            <h2 className="text-xl font-semibold text-photo-secondary mb-2">
              {error || 'User not found'}
            </h2>
            <p className="text-photo-secondary/70">
              The requested user could not be loaded.
            </p>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-8">
      <Container>
        <UserHeader user={user} albumCount={albums.length} />
        
        <div className="mt-10">
          <h2 className="text-xl font-semibold text-photo-secondary mb-6">Albums</h2>
          
          {albums.length === 0 ? (
            <div className="bg-photo-secondary/5 backdrop-blur-sm border border-photo-secondary/10 rounded-xl p-8 text-center">
              <p className="text-photo-secondary/70">
                No albums found for this user
              </p>
            </div>
          ) : (
            <AlbumsList albums={albums} />
          )}
        </div>
      </Container>
    </div>
  );
}