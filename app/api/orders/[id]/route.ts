import { NextResponse } from "next/server";
import { getOrder } from "@/lib/apis";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const order = await getOrder(id);
    if (!order) {
      return NextResponse.json({ error: "order_not_found" }, { status: 404 });
    }
    return NextResponse.json(order);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "orders_error" },
      { status: 502 }
    );
  }
}
