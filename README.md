# Street Alert Frontend

Production-focused React (JavaScript) + Vite frontend for the Street Alert Spring Boot backend.

## Stack

- React 19 (JavaScript)
- Vite
- React Router
- TanStack Query
- Axios
- React Hook Form + Zod
- React Toastify

## Folder Structure

```text
src/
  app/
    config/           # env and runtime config
    lib/              # API client + token storage
    store/            # auth context/state
    types/            # shared DTO/domain typings
    providers.jsx     # global providers
    router.jsx        # route config and guards
  features/
    auth/
    news/
    notifications/
    subscriptions/
    admin/
  shared/
    components/
    layout/
    utils/
  main.jsx
  styles.css
```

## Environment

Copy `.env.example` to `.env` and set values:

```env
VITE_API_BASE_URL=http://localhost:8080
```

If `.env` is missing, the app defaults to `http://localhost:8080`.

Optional:

```env
VITE_PERSIST_ACCESS_TOKEN=true
```

Default token strategy is in-memory access token + localStorage refresh token. `VITE_PERSIST_ACCESS_TOKEN=true` enables localStorage fallback for access token persistence.

## Run Locally

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
```

## Implemented Phases

1. **Core architecture**: JavaScript feature-based modules, routing shell, env config.
2. **Auth**: register/login pages, auth context, JWT handling, protected/guest/admin route guards.
3. **Dashboard**: personalized feed with sector/impact filters and loading/error/empty states.
4. **Notifications**: list, unread badge, mark-as-read with optimistic UI update.
5. **Subscriptions**: full CRUD for sector + minimum impact preferences.
6. **Admin**: manual fetch trigger, fetch logs, keyword rule CRUD.

## API Contract Assumptions

The UI is wired to these backend route groups:

- `/api/auth/*`
- `/api/news`
- `/api/notifications/*`
- `/api/subscriptions/*`
- `/api/admin/*`

If your backend uses different paths or payload shapes, update files under `src/features/*/api`.

## Key Architecture Decisions

1. **Auth token handling**: access token defaults to in-memory storage (XSS blast radius reduction), with optional localStorage fallback behind `VITE_PERSIST_ACCESS_TOKEN=true` for environments requiring persistence across reloads.
2. **Central API integration**: one Axios client with auth header injection + automatic refresh flow + single unauthorized handler for secure, consistent session recovery.
3. **Feature-first modules**: each domain owns its API adapter and UI, while `app/` contains cross-cutting runtime concerns (router, providers, auth store, shared contracts).
