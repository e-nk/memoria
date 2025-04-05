// app/api/webhooks/clerk/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

// Initialize Convex client
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL as string);

// Define the clerk webhook handler
export async function POST(req: NextRequest) {
  // Get the Clerk webhook secret from environment variables
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return new NextResponse("Webhook secret not configured", { status: 500 });
  }

  // Get the headers
  const svix_id = req.headers.get("svix-id");
  const svix_timestamp = req.headers.get("svix-timestamp");
  const svix_signature = req.headers.get("svix-signature");

  // If there are no headers, return 400
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new NextResponse("Missing svix headers", { status: 400 });
  }

  // Get the request body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with the webhook secret
  const wh = new Webhook(webhookSecret);

  let evt: any;
  try {
    // Verify the webhook signature
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new NextResponse("Error verifying webhook", { status: 400 });
  }

  // Handle the webhook event
  const eventType = evt.type;

  try {
    // Handle user creation and updates
    if (eventType === "user.created" || eventType === "user.updated") {
      const { id, email_addresses, username, first_name, last_name, image_url, ...rest } = evt.data;

      // Get the user's primary email
      const primaryEmail = email_addresses.find(
        (email: any) => email.id === evt.data.primary_email_address_id
      );

      if (!primaryEmail) {
        return new NextResponse("User has no primary email address", {
          status: 400,
        });
      }

      // Sync the user with Convex
      await convex.mutation(api.auth.syncClerkUser, {
        clerkId: id,
        email: primaryEmail.email_address,
        name: [first_name, last_name].filter(Boolean).join(" ") || "User",
        username: username || `user${Date.now()}`,
        imageUrl: image_url,
      });
    }

    // Handle user deletion
    if (eventType === "user.deleted") {
      const { id } = evt.data;

      // Delete the user from Convex
      await convex.mutation(api.auth.deleteClerkUser, {
        clerkId: id,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error handling webhook:", error);
    return new NextResponse("Error handling webhook", { status: 500 });
  }
}