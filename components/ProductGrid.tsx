"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/lib/apis";
import { addToCart } from "@/lib/cart";

interface Props {
  initialProducts: Product[];
}

export function ProductGrid({ initialProducts }: Props) {
  const [products] = useState<Product[]>(initialProducts);
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState<Product[]>(initialProducts);
  const [searching, setSearching] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (!feedback) return;
    const t = setTimeout(() => setFeedback(null), 1800);
    return () => clearTimeout(t);
  }, [feedback]);

  async function runSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearching(true);
    try {
      const url = new URL("/api/catalog", window.location.origin);
      if (query) url.searchParams.set("q", query);
      const res = await fetch(url);
      const data = (await res.json()) as { items: Product[] };
      setFiltered(data.items);
    } finally {
      setSearching(false);
    }
  }

  function onAdd(product: Product) {
    addToCart(product, 1);
    setFeedback(`${product.name} adicionado ao carrinho`);
  }

  return (
    <div className="space-y-6">
      <form onSubmit={runSearch} className="flex gap-2">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar produtos..."
          className="flex-1 rounded border border-slate-300 px-3 py-2"
        />
        <button
          type="submit"
          disabled={searching}
          className="rounded bg-brand px-4 py-2 text-white hover:bg-brand-dark disabled:opacity-60"
        >
          {searching ? "Buscando..." : "Buscar"}
        </button>
      </form>

      {feedback && (
        <div className="rounded bg-emerald-100 px-3 py-2 text-sm text-emerald-800">
          {feedback}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="text-sm text-slate-500">Nenhum produto encontrado.</p>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <li
              key={p.id}
              className="flex flex-col gap-2 rounded border border-slate-200 bg-white p-4 shadow-sm"
            >
              <h3 className="font-semibold">{p.name}</h3>
              <p className="text-xs text-slate-500">{p.description}</p>
              <div className="mt-auto flex items-center justify-between">
                <span className="font-bold">
                  R$ {p.price.toFixed(2).replace(".", ",")}
                </span>
                <button
                  onClick={() => onAdd(p)}
                  className="rounded bg-brand px-3 py-1.5 text-sm text-white hover:bg-brand-dark"
                >
                  Adicionar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
