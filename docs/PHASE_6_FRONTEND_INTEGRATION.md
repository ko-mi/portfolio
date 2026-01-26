# Phase 6: Frontend Integration (Server-Side Rendering)

This document describes the changes made to integrate the Next.js frontend with the secured Strapi CMS backend.

---

## Completed: January 26, 2026

---

## Overview

The frontend has been refactored from client-side data fetching to server-side rendering (SSR) with Incremental Static Regeneration (ISR). This ensures:
- ✅ API token never reaches the browser
- ✅ Improved SEO and initial page load
- ✅ Graceful fallback to default content if CMS is unavailable
- ✅ Cached responses for better performance (5-minute revalidation)

---

## Architecture Changes

### Before (Client-Side):
```
Browser → useEffect → fetch() → Strapi API
  ❌ Token exposed (NEXT_PUBLIC_ variable)
  ❌ CMS URL visible in browser
  ❌ Slower initial render
  ❌ Not SEO-friendly
```

### After (Server-Side):
```
Next.js Server → fetch() with token → Strapi API → Render HTML → Browser
  ✅ Token stays on server
  ✅ CMS URL never exposed
  ✅ Fast initial render
  ✅ SEO-friendly
  ✅ ISR caching (300s)
```

---

## Files Changed

### 1. **src/app/page.tsx** (Updated)

**Purpose**: Main page component with server-side data fetching

**Changes**:
- Added `export const revalidate = 300` for ISR (5 minutes)
- Created `getProjects()` async function for server-side fetching
- Changed from client component to server component
- Passes `problems` as prop to `App` component
- Falls back to `defaultProblems` if CMS fails

**Key Features**:
```typescript
// ISR: Regenerate every 5 minutes
export const revalidate = 300;

// Server-side data fetching
async function getProjects(): Promise<ProblemCard[]> {
  // Fetch with token authentication
  // Graceful fallback to defaultProblems
}

// Server component (async)
export default async function Page() {
  const problems = await getProjects();
  return <App problems={problems} />;
}
```

---

### 2. **src/App.tsx** (Updated)

**Purpose**: Main app component (now accepts props from server)

**Changes**:
- Removed `useEffect` and `useState` for data fetching
- Removed `fetchProjects` import
- Added `AppProps` interface with `problems` prop
- Changed from stateful to props-based rendering
- Simplified to pure presentation component

**Before**:
```typescript
function App() {
  const [problems, setProblems] = useState<ProblemCard[] | null>(null);
  
  useEffect(() => {
    // Client-side fetch
  }, []);
  
  return <ProblemsSection problems={problems ?? defaultProblems} />;
}
```

**After**:
```typescript
interface AppProps {
  problems?: ProblemCard[];
}

function App({ problems = defaultProblems }: AppProps) {
  return <ProblemsSection problems={problems} />;
}
```

---

### 3. **src/app/api/projects/route.ts** (New)

**Purpose**: Optional Route Handler for internal API needs

**Features**:
- Server-side only (not exposed to browser directly)
- Token authentication
- 10-second timeout
- Proper error handling
- Returns transformed `ProblemCard[]` format
- ISR caching (300s)

**Why Created**:
- Future-proofing for client-side needs
- Consistent API interface
- Centralized error handling
- Easy to extend for other endpoints

**Usage** (if needed in future):
```typescript
// Client-side component could call:
const res = await fetch('/api/projects');
const { data } = await res.json();
// Token never reaches browser
```

---

### 4. **src/services/strapi.ts** (Updated)

**Purpose**: Server-side Strapi client (utility functions)

**Changes**:
- Removed `NEXT_PUBLIC_STRAPI_URL` reference
- Added server-side token authentication
- Updated to use `STRAPI_URL` and `STRAPI_API_TOKEN`
- Better error messages
- Added JSDoc comments

**Usage**:
```typescript
import { fetchProjects } from '@/services/strapi';

// Server-side only
const projects = await fetchProjects();
```

---

### 5. **next.config.ts** (New)

**Purpose**: Next.js configuration for image optimization

**Configuration**:
```typescript
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.michalina.dev',
        port: '',
        pathname: '/**',
      },
    ],
  },
};
```

