'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { dashboardConfig } from '@/lib/constants/dashboard-config';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSidebar } from '@/lib/hooks/use-sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';

export function Sidebar() {
  const pathname = usePathname();
  const { collapsed, toggle } = useSidebar();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen border-r bg-background transition-all duration-300 ease-in-out',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header del Sidebar */}
      <div className="flex h-16 items-center justify-between px-4 border-b">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <span className="text-white font-bold text-lg">U</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm">UNS HRApp</span>
              <span className="text-xs text-muted-foreground">v4.0</span>
            </div>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggle}
          className={cn(
            'h-8 w-8 hover:bg-accent',
            collapsed && 'mx-auto'
          )}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navegación */}
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <nav className="flex flex-col gap-2 p-2">
          {/* Navegación Principal */}
          <div className="space-y-1">
            {!collapsed && (
              <h4 className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Principal
              </h4>
            )}
            {dashboardConfig.mainNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');

              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    className={cn(
                      'w-full justify-start gap-3 h-10',
                      collapsed && 'justify-center px-2',
                      isActive && 'bg-primary/10 text-primary font-medium hover:bg-primary/20 border-l-2 border-primary'
                    )}
                    title={collapsed ? item.title : undefined}
                  >
                    <Icon className={cn('h-5 w-5', isActive && 'text-primary')} />
                    {!collapsed && (
                      <span className="text-sm truncate">{item.title}</span>
                    )}
                  </Button>
                </Link>
              );
            })}
          </div>

          <Separator className="my-2" />

          {/* Navegación Secundaria */}
          <div className="space-y-1">
            {!collapsed && (
              <h4 className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Otros
              </h4>
            )}
            {dashboardConfig.secondaryNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    className={cn(
                      'w-full justify-start gap-3 h-10',
                      collapsed && 'justify-center px-2',
                      isActive && 'text-primary font-medium'
                    )}
                    title={collapsed ? item.title : undefined}
                  >
                    <Icon className="h-5 w-5" />
                    {!collapsed && (
                      <span className="text-sm truncate">{item.title}</span>
                    )}
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Footer del Sidebar */}
          {!collapsed && (
            <div className="mt-auto pt-4 pb-2">
              <div className="px-3 py-2 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">
                  Sistema de RRHH para agencias japonesas
                </p>
              </div>
            </div>
          )}
        </nav>
      </ScrollArea>
    </aside>
  );
}
