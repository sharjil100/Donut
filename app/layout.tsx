import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Bebas_Neue, Caveat } from 'next/font/google';
import './globals.css';

const displayFont = Bebas_Neue({
  subsets: ['latin', 'latin-ext'],
  weight: '400',
  variable: '--font-display',
  display: 'swap',
});

const scriptFont = Caveat({
  subsets: ['latin', 'latin-ext'],
  weight: ['500', '700'],
  variable: '--font-script',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Crèmeau — Brewed for the Bold',
  description:
    'A cinematic donut portal experience — scroll into a dreamy pink world and emerge in a sun-soaked Crèmeau scene.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#b51e4f',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${displayFont.variable} ${scriptFont.variable}`}>
      <body>{children}</body>
    </html>
  );
}
