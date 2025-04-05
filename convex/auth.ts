// convex/auth.ts
import { ConvexError, v } from "convex/values";
import { MutationCtx, QueryCtx, internalMutation } from "./_generated/server";

/**
 * Get the current user's Convex User ID from their clerk ID
 */
export async function getUser(
  ctx: QueryCtx | MutationCtx,
  clerkId: string | null
) {
  if (!clerkId) {
    return null;
  }

  const user = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
    .first();

  return user;
}

/**
 * Function to get the authenticated user or throw an error if not authenticated
 */
export async function getAuthenticatedUser(
  ctx: QueryCtx | MutationCtx,
  clerkId: string | null
) {
  const user = await getUser(ctx, clerkId);
  if (!user) {
    throw new ConvexError("Not authenticated");
  }
  return user;
}

/**
 * Function to run when a user is created or updated in Clerk
 * This should be triggered via a webhook from Clerk
 */
export const syncClerkUser = internalMutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
    username: v.string(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { clerkId, email, name, username, imageUrl } = args;

    // Check if user exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
      .first();

    const now = Date.now();

    if (existingUser) {
      // Update existing user
      return await ctx.db.patch(existingUser._id, {
        name,
        username,
        email,
        imageUrl,
        updatedAt: now,
      });
    } else {
      // Create new user
      return await ctx.db.insert("users", {
        clerkId,
        name,
        username,
        email,
        imageUrl,
        createdAt: now,
        updatedAt: now,
      });
    }
  },
});

/**
 * Function to run when a user is deleted in Clerk
 * This should be triggered via a webhook from Clerk
 */
export const deleteClerkUser = internalMutation({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const { clerkId } = args;

    // Find the user
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
      .first();

    if (!user) {
      return { success: false, message: "User not found" };
    }

    // In a real application, you might want to:
    // 1. Delete all the user's albums and photos
    // 2. Or archive them instead of deleting
    // 3. Handle any other cleanup

    // Delete the user
    await ctx.db.delete(user._id);

    return { success: true };
  },
});