import stripe from "stripe";
import { NextResponse } from "next/server";
import { createOrder } from "@/lib/actions/order.action";

export async function POST(request: Request) {
  const body = await request.json();

  const sig = request.headers.get("Stripe-Signature")!;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (error) {
    return NextResponse.json({
      message: "Webhook error",
      error: error,
    });
  }

  // get the ID and type
  const eventType = event.type;

  // Create
  if (eventType === "checkout.session.completed") {
    const { id, amount_total, metadata } = event.data.object;

    const order = {
      stripeId: id,
      eventId: metadata?.eventId || "",
      buyerId: metadata?.buyerId || "",
      totalAmount: amount_total ? (amount_total / 100).toString() : "0",
      createdAt: new Date(),
    };

    const newOrder = await createOrder(order);
    return NextResponse.json({
      message: "Order created",
      order: newOrder,
    });
  }

  return NextResponse.json("", { status: 200 });
}
