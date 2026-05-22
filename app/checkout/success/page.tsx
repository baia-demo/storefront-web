import Link from "next/link";

interface Props {
  searchParams: Promise<{ id?: string }>;
}

export default async function SuccessPage({ searchParams }: Props) {
  const { id } = await searchParams;

  return (
    <div className="space-y-4 rounded border border-emerald-200 bg-emerald-50 p-6">
      <h1 className="text-2xl font-bold text-emerald-900">
        Pedido confirmado!
      </h1>
      <p className="text-sm text-emerald-800">
        Seu pedido foi criado com sucesso.
      </p>
      {id && (
        <p className="text-xs text-emerald-700">
          ID do pedido: <code>{id}</code>
        </p>
      )}
      <Link
        href="/"
        className="inline-block rounded bg-brand px-4 py-2 text-sm text-white hover:bg-brand-dark"
      >
        Voltar ao catálogo
      </Link>
    </div>
  );
}
