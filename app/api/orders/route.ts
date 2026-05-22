import { NextResponse } from "next/server";
import { createOrder, listOrders } from "@/lib/apis";

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

export async function GET() {
  try {
    const items = await listOrders();
    return NextResponse.json({ items });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "orders_error" },
      { status: 502 }
    );
  }
}
