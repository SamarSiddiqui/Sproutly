'use client';

import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';

function PageTitleUpdater() {
  const pathname = usePathname();
  
  useEffect(() => {
    const titles: Record<string, string> = {
      '/dashboard': 'Command Center | Sproutly',
      '/collection': 'My Collection | Sproutly',
      '/care': 'Care Cycle | Sproutly',
      '/knowledge': 'Knowledge Hub | Sproutly',
      '/ai': 'Sproutly AI Companion | Sproutly',
      '/settings': 'Settings | Sproutly'
    };
    
    document.title = titles[pathname] || 'Sproutly — Smart Garden Assistant';
  }, [pathname]);

  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <PageTitleUpdater />
      {children}
    </QueryClientProvider>
  );
}
