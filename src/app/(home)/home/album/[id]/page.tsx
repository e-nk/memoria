"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Container from '@/components/layouts/Container';
import AlbumHeader from '@/components/album/AlbumHeader';
import PhotoGrid from '@/components/album/PhotoGrid';

interface UserProps {
  id: number;
  name: string;
  username: string;
}

interface AlbumProps {
  userId: number;
  id: number;
  title: string;
  user?: UserProps;
}

interface PhotoProps {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

export default function AlbumPage() {
  const params = useParams();
  const albumId = Number(params.id);
  
  const [album, setAlbum] = useState<AlbumProps | null>(null);
  const [photos, setPhotos] = useState<PhotoProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAlbumData = async () => {
      try {
        setLoading(true);
        
        // Fetch album
        const albumResponse = await fetch(`https://jsonplaceholder.typicode.com/albums/${albumId}`);
        if (!albumResponse.ok) {
          throw new Error('Album not found');
        }
        const albumData = await albumResponse.json();
        
        // Fetch user info for this album
        const userResponse = await fetch(`https://jsonplaceholder.typicode.com/users/${albumData.userId}`);
        const userData = await userResponse.json();
        
        // Fetch album's photos
        const photosResponse = await fetch(`https://jsonplaceholder.typicode.com/albums/${albumId}/photos`);
        const photosData = await photosResponse.json();
        
        setAlbum({
          ...albumData,
          user: {
            id: userData.id,
            name: userData.name,
            username: userData.username
          }
        });
        setPhotos(photosData);
        setError('');
      } catch (error) {
        console.error('Error fetching album data:', error);
        setError('Failed to load album data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (albumId) {
      fetchAlbumData();
    }
  }, [albumId]);

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

  if (error || !album) {
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

  return (
    <div className="py-8">
      <Container>
        <AlbumHeader album={album} photoCount={photos.length} />
        
        <div className="mt-10">
          <h2 className="text-xl font-semibold text-photo-secondary mb-6">Photos</h2>
          
          {photos.length === 0 ? (
            <div className="bg-photo-secondary/5 backdrop-blur-sm border border-photo-secondary/10 rounded-xl p-8 text-center">
              <p className="text-photo-secondary/70">
                No photos found in this album
              </p>
            </div>
          ) : (
            <PhotoGrid photos={photos} />
          )}
        </div>
      </Container>
    </div>
  );
}