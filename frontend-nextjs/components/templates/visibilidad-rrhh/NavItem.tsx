'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { VisibilidadTemplate } from '@/stores/visibilidad-template-store';

interface NavItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
  template: VisibilidadTemplate;
  iconSize: string;
}

export const NavItem = ({ href, icon: Icon, label, template, iconSize }: NavItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + '/');

  const baseClasses = cn(
    'flex items-center gap-3 p-3 font-medium transition-all duration-150 ease-in-out border-l-4 rounded-md',
    template.nav.fontSize || 'text-sm',
    template.sidebar.textColor,
    template.nav.hoverEffect ? 'hover:translate-x-1' : '',
  );

  const activeClass = cn(
    template.sidebar.activeItemBg,
    template.sidebar.activeItemText,
    template.sidebar.activeItemBorder,
  );

  const inactiveClass = cn(
    'border-transparent',
    template.sidebar.textColor,
    'hover:bg-gray-100 hover:text-gray-900',
  );

  return (
    <Link
      href={href}
      className={cn(baseClasses, isActive ? activeClass : inactiveClass)}
    >
      {/* Icono */}
      {Icon && <Icon className={cn(iconSize)} />}

      {/* Etiqueta */}
      <span>{label}</span>
    </Link>
  );
};

export default NavItem;
