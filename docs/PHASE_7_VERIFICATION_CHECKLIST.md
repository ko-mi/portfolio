# Phase 7: Production Verification Checklist

Quick checklist to verify your production deployment is working correctly.

---

## ✅ Deployment Status: SUCCESS

**Build Output:**
```
✓ Generating static pages using 1 worker (4/4) in 526.0ms
✓ Build Completed in /vercel/output [23s]
✓ Deploying outputs...
```

**Clean build - no deprecation warnings!**

---

## 🔍 Step-by-Step Verification

### 1. Get Your Production URL

From Vercel dashboard or deployment log, find your URL:
- Format: `https://your-project.vercel.app`
- Or: Your custom domain (if configured)

---

### 2. Basic Functionality Test

**Visit the site:**
```
✅ Site loads (no errors)
✅ Content appears instantly (no loading spinner)
✅ Projects section visible
✅ Navigation works (tabs, modals, links)
```

---

### 3. Server-Side Rendering Verification

**A. View Page Source (Critical!)**

1. Visit your production URL
2. Right-click anywhere → **View Page Source** (or Ctrl/Cmd+U)
3. Search for text from your CMS projects

**What to look for:**
```html
<!-- You SHOULD see actual content in the HTML: -->
<h3>Migrated a legacy marketing site to Framer</h3>
<p>Led an end-to-end migration from a legacy site...</p>
```

**If you see this instead (BAD):**
```html
<!-- Just empty divs or loading states: -->
<div id="root"></div>
<!-- or -->
<div>Loading...</div>
```

**Status:**
- ✅ See actual content → Server-side rendering working!
- ❌ Don't see content → Environment variables not set, check Vercel settings

---

### 4. Security Check (Most Important!)

**A. Check Network Tab**

1. Open DevTools (F12 or Cmd+Option+I)
2. Go to **Network** tab
3. Refresh page
4. Filter by "cms.michalina.dev"

**Expected Result:**
```
✅ ZERO requests to cms.michalina.dev from browser
```

**If you see requests:**
- ❌ Token might be exposed (check code)
- ❌ Using NEXT_PUBLIC_ vars (bad!)

**B. Check Console**

Open **Console** tab and type:
```javascript
console.log(process.env.STRAPI_API_TOKEN)
```

**Expected Result:**
```
undefined  ✅ (Token is server-only, not exposed!)
```

**If you see the token:**
- ❌ CRITICAL: Token is exposed to browser!
- ❌ Check you're not using NEXT_PUBLIC_STRAPI_API_TOKEN

---

### 5. Content Verification

**Check if CMS data is showing:**

Visit your site and verify you see:
- ✅ "Migrated a legacy marketing site to Framer" (Project 1)
- ✅ "CMS Data Modeling for Complex Content" (Project 2)
- ✅ "Interactive Demo / Funnel Systems" (Project 3)
- ✅ "Analytics Infrastructure" (Project 4)
- ✅ "Cross-Team Collaboration" (Project 5)

**If you see generic/fallback data instead:**
- ⚠️ Using `defaultProblems` (fallback data)
- Possible causes:
  1. Environment variables not set in Vercel
  2. Token is invalid
  3. Strapi is down
  4. Network issue from Vercel to your VPS

---

### 6. ISR (Caching) Test

**Quick Cache Test:**

1. **First visit:** Note the response time (DevTools → Network → Document)
   - Should be ~200-500ms (fetches from Strapi)

2. **Immediate refresh:** Reload the page
   - Should be ~10-50ms (served from cache!)

3. **Check headers:** Look for `x-vercel-cache` header
   ```
   x-vercel-cache: HIT  ✅ (cache working!)
   ```

**This proves ISR is working!**

---

### 7. Images/Media Check

**If you have images from R2:**

1. Open DevTools → Network
2. Filter by "media.michalina.dev"
3. Check if images load

**Expected:**
```
✅ Images load from https://media.michalina.dev/...
✅ No CORS errors
✅ Next.js optimization working (WebP format)
```

---

### 8. Performance Check (Optional but Recommended)

**Run Lighthouse:**

1. Open DevTools → Lighthouse
2. Select: Performance, Accessibility, Best Practices, SEO
3. Click "Analyze page load"

