// convex/photos.ts
import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";
import { ConvexError } from "convex/values";
import { Id } from "./_generated/dataModel";
import { StorageReader, StorageWriter } from "./_generated/server";

// Function to validate that a user owns a resource or has access
async function validateUserAccess(ctx: any, userId: Id<"users">, resourceUserId: Id<"users">) {
  if (userId !== resourceUserId) {
    throw new ConvexError("Unauthorized access");
  }
}

/**
 * Generate an upload URL for a photo
 */
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

/**
 * Add a new photo to an album
 */
export const addPhoto = mutation({
  args: {
    albumId: v.id("albums"),
    userId: v.id("users"),
    title: v.string(),
    description: v.optional(v.string()),
    storageId: v.string(),
    thumbnailStorageId: v.string(),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { albumId, userId, title, description, storageId, thumbnailStorageId, tags } = args;
    
    // Verify album exists and belongs to the user
    const album = await ctx.db.get(albumId);
    if (!album) {
      throw new ConvexError("Album not found");
    }
    
    // Validate user owns this album
    await validateUserAccess(ctx, userId, album.userId);
    
    const now = Date.now();
    
    const photoId = await ctx.db.insert("photos", {
      albumId,
      userId,
      title,
      description,
      storageId,
      thumbnailStorageId,
      tags,
      createdAt: now,
      updatedAt: now,
    });
    
    // If this is the first photo in the album, set it as the cover photo
    if (!album.coverPhotoId) {
      await ctx.db.patch(albumId, {
        coverPhotoId: photoId,
        updatedAt: now,
      });
    }
    
    return photoId;
  },
});

/**
 * Process an uploaded image to create a thumbnail
 * This will be an action since it performs processing outside the database
 */
export const processImage = action({
  args: {
    storageId: v.string(),
    albumId: v.id("albums"),
    userId: v.id("users"),
    title: v.string(),
    description: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { storageId, albumId, userId, title, description, tags } = args;
    
    // Get the image data
    const imageData = await ctx.storage.get(storageId);
    if (!imageData) {
      throw new ConvexError("Image not found in storage");
    }
    
    // In a real implementation, you would:
    // 1. Resize the image to create a thumbnail
    // 2. Optimize the image
    // 3. Extract metadata (EXIF, etc.)
    
    // For this example, we'll just use the same image for the thumbnail
    // In a real app, you'd process the image here
    
    // Upload the thumbnail
    const thumbnailStorageId = await ctx.storage.store(imageData);
    
    // Add the photo record
    const photoId = await ctx.runMutation(api.photos.addPhoto, {
      albumId,
      userId,
      title,
      description,
      storageId,
      thumbnailStorageId,
      tags,
    });
    
    return { photoId, thumbnailStorageId };
  },
});

/**
 * Update a photo's metadata
 */
