---
id: "portfolio-nextjs-strapi"
title: "Portfolio site + headless CMS (Vercel + Strapi on VPS)"
type: "tech-details"
context: "independent"
date_start: null
date_end: null
visibility: "public-safe"
tags:
  - nextjs
  - react
  - typescript
  - strapi
  - headless-cms
  - content-systems
  - cloudflare
  - docker
  - vps
related_case_study_id: null
---

# Portfolio + CMS (Next.js + Strapi) — System Write-up

This project is a **two-repo system**:

- A **portfolio frontend** deployed on **Vercel** (`/Users/komi/portfolio`)
- A **headless CMS** (Strapi) intended to run in production on a **VPS via Docker**, fronted by **Cloudflare** (`/Users/komi/portfolio-cms`)

The “end-game” architecture goal is: **the browser never calls Strapi**, Strapi is **locked down behind Cloudflare + tokens**, and the frontend uses **SSG/ISR** so the site continues to serve even if the CMS is temporarily down.

## What exists today (and what’s changing next)

### Current state (already implemented)
- **Frontend**: Next.js App Router with an SPA-like client tree (`'use client'` root). Deployed on Vercel.
- **CMS**: Strapi 5 project with a `Project` collection type + seed script.
- **Integration**: frontend currently fetches projects **client-side** from `NEXT_PUBLIC_STRAPI_URL` and falls back to a local dataset if the CMS is unavailable.
- **Cloudflare**: configured (DNS / edge layer). Next step is attaching the VPS-backed CMS behind it.

### Target state (the VPS + Docker + Cloudflare route)
- **Vercel ↔ Strapi is server-only**: Next.js uses a token to query Strapi. No browser-to-Strapi traffic.
- **Strapi runs on a VPS in Docker**:
  - Reverse proxy terminates TLS and is the only public entry
  - Strapi and Postgres run on a private Docker network
  - Port `1337` is not publicly exposed
- **Cloudflare protects the CMS**:
  - WAF/rate limits for `/api/*`
  - Strong protection for `/admin` (Cloudflare Access preferred)
- **ISR** on the portfolio page: published projects can update without redeploying the frontend, while retaining resilience if the CMS is down.

## Architecture (target trust boundaries)

### High-level data flow

```mermaid
flowchart TD
  Browser-->VercelApp
  Browser-->MediaDomain
  VercelApp-->NextRoute
  NextRoute-->|"HTTPS + Bearer STRAPI_TOKEN"|CmsDomain

  subgraph VercelGroup [Vercel]
    VercelApp[Next.js App Router]
    NextRoute[Route Handlers / Server Fetch]
  end

  subgraph CloudflareGroup [Cloudflare]
    CmsDomain[cms.<domain> (WAF/TLS/Access)]
    MediaDomain[media.<domain> (CDN)]
  end

  subgraph VPSGroup [VPS (Docker)]
    ReverseProxy[Reverse proxy (443 only)]
    Strapi[Strapi (private :1337)]
    Postgres[Postgres (private)]
  end

  CmsDomain-->ReverseProxy
  ReverseProxy-->Strapi
  Strapi-->Postgres
```

### Why this boundary matters
- **Security story**: the Strapi token lives only in Vercel server env vars; it never ships to the browser.
- **Resilience story**: ISR means user traffic is served from cached HTML/data; Strapi is only required during revalidation/regeneration.
- **Operational story**: VPS ownership makes it possible to talk about reverse proxies, Docker networking, backups, and hardening.

## Repositories and responsibilities

### Frontend repo (`/Users/komi/portfolio`)
- **Purpose**: render the portfolio UI and “Selected work” section.
- **Framework**: Next.js (App Router) + React 18 + TypeScript.
- **Styling**: CSS Modules plus Tailwind tooling in the repo.
- **Current integration shape**: client fetch from Strapi with graceful fallback.
- **Planned integration shape**: server fetch via a Route Handler + ISR.

Key files:
- `src/app/layout.tsx`: global CSS + metadata + font.
- `src/app/page.tsx`: mounts the client app.
- `src/App.tsx`: current client-side data loading + UI composition.
- `src/services/strapi.ts`: current Strapi fetch adapter (browser).
- `src/components/ProblemsSection/*`: “Selected work” UI (tabs + modal).
- `src/content/defaultProblems.ts`: fallback dataset.

### CMS repo (`/Users/komi/portfolio-cms`)
- **Purpose**: manage portfolio `Project` entries as CMS content.
- **Framework**: Strapi 5.
- **DB**: SQLite for local/dev; **Postgres in production** (planned on the VPS).

Key files:
- `src/api/project/content-types/project/schema.json`: the `Project` collection schema.
- `scripts/seed-projects.ts`: CLI seeding/upsert+pUBLISH tool.
- `seed/projects.ts`: the canonical seed payload.
- `config/database.ts`: DB adapter selection (SQLite/MySQL/Postgres).

## Content model: `Project`

The CMS is intentionally modeled to match the UI’s “Selected work” / “Problems” section.

### Fields (v1)
- **Required**
  - `title` (string)
  - `sortOrder` (integer): **canonical ordering + stable UI identity**
  - `slug` (UID from `title`): deterministic identity for upserts and future deep links
