"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Container from '@/components/layouts/Container';
import PhotoHeader from '@/components/photo/PhotoHeader';
import PhotoEditor from '@/components/photo/PhotoEditor';

interface AlbumProps {
  id: number;
  title: string;
  userId: number;
}

interface PhotoProps {
  id: number;
  albumId: number;
  title: string;
  url: string;
  thumbnailUrl: string;
  album?: AlbumProps;
}

export default function PhotoPage() {
  const params = useParams();
  const router = useRouter();
  const photoId = Number(params.id);
  
  const [photo, setPhoto] = useState<PhotoProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchPhotoData = async () => {
      try {
        setLoading(true);
        
        // Fetch photo
        const photoResponse = await fetch(`https://jsonplaceholder.typicode.com/photos/${photoId}`);
        if (!photoResponse.ok) {
          throw new Error('Photo not found');
        }
        const photoData = await photoResponse.json();
        
        // Fetch album info for this photo
        const albumResponse = await fetch(`https://jsonplaceholder.typicode.com/albums/${photoData.albumId}`);
        const albumData = await albumResponse.json();
        
        setPhoto({
          ...photoData,
          album: {
            id: albumData.id,
            title: albumData.title,
            userId: albumData.userId
          }
        });
        setError('');
      } catch (error) {
        console.error('Error fetching photo data:', error);
        setError('Failed to load photo data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (photoId) {
      fetchPhotoData();
    }
  }, [photoId]);

  const handleEditTitle = () => {
    setIsEditing(true);
  };

  const handleSaveTitle = async (newTitle: string) => {
    if (!photo) return;
    
    try {
      setLoading(true);
      
      // Send PATCH request to update the photo title
      const response = await fetch(`https://jsonplaceholder.typicode.com/photos/${photoId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTitle }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update photo title');
      }
      
      // Update the photo in state
      setPhoto({
        ...photo,
        title: newTitle
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating photo title:', error);
      alert('Failed to update the photo title. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  if (loading && !photo) {
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

  if (error || !photo) {
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
          onEdit={handleEditTitle}
          isEditing={isEditing}
        />
        
        <div className="mt-6 bg-photo-darkgray/30 p-2 rounded-xl">
          <div className="relative w-full rounded-lg overflow-hidden">
            <Image
              src={photo.url}
              alt={photo.title}
              width={600}
              height={600}
              className="w-full h-auto mx-auto"
              priority
            />
          </div>
        </div>
        
        {isEditing ? (
          <PhotoEditor
            initialTitle={photo.title}
            onSave={handleSaveTitle}
            onCancel={handleCancelEdit}
            isLoading={loading}
          />
        ) : (
          <div className="mt-6 bg-photo-secondary/5 backdrop-blur-sm border border-photo-secondary/10 rounded-xl p-4">
            <h1 className="text-xl text-photo-secondary">
              {photo.title.charAt(0).toUpperCase() + photo.title.slice(1)}
            </h1>
          </div>
        )}
      </Container>
    </div>
  );
}