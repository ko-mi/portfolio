# Phase 7: Production Deployment & Validation

This document guides you through deploying the portfolio to Vercel and validating the complete end-to-end integration.

---

## Status: In Progress (January 26, 2026)

---

## Overview

Phase 7 completes the deployment pipeline:
- ✅ Code merged to `main` branch
- ✅ Vercel auto-deployment triggered
- ⏳ Configure environment variables in Vercel
- ⏳ Verify production deployment
- ⏳ Test end-to-end functionality
- ⏳ Validate ISR caching
- ⏳ Test CMS downtime resilience

---

## Step 1: Configure Vercel Environment Variables

### Access Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Find your portfolio project
3. Click **Settings** → **Environment Variables**

### Add Required Variables

Add the following environment variables for **Production**, **Preview**, and **Development** environments:

#### Variable 1: STRAPI_URL

```
Name:  STRAPI_URL
Value: https://cms.michalina.dev
Environments: ✅ Production  ✅ Preview  ✅ Development
```

#### Variable 2: STRAPI_API_TOKEN

```
Name:  STRAPI_API_TOKEN
Value: 644d75bf4f444cc087c3f3ffae3e0826498a86f0662c4ddc7dcb9a5f012534e4cd4d366ec76fb4903d717396939fba10c92eb5d37c45b616b13bfcf2bafa7a8ee3d9cdde396833b02d3a8df1faae9cf0f15603f1b5c694142cf7581c1664e72acea774b91d05a33aaef047b85c14452a9c5240be3dfa7cacb1e726e509e53ed7
Environments: ✅ Production  ✅ Preview  ✅ Development
```

**Important Notes**:
- ❌ Do NOT prefix with `NEXT_PUBLIC_` (these are server-only)
- ✅ Apply to all environments (Production, Preview, Development)
- ✅ Token is read-only (safe to use)
- ✅ Token never reaches browser (server-only)

### Save & Redeploy

After adding variables:
1. Click **Save**
2. Vercel will show: "Redeploy required for changes to take effect"
3. Click **Redeploy** (or just wait for the auto-deploy to complete)

---

## Step 2: Monitor Deployment

### Check Deployment Status

1. Go to **Deployments** tab in Vercel
2. Find the latest deployment (triggered by your main branch push)
3. Click on the deployment to view logs

### Expected Build Output

```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages (X/X)
✓ Collecting build traces
✓ Finalizing page optimization

Build completed successfully
```

### Check for Errors

**Common issues and fixes**:

**Error: "Missing environment variable"**
- **Cause**: Variables not set in Vercel
- **Fix**: Add `STRAPI_URL` and `STRAPI_API_TOKEN` in Settings → Environment Variables

**Error: "Failed to fetch from Strapi"**
- **Cause**: Token invalid or Strapi down
- **Fix**: Verify token is correct, test Strapi is accessible

**Error: "Module not found"**
- **Cause**: npm install failed
- **Fix**: Check `package.json` dependencies, redeploy

---

## Step 3: Verify Production Deployment

### Get Your Production URL

Vercel provides a URL like:
- `https://your-project.vercel.app`
- Or your custom domain if configured

### Initial Checks

**1. Site Loads**
```
✅ Visit production URL
✅ Page loads without errors
✅ Content is visible
✅ No loading spinner (instant render)
```

**2. View Source**
```
✅ Right-click → View Page Source
✅ Should see actual content in HTML (not just <div id="root">)
✅ Should see project titles from CMS
✅ Should NOT see "Loading..." placeholder
```

**3. Network Tab (DevTools)**
```
✅ Open Browser DevTools → Network tab
✅ Refresh page
✅ Should see NO requests to cms.michalina.dev
✅ Should see NO requests with "Bearer" in headers
✅ All content should be in initial HTML document
```

**4. Console (DevTools)**
```
✅ Open Browser DevTools → Console
✅ Should see no errors
✅ Should see no warnings about CMS
✅ Should see no "Failed to fetch" messages
```

---

## Step 4: Test Server-Side Rendering

### Verify SSR is Working

