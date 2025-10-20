'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, Palette, Sparkles, Paintbrush, Grid3x3, Layers } from 'lucide-react';
import { themes } from '@/lib/themes';
import { cn } from '@/lib/utils';
import { CustomThemeBuilder } from './components/custom-theme-builder';
import { CustomThemesList } from './components/custom-themes-list';

// Theme metadata with emojis and descriptions
const themeMetadata: Record<string, { emoji: string; label: string; description: string; category: string }> = {
  "default-light": {
    emoji: "☀️",
    label: "Light Default",
    description: "Classic light theme with professional blue accents",
    category: "Default"
  },
  "default-dark": {
    emoji: "🌙",
    label: "Dark Default",
    description: "Classic dark theme for reduced eye strain",
    category: "Default"
  },
  "ocean-blue": {
    emoji: "🌊",
    label: "Ocean Blue",
    description: "Calming ocean waves for a peaceful work environment",
    category: "Nature"
  },
  "sunset": {
    emoji: "🌅",
    label: "Sunset",
    description: "Warm sunset colors to inspire creativity",
    category: "Nature"
  },
  "mint-green": {
    emoji: "🌿",
    label: "Mint Green",
    description: "Fresh mint vibes for a refreshing experience",
    category: "Nature"
  },
  "royal-purple": {
    emoji: "👑",
    label: "Royal Purple",
    description: "Majestic purple tones for a premium feel",
    category: "Premium"
  },
  "industrial": {
    emoji: "🏭",
    label: "Industrial",
    description: "Professional steel blue for serious work",
    category: "Professional"
  },
  "vibrant-coral": {
    emoji: "🪸",
    label: "Vibrant Coral",
    description: "Energetic coral pink to boost productivity",
    category: "Vibrant"
  },
  "forest-green": {
    emoji: "🌲",
    label: "Forest Green",
    description: "Natural forest tones for focus and concentration",
    category: "Nature"
  },
  "monochrome": {
    emoji: "⚫",
    label: "Monochrome",
    description: "Black and white elegance with timeless style",
    category: "Minimalist"
  },
  "espresso": {
    emoji: "☕",
    label: "Espresso",
    description: "Warm coffee tones for cozy productivity",
    category: "Warm"
  },
};

