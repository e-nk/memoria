// convex/users.ts
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { ConvexError } from "convex/values";

/**
 * Creates or updates a user record when they log in with Clerk
 */
export const createOrUpdateUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
    username: v.string(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    const now = Date.now();

    if (existingUser) {
      // Update existing user
      return await ctx.db.patch(existingUser._id, {
        name: args.name,
        username: args.username,
        email: args.email,
        imageUrl: args.imageUrl,
        updatedAt: now,
      });
    } else {
      // Create new user
      return await ctx.db.insert("users", {
        clerkId: args.clerkId,
        name: args.name,
        username: args.username,
        email: args.email,
        imageUrl: args.imageUrl,
        createdAt: now,
        updatedAt: now,
      });
    }
  },
});

/**
 * Get the currently authenticated user from Convex
 */
export const getCurrentUser = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    return user;
  },
});

/**
 * Get user by ID
 */
export const getUserById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    
    if (!user) {
      throw new ConvexError("User not found");
    }
    
    return user;
  },
});

/**
 * Get all users (for admin or public user listing)
 */
export const getAllUsers = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    return users;
  },
});

/**
 * Get a paginated list of users
 */
export const getUsers = query({
  args: { 
    limit: v.number(),
    cursor: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const { limit, cursor } = args;
    
    const results = await ctx.db
      .query("users")
      .order("desc")
      .paginate({ cursor, numItems: limit });
    
    return results;
  },
});

/**
 * Check if a username is available or already taken
 */
export const isUsernameAvailable = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .first();
    
    return !existingUser;
  },
});