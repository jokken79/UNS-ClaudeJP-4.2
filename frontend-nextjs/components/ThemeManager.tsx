"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import { themes } from "@/lib/themes";
import { getCustomThemes } from "@/lib/custom-themes";

const themeAliases: Record<string, string> = {
  dark: "default-dark",
  light: "default-light",
};

export function ThemeManager() {
  const { theme } = useTheme();

  useEffect(() => {
    if (!theme) return;

    const normalizedTheme = themeAliases[theme] ?? theme;
    const root = document.documentElement;

    // First check pre-defined themes
    let selectedTheme = themes.find((t) => t.name === normalizedTheme);

    // If not found, check custom themes
    if (!selectedTheme) {
      const customThemes = getCustomThemes();
      selectedTheme = customThemes.find((t) => t.name === normalizedTheme);
    }

    if (selectedTheme) {
      Object.entries(selectedTheme.colors).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });
    } else if (themes.length > 0) {
      // Fallback to default if theme not found
      Object.keys(themes[0].colors).forEach((key) => {
        root.style.removeProperty(key);
      });
    }

    root.classList.toggle("dark", normalizedTheme === "default-dark");
  }, [theme]);

  return null; // This component does not render anything
}