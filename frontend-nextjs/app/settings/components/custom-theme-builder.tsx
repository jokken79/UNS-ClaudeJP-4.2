"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ColorPicker } from "@/components/ui/color-picker";
import { Badge } from "@/components/ui/badge";
import {
  Palette,
  Save,
  RotateCcw,
  Eye,
  Sparkles,
  Check,
  AlertCircle
} from "lucide-react";
import { useTheme } from "next-themes";
import toast from "react-hot-toast";
import {
  saveCustomTheme,
  createThemeFromColors,
  getDefaultColorInputs,
  isThemeLimitReached,
  getMaxThemes,
  type ThemeColorInputs,
} from "@/lib/custom-themes";
import { hslToRgb } from "@/lib/color-utils";
import { cn } from "@/lib/utils";

interface CustomThemeBuilderProps {
  onThemeSaved?: () => void;
}

export function CustomThemeBuilder({ onThemeSaved }: CustomThemeBuilderProps) {
  const { setTheme } = useTheme();
  const [themeName, setThemeName] = React.useState("");
  const [colors, setColors] = React.useState<ThemeColorInputs>(getDefaultColorInputs());
  const [errors, setErrors] = React.useState<{ name?: string; colors?: string }>({});
  const [isPreview, setIsPreview] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  const handleColorChange = (key: keyof ThemeColorInputs, value: string) => {
    setColors(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, colors: undefined }));
  };

  const handleReset = () => {
    setThemeName("");
    setColors(getDefaultColorInputs());
    setErrors({});
    setIsPreview(false);
    toast.success("Formulario reiniciado");
  };

  const validateForm = (): boolean => {
    const newErrors: { name?: string; colors?: string } = {};

    // Validate theme name
    if (!themeName.trim()) {
      newErrors.name = "El nombre del tema es requerido";
    } else if (themeName.trim().length < 3) {
      newErrors.name = "El nombre debe tener al menos 3 caracteres";
    } else if (themeName.trim().length > 30) {
      newErrors.name = "El nombre debe tener máximo 30 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePreview = () => {
    if (!validateForm()) {
      toast.error("Por favor corrige los errores del formulario");
      return;
    }

    try {
      const theme = createThemeFromColors(themeName.trim(), colors);
      const root = document.documentElement;

      // Apply theme colors
      Object.entries(theme.colors).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });

      setIsPreview(true);
      toast.success("Vista previa aplicada. ¡Navega por la app para verlo!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al aplicar vista previa");
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error("Por favor corrige los errores del formulario");
      return;
    }

    if (isThemeLimitReached()) {
      toast.error(`Máximo ${getMaxThemes()} temas personalizados permitidos`);
      return;
    }

    setIsSaving(true);

    try {
      const theme = createThemeFromColors(themeName.trim(), colors);
      const savedTheme = saveCustomTheme(theme);

      // Apply the new theme
      setTheme(savedTheme.name);

      toast.success(`Tema "${savedTheme.name}" guardado exitosamente!`);

      // Reset form
      handleReset();

      // Notify parent
      onThemeSaved?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al guardar el tema");
    } finally {
      setIsSaving(false);
    }
  };

  // Generate preview colors
  const previewColors = React.useMemo(() => {
    try {
      const theme = createThemeFromColors(themeName || "Preview", colors);
      return {
        primary: hslToRgb(theme.colors["--primary"]),
        background: hslToRgb(theme.colors["--background"]),
        card: hslToRgb(theme.colors["--card"]),
        foreground: hslToRgb(theme.colors["--foreground"]),
        border: hslToRgb(theme.colors["--border"]),
        accent: hslToRgb(theme.colors["--accent"]),
      };
    } catch {
      return {
        primary: colors.primary,
        background: colors.background,
        card: colors.card,
        foreground: colors.foreground,
        border: colors.border,
        accent: colors.accent,
      };
    }
  }, [colors, themeName]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Form Section */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Información del Tema
            </CardTitle>
            <CardDescription>
              Dale un nombre único a tu tema personalizado
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme-name">Nombre del Tema *</Label>
              <Input
                id="theme-name"
                type="text"
                value={themeName}
                onChange={(e) => {
                  setThemeName(e.target.value);
                  setErrors(prev => ({ ...prev, name: undefined }));
                }}
                placeholder="Mi Tema Increíble"
                maxLength={30}
                className={cn(errors.name && "border-destructive")}
              />
              {errors.name && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.name}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                {themeName.length}/30 caracteres
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Colores Principales
            </CardTitle>
            <CardDescription>
              Define los colores base de tu tema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ColorPicker
              label="Color Primario"
              description="Botones, enlaces"
              value={colors.primary}
              onChange={(value) => handleColorChange("primary", value)}
            />
            <ColorPicker
              label="Color de Acento"
              description="Destacados"
              value={colors.accent}
              onChange={(value) => handleColorChange("accent", value)}
            />
            <ColorPicker
              label="Color Secundario"
              description="Elementos secundarios"
              value={colors.secondary}
              onChange={(value) => handleColorChange("secondary", value)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Colores de Fondo
            </CardTitle>
            <CardDescription>
              Define el fondo y las superficies
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ColorPicker
              label="Fondo Principal"
              description="Fondo de página"
              value={colors.background}
              onChange={(value) => handleColorChange("background", value)}
            />
            <ColorPicker
              label="Fondo de Tarjeta"
              description="Tarjetas y paneles"
              value={colors.card}
              onChange={(value) => handleColorChange("card", value)}
            />
            <ColorPicker
              label="Color Silenciado"
              description="Elementos secundarios"
              value={colors.muted}
              onChange={(value) => handleColorChange("muted", value)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Colores de Texto y Bordes
            </CardTitle>
            <CardDescription>
              Define el texto y los bordes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ColorPicker
              label="Color de Texto"
              description="Texto principal"
              value={colors.foreground}
              onChange={(value) => handleColorChange("foreground", value)}
            />
            <ColorPicker
              label="Color de Borde"
              description="Bordes y divisores"
              value={colors.border}
              onChange={(value) => handleColorChange("border", value)}
            />
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handlePreview}
            variant="outline"
            className="flex-1"
            disabled={isSaving}
          >
            <Eye className="h-4 w-4 mr-2" />
            Vista Previa
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1"
            disabled={isSaving}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Guardando..." : "Guardar Tema"}
          </Button>
          <Button
            onClick={handleReset}
            variant="ghost"
            disabled={isSaving}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reiniciar
          </Button>
        </div>

        {isPreview && (
          <Card className="border-primary/50 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Eye className="h-5 w-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Vista Previa Activa</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    El tema está aplicado temporalmente. Navega por la aplicación para verlo en acción.
                    Haz clic en "Guardar Tema" para guardarlo permanentemente.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Preview Section */}
      <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Vista Previa en Tiempo Real
            </CardTitle>
            <CardDescription>
              Así se verá tu tema personalizado
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Theme Name Preview */}
            {themeName && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                <span className="text-sm font-medium">{themeName}</span>
                <Badge variant="secondary">Personalizado</Badge>
              </div>
            )}

            {/* Color Swatches */}
            <div className="grid grid-cols-4 gap-2">
              <div className="space-y-1">
                <div
                  className="h-16 rounded-lg border-2 transition-all"
                  style={{ backgroundColor: colors.primary }}
                />
                <p className="text-xs text-center text-muted-foreground">Primario</p>
              </div>
              <div className="space-y-1">
                <div
                  className="h-16 rounded-lg border-2 transition-all"
                  style={{ backgroundColor: colors.accent }}
                />
                <p className="text-xs text-center text-muted-foreground">Acento</p>
              </div>
              <div className="space-y-1">
                <div
                  className="h-16 rounded-lg border-2 transition-all"
                  style={{ backgroundColor: colors.secondary }}
                />
                <p className="text-xs text-center text-muted-foreground">Secundario</p>
              </div>
              <div className="space-y-1">
                <div
                  className="h-16 rounded-lg border-2 transition-all"
                  style={{ backgroundColor: colors.border }}
                />
                <p className="text-xs text-center text-muted-foreground">Borde</p>
              </div>
            </div>

            {/* Preview Card */}
            <div
              className="rounded-lg p-6 space-y-4 border-2 transition-all"
              style={{
                backgroundColor: previewColors.background,
                color: previewColors.foreground,
                borderColor: previewColors.border,
              }}
            >
              <div
                className="rounded-md p-4 space-y-3"
                style={{ backgroundColor: previewColors.card }}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold" style={{ color: previewColors.foreground }}>
                    Título de Ejemplo
                  </h4>
                  <Badge
                    className="text-white"
                    style={{ backgroundColor: previewColors.primary }}
                  >
                    Nuevo
                  </Badge>
                </div>
                <p className="text-sm opacity-70" style={{ color: previewColors.foreground }}>
                  Este es un ejemplo de cómo se verá el texto en tu tema personalizado.
                </p>
                <div className="flex gap-2">
                  <button
                    className="px-4 py-2 rounded-md text-sm font-medium transition-all hover:opacity-90"
                    style={{
                      backgroundColor: previewColors.primary,
                      color: '#FFFFFF',
                    }}
                  >
                    Botón Primario
                  </button>
                  <button
                    className="px-4 py-2 rounded-md text-sm font-medium border-2 transition-all hover:opacity-90"
                    style={{
                      backgroundColor: 'transparent',
                      color: previewColors.foreground,
                      borderColor: previewColors.border,
                    }}
                  >
                    Botón Secundario
                  </button>
                </div>
              </div>

              <div className="flex gap-2">
                {[colors.primary, colors.accent, colors.secondary, colors.muted].map((color, i) => (
                  <div
                    key={i}
                    className="h-2 flex-1 rounded-full transition-all"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Info Card */}
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                  <div className="flex-1 space-y-2 text-xs text-muted-foreground">
                    <p>
                      <Check className="h-3 w-3 inline mr-1" />
                      Los colores de texto se ajustan automáticamente para mejor contraste
                    </p>
                    <p>
                      <Check className="h-3 w-3 inline mr-1" />
                      Puedes guardar hasta {getMaxThemes()} temas personalizados
                    </p>
                    <p>
                      <Check className="h-3 w-3 inline mr-1" />
                      Los temas se guardan en tu navegador (localStorage)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
