export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  customerId: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  createdAt: string;
}

const CATALOG_BASE =
  process.env.CATALOG_API_URL ?? "http://localhost:3001";

const ORDERS_BASE =
  process.env.ORDERS_API_URL ?? "http://localhost:3002";

export async function fetchProducts(query?: string): Promise<Product[]> {
  const url = new URL("/products", CATALOG_BASE);
  if (query) url.searchParams.set("q", query);

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`catalog-api ${res.status}`);
  const data = (await res.json()) as { items: Product[] };
  return data.items;
}

export async function createOrder(input: {
  customerId: string;
  items: OrderItem[];
}): Promise<Order> {
  const res = await fetch(new URL("/orders", ORDERS_BASE), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(`orders-api ${res.status}`);
  return (await res.json()) as Order;
}
