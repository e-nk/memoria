// hooks/useConvexAuth.ts
import { useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { useAuth, useUser } from '@clerk/nextjs';
import { api } from '@/convex/_generated/api';

/**
 * A hook that synchronizes Clerk authentication with Convex
 * This ensures that when a user logs in with Clerk, their data is available in Convex
 */
export function useConvexAuth() {
  const { isSignedIn, isLoaded: isAuthLoaded } = useAuth();
  const { user, isLoaded: isUserLoaded } = useUser();
  
  // Convex mutations and queries
  const createOrUpdateUser = useMutation(api.users.createOrUpdateUser);
  const currentUser = useQuery(
    api.users.getCurrentUser,
    isSignedIn && isUserLoaded && user?.id 
      ? { clerkId: user.id } 
      : "skip"
  );

  // Sync Clerk user data to Convex when the user signs in
  useEffect(() => {
    // Make sure auth is loaded and user is signed in
    if (!isAuthLoaded || !isUserLoaded || !isSignedIn || !user) {
      return;
    }

    // If we already have the user in Convex, no need to update
    if (currentUser) {
      return;
    }

    // Get user data from Clerk
    const syncUser = async () => {
      try {
        const primaryEmail = user.emailAddresses.find(
          email => email.id === user.primaryEmailAddressId
        );
        
        if (!primaryEmail) {
          console.error("User has no primary email address");
          return;
        }

        // Create or update the user in Convex
        await createOrUpdateUser({
          clerkId: user.id,
          email: primaryEmail.emailAddress,
          name: user.fullName || user.firstName || 'User',
          username: user.username || `user${Date.now()}`,
          imageUrl: user.imageUrl,
        });
      } catch (error) {
        console.error("Error syncing user to Convex:", error);
      }
    };

    syncUser();
  }, [
    isAuthLoaded,
    isUserLoaded,
    isSignedIn,
    user,
    currentUser,
    createOrUpdateUser,
  ]);

  return {
    isLoaded: isAuthLoaded && isUserLoaded,
    isAuthenticated: isSignedIn,
    user: currentUser,
  };
}