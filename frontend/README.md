# TechHub Bangladesh Frontend

The frontend application for an electronics e-commerce platform serving the Bangladesh market. One Next.js codebase provides two isolated interfaces:

- Customer storefront
- Business portal

The Laravel backend is maintained in a separate repository and is consumed through its REST API.

## Technology

| Area | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| UI | React 19, TypeScript |
| Styling | Tailwind CSS 4 |
| Package manager | pnpm 11 |
| Backend integration | External Laravel REST API |

## Frontend architecture

The `APP_SURFACE` environment variable selects which interface is exposed. Each interface uses a separate port and build directory.

| Interface | Development URL | Build directory |
| --- | --- | --- |
| Customer storefront | `http://localhost:3000` | `.next-store` |
| Business portal | `http://localhost:3001` | `.next-business` |

[`proxy.ts`](proxy.ts) isolates the routes:

- The storefront rejects `/business-portal/*` routes.
- The business surface exposes only `/business-portal/*` routes.
- Visiting port `3001` redirects to login or dashboard according to the business-session cookie.

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for more detail.
The backend response conventions are documented in [`docs/API_CONTRACTS.md`](docs/API_CONTRACTS.md).

## Prerequisites

- Node.js 20.9 or newer
- pnpm 11
- A separately running backend API when testing real-data features

PHP, Composer, MySQL, and Redis are backend-repository requirements, not frontend prerequisites.

## Installation

```bash
pnpm install
```

Copy `.env.example` to `.env.local` and configure the server-only backend URL and frontend key. Keep `STOREFRONT_MOCK_DATA=false` in production.

## Development

Run both frontend interfaces:

```bash
pnpm dev
```

Or run one interface:

```bash
# Customer storefront on port 3000
pnpm dev:store

# Business portal on port 3001
pnpm dev:business
```

Start the Laravel API from its own repository when API-backed functionality is required.

### Local business-portal demo

To test the portal before connecting Laravel, add these server-only values to `.env.local`:

```env
BUSINESS_DEMO_MODE=true
BUSINESS_DEMO_EMAIL=admin@techhub.test
BUSINESS_DEMO_PASSWORD=choose-a-local-demo-password
BUSINESS_DEMO_SESSION_TOKEN=choose-a-long-random-local-token
```

Restart `pnpm dev:business`, open `http://localhost:3001`, and sign in using the configured demo credentials. Demo records are read-only.

Demo authentication is protected by an HTTP-only cookie and is hard-disabled whenever `NODE_ENV=production`. The demo endpoint also returns `404` outside the business development surface. Do not use demo mode as real authentication.

If a port is already occupied on Windows, stop the existing development process before retrying. Use `taskkill /F /IM node.exe` only when it is safe to close every running Node.js process.

## Quality checks

```bash
pnpm lint
pnpm build
```

The production build creates both frontend outputs. Build a single interface when needed:

```bash
pnpm build:store
pnpm build:business
```

## Production start

Build the required interface first, then run its production server:

```bash
pnpm start:store
pnpm start:business
```

Run each command in a separate process. The Laravel API must be deployed and configured independently.

## Project structure

```text
├── app/
│   ├── (storefront)/        # Customer-facing App Router routes
│   ├── api/                 # Frontend route handlers and API handshake
│   └── business-portal/     # Staff login and dashboard routes
├── components/
│   └── storefront/          # Storefront UI components
├── context/                 # Client-side React context providers
├── docs/                    # SRS and architecture documentation
├── lib/                     # Frontend data, configuration, and API helpers
├── public/                  # Static images and storefront assets
├── scripts/                 # Frontend development/build launchers
├── types/                   # Shared frontend TypeScript types
├── proxy.ts                 # Surface isolation and portal redirects
├── next.config.ts           # Surface-specific build configuration
└── package.json             # Frontend scripts and dependencies
```

## Repository responsibility

This repository owns frontend code, assets, documentation, and frontend configuration.

## License

Private — all rights reserved.
