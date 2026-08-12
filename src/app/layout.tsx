import React from 'react';
import Providers from './providers';
import { LenisProvider } from '../components/LenisProvider';
import '../index.css';

export const metadata = {
  title: 'Sproutly — Your Smart Garden Assistant & Plant Care Tracker',
  description:
    'Sproutly helps you track water schedules, manage garden nutrition, view light reports, and diagnose plants with AI.',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-sproutly-bg text-sproutly-primary">
        <LenisProvider>
          <Providers>{children}</Providers>
        </LenisProvider>
      </body>
    </html>
  );
}
