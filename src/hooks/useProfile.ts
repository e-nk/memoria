import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useAuth } from '@/context/AuthContext';

interface UpdateProfileData {
  name?: string;
  username?: string;
}

export function useProfile() {
  const { userId, userDetails } = useAuth();
  const createOrUpdateUser = useMutation(api.users.createOrUpdateUser);
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const updateProfile = async (data: UpdateProfileData) => {
    if (!userId || !userDetails) {
      setError('You must be logged in to update your profile');
      return false;
    }
    
    try {
      setIsUpdating(true);
      setError(null);
      
      await createOrUpdateUser({
        clerkId: userDetails.clerkId,
        email: userDetails.email,
        name: data.name || userDetails.name,
        username: data.username || userDetails.username,
        imageUrl: userDetails.imageUrl,
      });
      
      return true;
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      return false;
    } finally {
      setIsUpdating(false);
    }
  };
  
  const checkUsernameAvailability = async (username: string): Promise<boolean> => {
    try {
      // Skip check if username is unchanged
      if (userDetails?.username === username) {
        return true;
      }
      
      // TODO: Add isUsernameAvailable query to check availability
      // For now, we'll simulate the check
      return true;
    } catch (err) {
      console.error('Error checking username availability:', err);
      return false;
    }
  };
  
  return {
    updateProfile,
    checkUsernameAvailability,
    isUpdating,
    error,
  };
}