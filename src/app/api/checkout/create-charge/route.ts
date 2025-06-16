import { NextRequest, NextResponse } from "next/server";
import { CoinbaseCommerceService } from "@/lib/coinbase-commerce";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.local_price || !body.metadata) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Create charge using Coinbase Commerce service
    const charge = await CoinbaseCommerceService.createCharge(body);

    return NextResponse.json({ charge });
  } catch (error) {
    console.error("Error creating charge:", error);
    return NextResponse.json(
      { error: "Failed to create charge" },
      { status: 500 },
    );
  }
}
