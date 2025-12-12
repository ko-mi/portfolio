# Portfolio Site - Build Plan

## Tech Stack
- **React 18** + **TypeScript**
- **Vite** (fast build tool, excellent Vercel support)
- **CSS Modules** or **Styled Components** (or plain CSS with variables - let's use CSS variables + global styles for maintainability)
- **React Router** (not needed for single page, but useful for future CMS integration)

## Project Structure
```
portfolio/
├── public/
│   └── (static assets if needed)
├── src/
│   ├── components/
│   │   ├── Header/
│   │   │   ├── Header.tsx
│   │   │   ├── HamburgerMenu.tsx
│   │   │   └── Header.module.css
│   │   ├── Hero/
│   │   │   ├── Hero.tsx
│   │   │   └── Hero.module.css
│   │   ├── ValueSection/
│   │   │   ├── ValueSection.tsx
│   │   │   └── ValueSection.module.css
│   │   ├── ProblemsSection/
│   │   │   ├── ProblemsSection.tsx
│   │   │   ├── ProblemCard.tsx
│   │   │   └── ProblemsSection.module.css
│   │   └── Footer/
│   │       ├── Footer.tsx
│   │       └── Footer.module.css
│   ├── styles/
│   │   ├── globals.css (CSS variables, reset, base styles)
│   │   └── utilities.css (utility classes if needed)
│   ├── types/
│   │   └── index.ts (TypeScript types)
│   ├── utils/
│   │   └── smoothScroll.ts (smooth scroll utility)
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Design System (CSS Variables)
Based on the HTML reference, we'll use:
```css
:root {
  /* Colors */
  --bg: #001f1e;
  --text: #c4d4d1;
  --muted: #8fa5a1;
  
  /* Cards */
  --card: rgba(10, 42, 41, 0.55);
  --card-hover: rgba(20, 58, 57, 0.62);
  
  /* Spacing */
  --spacing-xs: 8px;
  --spacing-sm: 12px;
  --spacing-md: 18px;
  --spacing-lg: 28px;
  --spacing-xl: 40px;
  
  /* Typography */
  --font-family: "Space Grotesk", sans-serif;
  --font-weight-light: 200;
  --font-weight-normal: 300;
  --font-weight-medium: 400;
  
  /* Layout */
  --max-width: 980px;
  --border-radius: 18px;
  
  /* Effects */
  --backdrop-blur: blur(12px);
  --transition: 0.15s ease;
}
```

## Component Breakdown

### 1. Header Component
- Sticky header with backdrop blur
- Left: "Michalina Kowalczyk"
- Right: Hamburger icon
- Hamburger opens drawer/menu panel (not full screen)
- Menu items:
  - Work → #problems
  - About → #value
  - Writing → #writing (placeholder)
  - Contact → #contact
  - Resume → external link (new tab)
  - GitHub → external link (optional)
  - LinkedIn → external link (optional)
- Close on outside click or link click
- Accessible: ARIA labels, keyboard navigation

### 2. Hero Section
- Large heading (one of the provided options)
- Subline
- Optional CTA button ("View selected work")
- Smooth scroll to #problems on CTA click

### 3. Value Section ("Value I can add")
- Section heading
- Intro line (swappable)
- Bullet list (4 items)
- Optional closing line
- ID: #value

### 4. Problems Section ("Problems I've solved")
- Section heading
- Responsive grid (3 cols desktop, 1 col mobile)
- 5-6 cards with glass morphism style
- Each card: title + 1-2 lines
- Hover effects: lift + stronger surface
- ID: #problems

### 5. Footer/Contact Section
- Contact line
- Email, LinkedIn, Resume links
- Location line
- ID: #contact

## Background Effects
- Glow layers (radial gradients) - fixed position
- Noise texture overlay - fixed position
- Systems pattern (optional, from reference)
- All as pseudo-elements or separate divs with fixed positioning

## Accessibility Features
- Semantic HTML (header, nav, main, section, footer)
- ARIA labels for hamburger menu
- Focus styles for all interactive elements
- Keyboard navigation support
- `prefers-reduced-motion` media query for animations
- Proper heading hierarchy
- Alt text for any images (future)

## Performance Optimizations
- Code splitting (if needed)
- Lazy loading for images (future)
- Optimized fonts (preload Space Grotesk)
- CSS-only animations (no JS animations for performance)
- Minimal dependencies

## Responsive Breakpoints
- Mobile: < 768px (single column, adjusted spacing)
- Tablet: 768px - 1024px
- Desktop: > 1024px

## Implementation Steps
1. ✅ Set up Vite + React + TypeScript project
2. ✅ Configure TypeScript and ESLint
3. ✅ Set up global styles with CSS variables
4. ✅ Create background effects (glow + noise)
5. ✅ Build Header component with hamburger menu
6. ✅ Build Hero section
7. ✅ Build Value section
8. ✅ Build Problems section with cards
9. ✅ Build Footer/Contact section
10. ✅ Add smooth scroll functionality
11. ✅ Add accessibility features
12. ✅ Test responsive design
13. ✅ Optimize for production

## Future Considerations (CMS Integration)
- **Problems Section**: Structure to accept props for content (array of problem items)
- Create TypeScript interfaces for CMS data (ProblemCard interface ready for CMS)
- Keep content easily swappable
- Consider using a headless CMS like Contentful, Sanity, or Strapi
- Note: Problems section will be built with props structure from the start, but will use hardcoded data initially

## Deployment (Vercel)
- Vite builds to `dist/` folder
- Vercel will auto-detect Vite and configure correctly
- Add `vercel.json` if needed for routing (not needed for static site)