- **Optional**
  - `tabLabel` (string): controls tab label without hardcoding
  - `description`, `problem`, `solution`, `result` (text): modal content
  - `techStack` (json): currently used as `string[]` in the frontend

### Editorial invariants
- `sortOrder` should be **unique per card**. (Not enforced in schema today; treated as an editorial constraint.)
- Published content is what the production portfolio reads.

## Frontend integration (current vs target)

### Current integration (client fetch + fallback)
- `src/services/strapi.ts` reads `NEXT_PUBLIC_STRAPI_URL` and calls:
  - `GET {NEXT_PUBLIC_STRAPI_URL}/api/projects?sort=sortOrder:asc`
- `src/App.tsx` adapts CMS data into `ProblemCard[]` and uses:
  - `ProblemCard.id = String(sortOrder ?? id)` to keep stable keys
- On any failure, the UI renders `defaultProblems` so the page stays usable.

This is a great “first integration” because it proves:
- the content model matches the UI,
- the adapter layer exists,
- and the UX doesn’t break when the CMS is unavailable.

### Target integration (server-only Strapi + ISR)
The end-to-end plan changes the trust boundary:

- Add a Next Route Handler (example path: `src/app/api/projects/route.ts`) that:
  - reads **server-only** env vars (`STRAPI_URL`, `STRAPI_TOKEN`)
  - calls Strapi with a Bearer token
  - returns a stable JSON shape for the frontend (ideally `ProblemCard[]`)
  - sets a strict timeout and returns a fallback response when needed
- Fetch projects **server-side** in `src/app/page.tsx` (or another server component) and set ISR:
  - `export const revalidate = 300`
- Refactor `src/App.tsx` so it **receives** `problems` as props instead of calling the CMS directly.

Net effect:
- **No `NEXT_PUBLIC_STRAPI_URL` in production**
- **No browser → Strapi**
- **Strapi can require a token**, and is no longer “public read”

## CMS security posture (target)

### Strapi roles/permissions
- **Public role**: no read access to `Project` (prevents anonymous scraping and accidental exposure if new fields are added later).
- **API token**: read-only, minimal scopes (e.g. `project.find` / `project.findOne`) used only by the Vercel server layer.

### Cloudflare edge controls
- **WAF / rate limiting**: apply to `cms.<domain>/api/*`.
- **Admin protection**: protect `cms.<domain>/admin` (Cloudflare Access preferred; reverse-proxy basic auth as fallback).
- **TLS**: Cloudflare handles certificate issuance/renewal and edge termination (with origin certs or strict TLS mode).

## VPS + Docker deployment (next milestone)

This is the next “production enablement” step: stand up the CMS so the deployed portfolio can read real production content.

### Container layout (recommended)
- Reverse proxy container (Caddy/Nginx/Traefik):
  - Only public ports: `80/443`
  - Routes `cms.<domain>` → Strapi container on a private network
- Strapi container:
  - Not publicly exposed (`:1337` only inside Docker network)
- Postgres container:
  - Private network only
  - Persistent volume

### Operational requirements (minimum viable ops)
- **Firewall**: only `22` (SSH), `80/443` (web) open.
- **Backups**:
  - automated Postgres dump or volume snapshot
  - periodic restore drill (documented)
- **Upgrades**:
  - Strapi upgrade path tested in a staging environment (or at least a local clone with prod DB dump)
- **Secrets management**:
  - Strapi app keys, JWT secrets, API token salts, DB credentials stored as VPS env vars (not in git)

## Media/uploads (planned, not required for “Projects text only”)

The end-to-end plan includes object storage + a CDN media domain. This becomes relevant when the CMS introduces media fields (e.g. `coverImage`).

Target:
- Store uploads in **Cloudflare R2** via an S3-compatible Strapi upload provider.
- Serve files via `media.<domain>` (CDN), not the VPS.

## Failure strategy and resilience goals

### “CMS downtime should not break the site”
With ISR, the frontend can keep serving cached HTML/data even if Strapi is down during revalidation.

Preferred behavior hierarchy:
1. Serve the last successfully generated ISR output.
2. If regeneration fails and there is no cache (rare), serve a safe fallback dataset (`defaultProblems`) or an explicit “content temporarily unavailable” state.

### Timeouts are non-negotiable
All server-side calls from Next → Strapi should have a strict timeout to prevent cascading latency during incidents.

## Testing and validation checklist (production)
- **Browser network panel**: verify **no requests** to `cms.<domain>` from the browser.
- **Token secrecy**: verify `STRAPI_TOKEN` never appears in client bundles.
- **Permissions**: verify `GET /api/projects` fails without token and works with token.
- **ISR behavior**: verify Strapi is not hit on every request; it is hit only on revalidation windows.
- **Admin protection**: verify `/admin` is gated behind Cloudflare Access (or equivalent).

## Appendix

### Environment variables (intended)
- **Frontend (Vercel)**
  - `STRAPI_URL` (server-only): `https://cms.<domain>`
  - `STRAPI_TOKEN` (server-only): read-only API token
  - Avoid `NEXT_PUBLIC_STRAPI_URL` in production once server fetching is implemented

### Local development
- Frontend: `npm run dev` in `portfolio`
- CMS: `npm run develop` in `portfolio-cms`
- Seed: `npm run seed:projects` in `portfolio-cms`

