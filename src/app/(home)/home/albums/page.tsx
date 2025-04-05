"use client";

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Container from '@/components/layouts/Container';
import MyAlbumsHeader from '@/components/albums/MyAlbumsHeader';
import AlbumsList from '@/components/user/AlbumsList'; // Reusing the component from user page

interface AlbumProps {
  userId: number;
  id: number;
  title: string;
}

export default function MyAlbumsPage() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const [albums, setAlbums] = useState<AlbumProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        setLoading(true);
        
        // For demo purposes, we'll get user 1's albums since we don't have real user mapping
        // In a real app with Convex, you would fetch the user's actual albums
        const userId = 1; // Demo user ID
        
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}/albums`);
        const data = await response.json();
        
        setAlbums(data);
      } catch (error) {
        console.error('Error fetching albums:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isUserLoaded) {
      fetchAlbums();
    }
  }, [isUserLoaded]);

  return (
    <div className="py-8">
      <Container>
        <MyAlbumsHeader 
          userName={isUserLoaded ? user?.fullName || user?.username : 'User'}
          albumCount={albums.length}
        />
        
        <div className="mt-8">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-photo-indigo"></div>
            </div>
          ) : albums.length === 0 ? (
            <div className="bg-photo-secondary/5 backdrop-blur-sm border border-photo-secondary/10 rounded-xl p-8 text-center">
              <p className="text-photo-secondary/70 mb-3">
                You don't have any albums yet
              </p>
              <button className="px-4 py-2 bg-gradient-to-r from-photo-indigo to-photo-violet text-photo-secondary rounded-lg hover:opacity-90 transition-opacity">
                Create Your First Album
              </button>
            </div>
          ) : (
            <AlbumsList albums={albums} />
          )}
        </div>
      </Container>
    </div>
  );
}