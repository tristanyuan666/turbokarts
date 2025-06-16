import { NextRequest, NextResponse } from "next/server";
import { CoinbaseCommerceService } from "@/lib/coinbase-commerce";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-cc-webhook-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    const webhookSecret = process.env.COINBASE_COMMERCE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("Coinbase Commerce webhook secret not configured");
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 },
      );
    }

    // Verify webhook signature
    const isValid = CoinbaseCommerceService.verifyWebhookSignature(
      body,
      signature,
      webhookSecret,
    );
    if (!isValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Parse webhook event
    const event = CoinbaseCommerceService.parseWebhookEvent(body);

    console.log("Coinbase Commerce webhook received:", {
      type: event.type,
      id: event.id,
      chargeId: event.data?.id,
    });

    // Handle different event types
    switch (event.type) {
      case "charge:confirmed":
        console.log("Payment confirmed for charge:", event.data.id);
        // Here you would typically:
        // 1. Update your database with the confirmed payment
        // 2. Send confirmation email to customer
        // 3. Trigger order fulfillment process
        break;

      case "charge:failed":
        console.log("Payment failed for charge:", event.data.id);
        // Handle failed payment
        break;

      case "charge:delayed":
        console.log("Payment delayed for charge:", event.data.id);
        // Handle delayed payment (common with crypto)
        break;

      case "charge:pending":
        console.log("Payment pending for charge:", event.data.id);
        // Handle pending payment
        break;

      case "charge:resolved":
        console.log("Payment resolved for charge:", event.data.id);
        // Handle resolved payment
        break;

      default:
        console.log("Unhandled webhook event type:", event.type);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}
