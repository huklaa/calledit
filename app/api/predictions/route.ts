import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/db";
import { createProofHash } from "@/lib/proof";
import { predictionSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const parsed = predictionSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid prediction" },
        { status: 400 },
      );
    }

    const { text, category, creatorHandle, creatorName, resolutionDate } = parsed.data;
    const createdAt = new Date();
    const proofHash = createProofHash({
      text,
      category,
      creatorHandle,
      resolutionDate: resolutionDate.toISOString(),
      createdAt: createdAt.toISOString(),
    });

    const requirePayment = process.env.NEXT_PUBLIC_REQUIRE_PAYMENT === "true";
    const prediction = await db.prediction.create({
      data: {
        text,
        category,
        creatorHandle: creatorHandle.toLowerCase(),
        creatorName: creatorName || null,
        resolutionDate,
        createdAt,
        proofHash,
        paymentStatus: requirePayment ? "PENDING" : "FREE",
      },
    });

    if (!requirePayment) {
      return NextResponse.json({ id: prediction.id, number: prediction.number });
    }

    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
      await db.prediction.delete({ where: { id: prediction.id } });
      return NextResponse.json({ error: "Payments are not configured yet." }, { status: 503 });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const origin = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [{ price_data: { currency: "usd", unit_amount: 100, product_data: { name: `Called It prediction #${prediction.number}`, description: "Public prediction proof after confirmed payment" } }, quantity: 1 }],
      metadata: { predictionId: prediction.id },
      success_url: `${origin}/payment/status?prediction=${prediction.number}`,
      cancel_url: `${origin}/new?cancelled=1`,
    });

    await db.prediction.update({
      where: { id: prediction.id },
      data: { stripeSessionId: session.id },
    });

    return NextResponse.json({ checkoutUrl: session.url });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Could not publish prediction." }, { status: 500 });
  }
}