**Test 1: Disable JavaScript**
```
1. Open DevTools → Settings → Preferences
2. Check "Disable JavaScript"
3. Refresh page
4. Page should still show content (SSR working!)
5. Re-enable JavaScript
```

**Test 2: Check Initial HTML**
```bash
# From your terminal
curl -s https://your-project.vercel.app | grep -i "migrated a legacy"
```

**Expected**: Should return the project title from CMS

**Test 3: curl with User-Agent**
```bash
curl -A "Mozilla/5.0" https://your-project.vercel.app
```

**Expected**: Full HTML with CMS content

---

## Step 5: Test ISR (Incremental Static Regeneration)

### Verify Caching Behavior

**Test Sequence**:

1. **First Visit**
   - Visit production URL
   - Check response time in Network tab (might be ~500ms-1s)
   - This fetches fresh data from Strapi

2. **Immediate Refresh** (within 5 minutes)
   - Refresh page
   - Check response time (should be ~10-50ms)
   - This serves cached HTML (ISR cache hit)

3. **Wait 5+ Minutes**
   - Wait 6 minutes
   - Refresh page
   - This triggers background revalidation (still fast)
   - Next request gets updated data

4. **Make CMS Change**
   - Edit a project in Strapi CMS
   - Wait 5+ minutes for ISR to revalidate
   - Refresh page
   - Should see updated content

### Check Cache Headers

```bash
curl -I https://your-project.vercel.app
```

Look for:
```
x-vercel-cache: HIT    (served from cache)
x-vercel-cache: MISS   (fresh fetch)
x-vercel-cache: STALE  (serving stale while revalidating)
```

---

## Step 6: Test Fallback Behavior

### Simulate CMS Downtime