**Why Needed**:
- Allows `next/image` to optimize images from R2 CDN
- Enables automatic WebP conversion
- Provides responsive image loading

**Usage in components**:
```tsx
import Image from 'next/image';

<Image 
  src="https://media.michalina.dev/photo.jpg"
  alt="Project"
  width={800}
  height={600}
/>
```

---

### 6. **.env.local** (Updated)

**Purpose**: Local environment configuration

**Changes**:
- Removed: `NEXT_PUBLIC_STRAPI_URL=http://localhost:1337`
- Added: `STRAPI_URL=https://cms.michalina.dev`
- Added: `STRAPI_API_TOKEN=your_token_here`

**Important**:
- ❌ NOT prefixed with `NEXT_PUBLIC_`
- ✅ Stays on server, never sent to browser
- ✅ Used only in server components and API routes

---

### 7. **.env.example** (New)

**Purpose**: Template for environment variables

**Contents**:
```env
STRAPI_URL=https://cms.michalina.dev
STRAPI_API_TOKEN=your_strapi_read_only_token_here
```

**Usage**:
```bash
# Copy template
cp .env.example .env.local

# Fill in your token from Strapi admin
```

---

## Environment Variables

### Development (.env.local)

```env
STRAPI_URL=https://cms.michalina.dev
STRAPI_API_TOKEN=<your-read-only-token>
```

### Production (Vercel)

Set these in Vercel dashboard:
- `STRAPI_URL` = `https://cms.michalina.dev`
- `STRAPI_API_TOKEN` = `<your-read-only-token>`

**Important**: Do NOT prefix with `NEXT_PUBLIC_`

---

## ISR (Incremental Static Regeneration)

### Configuration

```typescript
// In src/app/page.tsx
export const revalidate = 300; // 5 minutes
```

### How It Works

1. **First Request**: Server fetches from Strapi, renders HTML, caches
2. **Cached Requests** (within 5 min): Serve cached HTML instantly
3. **After 5 Minutes**: Next request triggers background revalidation
4. **Revalidation**: Fetch fresh data, update cache, serve to next visitor

### Benefits

- ⚡ Fast page loads (serve from cache)
- 🔄 Fresh content every 5 minutes
- 💪 Resilient to CMS downtime (serves stale cache)
- 📊 Reduced CMS load (not every request hits Strapi)

---

## Data Flow

### Success Path

```
1. User visits site
   ↓
2. Next.js server checks cache
   ↓
3. If stale or missing: fetch from Strapi with token
   ↓
4. Transform response to ProblemCard[]
   ↓
5. Render HTML on server
   ↓
6. Send HTML to browser
   ↓
7. Browser displays immediately (no loading state!)
```

### Failure Path (Graceful Fallback)

```
1. User visits site
   ↓
2. Next.js server tries to fetch from Strapi
   ↓
3. ❌ Strapi timeout / error / unavailable
   ↓
4. ✅ Fallback to defaultProblems
   ↓
5. Render HTML with fallback data
   ↓
6. Browser displays (user sees content, not error)
```

---

## Testing Locally

### 1. Setup Environment

```bash
# Copy template
cp .env.example .env.local

# Edit .env.local and add your token
nano .env.local
```

### 2. Get API Token

From Strapi admin:
1. Go to https://cms.michalina.dev/admin
2. Settings → API Tokens
3. Find "Portfolio Frontend (Read-Only)"
4. Copy the token

### 3. Run Development Server

```bash
npm install
npm run dev
```

Visit http://localhost:3000

### 4. Verify Server-Side Rendering

**Check browser console**: Should see NO requests to `cms.michalina.dev`

**Check page source** (View Source):
```html
<!-- Should see actual content in HTML, not loading state -->
<h2>Migrated a legacy marketing site...</h2>
```

**Check Network tab**: No Strapi API calls from browser

---

## Testing ISR

### Verify Caching Behavior

```bash
# Build for production
npm run build

# Start production server
npm start
```

**Test sequence**:
1. Visit page → Check response time (~200ms from Strapi)
2. Refresh immediately → Check response time (~10ms from cache)
3. Wait 6 minutes → Refresh → Background revalidation triggers
4. Refresh again → See updated data (if CMS changed)

### Verify Fallback Behavior

