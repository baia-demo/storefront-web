import { NextResponse } from "next/server";
import { createOrder } from "@/lib/apis";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const order = await createOrder(body);
    return NextResponse.json(order);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "orders_error" },
      { status: 502 }
    );
  }
}