**Target Scores:**
- 🎯 Performance: 90+ (SSR helps!)
- 🎯 Accessibility: 90+
- 🎯 Best Practices: 90+
- 🎯 SEO: 100 (SSR content is crawlable!)

---

## 🚨 Troubleshooting

### Issue: Site shows defaultProblems instead of CMS data

**Fix:**

1. Go to Vercel dashboard
2. Project → Settings → Environment Variables
3. Verify these exist:
   ```
   STRAPI_URL=https://cms.michalina.dev
   STRAPI_API_TOKEN=<your-token>
   ```
4. Make sure they're set for **Production** environment
5. Click **Redeploy** after adding/changing

**Test token manually:**
```bash
curl https://cms.michalina.dev/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Should return JSON with your projects.

---

### Issue: "x-vercel-cache" always shows MISS

**Possible causes:**
1. ISR not configured (should be, we set `revalidate = 300`)
2. Dynamic parameters preventing cache
3. Cookies interfering

**Check:**
```typescript
// In src/app/page.tsx - should have:
export const revalidate = 300;
```

---

### Issue: Images from media.michalina.dev won't load

**Fix:**

1. Check `next.config.ts` has:
   ```typescript
   images: {
     remotePatterns: [
       { hostname: 'media.michalina.dev' }
     ]
   }
   ```

2. Test R2 directly:
   ```
   https://media.michalina.dev/cv_5cdba5ac4c.pdf
   ```
   Should load (proves R2 is working)

---

## ✅ Success Criteria

**You're done when:**

- ✅ Site loads instantly with CMS content
- ✅ View Source shows actual content (not placeholders)
- ✅ Network tab shows ZERO requests to cms.michalina.dev
- ✅ Token is undefined in console (not exposed)
- ✅ All 5 projects visible with correct data
- ✅ ISR caching working (fast subsequent loads)
- ✅ Images load from media.michalina.dev (if any)
- ✅ Lighthouse score >90

---

## 🎉 Phase 7 Complete!

Once all checks pass, you've successfully completed the entire deployment pipeline:

**Phases Completed:**
- ✅ **Phase 0:** Domain configuration
- ✅ **Phase 1:** R2 media storage setup
- ✅ **Phase 2:** VPS provisioning and security
- ✅ **Phase 3:** Strapi + PostgreSQL + Caddy deployment
- ✅ **Phase 4:** R2 integration with Strapi
- ✅ **Phase 5:** API security lockdown
- ✅ **Phase 6:** Frontend server-side rendering
- ✅ **Phase 7:** Production deployment & verification

**Your Architecture:**

```
User → Vercel Edge (ISR Cache) → Next.js Server
                                      ↓
                                  (with token)
                                      ↓
                    ┌─────────────────┴─────────────────┐
                    ↓                                   ↓
            Strapi CMS (VPS)                    Cloudflare R2
         cms.michalina.dev                    media.michalina.dev
                    ↓
              PostgreSQL
```

**Security Posture:**
- 🔒 API token never reaches browser
- 🔒 CMS URL hidden from public
- 🔒 Read-only token (can't modify data)
- 🔒 Token scoped to minimal permissions

**Performance:**
- ⚡ ISR caching (5-minute revalidation)
- ⚡ Server-side rendering (instant initial load)
- ⚡ CDN media delivery (globally distributed)
- ⚡ Reduced CMS load (~12 requests/hour vs 3,600)

---

## 📝 Post-Deployment Tasks

### Immediate
- [ ] Share production URL with stakeholders
- [ ] Monitor Vercel analytics for traffic
- [ ] Set up custom domain (if not already)
- [ ] Test on mobile devices

### This Week
- [ ] Create backup schedule for VPS/database
- [ ] Set up error monitoring (optional: Sentry)
- [ ] Document content update workflow
- [ ] Train team on Strapi admin panel

### Ongoing
- [ ] Weekly: Review logs and analytics
- [ ] Monthly: Database backup, dependency updates
- [ ] Quarterly: Security audit, performance review

---

## 🎊 Congratulations!

You've built a production-ready, secure, performant portfolio with:
- Professional infrastructure (VPS, Docker, CDN)
- Modern stack (Next.js 16, React 19, Strapi 5)
- Best practices (SSR, ISR, token auth, type safety)
- Comprehensive documentation (7 phase guides)

**Your portfolio is now live and ready to impress!** 🚀

---

*Deployment Completed: January 26, 2026*
