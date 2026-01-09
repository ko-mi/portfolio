/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ['class'],
    content: ['./src/app/**/*.{js,ts,jsx,tsx,mdx}', './src/**/*.{js,ts,jsx,tsx,mdx}'],
    theme: {
      extend: {
        colors: {
          background: 'var(--bg)',
          foreground: 'var(--text)',
          muted: {
            DEFAULT: 'var(--muted)',
            foreground: 'var(--text)',
          },
          card: {
            DEFAULT: 'var(--card)',
            hover: 'var(--card-hover)',
          },
          border: 'rgba(196, 212, 209, 0.1)',
          input: 'rgba(196, 212, 209, 0.1)',
          ring: 'var(--text)',
        },
        borderRadius: {
          lg: 'var(--border-radius)',
          md: 'calc(var(--border-radius) * 0.8)',
          sm: 'calc(var(--border-radius) * 0.6)',
        },
        fontFamily: {
          sans: ['var(--font-family)', 'sans-serif'],
        },
        spacing: {
          xs: 'var(--spacing-xs)',
          sm: 'var(--spacing-sm)',
          md: 'var(--spacing-md)',
          lg: 'var(--spacing-lg)',
          xl: 'var(--spacing-xl)',
          '2xl': 'var(--spacing-2xl)',
        },
        maxWidth: {
          container: 'var(--max-width)',
        },
        transitionDuration: {
          DEFAULT: 'var(--transition)',
        },
        backdropBlur: {
          DEFAULT: 'var(--backdrop-blur)',
        },
      },
    },
    plugins: [],
  };