import { NextResponse } from "next/server";
import { fetchProducts } from "@/lib/apis";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q") ?? undefined;

  try {
    const items = await fetchProducts(q);
    return NextResponse.json({ items });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "catalog_error" },
      { status: 502 }
    );
  }
}
