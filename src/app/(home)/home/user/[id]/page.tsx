"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Container from '@/components/layouts/Container';
import UserHeader from '@/components/user/UserHeader';
import AlbumsList from '@/components/user/AlbumsList';

interface UserProps {
  id: number;
  name: string;
  username: string;
  email: string;
  phone?: string;
  website?: string;
  company?: {
    name: string;
    catchPhrase?: string;
    bs?: string;
  };
}

interface AlbumProps {
  userId: number;
  id: number;
  title: string;
}

export default function UserPage() {
  const params = useParams();
  const userId = Number(params.id);
  
  const [user, setUser] = useState<UserProps | null>(null);
  const [albums, setAlbums] = useState<AlbumProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Fetch user
        const userResponse = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
        if (!userResponse.ok) {
          throw new Error('User not found');
        }
        const userData = await userResponse.json();
        
        // Fetch user's albums
        const albumsResponse = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}/albums`);
        const albumsData = await albumsResponse.json();
        
        setUser(userData);
        setAlbums(albumsData);
        setError('');
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load user data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

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