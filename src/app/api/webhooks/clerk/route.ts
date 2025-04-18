import Stripe from "stripe";
import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";

import { env } from "@/data/env/server";
import { deleteUser } from "@/server/db/users";
import {
  createUserSubscription,
  getUserSubscription,
} from "@/server/db/subscription";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export async function POST(req: Request) {
  // Get headers
  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Error: Missing Svix headers", {
      status: 400,
    });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create new Svix instance with secret
  const wh = new Webhook(env.CLERK_WEBHOOK_SECRET);
  let event: WebhookEvent;

  // Verify payload with headers
  try {
    event = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error: Could not verify webhook:", err);
    return new Response("Error: Verification error", {
      status: 400,
    });
  }

  // Do something with payload
  switch (event.type) {
    case "user.created": {
      await createUserSubscription({
        clerkUserId: event.data.id,
        tier: "Free",
      });
      break;
    }
    case "user.deleted": {
      if (event.data.id != null) {
        const userSubscription = await getUserSubscription(event.data.id);
        if (userSubscription?.stripeSubscriptionId != null) {
          await stripe.subscriptions.cancel(
            userSubscription?.stripeSubscriptionId
          );
        }
        await deleteUser(event.data.id);
      }
      break;
    }
  }

  return new Response("Webhook received", { status: 200 });
}
