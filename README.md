# storefront-web

Front-end da **ShopFlow** (demo do BaIA). Next.js 15 + App Router + Tailwind.

## Páginas

| Rota | Descrição |
|---|---|
| `/` | Catálogo (chama `catalog-api`) |
| `/cart` | Carrinho (localStorage) |
| `/checkout` | Checkout (chama `orders-api`) |
| `/checkout/success` | Confirmação do pedido |

## API routes internas (proxies)

| Rota | Backend |
|---|---|
| `GET /api/catalog` | `catalog-api/products` |
| `POST /api/orders` | `orders-api/orders` |
| `POST /api/report-bug` | GitHub Issues (`baia-demo/bug-reports`) |

## Widget de "Reportar bug"

Botão fixo no canto inferior direito. Quando submetido:

1. POST `/api/report-bug` com `{title, description, reporter, page}`
2. Server-side cria issue em `baia-demo/bug-reports` com label `needs-triage`
3. Workflow `bug-triage.yml` no repo `apresentacao-baia` é disparado
4. Agente Claude Code analisa e cria issue no repo certo

## Env vars

| Var | Default | Descrição |
|---|---|---|
| `CATALOG_API_URL` | `http://localhost:3001` | Base URL do catalog-api |
| `ORDERS_API_URL` | `http://localhost:3002` | Base URL do orders-api |
| `REPORTS_GITHUB_TOKEN` | — | PAT com `issues:write` em `baia-demo/bug-reports` |
| `REPORTS_REPO` | `baia-demo/bug-reports` | Repo onde os relatos viram issues |

## Rodar local

```bash
npm install
npm run dev
# → http://localhost:3000
```

Suba `catalog-api` (porta 3001) e `orders-api` (porta 3002) em paralelo.

## Deploy

```bash
fly deploy
fly secrets set REPORTS_GITHUB_TOKEN=ghp_...
fly secrets set CATALOG_API_URL=https://shopflow-catalog-api.fly.dev
fly secrets set ORDERS_API_URL=https://shopflow-orders-api.fly.dev
```

## Estrutura

```
app/
├── layout.tsx                  # Layout root + widget de bug
├── page.tsx                    # Home com catálogo
├── cart/page.tsx               # Carrinho (client-side)
├── checkout/page.tsx           # Checkout
├── checkout/success/page.tsx   # Pós-compra
├── api/
│   ├── catalog/route.ts        # Proxy → catalog-api
│   ├── orders/route.ts         # Proxy → orders-api
│   └── report-bug/route.ts     # Cria issue no GitHub
├── globals.css                 # Tailwind base
components/
├── ProductGrid.tsx             # Grid + busca
├── CheckoutForm.tsx            # Form do checkout
└── ReportBugWidget.tsx         # Modal flutuante
lib/
├── apis.ts                     # Fetch helpers
└── cart.ts                     # Cart via localStorage
```
