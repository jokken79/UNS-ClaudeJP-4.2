"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Palette,
  Trash2,
  Check,
  Calendar,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { useTheme } from "next-themes";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import toast from "react-hot-toast";
import {
  getCustomThemes,
  deleteCustomTheme,
  type CustomTheme,
} from "@/lib/custom-themes";
import { hslToRgb } from "@/lib/color-utils";
import { cn } from "@/lib/utils";

interface CustomThemesListProps {
  onThemeDeleted?: () => void;
}

export function CustomThemesList({ onThemeDeleted }: CustomThemesListProps) {
  const { theme, setTheme } = useTheme();
  const [customThemes, setCustomThemes] = React.useState<CustomTheme[]>([]);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  // Load custom themes
  React.useEffect(() => {
    loadThemes();
  }, []);

  const loadThemes = () => {
    const themes = getCustomThemes();
    setCustomThemes(themes);
  };

  const handleApplyTheme = (themeName: string) => {
    setTheme(themeName);
    toast.success(`Tema "${themeName}" aplicado`);
  };

  const handleDeleteTheme = async (themeToDelete: CustomTheme) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar el tema "${themeToDelete.name}"?`)) {
      return;
    }

    setDeletingId(themeToDelete.id);

    try {
      deleteCustomTheme(themeToDelete.id);

      // If the deleted theme is currently active, switch to default
      if (theme === themeToDelete.name) {
        setTheme("default-light");
        toast.success(`Tema "${themeToDelete.name}" eliminado. Cambiado a tema por defecto.`);
      } else {
        toast.success(`Tema "${themeToDelete.name}" eliminado`);
      }

      // Reload themes
      loadThemes();

      // Notify parent
      onThemeDeleted?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al eliminar el tema");
    } finally {
      setDeletingId(null);
    }
  };

  if (customThemes.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
              <Palette className="h-10 w-10 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">No hay temas personalizados</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Crea tu primer tema personalizado usando el Constructor de Temas.
                Podrás guardar hasta 10 temas únicos.
              </p>
            </div>
            <Button variant="outline" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <Sparkles className="h-4 w-4 mr-2" />
              Crear Mi Primer Tema
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Mis Temas Personalizados
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {customThemes.length} de 10 temas guardados
          </p>
        </div>
        <Badge variant="secondary" className="text-xs">
          {10 - customThemes.length} disponibles
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {customThemes.map((customTheme) => {
          const isActive = theme === customTheme.name;

          // Get colors for preview
          const primaryColor = hslToRgb(customTheme.colors["--primary"]);
          const bgColor = hslToRgb(customTheme.colors["--background"]);
          const cardColor = hslToRgb(customTheme.colors["--card"]);
          const foregroundColor = hslToRgb(customTheme.colors["--foreground"]);
          const accentColor = hslToRgb(customTheme.colors["--accent"]);
          const borderColor = hslToRgb(customTheme.colors["--border"]);

          const createdDate = new Date(customTheme.createdAt);
          const relativeTime = formatDistanceToNow(createdDate, {
            addSuffix: true,
            locale: es,
          });

          return (
            <Card
              key={customTheme.id}
              className={cn(
                "relative overflow-hidden transition-all hover:shadow-lg",
                isActive && "ring-2 ring-primary shadow-lg"
              )}
            >
              {isActive && (
                <Badge
                  variant="default"
                  className="absolute top-3 right-3 z-10 flex items-center gap-1"
                >
                  <Check className="h-3 w-3" />
                  Activo
                </Badge>
              )}

              <CardHeader>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1">
                    <CardTitle className="text-base flex items-center gap-2">
                      <span className="text-xl">🎨</span>
                      {customTheme.name}
                    </CardTitle>
                    <div className="flex items-center gap-1 mt-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{relativeTime}</span>
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className="w-fit">
                  Personalizado
                </Badge>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Color Preview */}
                <div className="space-y-3">
                  {/* Main Preview Card */}
                  <div
                    className="rounded-lg p-3 space-y-2 border"
                    style={{
                      backgroundColor: bgColor,
                      color: foregroundColor,
                      borderColor: borderColor,
                    }}
                  >
                    <div
                      className="rounded-md p-2"
                      style={{ backgroundColor: cardColor }}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <div
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: primaryColor }}
                        />
                        <div className="h-1.5 flex-1 rounded" style={{ backgroundColor: accentColor }} />
                      </div>
                      <div className="space-y-1">
                        <div className="h-1.5 w-3/4 rounded" style={{ backgroundColor: accentColor, opacity: 0.6 }} />
                        <div className="h-1.5 w-1/2 rounded" style={{ backgroundColor: accentColor, opacity: 0.4 }} />
                      </div>
                    </div>
                  </div>

                  {/* Color Swatches */}
                  <div className="grid grid-cols-5 gap-1.5">
                    {[
                      { color: primaryColor, label: "Primary" },
                      { color: accentColor, label: "Accent" },
                      { color: cardColor, label: "Card" },
                      { color: bgColor, label: "BG" },
                      { color: borderColor, label: "Border" },
                    ].map((item, i) => (
                      <div key={i} className="space-y-1">
                        <div
                          className="h-6 rounded border"
                          style={{ backgroundColor: item.color }}
                          title={item.label}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    variant={isActive ? "outline" : "default"}
                    onClick={() => handleApplyTheme(customTheme.name)}
                    disabled={isActive || deletingId === customTheme.id}
                  >
                    {isActive ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Aplicado
                      </>
                    ) : (
                      <>
                        <Palette className="h-4 w-4 mr-2" />
                        Aplicar
                      </>
                    )}
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDeleteTheme(customTheme)}
                    disabled={deletingId === customTheme.id}
                    title="Eliminar tema"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Info Card */}
      {customThemes.length >= 8 && (
        <Card className="border-amber-500/20 bg-amber-500/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">Límite casi alcanzado</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Has creado {customThemes.length} de 10 temas personalizados.
                  Elimina algunos temas antiguos si necesitas crear más.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
