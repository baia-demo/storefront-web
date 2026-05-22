# storefront-web

Front-end da **ShopFlow** (demo do BaIA). Next.js 15 + App Router + Tailwind.

## Páginas

| Rota | Descrição |
|---|---|
| `/` | Catálogo (chama `catalog-api`) |
| `/cart` | Carrinho (localStorage) |
| `/checkout` | Checkout (chama `orders-api`) |
| `/checkout/success` | Confirmação do pedido |
| `/orders` | Histórico de pedidos |

## API routes internas (proxies)

| Rota | Backend |
|---|---|
| `GET /api/catalog` | `catalog-api/products` |
| `POST /api/orders` | `orders-api/orders` |
| `POST /api/feedback` | GitHub Issues (`baia-demo/user-feedback`) |

## Widget "Central de ajuda"

Botão fixo no canto inferior direito. Capta **feedback do usuário** —
bugs, sugestões de melhoria ou dúvidas. Quando submetido:

1. POST `/api/feedback` com `{type, description, email, page}`
2. Server-side cria issue em `baia-demo/user-feedback` com label `needs-triage`
3. Workflow `triage.yml` no repo `apresentacao-baia` é disparado
4. Agente Claude Code classifica + (se `bug` ou `improvement`) cria issue
   técnica no repo correto

## Env vars

| Var | Default | Descrição |
|---|---|---|
| `CATALOG_API_URL` | `http://localhost:3001` | Base URL do catalog-api |
| `ORDERS_API_URL` | `http://localhost:3002` | Base URL do orders-api |
| `REPORTS_GITHUB_TOKEN` | — | PAT com `issues:write` em `baia-demo/user-feedback` |
| `REPORTS_REPO` | `baia-demo/user-feedback` | Repo onde os relatos viram issues |

## Rodar local

```bash
npm install
npm run dev
# → http://localhost:3000
```

Suba `catalog-api` (porta 3001) e `orders-api` (porta 3002) em paralelo.

## Tests

```bash
npm test          # unitários (vitest)
```

## Deploy

Deploy automático via GitHub Actions (`.github/workflows/deploy.yml`) em
todo push pra `main`. Requer secret `FLY_API_TOKEN` no repo.

Pra deploy manual:
```bash
fly deploy
fly secrets set REPORTS_GITHUB_TOKEN=ghp_...
fly secrets set CATALOG_API_URL=https://shopflow-catalog-api.fly.dev
fly secrets set ORDERS_API_URL=https://shopflow-orders-api.fly.dev
```

## Estrutura

```
app/
├── layout.tsx                  # Layout root + FeedbackWidget
├── page.tsx                    # Home com catálogo
├── cart/page.tsx               # Carrinho (client-side)
├── checkout/page.tsx           # Checkout
├── checkout/success/page.tsx   # Pós-compra
├── orders/page.tsx             # Histórico de pedidos
├── api/
│   ├── catalog/route.ts        # Proxy → catalog-api
│   ├── orders/route.ts         # Proxy → orders-api
│   └── feedback/route.ts       # Cria issue no GitHub
└── globals.css                 # Tailwind base
components/
├── ProductGrid.tsx             # Grid + busca
├── CheckoutForm.tsx            # Form do checkout
└── FeedbackWidget.tsx          # Modal flutuante "Central de ajuda"
lib/
├── apis.ts                     # Fetch helpers
└── cart.ts                     # Cart via localStorage
```
