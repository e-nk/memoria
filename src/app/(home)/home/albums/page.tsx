"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import Container from '@/components/layouts/Container';
import MyAlbumsHeader from '@/components/albums/MyAlbumsHeader';
import AlbumsList from '@/components/user/AlbumsList';
import AlbumCreateForm from '@/components/albums/AlbumCreateForm';

export default function MyAlbumsPage() {
  const { userId, userDetails, isLoaded } = useAuth();
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Get user's albums from Convex
  const albumsData = useQuery(
    api.albums.getAlbumsByUser,
    userId ? {
      userId: userId as Id<"users">,
      includePrivate: true,
      limit: 50
    } : "skip"
  );

  const albums = albumsData?.page || [];
  
  // Update loading state when data is loaded
  useEffect(() => {
    if (isLoaded && albumsData !== undefined) {
      setLoading(false);
    }
  }, [isLoaded, albumsData]);

  // Handle album creation
  const handleAlbumCreated = () => {
    setShowCreateForm(false);
    // The query will automatically refresh
  };

  return (
    <div className="py-8">
      <Container>
        <MyAlbumsHeader 
          userName={userDetails?.name || 'User'}
          albumCount={albums.length}
          onCreateAlbum={() => setShowCreateForm(true)}
        />
        
        {showCreateForm && (
          <div className="mt-6 mb-8">
            <AlbumCreateForm 
              onAlbumCreated={handleAlbumCreated}
              onCancel={() => setShowCreateForm(false)}
            />
          </div>
        )}
        
        <div className="mt-8">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-photo-indigo"></div>
            </div>
          ) : albums.length === 0 && !showCreateForm ? (
            <div className="bg-photo-secondary/5 backdrop-blur-sm border border-photo-secondary/10 rounded-xl p-8 text-center">
              <p className="text-photo-secondary/70 mb-4">
                You don't have any albums yet
              </p>
              <button 
                onClick={() => setShowCreateForm(true)}
                className="px-4 py-2 bg-gradient-to-r from-photo-indigo to-photo-violet text-photo-secondary rounded-lg hover:opacity-90 transition-opacity"
              >
                Create Your First Album
              </button>
            </div>
          ) : (
            <AlbumsList albums={albums} isOwner={true} />
          )}
        </div>
      </Container>
    </div>
  );
}