export const updatePhoto = mutation({
  args: {
    photoId: v.id("photos"),
    userId: v.id("users"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { photoId, userId, title, description, tags } = args;
    
    // Get the photo
    const photo = await ctx.db.get(photoId);
    if (!photo) {
      throw new ConvexError("Photo not found");
    }
    
    // Validate user owns this photo
    await validateUserAccess(ctx, userId, photo.userId);
    
    // Only update fields that were provided
    const updates: any = { updatedAt: Date.now() };
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (tags !== undefined) updates.tags = tags;
    
    await ctx.db.patch(photoId, updates);
    
    return photoId;
  },
});

/**
 * Delete a photo
 */
export const deletePhoto = mutation({
  args: {
    photoId: v.id("photos"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const { photoId, userId } = args;
    
    // Get the photo
    const photo = await ctx.db.get(photoId);
    if (!photo) {
      throw new ConvexError("Photo not found");
    }
    
    // Validate user owns this photo
    await validateUserAccess(ctx, userId, photo.userId);
    
    // Get the album to check if this is the cover photo
    const album = await ctx.db.get(photo.albumId);
    
    // Update album if this was the cover photo
    if (album && album.coverPhotoId === photoId) {
      // Find another photo to use as cover
      const otherPhotos = await ctx.db
        .query("photos")
        .withIndex("by_album", (q) => q.eq("albumId", photo.albumId))
        .filter((q) => q.neq(q.field("_id"), photoId))
        .first();
      
      await ctx.db.patch(photo.albumId, {
        coverPhotoId: otherPhotos ? otherPhotos._id : undefined,
        updatedAt: Date.now(),
      });
    }
    
    // Delete the photo
    await ctx.db.delete(photoId);
    
    // TODO: In a production app, you would also delete
    // the associated files from storage here
    
    return { success: true };
  },
});

/**
 * Get a specific photo by ID
 */
export const getPhotoById = query({
  args: { photoId: v.id("photos") },
  handler: async (ctx, args) => {
    const photo = await ctx.db.get(args.photoId);
    
    if (!photo) {
      throw new ConvexError("Photo not found");
    }
    
    // Get the photo's image URL
    const imageUrl = await ctx.storage.getUrl(photo.storageId);
    const thumbnailUrl = await ctx.storage.getUrl(photo.thumbnailStorageId);
    
    return {
      ...photo,
      imageUrl,
      thumbnailUrl,
    };
  },
});

/**
 * Get all photos in an album
 */
export const getPhotosByAlbum = query({
  args: { 
    albumId: v.id("albums"),
    limit: v.optional(v.number()),
    cursor: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { albumId, limit = 20, cursor } = args;
    
    // Get all photos for this album
    const results = await ctx.db
      .query("photos")
      .withIndex("by_album", (q) => q.eq("albumId", albumId))
      .order("desc")
      .paginate({ cursor, numItems: limit });
    
    // Add URLs to the photos
    const items = await Promise.all(
      results.page.map(async (photo) => {
        const imageUrl = await ctx.storage.getUrl(photo.storageId);
        const thumbnailUrl = await ctx.storage.getUrl(photo.thumbnailStorageId);
        
        return {
          ...photo,
          imageUrl,
          thumbnailUrl,
        };
      })
    );
    
    return {
      items,
      continuationToken: results.continuationToken,
    };
  },
});

/**
 * Get all photos by a user
 */
export const getPhotosByUser = query({
  args: { 
    userId: v.id("users"),
    limit: v.optional(v.number()),
    cursor: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId, limit = 20, cursor } = args;
    
    // Get all photos by this user
    const results = await ctx.db
      .query("photos")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .paginate({ cursor, numItems: limit });
    
    // Add URLs to the photos
    const items = await Promise.all(
      results.page.map(async (photo) => {
        const imageUrl = await ctx.storage.getUrl(photo.storageId);
        const thumbnailUrl = await ctx.storage.getUrl(photo.thumbnailStorageId);
        
        return {
          ...photo,
          imageUrl,
          thumbnailUrl,
        };
      })
    );
    
    return {
      items,
      continuationToken: results.continuationToken,
    };
  },
});

/**
 * Search photos by title, description or tags
 */
export const searchPhotos = query({
  args: { 
    searchQuery: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { searchQuery, limit = 20 } = args;
    
    if (!searchQuery) {
      return [];
    }
    
    // Get all photos
    const photos = await ctx.db
      .query("photos")
      .collect();
    
    // Filter photos by title, description, or tags match (case-insensitive)
    const searchLower = searchQuery.toLowerCase();
    const filteredPhotos = photos.filter(photo => 
      photo.title.toLowerCase().includes(searchLower) ||
      (photo.description && photo.description.toLowerCase().includes(searchLower)) ||
      (photo.tags && photo.tags.some(tag => tag.toLowerCase().includes(searchLower)))
    );
    
    // Add URLs to the photos
    const items = await Promise.all(
      filteredPhotos.slice(0, limit).map(async (photo) => {
        const imageUrl = await ctx.storage.getUrl(photo.storageId);
        const thumbnailUrl = await ctx.storage.getUrl(photo.thumbnailStorageId);
        
        return {
          ...photo,
          imageUrl,
          thumbnailUrl,
        };
      })
    );
    
    return items;
  },
});

/**
 * Get random recent photos for the Explore page
 */
export const getExplorePhotos = query({
  args: { 
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { limit = 20 } = args;
    
    // Get public albums
    const publicAlbums = await ctx.db
      .query("albums")
      .withIndex("by_visibility", (q) => q.eq("isPublic", true))
      .collect();
    
    if (publicAlbums.length === 0) {
      return [];
    }
    
    // Get album IDs
    const albumIds = publicAlbums.map(album => album._id);
    
    // Get photos from those albums
    let photos = [];
    for (const albumId of albumIds) {
      const albumPhotos = await ctx.db
        .query("photos")
        .withIndex("by_album", (q) => q.eq("albumId", albumId))
        .collect();
      
      photos = [...photos, ...albumPhotos];
    }
    
    // Shuffle the photos to get a random selection
    photos.sort(() => Math.random() - 0.5);
    
    // Take only the number we need
    photos = photos.slice(0, limit);
    
    // Add URLs to the photos
    const items = await Promise.all(
      photos.map(async (photo) => {
        const imageUrl = await ctx.storage.getUrl(photo.storageId);
        const thumbnailUrl = await ctx.storage.getUrl(photo.thumbnailStorageId);
        
        return {
          ...photo,
          imageUrl,
          thumbnailUrl,
        };
      })
    );
    
    return items;
  },
});

/**
 * Get photo count for an album
 */
export const getPhotoCountByAlbum = query({
  args: { albumId: v.id("albums") },
  handler: async (ctx, args) => {
    const photos = await ctx.db
      .query("photos")
      .withIndex("by_album", (q) => q.eq("albumId", args.albumId))
      .collect();
    
    return photos.length;
  },
});