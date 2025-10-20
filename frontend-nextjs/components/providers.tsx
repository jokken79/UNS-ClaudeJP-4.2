"use client";

import { ThemeProvider } from 'next-themes';
import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { themes } from '@/lib/themes';
import { getCustomThemes } from '@/lib/custom-themes';
import { ThemeManager } from '@/components/ThemeManager';

// Mapa de migración de nombres de temas antiguos a nuevos
const themesMigration: Record<string, string> = {
  'Default Light': 'default-light',
  'Default Dark': 'default-dark',
  'Ocean Blue': 'ocean-blue',
  'Mint Green': 'mint-green',
  'Royal Purple': 'royal-purple',
  'Vibrant Coral': 'vibrant-coral',
  'Forest Green': 'forest-green',
  'Monochrome': 'monochrome',
  'Espresso': 'espresso',
  'Industrial': 'industrial',
  'Sunset': 'sunset',
};

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minuto
            gcTime: 5 * 60 * 1000, // 5 minutos (antes cacheTime)
            refetchOnWindowFocus: true,
            refetchOnReconnect: true,
            retry: 1,
          },
          mutations: {
            retry: 1,
          },
        },
      })
  );

  const [allThemes, setAllThemes] = useState<string[]>([]);

  // Load all themes (pre-defined + custom)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Migrate old theme names
      const oldTheme = localStorage.getItem('theme');
      if (oldTheme && themesMigration[oldTheme]) {
        localStorage.setItem('theme', themesMigration[oldTheme]);
      }

      // Get all theme names
      const customThemes = getCustomThemes();
      const allThemeNames = [
        ...themes.map(t => t.name),
        ...customThemes.map(t => t.name)
      ];
      setAllThemes(allThemeNames);
    }
  }, []);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="default-light"
      themes={allThemes.length > 0 ? allThemes : themes.map(t => t.name)}
      disableTransitionOnChange
    >
      <ThemeManager />
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#333',
              color: '#fff',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}