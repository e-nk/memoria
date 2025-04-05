import { useState, useCallback } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useAuth } from '@/context/AuthContext';
import { Id } from '@/convex/_generated/dataModel';
import { usePhotoUpload } from '@/utils/uploadUtils';

export function usePhotos() {
  const { userId } = useAuth();
  const { uploadPhoto } = usePhotoUpload();
  
  // Mutations
  const updatePhotoMutation = useMutation(api.photos.updatePhoto);
  const deletePhotoMutation = useMutation(api.photos.deletePhoto);
  
  // State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get photos by album
  const getAlbumPhotos = useCallback((albumId: Id<"albums">) => {
    return useQuery(api.photos.getPhotosByAlbum, { albumId });
  }, []);
  
  // Get photo by ID
  const getPhoto = useCallback((photoId: Id<"photos">) => {
    return useQuery(api.photos.getPhotoById, { photoId });
  }, []);
  
  // Get explore photos
  const getExplorePhotos = useCallback(() => {
    return useQuery(api.photos.getExplorePhotos, {});
  }, []);
  
  // Add a photo to an album
  const addPhoto = async ({
    file,
    albumId,
    title,
    description,
    tags,
  }: {
    file: File;
    albumId: Id<"albums">;
    title: string;
    description?: string;
    tags?: string[];
  }) => {
    if (!userId) {
      setError('You must be logged in to upload a photo');
      return null;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const { photoId } = await uploadPhoto({
        file,
        albumId: albumId as string,
        userId: userId as string,
        title,
        description,
        tags,
      });
      
      return photoId;
    } catch (err) {
      console.error('Error uploading photo:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload photo');
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update a photo
  const updatePhoto = async ({
    photoId,
    title,
    description,
    tags,
  }: {
    photoId: Id<"photos">;
    title?: string;
    description?: string;
    tags?: string[];
  }) => {
    if (!userId) {
      setError('You must be logged in to update a photo');
      return false;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      await updatePhotoMutation({
        photoId,
        userId: userId as Id<"users">,
        title,
        description,
        tags,
      });
      
      return true;
    } catch (err) {
      console.error('Error updating photo:', err);
      setError(err instanceof Error ? err.message : 'Failed to update photo');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Delete a photo
  const deletePhoto = async (photoId: Id<"photos">) => {
    if (!userId) {
      setError('You must be logged in to delete a photo');
      return false;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      await deletePhotoMutation({
        photoId,
        userId: userId as Id<"users">,
      });
      
      return true;
    } catch (err) {
      console.error('Error deleting photo:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete photo');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Search photos
  const searchPhotos = useCallback((query: string) => {
    return useQuery(api.photos.searchPhotos, { searchQuery: query });
  }, []);
  
  return {
    // Queries
    getAlbumPhotos,
    getPhoto,
    getExplorePhotos,
    searchPhotos,
    
    // Mutations
    addPhoto,
    updatePhoto,
    deletePhoto,
    
    // State
    isLoading,
    error,
  };
}