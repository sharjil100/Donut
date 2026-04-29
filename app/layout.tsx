import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Donut Portal — Brewed for the Bold',
  description:
    'A cinematic donut portal experience — scroll into a dreamy pink world and emerge in a sun-soaked Dunkin-inspired scene.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#b51e4f',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
