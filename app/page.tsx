import { fetchProducts, type Product } from "@/lib/apis";
import { ProductGrid } from "@/components/ProductGrid";

export default async function HomePage() {
  let products: Product[] = [];
  let error: string | null = null;

  try {
    products = await fetchProducts();
  } catch (e) {
    error = e instanceof Error ? e.message : "erro desconhecido";
  }

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-3xl font-bold">Catálogo</h1>
        <p className="mt-1 text-sm text-slate-500">
          Loja fictícia da demo do BaIA. Encontrou um problema, tem uma
          sugestão ou uma dúvida? Use o botão "Central de ajuda" no canto
          inferior direito.
        </p>
      </section>

      {error ? (
        <div className="rounded border border-red-300 bg-red-50 p-4 text-sm text-red-800">
          Falha ao carregar catalog-api: {error}
        </div>
      ) : (
        <ProductGrid initialProducts={products} />
      )}
    </div>
  );
}
