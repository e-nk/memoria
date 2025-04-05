"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useAuth } from '@/context/AuthContext';
import Container from '@/components/layouts/Container';
import PhotoHeader from '@/components/photo/PhotoHeader';
import PhotoEditor from '@/components/photo/PhotoEditor';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function PhotoPage() {
  const params = useParams();
  const router = useRouter();
  const photoId = params.id as string;
  const { userId } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [albumIdForRedirect, setAlbumIdForRedirect] = useState<string | null>(null);

  // Get direct mutations for more control
  const deletePhotoMutation = useMutation(api.photos.deletePhoto);
  const updatePhotoMutation = useMutation(api.photos.updatePhoto);

  // Fetch photo data
  const photo = useQuery(api.photos.getPhotoById, { photoId });
  
  // Fetch album data when photo is available
  const albumId = photo?.albumId;
  const album = useQuery(
    api.albums.getAlbumById, 
    albumId ? { albumId } : "skip"
  );
  
  // Determine if the current user is the photo owner
  const isOwner = photo && userId ? photo.userId === userId : false;
  
  // Store album ID for redirect as soon as we have it
  useEffect(() => {
    if (photo && photo.albumId) {
      setAlbumIdForRedirect(photo.albumId);
    }
  }, [photo]);
  
  // Update loading state when data is loaded
  useEffect(() => {
    if (photo !== undefined) {
      if (photo && albumId) {
        if (album !== undefined) {
          setLoading(false);
        }
      } else {
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
    if (!photo || !isOwner || !userId) return;
    
    try {
      await updatePhotoMutation({
        photoId: photo._id,
        userId,
        title: newTitle,
        description: newDescription,
        tags: newTags,
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating photo:', error);
      alert('Failed to update photo');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };
  
  const handleDeletePhoto = async () => {
		if (!photo || !isOwner || !userId) return;
		
		if (confirm('Are you sure you want to delete this photo? This action cannot be undone.')) {
			try {
				setIsDeleting(true);
				
				// Delete the photo
				await deletePhotoMutation({
					photoId: photo._id,
					userId,
				});
				
				// Use window.location for a full page navigation
				window.location.href = '/home/albums';
				
			} catch (error) {
				console.error('Error deleting photo:', error);
				setIsDeleting(false);
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
            {albumIdForRedirect && (
              <div className="mt-4">
                <Link 
                  href={`/home/album/${albumIdForRedirect}`}
                  className="px-4 py-2 bg-photo-secondary/10 rounded-lg text-photo-secondary hover:bg-photo-secondary/20 transition-colors"
                >
                  Back to Album
                </Link>
              </div>
            )}
          </div>
        </Container>
      </div>
    );
  }

  // Show deletion loading state
  if (isDeleting) {
    return (
      <div className="py-8">
        <Container>
          <div className="flex flex-col justify-center items-center py-24">
            <Loader2 className="h-12 w-12 animate-spin text-photo-indigo mb-4" />
            <p className="text-photo-secondary">Deleting photo and redirecting...</p>
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
            isLoading={false}
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