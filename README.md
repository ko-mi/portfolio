# Portfolio Site

A modern, minimal portfolio site built with **Next.js**, React, and TypeScript.

## Features

- Dark theme with subtle glow and noise effects
- Responsive design (mobile-first)
- Accessible (ARIA labels, keyboard navigation, focus styles)
- Smooth scroll navigation
- Glass morphism card design
- Hamburger menu drawer
- CMS-ready structure (Problems section accepts props)

## Tech Stack

- React 18
- TypeScript
- Next.js (App Router)
- CSS Modules
- Inter font (via `next/font`)

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run production server locally (after build)
npm run start
```

## Deployment

This project is configured for Vercel deployment. Connect your repository to Vercel and it will auto-detect the **Next.js** configuration.

## Migration notes

See [`docs/nextjs-migration-workflow.md`](docs/nextjs-migration-workflow.md) for what changed in the Vite → Next.js migration and how it affects day-to-day workflow.

## Future CMS Integration

The Problems section is structured to accept props, making it easy to integrate with a headless CMS later. The `ProblemCard` interface in `src/types/index.ts` can be extended with CMS-specific fields.


