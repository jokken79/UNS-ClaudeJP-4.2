"use client";

import NavItem from "./NavItem";
import {
  LayoutDashboard,
  Users,
  Clock,
  FileText,
  Settings,
  HelpCircle,
  Briefcase,
  Building2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { useVisibilidadTemplateStore } from "@/stores/visibilidad-template-store";

interface NavGroup {
  title: string;
  items: Array<{
    href: string;
    label: string;
    icon: LucideIcon;
  }>;
}

const navGroups: NavGroup[] = [
  {
    title: "PRINCIPAL",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/candidates", label: "Candidatos", icon: Users },
      { href: "/employees", label: "Empleados", icon: Briefcase },
      { href: "/factories", label: "Fábricas", icon: Building2 },
    ],
  },
  {
    title: "TIEMPO Y NÓMINA",
    items: [
      { href: "/timercards", label: "Asistencia", icon: Clock },
      { href: "/salary", label: "Nómina", icon: FileText },
      { href: "/requests", label: "Solicitudes", icon: FileText },
    ],
  },
  {
    title: "OTROS",
    items: [
      { href: "/database-management", label: "Base de Datos", icon: FileText },
      { href: "/reports", label: "Reportes", icon: FileText },
      { href: "/settings", label: "Configuración", icon: Settings },
      { href: "/help", label: "Ayuda", icon: HelpCircle },
    ],
  },
];

export const Sidebar = () => {
  const { activeTemplate, getDefaultTemplate } = useVisibilidadTemplateStore();
  const template = activeTemplate ?? getDefaultTemplate();
  const navSpacing = template.nav.spacing || "space-y-1";
  const iconSize = template.nav.iconSize || "w-5 h-5";

  return (
    <div
      className={cn(
        template.sidebar.width,
        "flex flex-col h-screen border-r sticky top-0",
        template.sidebar.backgroundColor,
        template.sidebar.textColor,
      )}
      style={{ borderColor: template.colors.border }}
    >
      {/* Logo/Título de la App */}
      <div className="p-4 border-b" style={{ borderColor: template.colors.border }}>
        <p className="text-xl font-bold" style={{ color: template.colors.text }}>
          Visibilidad RRHH
        </p>
      </div>

      {/* Contenedor del Menú */}
      <nav className="flex-grow p-2 overflow-y-auto space-y-4">
        {navGroups.map((group) => (
          <div key={group.title} className="flex flex-col gap-2">
            {/* Título de la Sección (PRINCIPAL, OTROS, etc.) */}
            <h3
              className="px-3 mt-4 text-xs font-semibold uppercase tracking-wider"
              style={{ color: template.colors.secondary }}
            >
              {group.title}
            </h3>

            {/* Lista de Enlaces */}
            <div className={cn("flex flex-col", navSpacing)}>
              {group.items.map((item) => (
                <NavItem
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  label={item.label}
                  template={template}
                  iconSize={iconSize}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Pie de página del Sidebar (Sistema de RRHH) */}
      <div
        className="p-4 text-xs text-center border-t"
        style={{ borderColor: template.colors.border, color: template.colors.secondary }}
      >
        Sistema de RRHH para agencias japonesas
      </div>
    </div>
  );
};

export default Sidebar;
