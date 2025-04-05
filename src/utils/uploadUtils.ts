// utils/uploadUtils.ts
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

// Maximum file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Allowed file types
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

/**
 * Creates a thumbnail from an image file
 */
const createThumbnail = async (file: File): Promise<Blob> => {
  // In a real app, you would resize the image here
  // For this example, we'll just return the same file as the thumbnail
  return file;
};

/**
 * Validates an image file before upload
 */
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  // Check file type
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `File type not supported. Please upload JPEG, PNG, WebP, or GIF.`,
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`,
    };
  }

  return { valid: true };
};

/**
 * Custom hook for uploading a photo to an album
 */
export function usePhotoUpload() {
  const generateUploadUrl = useMutation(api.photos.generateUploadUrl);
  const addPhoto = useMutation(api.photos.addPhoto);

  const uploadPhoto = async ({
    file,
    albumId,
    userId,
    title,
    description,
    tags,
  }: {
    file: File;
    albumId: string;
    userId: string;
    title: string;
    description?: string;
    tags?: string[];
  }) => {
    try {
      // Validate the file
      const validation = validateImageFile(file);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      // Get upload URL
      const uploadUrl = await generateUploadUrl();

      // Upload the file to Convex storage
      const result = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      });

      if (!result.ok) {
        throw new Error('Failed to upload image');
      }

      // Get the storage ID from the response
      const { storageId } = await result.json();

      // Create a thumbnail
      // In a real app, you would resize the image here
      // For now, just use the same image as both original and thumbnail
      const thumbnailStorageId = storageId;

      // Add the photo directly (skip the processImage action)
      const photoId = await addPhoto({
        albumId,
        userId,
        title: title || file.name,
        description,
        storageId,
        thumbnailStorageId,
        tags,
      });

      return { photoId, storageId, thumbnailStorageId };
    } catch (error) {
      console.error('Error uploading photo:', error);
      throw error;
    }
  };

  return { uploadPhoto };
}