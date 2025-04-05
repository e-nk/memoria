// This file re-exports the API to make it easier to import in other files

import { api } from './_generated/api';
import { ConvexError } from 'convex/values';

// Export the API
export { api, ConvexError };

// Define error messages for common errors
export const ErrorMessages = {
  UNAUTHORIZED: 'You are not authorized to perform this action',
  NOT_FOUND: 'The requested resource was not found',
  ALREADY_EXISTS: 'This resource already exists',
  INVALID_INPUT: 'Invalid input provided',
  SERVER_ERROR: 'An unexpected error occurred',
};

// Helper function to handle async operations with proper error handling
export const handleAsyncOperation = async <T>(
  operation: Promise<T>,
  errorMessage: string = ErrorMessages.SERVER_ERROR
): Promise<T> => {
  try {
    return await operation;
  } catch (error) {
    console.error('Operation error:', error);
    if (error instanceof ConvexError) {
      throw error;
    }
    throw new ConvexError(
      error instanceof Error ? error.message : errorMessage
    );
  }
};