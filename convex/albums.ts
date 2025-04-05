// convex/albums.ts
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { ConvexError } from "convex/values";
import { Id } from "./_generated/dataModel";

// Function to validate that a user owns a resource or has access
async function validateUserAccess(ctx: any, userId: Id<"users">, resourceUserId: Id<"users">) {
  if (userId !== resourceUserId) {
    throw new ConvexError("Unauthorized access");
  }
}

/**
 * Create a new album
 */
export const createAlbum = mutation({
  args: {
    userId: v.id("users"),
    title: v.string(),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
    isPublic: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { userId, title, description, category, isPublic } = args;
    
    const now = Date.now();
    
    const albumId = await ctx.db.insert("albums", {
      userId,
      title,
      description,
      category,
      isPublic,
      createdAt: now,
      updatedAt: now,
    });
    
    return albumId;
  },
});

/**
 * Update an existing album
 */
export const updateAlbum = mutation({
  args: {
    albumId: v.id("albums"),
    userId: v.id("users"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
    isPublic: v.optional(v.boolean()),
    coverPhotoId: v.optional(v.id("photos")),
  },
  handler: async (ctx, args) => {
    const { albumId, userId, title, description, category, isPublic, coverPhotoId } = args;
    
    // Verify album exists and belongs to the user
    const album = await ctx.db.get(albumId);
    if (!album) {
      throw new ConvexError("Album not found");
    }
    
    // Validate user owns this album
    await validateUserAccess(ctx, userId, album.userId);
    
    // Only update fields that were provided
    const updates: any = { updatedAt: Date.now() };
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (category !== undefined) updates.category = category;
    if (isPublic !== undefined) updates.isPublic = isPublic;
    if (coverPhotoId !== undefined) updates.coverPhotoId = coverPhotoId;
    
    await ctx.db.patch(albumId, updates);
    
    return albumId;
  },
});

/**
 * Delete an album and all its photos
 */
export const deleteAlbum = mutation({
  args: {
    albumId: v.id("albums"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const { albumId, userId } = args;
    
    // Verify album exists and belongs to the user
    const album = await ctx.db.get(albumId);
    if (!album) {
      throw new ConvexError("Album not found");
    }
    
    // Validate user owns this album
    await validateUserAccess(ctx, userId, album.userId);
    
    // Get all photos in this album
    const photos = await ctx.db
      .query("photos")
      .withIndex("by_album", (q) => q.eq("albumId", albumId))
      .collect();
    
    // Delete all photos in the album
    for (const photo of photos) {
      await ctx.db.delete(photo._id);
      
      // TODO: In a production system, you would also delete
      // the associated files from storage here
    }
    
    // Delete the album itself
    await ctx.db.delete(albumId);
    
    return { success: true };
  },
});

/**
 * Get a specific album by ID
 */
export const getAlbumById = query({
  args: { albumId: v.id("albums") },
  handler: async (ctx, args) => {
    const album = await ctx.db.get(args.albumId);
    
    if (!album) {
      throw new ConvexError("Album not found");
    }
    
    return album;
  },
});

/**
 * Get all albums for a specific user
 */
export const getAlbumsByUser = query({
  args: { 
    userId: v.id("users"),
    includePrivate: v.optional(v.boolean()),
    limit: v.optional(v.number()),
    cursor: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId, includePrivate, limit = 20, cursor } = args;
    
    // Build query for albums by this user
    let albumsQuery = ctx.db
      .query("albums")
      .withIndex("by_user", (q) => q.eq("userId", userId));
    
    // If we don't want private albums, filter for public only
    if (!includePrivate) {
      albumsQuery = albumsQuery.filter((q) => q.eq(q.field("isPublic"), true));
    }
    
    // Get paginated results sorted by creation date (newest first)
    const results = await albumsQuery
      .order("desc")
      .paginate({ cursor, numItems: limit });
    
    return results;
  },
});

/**
 * Get all public albums from all users
 */
export const getPublicAlbums = query({
  args: {
    limit: v.optional(v.number()),
    cursor: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { limit = 20, cursor } = args;
    
    const results = await ctx.db
      .query("albums")
      .withIndex("by_visibility", (q) => q.eq("isPublic", true))
      .order("desc")
      .paginate({ cursor, numItems: limit });
    
    return results;
  },
});

/**
 * Get album count for a user
 */
export const getAlbumCountByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const albums = await ctx.db
      .query("albums")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
    
    return albums.length;
  },
});

/**
 * Search albums by title
 */
export const searchAlbums = query({
  args: { 
    searchQuery: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { searchQuery, limit = 20 } = args;
    
    if (!searchQuery) {
      return [];
    }
    
    // Get all public albums
    const albums = await ctx.db
      .query("albums")
      .withIndex("by_visibility", (q) => q.eq("isPublic", true))
      .collect();
    
    // Filter albums by title match (case-insensitive)
    const searchLower = searchQuery.toLowerCase();
    const filteredAlbums = albums.filter(album => 
      album.title.toLowerCase().includes(searchLower) ||
      (album.description && album.description.toLowerCase().includes(searchLower))
    );
    
    // Limit results
    return filteredAlbums.slice(0, limit);
  },
});