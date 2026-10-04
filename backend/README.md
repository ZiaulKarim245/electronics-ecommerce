# TechHub Bangladesh API

Laravel REST API for the TechHub electronics e-commerce platform. This repository owns backend business rules, persistence, authentication, authorization, queues, and third-party integrations. The Next.js storefront and business portal are maintained in a separate frontend repository.

## Technology

- PHP 8.3+
- Laravel 13
- MySQL 8+
- Redis
- PHPUnit 12

## Current functionality

- Frontend API-key verification
- Product, category, brand, variant, specification, serial/IMEI, order, order-item, and RMA database foundation
- Read-only product catalog and product-detail endpoints
- Seeded catalog data for local development and tests
- Feature tests for catalog authorization and responses

Sanctum staff authentication, role-based permissions, management CRUD, inventory operations, order processing, POS, RMA workflows, accounting, and third-party integrations are not implemented yet.

## Requirements

- PHP 8.3 or newer
- Composer 2
- MySQL 8 or newer
- Redis when testing cache or queued work

## Local installation

```bash
composer install
```

Copy `.env.example` to `.env`, then configure:

```env
APP_ENV=local
APP_DEBUG=true
APP_URL=http://127.0.0.1:8000

FRONTEND_URL=http://localhost:3000
BUSINESS_PORTAL_URL=http://localhost:3001
FRONTEND_API_KEY=use-the-same-private-key-as-the-nextjs-server

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=electronics_ecommerce
DB_USERNAME=electronics_app
DB_PASSWORD=your-local-database-password
```

Never commit `.env`, real credentials, or production secrets.

Generate the application key and prepare the database:

```bash
php artisan key:generate
php artisan migrate --seed
```

Start the API:

```bash
php artisan serve --host=127.0.0.1 --port=8000
```

## API access

Current API routes require the server-to-server header:

```http
Accept: application/json
X-Frontend-Key: value-matching-FRONTEND_API_KEY
```

Never expose `FRONTEND_API_KEY` in browser JavaScript or a `NEXT_PUBLIC_` environment variable.

### Available endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | API health check |
| `GET` | `/api/products` | Paginated product catalog |
| `GET` | `/api/products/{slug}` | Product detail by slug |

The coordinated frontend contract is documented in the frontend repository at `docs/API_CONTRACTS.md`.

## Quality checks

Run code-style verification:

```bash
php vendor/bin/pint --test
```

Run the test suite:

```bash
php artisan test
```

Clear cached framework state after dependency or environment changes:

```bash
php artisan optimize:clear
```

Confirm the installed framework version:

```bash
php artisan --version
```

## Project structure

```text
app/
├── Http/Controllers/Api/    # REST endpoint controllers
├── Http/Middleware/         # API client verification
└── Models/                  # Eloquent domain models
database/
├── factories/               # Test model factories
├── migrations/              # Database schema
└── seeders/                 # Local and test seed data
routes/api.php               # API route definitions
tests/Feature/               # HTTP and integration tests
```

## Implementation order

1. Laravel Sanctum authentication and RBAC
2. Catalog management CRUD with Form Requests and API Resources
3. Inventory intake and serial/IMEI assignment
4. Order processing and fraud-review workflow
5. RMA, POS, quotations, accounting, and reporting
6. Courier, SMS, payment, and queue integrations

## Repository policy

- Commit `composer.lock` to keep application deployments reproducible.
- Do not commit `.env`, `vendor/`, local logs, caches, editor configuration, or database dumps.
- Run Pint and the test suite before every push.
