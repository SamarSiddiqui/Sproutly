import React from 'react';
import Providers from './providers';
import '../index.css';

export const metadata = {
  title: 'Sproutly — Your Smart Garden Assistant & Plant Care Tracker',
  description:
    'Sproutly helps you track water schedules, manage garden nutrition, view light reports, and diagnose plants with AI.',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🌱</text></svg>',
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
