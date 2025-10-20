import { Theme } from './themes';
import { generateThemeId, hexToHsl, getContrastColor } from './color-utils';

export interface CustomTheme extends Theme {
  id: string;
  isCustom: true;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'uns-custom-themes';
const MAX_CUSTOM_THEMES = 10;

/**
 * Get all custom themes from localStorage
 */
export function getCustomThemes(): CustomTheme[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const themes = JSON.parse(stored);
    return Array.isArray(themes) ? themes : [];
  } catch (error) {
    console.error('Error loading custom themes:', error);
    return [];
  }
}

/**
 * Save a new custom theme
 */
export function saveCustomTheme(theme: Omit<CustomTheme, 'id' | 'isCustom' | 'createdAt' | 'updatedAt'>): CustomTheme {
  const themes = getCustomThemes();

  // Check if max limit reached
  if (themes.length >= MAX_CUSTOM_THEMES) {
    throw new Error(`Maximum ${MAX_CUSTOM_THEMES} custom themes allowed`);
  }

  // Check if name already exists
  if (themes.some(t => t.name === theme.name)) {
    throw new Error('A theme with this name already exists');
  }

  const now = new Date().toISOString();
  const newTheme: CustomTheme = {
    ...theme,
    id: generateThemeId(),
    isCustom: true,
    createdAt: now,
    updatedAt: now,
  };

  themes.push(newTheme);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(themes));

  return newTheme;
}

/**
 * Update an existing custom theme
 */
export function updateCustomTheme(id: string, updates: Partial<Omit<CustomTheme, 'id' | 'isCustom' | 'createdAt'>>): CustomTheme {
  const themes = getCustomThemes();
  const index = themes.findIndex(t => t.id === id);

  if (index === -1) {
    throw new Error('Theme not found');
  }

  // Check if name already exists (excluding current theme)
  if (updates.name && themes.some(t => t.id !== id && t.name === updates.name)) {
    throw new Error('A theme with this name already exists');
  }

  const updatedTheme: CustomTheme = {
    ...themes[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  themes[index] = updatedTheme;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(themes));

  return updatedTheme;
}

/**
 * Delete a custom theme
 */
export function deleteCustomTheme(id: string): void {
  const themes = getCustomThemes();
  const filtered = themes.filter(t => t.id !== id);

  if (filtered.length === themes.length) {
    throw new Error('Theme not found');
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

/**
 * Apply a custom theme to the document
 */
export function applyCustomTheme(theme: CustomTheme): void {
  const root = document.documentElement;

  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
}

/**
 * Create a theme object from color inputs
 */
export interface ThemeColorInputs {
  primary: string; // hex
  background: string; // hex
  foreground: string; // hex
  card: string; // hex
  secondary: string; // hex
  accent: string; // hex
  border: string; // hex
  muted: string; // hex
  destructive?: string; // hex (optional, will use default)
}

export function createThemeFromColors(name: string, colors: ThemeColorInputs): Omit<CustomTheme, 'id' | 'isCustom' | 'createdAt' | 'updatedAt'> {
  // Get contrasting foreground colors
  const primaryFg = getContrastColor(colors.primary);
  const secondaryFg = getContrastColor(colors.secondary);
  const accentFg = getContrastColor(colors.accent);
  const destructiveFg = '#FFFFFF';

  // Convert hex to HSL
  const themeColors = {
    "--background": hexToHsl(colors.background),
    "--foreground": hexToHsl(colors.foreground),
    "--card": hexToHsl(colors.card),
    "--card-foreground": hexToHsl(colors.foreground),
    "--popover": hexToHsl(colors.card),
    "--popover-foreground": hexToHsl(colors.foreground),
    "--primary": hexToHsl(colors.primary),
    "--primary-foreground": hexToHsl(primaryFg),
    "--secondary": hexToHsl(colors.secondary),
    "--secondary-foreground": hexToHsl(secondaryFg),
    "--muted": hexToHsl(colors.muted),
    "--muted-foreground": hexToHsl(colors.foreground).replace(/\d+%\s+\d+%$/, '50% 50%'), // Make muted-fg lighter
    "--accent": hexToHsl(colors.accent),
    "--accent-foreground": hexToHsl(accentFg),
    "--destructive": colors.destructive ? hexToHsl(colors.destructive) : "0 84.2% 60.2%",
    "--destructive-foreground": hexToHsl(destructiveFg),
    "--border": hexToHsl(colors.border),
    "--input": hexToHsl(colors.border),
    "--ring": hexToHsl(colors.primary),
  };

  return {
    name,
    colors: themeColors,
  };
}

/**
 * Get default color values for the theme builder
 */
export function getDefaultColorInputs(): ThemeColorInputs {
  return {
    primary: '#3B82F6',      // Blue
    background: '#FFFFFF',   // White
    foreground: '#0F172A',   // Dark gray
    card: '#F8FAFC',         // Light gray
    secondary: '#F1F5F9',    // Light blue gray
    accent: '#3B82F6',       // Blue (same as primary)
    border: '#E2E8F0',       // Light border
    muted: '#F1F5F9',        // Light muted
  };
}

/**
 * Check if theme limit is reached
 */
export function isThemeLimitReached(): boolean {
  return getCustomThemes().length >= MAX_CUSTOM_THEMES;
}

/**
 * Get maximum theme limit
 */
export function getMaxThemes(): number {
  return MAX_CUSTOM_THEMES;
}
