import { useState, useCallback } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useAuth } from '@/context/AuthContext';
import { Id } from '@/convex/_generated/dataModel';

export function useAlbums() {
  const { userId } = useAuth();
  
  // Mutations
  const createAlbumMutation = useMutation(api.albums.createAlbum);
  const updateAlbumMutation = useMutation(api.albums.updateAlbum);
  const deleteAlbumMutation = useMutation(api.albums.deleteAlbum);
  
  // State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get user's albums
  const userAlbums = useQuery(
    api.albums.getAlbumsByUser,
    userId ? {
      userId: userId as Id<"users">,
      includePrivate: true,
    } : "skip"
  );
  
  // Get album by ID
  const getAlbum = useCallback((albumId: Id<"albums">) => {
    return useQuery(api.albums.getAlbumById, { albumId });
  }, []);
  
  // Create a new album
  const createAlbum = async ({
    title,
    description,
    category,
    isPublic,
  }: {
    title: string;
    description?: string;
    category?: string;
    isPublic: boolean;
  }) => {
    if (!userId) {
      setError('You must be logged in to create an album');
      return null;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const albumId = await createAlbumMutation({
        userId: userId as Id<"users">,
        title,
        description,
        category,
        isPublic,
      });
      
      return albumId;
    } catch (err) {
      console.error('Error creating album:', err);
      setError(err instanceof Error ? err.message : 'Failed to create album');
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update an album
  const updateAlbum = async ({
    albumId,
    title,
    description,
    category,
    isPublic,
    coverPhotoId,
  }: {
    albumId: Id<"albums">;
    title?: string;
    description?: string;
    category?: string;
    isPublic?: boolean;
    coverPhotoId?: Id<"photos">;
  }) => {
    if (!userId) {
      setError('You must be logged in to update an album');
      return false;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      await updateAlbumMutation({
        albumId,
        userId: userId as Id<"users">,
        title,
        description,
        category,
        isPublic,
        coverPhotoId,
      });
      
      return true;
    } catch (err) {
      console.error('Error updating album:', err);
      setError(err instanceof Error ? err.message : 'Failed to update album');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Delete an album
  const deleteAlbum = async (albumId: Id<"albums">) => {
    if (!userId) {
      setError('You must be logged in to delete an album');
      return false;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      await deleteAlbumMutation({
        albumId,
        userId: userId as Id<"users">,
      });
      
      return true;
    } catch (err) {
      console.error('Error deleting album:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete album');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Search albums
  const searchAlbums = useCallback((query: string) => {
    return useQuery(api.albums.searchAlbums, { searchQuery: query });
  }, []);
  
  return {
    // Queries
    userAlbums,
    getAlbum,
    searchAlbums,
    
    // Mutations
    createAlbum,
    updateAlbum,
    deleteAlbum,
    
    // State
    isLoading,
    error,
  };
}