import {
  LayoutDashboard,
  Users,
  Building2,
  Clock,
  DollarSign,
  FileText,
  Settings,
  HelpCircle,
  UserPlus,
  FileSpreadsheet,
} from 'lucide-react';

export const dashboardConfig = {
  mainNav: [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      description: 'Vista general del sistema',
    },
    {
      title: '候補者 Candidatos',
      href: '/candidates',
      icon: UserPlus,
      description: 'Gestión de candidatos (履歴書)',
    },
    {
      title: '派遣社員 Empleados',
      href: '/employees',
      icon: Users,
      description: 'Gestión de empleados',
    },
    {
      title: '派遣先 Fábricas',
      href: '/factories',
      icon: Building2,
      description: 'Empresas cliente',
    },
    {
      title: 'タイムカード Asistencia',
      href: '/timercards',
      icon: Clock,
      description: 'Control de horas',
    },
    {
      title: '給与 Nómina',
      href: '/salary',
      icon: DollarSign,
      description: 'Cálculo de nómina',
    },
    {
      title: '申請 Solicitudes',
      href: '/requests',
      icon: FileText,
      description: 'Solicitudes de empleados',
    },
  ],
  secondaryNav: [
    {
      title: 'Reportes',
      href: '/reports',
      icon: FileSpreadsheet,
      description: 'Reportes y estadísticas',
    },
    {
      title: 'Configuración',
      href: '/settings',
      icon: Settings,
      description: 'Configuración del sistema',
    },
    {
      title: 'Ayuda',
      href: '/help',
      icon: HelpCircle,
      description: 'Centro de ayuda',
    },
  ],
};

export type NavItem = {
  title: string;
  href: string;
  icon: any;
  description?: string;
};
