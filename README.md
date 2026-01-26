# Portfolio Site

A modern, production-ready portfolio site built with **Next.js 16**, React 19, and TypeScript, integrated with Strapi CMS.

**Live Site**: https://www.michalina.dev/

---

## Features

### Core Features
- ⚡ **Server-Side Rendering (SSR)** with Incremental Static Regeneration (ISR)
- 🎨 **Modern Design** with glass morphism effects and subtle animations
- 📱 **Fully Responsive** mobile-first design
- ♿ **Accessible** (ARIA labels, keyboard navigation, focus management)
- 🔒 **Secure CMS Integration** - API token never exposed to browser
- 🚀 **Performance Optimized** - ISR reduces CMS load by 99.7%
- 🛡️ **Type-Safe** with TypeScript strict mode
- ✅ **Runtime Validation** with Zod for API responses
- 🎯 **Error Boundaries** for graceful error handling
- 📊 **SEO-Friendly** with fully rendered HTML

### Technical Highlights
- Zero browser → CMS requests (all server-side)
- 5-minute ISR cache for optimal performance
- Graceful fallback to default content if CMS unavailable
- Custom hooks for reusable logic
- Comprehensive error handling

---

## Tech Stack

### Frontend
- **Next.js 16** (App Router with Turbopack)
- **React 19**
- **TypeScript 5.7** (strict mode)
- **CSS Modules** with design tokens
- **Zod** for runtime validation
- **Inter font** (optimized via `next/font`)

### Backend
- **Strapi 5.33.2** (Headless CMS)
- **PostgreSQL 16** (Production database)
- **Cloudflare R2** (Media CDN)
- **Caddy 2** (Reverse proxy with auto-SSL)

### Hosting
- **Vercel** (Frontend with ISR)
- **VPS** (Debian 13 with Docker)

---

## Architecture

```
Browser
   ↓
Vercel Edge (ISR Cache)
   ↓
Next.js Server (SSR)
   ↓ (Bearer Token - Server Only)
Strapi CMS
   ↓
PostgreSQL + Cloudflare R2
```

**Key Points:**
- API token is server-only (never exposed to browser)
- Browser never directly contacts CMS
- ISR cache serves most requests (5-minute revalidation)
- Fallback to `defaultProblems` if CMS unavailable

---

## Development

### Prerequisites
- Node.js 20+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Add your Strapi credentials to .env.local
# STRAPI_URL=https://cms.michalina.dev
# STRAPI_API_TOKEN=your_token_here
```

### Running Locally

```bash
# Start development server
npm run dev
# → Opens on http://localhost:3000

# Build for production
npm run build

# Run production build locally
npm run start

# Lint code
npm run lint
```

### Environment Variables

**Development (.env.local):**
```env
STRAPI_URL=https://cms.michalina.dev
STRAPI_API_TOKEN=your_read_only_token_here
```

**Important:** Do NOT use `NEXT_PUBLIC_` prefix - these are server-only variables.

---

## Project Structure

```
src/
├── app/                     # Next.js App Router
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Homepage (Server Component with ISR)
│   └── api/projects/       # API route handler (currently unused)
├── components/             # React components
│   ├── Header/            # Navigation header with menu
│   ├── Hero/              # Hero section
│   ├── ValueSection/      # Value proposition
│   ├── ProblemsSection/   # Projects showcase with tabs & modal
│   ├── Footer/            # Contact footer
│   └── ErrorBoundary.tsx  # Error boundary wrapper
├── hooks/                  # Custom React hooks
│   └── useBodyScrollLock.ts
├── utils/                  # Utility functions
│   ├── transformStrapiProjects.ts  # Data transformation
│   └── strapiValidation.ts         # Zod schemas
├── services/               # External API services
│   └── strapi.ts          # Strapi type definitions
├── content/                # Fallback content
│   └── defaultProblems.ts
├── types/                  # TypeScript type definitions
│   └── index.ts
├── lib/                    # Library utilities
│   └── utils.ts           # cn() helper for classnames
└── styles/                 # Global styles
    └── globals.css        # CSS variables and base styles
```

---

## Key Features Explained

### Server-Side Rendering + ISR

**How it works:**
1. User visits site → Next.js server checks ISR cache
2. If cache is fresh (<5 min) → Serve cached HTML instantly
3. If cache is stale → Fetch from Strapi, re-generate HTML, update cache
4. If CMS fails → Fallback to `defaultProblems` content

**Benefits:**
- Fast page loads (<50ms for cached requests)
- Reduced CMS load (12 requests/hour vs 3,600)
- SEO-friendly (fully rendered HTML)
- Resilient to CMS downtime

### Runtime Validation

All Strapi API responses are validated at runtime using Zod schemas:
```typescript
const validationResult = StrapiResponseSchema.safeParse(json);
if (!validationResult.success) {
  // Fallback to default content
}
```

This ensures type safety beyond TypeScript's compile-time checks.

### Error Boundaries

Each major section is wrapped in an error boundary:
```tsx
<ErrorBoundary fallback={<FallbackUI />}>
  <ProblemsSection />
