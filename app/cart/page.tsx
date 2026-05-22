"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { readCart, removeFromCart, cartTotal, type CartLine } from "@/lib/cart";

export default function CartPage() {
  const [items, setItems] = useState<CartLine[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setItems(readCart());
    setMounted(true);
  }, []);

  function handleRemove(productId: string) {
    setItems(removeFromCart(productId));
  }

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Carrinho</h1>
        <p className="text-sm text-slate-500">
          Carrinho vazio.{" "}
          <Link href="/" className="text-brand underline">
            Voltar pro catálogo
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Carrinho</h1>

      <ul className="divide-y divide-slate-200 rounded border border-slate-200 bg-white">
        {items.map((line) => (
          <li
            key={line.productId}
            className="flex items-center justify-between gap-4 p-4"
          >
            <div>
              <p className="font-medium">{line.name}</p>
              <p className="text-xs text-slate-500">
                {line.quantity}x R$ {line.price.toFixed(2).replace(".", ",")}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-semibold">
                R$ {(line.price * line.quantity).toFixed(2).replace(".", ",")}
              </span>
              <button
                onClick={() => handleRemove(line.productId)}
                className="text-xs text-red-600 hover:underline"
              >
                Remover
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between rounded border border-slate-200 bg-white p-4">
        <span className="text-sm text-slate-500">
          Subtotal ({items.length}{" "}
          {items.length === 1 ? "item" : "itens"})
        </span>
        <span className="text-xl font-bold">
          R$ {cartTotal(items).toFixed(2).replace(".", ",")}
        </span>
      </div>

      <div className="flex justify-end">
        <Link
          href="/checkout"
          className="rounded bg-brand px-4 py-2 text-white hover:bg-brand-dark"
        >
          Ir para o checkout
        </Link>
      </div>
    </div>
  );
}