**Simulate CMS downtime**:
1. Temporarily set wrong token in `.env.local`
2. Restart dev server
3. Visit page
4. Should see `defaultProblems` content (no errors!)

---

## Security Verification

### ✅ Token Not in Browser

**Check 1**: View page source
- Token should NOT appear anywhere

**Check 2**: Browser DevTools → Network
- No requests to `cms.michalina.dev` from browser

**Check 3**: Browser DevTools → Console
```javascript
console.log(process.env.STRAPI_API_TOKEN);
// → undefined (browser can't access server env vars)
```

### ✅ No Public Variables

**Check 4**: Search codebase
```bash
cd /Users/komi/portfolio
grep -r "NEXT_PUBLIC_STRAPI" .
# → Should return nothing
```

---

## Performance Metrics

### Expected Performance

| Metric | Before (Client-Side) | After (Server-Side + ISR) |
|--------|---------------------|--------------------------|
| **Initial Load** | ~2-3s (fetch in browser) | ~500ms (HTML ready) |
| **Time to Interactive** | ~2-3s | ~500ms |
| **Cached Load** | N/A | ~10-50ms |
| **CMS Requests/Hour** | ~3,600 (1 per visitor) | ~12 (1 per 5 min) |
| **SEO Score** | ⚠️ Dynamic content | ✅ Fully rendered |

### Monitoring

**Check build output**:
```bash
npm run build
```

Look for:
```
○  (Static)  prerendered as static content
●  (SSG)     prerendered as static HTML (uses getStaticProps)
λ  (Server)  server-side renders at runtime (uses getServerSideProps or getInitialProps)
```

Your page should show ISR indicator.

---

## Troubleshooting

### Issue: "Missing STRAPI_URL environment variable"

**Cause**: `.env.local` not configured

**Fix**:
```bash
cp .env.example .env.local
# Edit and add token
```

### Issue: Page shows defaultProblems instead of CMS data

**Check 1**: Verify token is valid
```bash
curl https://cms.michalina.dev/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Check 2**: Check server logs
```bash
npm run dev
# Look for error messages
```

**Check 3**: Verify environment variable is loaded
```typescript
// Add temporarily to page.tsx
console.log('STRAPI_URL:', process.env.STRAPI_URL);
console.log('Token length:', process.env.STRAPI_API_TOKEN?.length);
```

### Issue: Images from media.michalina.dev won't load

**Cause**: Next.js image optimization not configured

**Fix**: Verify `next.config.ts` includes:
```typescript
images: {
  remotePatterns: [
    { hostname: 'media.michalina.dev' }
  ]
}
```

### Issue: Changes to CMS not showing

**Cause 1**: ISR cache (5 minutes)
- **Wait**: 5 minutes, then refresh

**Cause 2**: Vercel caching (if deployed)
- **Fix**: Redeploy or wait for ISR revalidation

**Force Refresh** (development):
```bash
# Delete .next cache
rm -rf .next
npm run dev
```

---

## Next Steps (Phase 7)

1. Deploy to Vercel
2. Add environment variables in Vercel dashboard
3. Verify production behavior
4. Test ISR in production
5. Monitor performance
6. Celebrate! 🎉

---

## Summary

### What Changed
- ✅ Client-side fetching → Server-side rendering
- ✅ `NEXT_PUBLIC_` variables → Server-only variables
- ✅ Token exposed to browser → Token stays on server
- ✅ Slow initial load → Fast HTML delivery
- ✅ No fallback strategy → Graceful fallback to defaults
- ✅ No caching → ISR with 5-minute cache

### Security Improvements
- ✅ API token never reaches browser
- ✅ CMS URL hidden from public
- ✅ Read-only token (can't modify data)
- ✅ Token scoped to minimal permissions

### Performance Improvements
- ✅ Faster initial page load (HTML ready)
- ✅ Better SEO (fully rendered content)
- ✅ Reduced CMS load (ISR caching)
- ✅ Resilient to CMS downtime

### Developer Experience
- ✅ Simpler component logic (no useEffect)
- ✅ Clear separation (server vs client)
- ✅ Better error handling
- ✅ Easier to test

---

*Phase 6 Implementation Completed: January 26, 2026*
