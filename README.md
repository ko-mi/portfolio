# Portfolio Site

A modern, minimal portfolio site built with React, TypeScript, and Vite.

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
- Vite
- CSS Modules
- Space Grotesk font

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

This project is configured for Vercel deployment. Simply connect your repository to Vercel and it will auto-detect the Vite configuration.

## Future CMS Integration

The Problems section is structured to accept props, making it easy to integrate with a headless CMS later. The `ProblemCard` interface in `src/types/index.ts` can be extended with CMS-specific fields.