// Helper function to convert HSL string to RGB for preview
const hslToRgb = (hsl: string): string => {
  const [h, s, l] = hsl.split(' ').map(v => parseFloat(v.replace('%', '')));

  const c = (1 - Math.abs(2 * l / 100 - 1)) * s / 100;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l / 100 - c / 2;

  let r = 0, g = 0, b = 0;

  if (h >= 0 && h < 60) {
    r = c; g = x; b = 0;
  } else if (h >= 60 && h < 120) {
    r = x; g = c; b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; b = x;
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; b = c;
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; b = c;
  } else {
    r = c; g = 0; b = x;
  }

  const red = Math.round((r + m) * 255);
  const green = Math.round((g + m) * 255);
  const blue = Math.round((b + m) * 255);

  return `rgb(${red}, ${green}, ${blue})`;
};

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeChange = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Check if current theme is custom
  const isCustomTheme = theme?.startsWith('custom-');

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Palette className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight">Configuración</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Personaliza la apariencia de tu aplicación con hermosos temas
          </p>
        </div>

        {/* Current Theme */}
        <Card className="mb-8 border-primary/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Tema Actual
            </CardTitle>
            <CardDescription>
              El tema que estás utilizando ahora mismo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <span className="text-4xl">
                {isCustomTheme ? '🎨' : themeMetadata[theme || 'default-light']?.emoji}
              </span>
              <div className="flex-1">
                <h3 className="text-xl font-semibold">
                  {isCustomTheme ? theme : themeMetadata[theme || 'default-light']?.label}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {isCustomTheme
                    ? 'Tema personalizado creado por ti'
                    : themeMetadata[theme || 'default-light']?.description
                  }
                </p>
              </div>
              <Badge variant="secondary" className="px-4 py-2">
                {isCustomTheme ? 'Personalizado' : themeMetadata[theme || 'default-light']?.category}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for Theme Management */}
        <Tabs defaultValue="predefined" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-flex">
            <TabsTrigger value="predefined" className="flex items-center gap-2">
              <Grid3x3 className="h-4 w-4" />
              <span className="hidden sm:inline">Temas Predefinidos</span>
              <span className="sm:hidden">Predefinidos</span>
            </TabsTrigger>
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Paintbrush className="h-4 w-4" />
              <span className="hidden sm:inline">Crear Tema</span>
              <span className="sm:hidden">Crear</span>
            </TabsTrigger>
            <TabsTrigger value="custom" className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              <span className="hidden sm:inline">Mis Temas</span>
              <span className="sm:hidden">Mis Temas</span>
            </TabsTrigger>
          </TabsList>

          {/* Pre-defined Themes Tab */}
          <TabsContent value="predefined" className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Palette className="h-6 w-6" />
                Todos los Temas
              </h2>
              <p className="text-muted-foreground mb-6">
                Haz clic en "Aplicar" para cambiar el tema de la aplicación
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {themes.map((themeOption) => {
                const metadata = themeMetadata[themeOption.name];
                const isActive = theme === themeOption.name;

                // Get colors for preview
                const primaryColor = hslToRgb(themeOption.colors["--primary"]);
                const bgColor = hslToRgb(themeOption.colors["--background"]);
                const cardColor = hslToRgb(themeOption.colors["--card"]);
                const foregroundColor = hslToRgb(themeOption.colors["--foreground"]);
                const accentColor = hslToRgb(themeOption.colors["--accent"]);

                return (
                  <Card
                    key={themeOption.name}
                    className={cn(
                      "relative overflow-hidden transition-all hover:shadow-lg",
                      isActive && "ring-2 ring-primary shadow-lg"
                    )}
                  >
                    {isActive && (
                      <Badge
                        variant="default"
                        className="absolute top-4 right-4 z-10 flex items-center gap-1"
                      >
                        <Check className="h-3 w-3" />
                        Activo
                      </Badge>
                    )}

                    <CardHeader>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-3xl">{metadata?.emoji}</span>
                        <div className="flex-1">
                          <CardTitle className="text-lg">
                            {metadata?.label || themeOption.name}
                          </CardTitle>
                          <Badge variant="outline" className="mt-1">
                            {metadata?.category}
                          </Badge>
                        </div>
                      </div>
                      <CardDescription>
                        {metadata?.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Color Preview */}
                      <div className="space-y-3">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          Vista Previa de Colores
                        </p>

                        {/* Main Preview Card */}
                        <div
                          className="rounded-lg p-4 space-y-3 border"
                          style={{
                            backgroundColor: bgColor,
                            color: foregroundColor,
                            borderColor: hslToRgb(themeOption.colors["--border"])
                          }}
                        >
                          <div
                            className="rounded-md p-3"
                            style={{ backgroundColor: cardColor }}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <div
                                className="h-3 w-3 rounded-full"
                                style={{ backgroundColor: primaryColor }}
                              />
                              <div className="h-2 flex-1 rounded" style={{ backgroundColor: accentColor }} />
                            </div>
                            <div className="space-y-1">
                              <div className="h-2 w-3/4 rounded" style={{ backgroundColor: accentColor, opacity: 0.6 }} />
                              <div className="h-2 w-1/2 rounded" style={{ backgroundColor: accentColor, opacity: 0.4 }} />
                            </div>
                          </div>
                        </div>

                        {/* Color Swatches */}
                        <div className="flex gap-2">
                          <div className="flex-1 space-y-1">
                            <div
                              className="h-8 rounded border"
                              style={{ backgroundColor: primaryColor }}
                            />
                            <p className="text-xs text-center text-muted-foreground">Primary</p>
                          </div>
                          <div className="flex-1 space-y-1">
                            <div
                              className="h-8 rounded border"
                              style={{ backgroundColor: cardColor }}
                            />
                            <p className="text-xs text-center text-muted-foreground">Card</p>
                          </div>
                          <div className="flex-1 space-y-1">
                            <div
                              className="h-8 rounded border"
                              style={{ backgroundColor: bgColor }}
                            />
                            <p className="text-xs text-center text-muted-foreground">Background</p>
                          </div>
                        </div>
                      </div>

                      {/* Apply Button */}
                      <Button
                        className="w-full"
                        variant={isActive ? "outline" : "default"}
                        onClick={() => setTheme(themeOption.name)}
                        disabled={isActive}
                      >
                        {isActive ? (
                          <>
                            <Check className="h-4 w-4 mr-2" />
                            Tema Actual
                          </>
                        ) : (
                          <>
                            <Palette className="h-4 w-4 mr-2" />
                            Aplicar Tema
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Create Custom Theme Tab */}
          <TabsContent value="create" className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Paintbrush className="h-6 w-6" />
                Crear Tema Personalizado
              </h2>
              <p className="text-muted-foreground mb-6">
                Diseña tu propio tema eligiendo colores personalizados
              </p>
            </div>

            <CustomThemeBuilder onThemeSaved={handleThemeChange} />
          </TabsContent>

          {/* My Custom Themes Tab */}
          <TabsContent value="custom" className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Layers className="h-6 w-6" />
                Mis Temas Personalizados
              </h2>
              <p className="text-muted-foreground mb-6">
                Gestiona tus temas creados
              </p>
            </div>

            <CustomThemesList key={refreshKey} onThemeDeleted={handleThemeChange} />
          </TabsContent>
        </Tabs>

        {/* Footer Info */}
        <div className="mt-12 text-center text-muted-foreground">
          <p className="text-sm">
            Los temas se guardan automáticamente en tu navegador y se aplicarán en todas las páginas.
          </p>
        </div>
      </div>
    </div>
  );
}
