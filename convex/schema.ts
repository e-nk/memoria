// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users table - connected to Clerk authentication
  users: defineTable({
    // Clerk user ID
    clerkId: v.string(),
    // User's name from Clerk
    name: v.string(),
    // User's username/handle
    username: v.string(),
    // User's email from Clerk
    email: v.string(),
    // User's profile image URL from Clerk
    imageUrl: v.optional(v.string()),
    // When the user first joined
    createdAt: v.number(),
    // Last time user's info was updated
    updatedAt: v.number(),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_email", ["email"])
    .index("by_username", ["username"]),

  // Albums table
  albums: defineTable({
    // Reference to the user who owns this album
    userId: v.id("users"),
    // Album title
    title: v.string(),
    // Optional album description
    description: v.optional(v.string()),
    // Optional album cover photo ID
    coverPhotoId: v.optional(v.id("photos")),
    // Optional album category/type
    category: v.optional(v.string()),
    // Is this album public or private
    isPublic: v.boolean(),
    // When the album was created
    createdAt: v.number(),
    // Last time album was updated
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_visibility", ["isPublic"])
    .index("by_user_and_created", ["userId", "createdAt"]),

  // Photos table
  photos: defineTable({
    // Reference to the album this photo belongs to
    albumId: v.id("albums"),
    // Reference to the user who owns this photo
    userId: v.id("users"),
    // Photo title/caption
    title: v.string(),
    // Storage ID for the full-size photo
    storageId: v.string(),
    // Storage ID for the thumbnail version
    thumbnailStorageId: v.string(),
    // Optional photo description
    description: v.optional(v.string()),
    // Array of tags for the photo
    tags: v.optional(v.array(v.string())),
    // When the photo was uploaded
    createdAt: v.number(),
    // Last time photo was updated
    updatedAt: v.number(),
  })
    .index("by_album", ["albumId"])
    .index("by_user", ["userId"])
    .index("by_created", ["createdAt"])
    .index("by_album_and_created", ["albumId", "createdAt"]),

  // Tags table for categorizing photos and albums
  tags: defineTable({
    // Tag name (e.g., "nature", "portrait", "vacation")
    name: v.string(),
    // A description of the tag
    description: v.optional(v.string()),
    // When the tag was created
    createdAt: v.number(),
  }).index("by_name", ["name"]),

  // Likes for photos
  likes: defineTable({
    // User who liked the photo
    userId: v.id("users"),
    // The photo that was liked
    photoId: v.id("photos"),
    // When the like was created
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_photo", ["photoId"])
    .index("by_user_and_photo", ["userId", "photoId"]),
});