"use client";

import { useState } from "react";

interface Submitted {
  number: number;
  url: string;
}

const SITUATION_TYPES: { value: string; label: string }[] = [
  { value: "bug", label: "Reportar um problema" },
  { value: "improvement", label: "Sugerir uma melhoria" },
  { value: "question", label: "Tirar uma dúvida" },
  { value: "unclear", label: "Outro" },
];

export function ReportBugWidget() {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<Submitted | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const payload = {
      type: String(form.get("type") ?? ""),
      description: String(form.get("description") ?? ""),
      email: String(form.get("email") ?? ""),
      page:
        typeof window !== "undefined"
          ? window.location.pathname
          : "unknown",
    };

    try {
      const res = await fetch("/api/report-bug", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error ?? `HTTP ${res.status}`);
      }

      setSubmitted({ number: data.number, url: data.url });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao enviar");
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setSubmitted(null);
    setError(null);
    setOpen(false);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 rounded-full bg-amber-500 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-amber-600"
      >
        Central de ajuda
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            {submitted ? (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">
                  Recebemos seu contato!
                </h2>
                <p className="text-sm text-slate-600">
                  Foi aberto o chamado{" "}
                  <a
                    href={submitted.url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-brand underline"
                  >
                    #{submitted.number}
                  </a>
                  . Em instantes, um agente de IA vai classificar a
                  situação e, se for o caso, abrir uma issue técnica no
                  repositório correto.
                </p>
                <button
                  onClick={reset}
                  className="w-full rounded bg-brand px-4 py-2 text-sm text-white hover:bg-brand-dark"
                >
                  Fechar
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">Central de ajuda</h2>
                    <p className="text-xs text-slate-500">
                      Conta o que aconteceu, ou o que você gostaria.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="text-slate-400 hover:text-slate-600"
                    aria-label="Fechar"
                  >
                    ✕
                  </button>
                </div>

                <label className="block text-sm">
                  <span className="mb-1 block text-slate-700">
                    Tipo da situação
                  </span>
                  <select
                    name="type"
                    required
                    defaultValue=""
                    className="w-full rounded border border-slate-300 bg-white px-3 py-2"
                  >
                    <option value="" disabled>
                      Selecione...
                    </option>
                    {SITUATION_TYPES.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block text-sm">
                  <span className="mb-1 block text-slate-700">
                    Descrição
                  </span>
                  <textarea
                    name="description"
                    required
                    rows={5}
                    placeholder="Conta o que aconteceu, como reproduzir ou o que você gostaria..."
                    className="w-full rounded border border-slate-300 px-3 py-2"
                  />
                </label>

                <label className="block text-sm">
                  <span className="mb-1 block text-slate-700">E-mail</span>
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="seu@email.com"
                    className="w-full rounded border border-slate-300 px-3 py-2"
                  />
                </label>

                {error && (
                  <div className="rounded bg-red-50 px-3 py-2 text-xs text-red-800">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
                >
                  {submitting ? "Enviando..." : "Enviar"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
