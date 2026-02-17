# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Trip-Path (여행 경로 플래닝 서비스) is a Korean-language travel route planning web application. The architecture specification is in `docs/design.md`.

## Monorepo Structure

pnpm workspace + Turborepo monorepo:
- `apps/api` — NestJS 10 backend (port 4000, API prefix `/v1`)
- `apps/web` — Next.js 15 frontend with App Router (port 3000)
- `packages/shared-types` — Shared TypeScript interfaces, enums, and API contracts
- `packages/shared-utils` — Shared utility functions (date, validation, geo, format)
- `packages/ui-components` — Shared React UI component library

## Commands

### Prerequisites
- Node.js >= 22, pnpm >= 9
- Local infra: `cd docker && docker compose up -d` (PostgreSQL 16, Redis 7, MinIO)
- Copy `.env.example` to `.env` and fill in secrets

### Root-level (Turborepo)
```bash
pnpm dev            # Start all apps in dev mode
pnpm build          # Build all apps and packages
pnpm lint           # Lint all workspaces
pnpm test           # Run all tests
pnpm clean          # Remove build artifacts
pnpm format         # Prettier format all files
pnpm format:check   # Check formatting
```

### API (`apps/api`)
```bash
pnpm --filter @trip-path/api dev          # Dev server with hot reload
pnpm --filter @trip-path/api test         # Unit tests (Jest)
pnpm --filter @trip-path/api test:e2e     # E2E tests (Jest + Supertest)
pnpm --filter @trip-path/api test:cov     # Tests with coverage
pnpm --filter @trip-path/api lint         # ESLint
```

Run a single test file:
```bash
pnpm --filter @trip-path/api test -- --testPathPattern=<pattern>
```

### Web (`apps/web`)
```bash
pnpm --filter @trip-path/web dev          # Next.js dev on port 3000
pnpm --filter @trip-path/web build        # Production build
pnpm --filter @trip-path/web lint         # Next.js ESLint
```

### Database Migrations (`apps/api`)
```bash
pnpm --filter @trip-path/api migration:generate
pnpm --filter @trip-path/api migration:run
pnpm --filter @trip-path/api migration:revert
```

## Architecture

### Backend (`apps/api/src/`)

NestJS modular monolith organized as feature modules under `src/modules/`:
- `auth/` — JWT + OAuth (Google/Kakao/Naver), token rotation
- `users/` — Profile, follow/unfollow
- `trips/` — Trip CRUD, place management, clone, like, bookmark, route optimization
- `places/` — Place search (Kakao/Google Maps integration)
- `collab/` — Collaborator management + Socket.io WebSocket gateway (namespace `/v1/ws`)
- `budget/` — Budget tracking
- `search/` — Unified search across trips/places/users
- `notification/` — Notification management

Each module follows: Controller → Service → Module + DTOs.

Cross-cutting concerns in `src/common/`:
- `filters/HttpExceptionFilter` — Global error handler returning `{ error: { code, message, details, timestamp, requestId } }`
- `interceptors/TransformInterceptor` — Wraps all responses in `{ data: ... }`
- `guards/` — `JwtAuthGuard`, `RolesGuard`
- `decorators/` — `@Public()`, `@Roles()`, `@CurrentUser()`

Entities live in `src/database/entities/` — all use UUID PKs, soft delete (`@DeleteDateColumn`), and `timestamptz` columns in UTC.

### Frontend (`apps/web/`)

Next.js 15 App Router with two route groups:
- `app/(auth)/` — Login, register, OAuth callback (no main layout)
- `app/(main)/` — All authenticated app pages

State management:
- **TanStack Query** for server state (API data, caching)
- **Zustand** for client state (`stores/auth.store.ts` with persist, `stores/trip-editor.store.ts` for optimistic updates)

API layer: `lib/api-client.ts` is a fetch-based HTTP client that auto-attaches JWT from Zustand auth store. Domain-specific API functions in `lib/api/`.

Real-time: Socket.io client singleton in `lib/socket.ts` connecting to `/v1/ws`.

Styling: Tailwind CSS 3 with HSL CSS custom properties theming, `class-variance-authority` for component variants, `clsx` + `tailwind-merge` for class composition.

### Shared Packages

`@trip-path/shared-types` defines the typed contracts between frontend and backend — all enums, entity types, and API request/response interfaces. When adding a new API endpoint, define its types here first.

## Key Conventions

- **Business rules** are documented with IDs (e.g., `BR-TRIP-001`, `BR-PLACE-002`) referencing `docs/design.md`. Preserve these references in code comments.
- **DTOs** use `class-validator` decorators; Swagger docs are auto-generated from these.
- Swagger UI is available at `/docs` in non-production mode.
- Next.js rewrites `/api/*` to the backend (`NEXT_PUBLIC_API_URL`).
- TypeScript strict mode is enabled (`tsconfig.base.json`). `noUnusedLocals` and `noUnusedParameters` are enforced.
- Code style: Prettier — single quotes, semicolons, trailing commas (all), 100 char width, 2-space indent, LF endings.

## CI

GitHub Actions (`.github/workflows/ci.yml`) runs on push/PR to `main` and `develop`: lint → build shared packages → test (with PostgreSQL + Redis services) → full build.
