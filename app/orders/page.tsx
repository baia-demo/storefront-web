import Link from "next/link";
import { listOrders, type Order } from "@/lib/apis";

function brl(value: number): string {
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString("pt-BR");
  } catch {
    return iso;
  }
}

export default async function OrdersPage() {
  let orders: Order[] = [];
  let error: string | null = null;

  try {
    orders = await listOrders();
  } catch (e) {
    error = e instanceof Error ? e.message : "erro desconhecido";
  }

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-3xl font-bold">Pedidos</h1>
        <p className="mt-1 text-sm text-slate-500">
          Histórico de todos os pedidos da ShopFlow (in-memory na orders-api —
          some quando o servidor reinicia).
        </p>
      </section>

      {error ? (
        <div className="rounded border border-red-300 bg-red-50 p-4 text-sm text-red-800">
          Falha ao carregar orders-api: {error}
        </div>
      ) : orders.length === 0 ? (
        <p className="text-sm text-slate-500">
          Nenhum pedido ainda.{" "}
          <Link href="/" className="text-brand underline">
            Voltar pro catálogo
          </Link>
          .
        </p>
      ) : (
        <ul className="space-y-3">
          {orders.map((order) => {
            const itemCount = order.items.reduce(
              (acc, i) => acc + i.quantity,
              0
            );
            return (
              <li
                key={order.id}
                className="rounded border border-slate-200 bg-white p-4"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <code className="font-mono text-sm font-semibold">
                    {order.id}
                  </code>
                  <span className="text-xs text-slate-500">
                    {formatDate(order.createdAt)}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600">
                  <span>Cliente: {order.customerId}</span>
                  <span>
                    {itemCount} {itemCount === 1 ? "item" : "itens"}
                  </span>
                  <span>
                    Subtotal: <strong>{brl(order.subtotal)}</strong>
                  </span>
                  <span>
                    Frete: <strong>{brl(order.shipping)}</strong>
                  </span>
                  <span>
                    Total: <strong>{brl(order.total)}</strong>
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