**Option 1: Temporary Token Invalidation** (don't do this unless testing)
1. Change `STRAPI_API_TOKEN` in Vercel to wrong value
2. Redeploy
3. Visit site
4. Should see `defaultProblems` content (fallback working!)
5. Restore correct token

**Option 2: Check Previous Behavior**
- If ISR cache exists, site serves stale cache even if CMS is down
- Graceful degradation is built-in

### Expected Fallback Behavior

```
CMS Down/Timeout → Falls back to defaultProblems
CMS Slow         → Waits up to fetch timeout, then fallback
CMS Returns 403  → Falls back to defaultProblems
Token Invalid    → Falls back to defaultProblems
```

**User Experience**:
- ✅ Site always works
- ✅ No error messages
- ✅ No loading spinners
- ✅ No blank pages

---

## Step 7: Security Verification

### Browser Cannot Access Token

**Test 1: Console Check**
```javascript
// Open browser console on production site
console.log(process.env.STRAPI_API_TOKEN);
// Expected: undefined

console.log(process.env.STRAPI_URL);
// Expected: undefined
```

**Test 2: Network Tab**
```
1. Open DevTools → Network
2. Refresh page
3. Check all requests
4. Filter by "cms.michalina.dev"
5. Expected: Zero results (no requests to CMS from browser)
```

**Test 3: View Source**
```
1. Right-click → View Page Source
2. Search for "644d75bf4f" (part of your token)
3. Expected: Not found (token not in HTML)
4. Search for "cms.michalina.dev"
5. Expected: Not found in JavaScript (only in image URLs is ok)
```

**Test 4: Public Environment Variables**
```bash
# Check if any NEXT_PUBLIC_ vars exist
curl -s https://your-project.vercel.app | grep -i "NEXT_PUBLIC_STRAPI"
```

**Expected**: No results

---

## Step 8: Media/Images Verification

### Check R2 Images Load

**Test 1: Image Sources**
```
1. Open a project modal with images (if any)
2. Right-click image → Inspect
3. Check src attribute
4. Expected: https://media.michalina.dev/...
```

**Test 2: Image Optimization**
```
1. Check Network tab for image requests
2. Images should load from media.michalina.dev
3. Next.js optimization should work (WebP format)
4. No CORS errors
```

**Test 3: Direct Image Access**
```
Visit: https://media.michalina.dev/cv_5cdba5ac4c.pdf
Expected: File loads directly (R2 working)
```

---

## Step 9: Performance Testing

### Lighthouse Audit

1. Open DevTools → Lighthouse
2. Select "Performance", "Accessibility", "Best Practices", "SEO"
3. Click "Analyze page load"

**Expected Scores**:
- Performance: 90+ (SSR + ISR helps a lot)
- Accessibility: 90+
- Best Practices: 90+
- SEO: 100 (SSR ensures crawlers see content)

### Key Metrics

| Metric | Target | Notes |
|--------|--------|-------|
| First Contentful Paint | <1.5s | HTML pre-rendered |
| Largest Contentful Paint | <2.5s | ISR cache helps |
| Time to Interactive | <3s | Minimal JavaScript |
| Cumulative Layout Shift | <0.1 | Good if no layout shifts |

---

## Step 10: End-to-End Validation

### Complete User Flow Test

1. **Homepage Load**
   - ✅ Loads instantly
   - ✅ Shows CMS content
   - ✅ No loading states

2. **Navigation**
   - ✅ "View selected work" scrolls to projects
   - ✅ Tabs work (switch between projects)
   - ✅ Modal opens with project details

3. **Content**
   - ✅ All 5 projects visible
   - ✅ Titles match CMS
   - ✅ Descriptions match CMS
   - ✅ Tech stack displays correctly

4. **Links**
   - ✅ Email link works
   - ✅ LinkedIn link works
   - ✅ GitHub link works

5. **Responsive**
   - ✅ Mobile view works
   - ✅ Tablet view works
   - ✅ Desktop view works
   - ✅ Hamburger menu works on mobile

---

## Troubleshooting

### Issue: Site shows defaultProblems instead of CMS data

**Diagnosis**:
```bash
# Test if Vercel can reach Strapi
# Check Vercel function logs in dashboard
```

**Possible Causes**:
1. Environment variables not set correctly
2. Token expired or invalid
3. Strapi is down
4. Firewall blocking Vercel IPs

**Fixes**:
1. Double-check `STRAPI_URL` and `STRAPI_API_TOKEN` in Vercel
2. Test token manually: `curl https://cms.michalina.dev/api/projects -H "Authorization: Bearer YOUR_TOKEN"`
3. Check Strapi is up: `curl -I https://cms.michalina.dev`
4. Review Strapi logs: `docker compose logs -f strapi`

### Issue: Images from media.michalina.dev won't load

**Diagnosis**:
```bash
# Test direct access
curl -I https://media.michalina.dev/test-file.jpg
```

**Possible Causes**:
1. R2 bucket CORS not configured
2. Next.js image config missing
3. URL in CMS is wrong

**Fixes**:
1. Check `next.config.ts` has `media.michalina.dev` in `remotePatterns`
2. Verify R2 bucket allows public access
3. Check Strapi `config/plugins.ts` has correct `R2_PUBLIC_URL`

### Issue: "x-vercel-cache: MISS" on every request

**Diagnosis**:
ISR not caching properly

**Possible Causes**:
1. `revalidate` not set in page.tsx
2. Dynamic parameters preventing cache
3. Cookies/auth preventing cache

**Fixes**:
1. Verify `export const revalidate = 300` in `src/app/page.tsx`
2. Remove any dynamic segments or searchParams usage
3. Check no cookies are being set that prevent caching

### Issue: Build fails in Vercel

**Check Build Logs**:
1. Go to Deployments → Click failed deployment
2. View build logs for specific error

**Common Fixes**:
- Missing dependencies: `npm install <missing-package>`
- TypeScript errors: Fix type issues locally, test with `npm run build`
- Environment variables: Ensure they're set before build

---

## Monitoring & Maintenance

### Regular Checks (Weekly)

```bash
# Test production site
curl -I https://your-project.vercel.app

# Check CMS is up
curl -I https://cms.michalina.dev

# Check media CDN
curl -I https://media.michalina.dev
```

### Vercel Dashboard Monitoring

1. **Analytics** → Check visitor traffic
2. **Speed Insights** → Monitor performance
3. **Logs** → Review function logs for errors
4. **Bandwidth** → Monitor usage

### CMS Monitoring

```bash
# SSH into VPS
ssh komi@159.195.45.58

# Check containers
docker compose ps

# Check logs
docker compose logs -f strapi

# Check resource usage
docker stats --no-stream
```

---

## Success Criteria

### ✅ Phase 7 Complete When:

**Deployment**:
- ✅ Site deployed to Vercel production
- ✅ Environment variables configured
- ✅ Build successful (no errors)

**Functionality**:
- ✅ Homepage loads with CMS content
- ✅ Server-side rendering working (view source shows content)
- ✅ ISR caching working (fast subsequent loads)
- ✅ Fallback to defaultProblems if CMS down

**Security**:
- ✅ No CMS requests from browser
- ✅ Token not visible in browser
- ✅ No NEXT_PUBLIC_ variables for CMS

**Performance**:
- ✅ Lighthouse score >90
- ✅ First load <2s
- ✅ Cached loads <100ms

**Media**:
- ✅ Images load from media.michalina.dev
- ✅ Next.js image optimization works
- ✅ No CORS errors

**User Experience**:
- ✅ No loading states (instant render)
- ✅ All navigation works
- ✅ Responsive design works
- ✅ No console errors

---

## Final Architecture

```
User Browser
     ↓
 [Vercel Edge Network]
     ↓ (CDN, ISR Cache)
 [Next.js Server]
     ↓ (if cache miss/stale)
     ├──→ [Strapi CMS] ← https://cms.michalina.dev
     │        ↓
     │    [PostgreSQL] (VPS)
     │
     └──→ [Cloudflare R2] ← https://media.michalina.dev
              (Media files)

Server Environment Variables:
  - STRAPI_URL=https://cms.michalina.dev
  - STRAPI_API_TOKEN=<read-only-token>

ISR Behavior:
  - First request: Fetch from Strapi, render, cache for 300s
  - Cached requests: Serve from Vercel Edge (instant)
  - After 300s: Background revalidation, update cache
  - CMS down: Serve stale cache or fallback to defaultProblems
```

---

## Next Steps (Post-Deployment)

### Immediate
1. ✅ Test production site thoroughly
2. ✅ Verify all links work
3. ✅ Share site with stakeholders
4. ✅ Monitor Vercel analytics

### Short-term
1. Set up custom domain (if not already)
2. Configure Vercel analytics
3. Set up error monitoring (Sentry, optional)
4. Create CMS backup schedule (weekly)

### Long-term
1. Regular CMS content updates
2. Monitor performance metrics
3. Update dependencies quarterly
4. Scale VPS if traffic grows

---

## Documentation Reference

- **Phase 0-2**: [VPS_ARCHITECTURE.md](/Users/komi/portfolio-cms/VPS_ARCHITECTURE.md)
- **Phase 3**: [DEPLOYMENT.md](/Users/komi/portfolio-cms/DEPLOYMENT.md)
- **Phase 4**: R2 integration in VPS_ARCHITECTURE.md
- **Phase 5**: [PHASE_5_API_SECURITY.md](/Users/komi/portfolio-cms/PHASE_5_API_SECURITY.md)
- **Phase 6**: [PHASE_6_FRONTEND_INTEGRATION.md](/Users/komi/portfolio/docs/PHASE_6_FRONTEND_INTEGRATION.md)
- **Phase 7**: This document

---

## Celebration Time! 🎉

Once all checks pass, you've successfully:
- ✅ Set up a production-ready VPS with Docker
- ✅ Deployed Strapi CMS with PostgreSQL
- ✅ Integrated Cloudflare R2 for media storage
- ✅ Secured API with token authentication
- ✅ Implemented server-side rendering with ISR
- ✅ Deployed to Vercel with zero-downtime caching
- ✅ Created a fully documented, maintainable system

**Your portfolio is now live with a professional, secure, performant infrastructure!**

---

*Phase 7 In Progress: January 26, 2026*
