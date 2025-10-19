"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import { themes } from "@/lib/themes";

export function ThemeManager() {
  const { theme } = useTheme();

  useEffect(() => {
    if (!theme) return;

    const selectedTheme = themes.find((t) => t.name === theme);

    if (selectedTheme) {
      const root = document.documentElement;
      Object.entries(selectedTheme.colors).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });
    }
  }, [theme]);

  return null; // This component does not render anything
}