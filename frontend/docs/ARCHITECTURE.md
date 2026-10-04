# Application architecture

## Current phase: frontend foundation

One Next.js 16 App Router codebase serves two independently runnable surfaces:

- Customer storefront: `http://localhost:3000`
- Business portal: `http://localhost:3001/business-portal/login`

`APP_SURFACE` selects the runtime surface. `proxy.ts` isolates storefront and business routes. Each runtime has its own build output (`.next-store` and `.next-business`) so both can run safely at once.

## Commands

- `pnpm dev`: run both Next.js frontend surfaces
- `pnpm dev:frontend`: run both Next.js surfaces
- `pnpm dev:store`: run only the storefront
- `pnpm dev:business`: run only the business portal
- `pnpm build`: build both surfaces
- `pnpm lint`: run ESLint

## Planned boundaries

- `app/(storefront)/`: customer-facing routes whose group name is omitted from URLs
- `app/business-portal/`: staff authentication and dashboard routes
- `components/`: reusable presentation components
- `features/`: catalog, comparison, PC builder, cart, checkout, inventory, orders, RMA, and POS
- `lib/api/`: typed Laravel REST API client and server request helpers
- `lib/auth/`: session integration and authorization helpers
- `types/`: API contracts and shared domain types

## Delivery sequence

1. Frontend routes, layouts, design system, and mock contracts
2. Integrate the separately maintained Laravel REST API and authentication
3. MySQL schema/migrations and real-data integration
4. Redis-backed queues/cache and third-party integrations

Payment gateway and MFS integrations (bKash, Nagad, SSLCommerz, etc.) are explicitly deferred.
