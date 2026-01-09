# Next.js Migration: What Changed + Daily Workflow

This repo was migrated from **Vite + React SPA** to **Next.js (App Router)**. The UI/structure is intentionally kept close to the original, but the entrypoints, tooling, and a few assumptions changed.

## Daily commands

- **Install**:

```bash
npm install
```

- **Dev** (runs Next dev server):

```bash
npm run dev
```

- **Build** (what Vercel runs; should be green before pushing):

```bash
npm run build
```

- **Lint**:

```bash
npm run lint
```

## What changed (mental model)

- **No Vite HTML entrypoint**
  - Vite used `index.html` + `src/main.tsx` to mount the app.
  - Next renders from routes under `src/app/*` (App Router).

- **Routing is file-based**
  - Home page route lives at `src/app/page.tsx`.
  - Global document/layout wrapper is `src/app/layout.tsx`.

- **Server vs Client components**
  - In App Router, files are **Server Components by default**.
  - Any component using hooks (`useState`, `useEffect`, etc.) must be a **Client Component**.
  - This repo keeps the interactive app tree under `src/App.tsx` marked with `'use client'`.

## Where to edit what

- **Home page composition**: `src/App.tsx`
  - Renders Header/Hero/ValueSection/ProblemsSection/Footer.

- **HTML shell + metadata + global font**: `src/app/layout.tsx`
  - Global CSS is imported here (Next requirement).

- **Global styles + Tailwind directives**: `src/styles/globals.css`
  - Includes `@tailwind base/components/utilities`.

- **Tailwind config**: `tailwind.config.cjs`
- **PostCSS config**: `postcss.config.cjs`

## Environment variables (important difference from Vite)

- If an env var is used in browser code, it **must** be prefixed with:
  - `NEXT_PUBLIC_...`

Examples:
- `NEXT_PUBLIC_STRAPI_URL=http://localhost:1337`

Server-only secrets (later, if you add a Strapi proxy/SSR fetching) should **not** use `NEXT_PUBLIC_`.

## Deployment implications (Vercel)

- Vercel auto-detects Next.js and runs `npm run build`.
- If `npm run build` fails locally, it will fail on Vercel.

## CMS integration implications (Strapi)

Current intended progression:
- Start with **client-side fetch** (fastest) using `NEXT_PUBLIC_STRAPI_URL`.
- Later upgrades (optional):
  - Fetch on the server (SSR/SSG/ISR) for SEO/perf and a better security story.
  - Proxy Strapi through Next route handlers to keep tokens secret.

