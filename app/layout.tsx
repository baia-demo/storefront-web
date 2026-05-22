import type { Metadata } from "next";
import Link from "next/link";
import { ReportBugWidget } from "@/components/ReportBugWidget";
import "./globals.css";

export const metadata: Metadata = {
  title: "ShopFlow — Demo BaIA",
  description: "E-commerce de exemplo para a demo de triagem autônoma de bugs",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <header className="bg-brand text-white">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
            <Link href="/" className="text-xl font-bold tracking-tight">
              ShopFlow
            </Link>
            <nav className="flex items-center gap-4 text-sm">
              <Link href="/" className="hover:underline">
                Catálogo
              </Link>
              <Link href="/cart" className="hover:underline">
                Carrinho
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
        <ReportBugWidget />
      </body>
    </html>
  );
}
