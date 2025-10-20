"use client";

import * as React from "react";
import { Palette, Check } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { themes } from "@/lib/themes";
import { getCustomThemes, type CustomTheme } from "@/lib/custom-themes";

// Theme metadata with emojis and descriptions
const themeMetadata: Record<string, { emoji: string; label: string; description: string }> = {
  "default-light": {
    emoji: "☀️",
    label: "Light Default",
    description: "Classic light theme"
  },
  "default-dark": {
    emoji: "🌙",
    label: "Dark Default",
    description: "Classic dark theme"
  },
  "ocean-blue": {
    emoji: "🌊",
    label: "Ocean Blue",
    description: "Calming ocean waves"
  },
  "sunset": {
    emoji: "🌅",
    label: "Sunset",
    description: "Warm sunset colors"
  },
  "mint-green": {
    emoji: "🌿",
    label: "Mint Green",
    description: "Fresh mint vibes"
  },
  "royal-purple": {
    emoji: "👑",
    label: "Royal Purple",
    description: "Majestic purple tones"
  },
  "industrial": {
    emoji: "🏭",
    label: "Industrial",
    description: "Professional steel blue"
  },
  "vibrant-coral": {
    emoji: "🪸",
    label: "Vibrant Coral",
    description: "Energetic coral pink"
  },
  "forest-green": {
    emoji: "🌲",
    label: "Forest Green",
    description: "Natural forest tones"
  },
  "monochrome": {
    emoji: "⚫",
    label: "Monochrome",
    description: "Black and white elegance"
  },
  "espresso": {
    emoji: "☕",
    label: "Espresso",
    description: "Warm coffee tones"
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

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [customThemes, setCustomThemes] = React.useState<CustomTheme[]>([]);

  React.useEffect(() => {
    setMounted(true);
    loadCustomThemes();
  }, []);

  const loadCustomThemes = () => {
    const themes = getCustomThemes();
    setCustomThemes(themes);
  };

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <Palette className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          title="Cambiar tema"
        >
          <Palette className="h-5 w-5" />
          <span className="sr-only">Selector de temas</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Palette className="h-4 w-4" />
          Temas disponibles
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-[400px] overflow-y-auto">
          {/* Pre-defined Themes */}
          {themes.map((themeOption) => {
            const metadata = themeMetadata[themeOption.name];
            const isActive = theme === themeOption.name;

            // Get primary color for preview
            const primaryColor = hslToRgb(themeOption.colors["--primary"]);
            const bgColor = hslToRgb(themeOption.colors["--background"]);
            const cardColor = hslToRgb(themeOption.colors["--card"]);

            return (
              <DropdownMenuItem
                key={themeOption.name}
                onClick={() => setTheme(themeOption.name)}
                className="flex items-center gap-3 p-3 cursor-pointer"
              >
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-xl">{metadata?.emoji}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {metadata?.label || themeOption.name}
                      </span>
                      {isActive && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {metadata?.description}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <div
                    className="h-4 w-4 rounded-full border"
                    style={{ backgroundColor: primaryColor }}
                    title="Primary"
                  />
                  <div
                    className="h-4 w-4 rounded-full border"
                    style={{ backgroundColor: cardColor }}
                    title="Card"
                  />
                  <div
                    className="h-4 w-4 rounded-full border"
                    style={{ backgroundColor: bgColor }}
                    title="Background"
                  />
                </div>
              </DropdownMenuItem>
            );
          })}

          {/* Custom Themes */}
          {customThemes.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="flex items-center gap-2 text-xs text-muted-foreground">
                🎨 Temas Personalizados
              </DropdownMenuLabel>
              {customThemes.map((customTheme) => {
                const isActive = theme === customTheme.name;

                // Get primary color for preview
                const primaryColor = hslToRgb(customTheme.colors["--primary"]);
                const bgColor = hslToRgb(customTheme.colors["--background"]);
                const cardColor = hslToRgb(customTheme.colors["--card"]);

                return (
                  <DropdownMenuItem
                    key={customTheme.id}
                    onClick={() => setTheme(customTheme.name)}
                    className="flex items-center gap-3 p-3 cursor-pointer"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-xl">🎨</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {customTheme.name}
                          </span>
                          {isActive && (
                            <Check className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <Badge variant="outline" className="text-xs mt-0.5">
                          Personalizado
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <div
                        className="h-4 w-4 rounded-full border"
                        style={{ backgroundColor: primaryColor }}
                        title="Primary"
                      />
                      <div
                        className="h-4 w-4 rounded-full border"
                        style={{ backgroundColor: cardColor }}
                        title="Card"
                      />
                      <div
                        className="h-4 w-4 rounded-full border"
                        style={{ backgroundColor: bgColor }}
                        title="Background"
                      />
                    </div>
                  </DropdownMenuItem>
                );
              })}
            </>
          )}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => window.location.href = '/settings'}
          className="justify-center text-sm text-primary cursor-pointer"
        >
          Ver todos en Configuración
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
