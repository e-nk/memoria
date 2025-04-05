"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useAuth } from '@/context/AuthContext';
import { usePhotos } from '@/hooks/usePhotos';
import Container from '@/components/layouts/Container';
import PhotoHeader from '@/components/photo/PhotoHeader';
import PhotoEditor from '@/components/photo/PhotoEditor';

export default function PhotoPage() {
  const params = useParams();
  const router = useRouter();
  const photoId = params.id as string;
  const { userId } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch photo data using ID string
  const photo = useQuery(api.photos.getPhotoById, { photoId });
  
  // Album depends on photo, use "skip" pattern to maintain hook order
  const albumId = photo?.albumId;
  const album = useQuery(
    api.albums.getAlbumById, 
    albumId ? { albumId } : "skip"
  );
  
  // Determine if the current user is the photo owner
  const isOwner = photo && userId ? photo.userId === userId : false;
  
  const { updatePhoto, deletePhoto, isLoading: isActionLoading } = usePhotos();
  
  // Enable edit mode from URL parameter
  useEffect(() => {
    // Check if the URL contains /edit at the end
    const isEditMode = params.edit === 'edit';
    if (isEditMode && isOwner) {
      setIsEditing(true);
    }
  }, [params, isOwner]);
  
  // Update loading state when data is loaded
  useEffect(() => {
    if (photo !== undefined) {
      if (photo && albumId) {
        // If we have a photo, check if album data is loaded
        if (album !== undefined) {
          setLoading(false);
        }
      } else {
        // If no photo, we don't need album data
        setLoading(false);
      }
    }
  }, [photo, album, albumId]);

  // Handle errors
  useEffect(() => {
    if (!loading) {
      if (!photo) {
        setError('Photo not found');
      } else if (!album) {
        setError('Album not found');
      } else if (!album.isPublic && !isOwner) {
        setError('This photo is in a private album');
      }
    }
  }, [loading, photo, album, isOwner]);

  const handleEditTitle = () => {
    setIsEditing(true);
  };

  const handleSaveTitle = async (newTitle: string, newDescription?: string, newTags?: string[]) => {
    if (!photo || !isOwner) return;
    
    console.log('Saving photo with:', { newTitle, newDescription, newTags });
    
    const success = await updatePhoto({
      photoId: photo._id,
      title: newTitle,
      description: newDescription,
      tags: newTags,
    });
    
    console.log('Save result:', success);
    
    if (success) {
      setIsEditing(false);
      
      // If we were in edit mode from URL, navigate back to the normal view
      if (params.edit === 'edit') {
        router.push(`/home/photo/${photoId}`);
      }
    } else {
      alert('Failed to update photo');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    
    // If we were in edit mode from URL, navigate back to the normal view
    if (params.edit === 'edit') {
      router.push(`/home/photo/${photoId}`);
    }
  };
  
  const handleDeletePhoto = async () => {
    if (!photo || !isOwner) return;
    
    if (confirm('Are you sure you want to delete this photo? This action cannot be undone.')) {
      const success = await deletePhoto(photo._id);
      
      if (success) {
        // Navigate back to the album
        router.push(`/home/album/${photo.albumId}`);
      } else {
        alert('Failed to delete photo');
      }
    }
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

  if (error || !photo || (photo && !album)) {
    return (
      <div className="py-8">
        <Container>
          <div className="py-12 text-center">
            <h2 className="text-xl font-semibold text-photo-secondary mb-2">
              {error || 'Photo not found'}
            </h2>
            <p className="text-photo-secondary/70">
              The requested photo could not be loaded.
            </p>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-8">
      <Container boxed>
        <PhotoHeader 
          photo={photo} 
          album={album}
          isOwner={isOwner}
          onEdit={handleEditTitle}
          onDelete={handleDeletePhoto}
          isEditing={isEditing}
        />
        
        <div className="mt-6 bg-photo-darkgray/30 p-2 rounded-xl">
          <div className="relative w-full rounded-lg overflow-hidden">
            <Image
              src={photo.imageUrl}
              alt={photo.title}
              width={1200}
              height={800}
              className="w-full h-auto mx-auto"
              priority
            />
          </div>
        </div>
        
        {isEditing ? (
          <PhotoEditor
            initialTitle={photo.title}
            initialDescription={photo.description || ''}
            initialTags={photo.tags || []}
            onSave={handleSaveTitle}
            onCancel={handleCancelEdit}
            isLoading={isActionLoading}
          />
        ) : (
          <div className="mt-6 bg-photo-secondary/5 backdrop-blur-sm border border-photo-secondary/10 rounded-xl p-4">
            <h1 className="text-xl text-photo-secondary">
              {photo.title}
            </h1>
            
            {photo.description && (
              <p className="mt-2 text-photo-secondary/70">
                {photo.description}
              </p>
            )}
            
            {photo.tags && photo.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {photo.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="bg-photo-secondary/10 text-photo-secondary/80 px-2 py-1 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </Container>
    </div>
  );
}