</ErrorBoundary>
```

Prevents entire app from crashing if one component fails.

### Custom Hooks

**`useBodyScrollLock(lock: boolean)`**
- Prevents body scroll when modals/menus are open
- Used by both Header and Modal components
- Automatically cleans up on unmount

---

## Deployment

### Vercel (Frontend)

**Prerequisites:**
1. Connect GitHub repository to Vercel
2. Add environment variables in Vercel dashboard:
   - `STRAPI_URL` = `https://cms.michalina.dev`
   - `STRAPI_API_TOKEN` = Your read-only token

**Deploy:**
```bash
# Automatic on push to main branch
git push origin main

# Or deploy manually
vercel --prod
```

### Environment Variables (Vercel)

Add these in **Project Settings → Environment Variables**:
- Apply to: **Production**, **Preview**, **Development**
- Do NOT use `NEXT_PUBLIC_` prefix

---

## Testing

### Manual Testing Checklist

1. **Server-Side Rendering:**
   - View page source → Should see actual content in HTML

2. **Security:**
   - Open DevTools → Network tab
   - Should see ZERO requests to cms.michalina.dev
   - Console: `console.log(process.env.STRAPI_API_TOKEN)` → `undefined`

3. **ISR Caching:**
   - First load: ~500ms (fetches from CMS)
   - Refresh: <50ms (serves from cache)

4. **Fallback Behavior:**
   - If CMS down → Site still works with default content

---

## Documentation

### Comprehensive Guides

- **[AUDIT_REPORT.md](docs/AUDIT_REPORT.md)** - Complete technical audit and recommendations
- **[PHASE_6_FRONTEND_INTEGRATION.md](docs/PHASE_6_FRONTEND_INTEGRATION.md)** - SSR implementation details
- **[PHASE_7_DEPLOYMENT.md](docs/PHASE_7_DEPLOYMENT.md)** - Production deployment guide
- **[PHASE_7_VERIFICATION_CHECKLIST.md](docs/PHASE_7_VERIFICATION_CHECKLIST.md)** - Testing procedures

### Component Documentation

Key components include JSDoc comments with usage examples:
```typescript
/**
 * Custom hook to lock/unlock body scroll.
 * @param lock - Whether to lock the body scroll
 * @example
 * ```tsx
 * useBodyScrollLock(isMenuOpen);
 * ```
 */
```

---

## Performance

### Metrics (Production)

| Metric | Target | Actual |
|--------|--------|--------|
| **First Contentful Paint** | <1.8s | ~500ms ✅ |
| **Largest Contentful Paint** | <2.5s | ~800ms ✅ |
| **Time to Interactive** | <3.8s | ~1.2s ✅ |
| **Cumulative Layout Shift** | <0.1 | ~0.05 ✅ |
| **Total Bundle Size** | - | ~136 KB ✅ |

**Lighthouse Score:** 95+ / 100

---

## Maintenance

### Weekly Checks
- Monitor Vercel analytics
- Check for console errors
- Verify CMS connectivity

### Monthly Updates
```bash
# Update dependencies
npm outdated
npm update

# Run security audit
npm audit

# Test locally
npm run build && npm start
```

---

## Troubleshooting

### Issue: Site shows default content instead of CMS data

**Check:**
1. Verify `.env.local` has correct `STRAPI_URL` and `STRAPI_API_TOKEN`
2. Test token: `curl https://cms.michalina.dev/api/projects -H "Authorization: Bearer YOUR_TOKEN"`
3. Check dev server logs for errors

### Issue: TypeScript errors after changes

```bash
# Restart TypeScript server in your IDE
# Or rebuild
npm run build
```

### Issue: Changes not appearing in production

- Wait 5 minutes (ISR cache revalidation)
- Or trigger redeploy in Vercel

---

## Contributing

### Code Style
- **TypeScript strict mode** - all code must be fully typed
- **ESLint** - run `npm run lint` before committing
- **No `any` types** - use proper types or `unknown`
- **JSDoc comments** - document public functions and components

### Adding New Features

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes with proper TypeScript types
3. Test locally: `npm run build && npm run start`
4. Update documentation if needed
5. Create pull request

---

## License

Private project - All rights reserved

---

## Contact

For questions or issues, please open an issue on GitHub or contact via email.

---

**Last Updated:** January 26, 2026  
**Version:** 1.0.0  
**Status:** ✅ Production Ready
