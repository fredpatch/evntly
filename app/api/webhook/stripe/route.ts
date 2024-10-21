import stripe from "stripe";
import { NextResponse } from "next/server";
import { createOrder } from "@/lib/actions/order.action";

export async function POST(request: Request) {
  const body = await request.clone().text(); // get the raw body as a string

  const sig = request.headers.get("stripe-signature") as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event;

  try {
    // Construct the Stripe event using the raw body
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (error) {
    return NextResponse.json(
      {
        message: "Webhook error",
        error: error,
      },
      { status: 400 }
    );
  }

  // get the ID and type
  const eventType = event.type;

  // Handle checkout session completion
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
