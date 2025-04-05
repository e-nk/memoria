"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useAuth } from '@/context/AuthContext';
import Container from '@/components/layouts/Container';
import AlbumHeader from '@/components/album/AlbumHeader';
import PhotoGrid from '@/components/album/PhotoGrid';
import PhotoUpload from '@/components/photo/PhotoUpload';

export default function AlbumPage() {
  const params = useParams();
  const albumId = params.id as string;
  const { userId, userDetails } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showUploadForm, setShowUploadForm] = useState(false);

  // Always query all data, using "skip" for conditional queries
  const album = useQuery(api.albums.getAlbumById, { albumId });
  
  // Always fetch owner data, but use "skip" when album is undefined
  const ownerUserId = album?.userId;
  const albumOwner = useQuery(
    api.users.getUserById, 
    ownerUserId ? { userId: ownerUserId } : "skip"
  );
  
  // Always fetch photos
  const photosData = useQuery(api.photos.getPhotosByAlbum, { albumId, limit: 100 });
  
  const photos = photosData?.items || [];
  
  // Determine if the current user is the album owner
  const isOwner = album && userId ? album.userId === userId : false;
  
  // Update loading state when data is loaded
  useEffect(() => {
    // Don't check albumOwner here since it depends on album
    if (album !== undefined && photosData !== undefined) {
      if (album && ownerUserId) {
        // If we have an album, check if owner data is loaded
        if (albumOwner !== undefined) {
          setLoading(false);
        }
      } else {
        // If no album, we don't need owner data
        setLoading(false);
      }
    }
  }, [album, photosData, albumOwner, ownerUserId]);

  // Handle errors
  useEffect(() => {
    if (!loading) {
      if (!album) {
        setError('Album not found');
      } else if (!album.isPublic && !isOwner) {
        setError('This album is private');
      }
    }
  }, [loading, album, isOwner]);

  // Handle photo upload completion
  const handleUploadComplete = () => {
    setShowUploadForm(false);
  };

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

  if (error || !album || (album && !albumOwner)) {
    return (
      <div className="py-8">
        <Container>
          <div className="py-12 text-center">
            <h2 className="text-xl font-semibold text-photo-secondary mb-2">
              {error || 'Album not found'}
            </h2>
            <p className="text-photo-secondary/70">
              The requested album could not be loaded.
            </p>
          </div>
        </Container>
      </div>
    );
  }

  // Prepare the album with owner data
  const albumWithOwner = {
    ...album,
    user: {
      id: albumOwner._id,
      name: albumOwner.name,
      username: albumOwner.username
    }
  };

  return (
    <div className="py-8">
      <Container>
        <AlbumHeader 
          album={albumWithOwner}
          photoCount={photos.length}
          isOwner={isOwner}
          onAddPhoto={() => setShowUploadForm(true)}
        />
        
        {showUploadForm && isOwner && (
          <div className="mt-6 mb-8">
            <PhotoUpload 
              albumId={albumId}
              onUploadComplete={handleUploadComplete}
              onCancel={() => setShowUploadForm(false)}
            />
          </div>
        )}
        
        <div className="mt-10">
          <h2 className="text-xl font-semibold text-photo-secondary mb-6">Photos</h2>
          
          {photos.length === 0 ? (
            <div className="bg-photo-secondary/5 backdrop-blur-sm border border-photo-secondary/10 rounded-xl p-8 text-center">
              <p className="text-photo-secondary/70">
                {isOwner 
                  ? "This album doesn't have any photos yet. Add your first photo!"
                  : "No photos found in this album"
                }
              </p>
              
              {isOwner && !showUploadForm && (
                <button
                  onClick={() => setShowUploadForm(true)}
                  className="mt-4 px-4 py-2 bg-gradient-to-r from-photo-indigo to-photo-violet text-photo-secondary rounded-lg hover:opacity-90 transition-opacity"
                >
                  Add Photos
                </button>
              )}
            </div>
          ) : (
            <PhotoGrid photos={photos} isOwner={isOwner} />
          )}
        </div>
      </Container>
    </div>
  );
}