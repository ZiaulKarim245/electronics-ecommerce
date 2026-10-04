# Frontend API contracts

This document defines the initial contract between this Next.js frontend and the separately maintained Laravel REST API. Changes should be coordinated between both repositories before either side is deployed.

## Transport conventions

- Base URL comes from the server-only `BACKEND_API_BASE_URL` variable.
- Frontend-to-backend requests send `Accept: application/json` and the server-only `X-Frontend-Key` header.
- JSON property names from Laravel use `snake_case`.
- Dates and timestamps use ISO 8601 strings.
- Money values use integer BDT amounts unless an endpoint explicitly documents a different representation.
- Authentication will use Laravel Sanctum; demo authentication is not part of the production contract.

## Success envelope

```json
{
  "status": "success",
  "data": {},
  "message": "Optional human-readable message"
}
```

Paginated collections place Laravel pagination fields inside `data`:

```json
{
  "status": "success",
  "data": {
    "data": [],
    "current_page": 1,
    "last_page": 1,
    "per_page": 20,
    "total": 0
  }
}
```

## Error envelope

```json
{
  "status": "error",
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "The submitted data is invalid.",
    "fields": {
      "email": ["The email field is required."]
    }
  }
}
```

Stable machine-readable error codes must be used for frontend decisions. Human-readable messages may change and must not be used as identifiers.

## Initial endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/products` | Paginated catalog with specifications, variants and warranty options |
| `POST` | `/auth/login` | Start an authorized staff session |
| `POST` | `/auth/logout` | End the current staff session |
| `GET` | `/auth/user` | Return staff identity, roles and permissions |
| `GET` | `/inventory` | Variant stock and serialized inventory |
| `GET` | `/orders` | Order queue, payment state and risk information |
| `GET` | `/rma-claims` | Warranty and service-ticket queue |

The TypeScript source of truth for shared envelopes and initial payloads is [`types/api.ts`](../types/api.ts). Runtime catalog validation lives in [`lib/api/contracts.ts`](../lib/api/contracts.ts). Add both a TypeScript contract and runtime validation before consuming a new endpoint.

## Catalog requirements

Each product must include its identity, category, brand, model, stock state, official and shop warranty options, key features, specification rows, and supported visual type. Optional media URLs may be `null` or omitted.

The frontend rejects malformed catalog responses. In local development only, `STOREFRONT_MOCK_DATA=true` permits a clearly identified mock fallback. Production never serves that fallback and returns HTTP `503` when live catalog data is unavailable.

## Authentication and authorization

The production backend must return the signed-in staff member with their role names and granular permissions. The frontend may hide unavailable actions for usability, but Laravel remains responsible for authorizing every protected request.

Before authentication integration, confirm Sanctum cookie domains, CORS origins, CSRF flow, session expiry, logout behavior, and the exact production frontend/backend domains.
