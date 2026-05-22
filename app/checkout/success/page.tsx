import Link from "next/link";
import { getOrder } from "@/lib/apis";

interface Props {
  searchParams: Promise<{ id?: string }>;
}

function brl(value: number): string {
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
}

export default async function SuccessPage({ searchParams }: Props) {
  const { id } = await searchParams;

  if (!id) {
    return (
      <div className="space-y-4 rounded border border-amber-200 bg-amber-50 p-6">
        <p className="text-amber-900">Pedido sem ID — algo deu errado.</p>
      </div>
    );
  }

  let order = null;
  try {
    order = await getOrder(id);
  } catch (e) {
    // continua e mostra fallback abaixo
  }

  if (!order) {
    return (
      <div className="space-y-4 rounded border border-amber-200 bg-amber-50 p-6">
        <h1 className="text-2xl font-bold text-amber-900">
          Pedido recebido
        </h1>
        <p className="text-sm text-amber-800">
          Não conseguimos carregar os detalhes agora. ID: <code>{id}</code>
        </p>
      </div>
    );
  }

  const itemCount = order.items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="space-y-6">
      <div className="space-y-2 rounded border border-emerald-200 bg-emerald-50 p-6">
        <h1 className="text-2xl font-bold text-emerald-900">
          Pedido confirmado!
        </h1>
        <p className="text-sm text-emerald-800">
          Pedido <code className="font-mono">{order.id}</code> registrado com{" "}
          {itemCount} {itemCount === 1 ? "item" : "itens"}.
        </p>
      </div>

      <div className="rounded border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-4 py-3">
          <h2 className="font-semibold">Itens</h2>
        </div>
        <ul className="divide-y divide-slate-100 text-sm">
          {order.items.map((line, idx) => (
            <li
              key={`${line.productId}-${idx}`}
              className="flex items-center justify-between px-4 py-2"
            >
              <span>
                {line.quantity}x {line.name}
              </span>
              <span className="font-mono">
                {brl(line.price * line.quantity)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-4 py-3">
          <h2 className="font-semibold">Totais</h2>
        </div>
        <dl className="divide-y divide-slate-100 text-sm">
          <div className="flex items-center justify-between px-4 py-2">
            <dt>Subtotal</dt>
            <dd className="font-mono">{brl(order.subtotal)}</dd>
          </div>
          <div className="flex items-center justify-between px-4 py-2">
            <dt>Frete</dt>
            <dd className="font-mono">{brl(order.shipping)}</dd>
          </div>
          <div className="flex items-center justify-between px-4 py-3 text-base font-bold">
            <dt>Total</dt>
            <dd className="font-mono">{brl(order.total)}</dd>
          </div>
        </dl>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/"
          className="rounded bg-brand px-4 py-2 text-sm text-white hover:bg-brand-dark"
        >
          Voltar ao catálogo
        </Link>
        <Link
          href="/orders"
          className="rounded border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
        >
          Ver todos os pedidos
        </Link>
      </div>
    </div>
  );
}
