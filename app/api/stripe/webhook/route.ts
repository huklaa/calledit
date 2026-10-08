import Stripe from "stripe";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return new Response("Stripe not configured", { status: 503 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const signature = request.headers.get("stripe-signature");
  if (!signature) return new Response("Missing signature", { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      await request.text(),
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const predictionId = session.metadata?.predictionId;
    if (predictionId && session.payment_status === "paid") {
      await db.prediction.updateMany({
        where: { id: predictionId, stripeSessionId: session.id, paymentStatus: "PENDING" },
        data: { paymentStatus: "PAID" },
      });
    }
  }

  return new Response("ok");
}
