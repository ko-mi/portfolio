import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'Michalina Kowalczyk - Portfolio',
  description: 'Growth-focused web infrastructure for SaaS teams. Portfolio of Michalina Kowalczyk.',
};

const inter = Inter({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-family',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}