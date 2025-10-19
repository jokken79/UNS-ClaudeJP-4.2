'use client';

import { MetricCard } from '@/components/dashboard/metric-card';
import { StatsChart } from '@/components/dashboard/stats-chart';
import { Users, UserCheck, Building2, Clock, Menu, Bell, Search, Sun, Moon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function DemoPage() {
  const [darkMode, setDarkMode] = useState(false);

  // Datos de ejemplo
  const stats = {
    totalCandidates: 127,
    pendingCandidates: 15,
    activeEmployees: 89,
    totalEmployees: 102,
    totalFactories: 12,
    totalTimerCards: 456,
  };

  const chartData = [
    { month: 'Ene', monthFull: 'Enero', employees: 45, hours: 3600, salary: 7200000, factories: 6 },
    { month: 'Feb', monthFull: 'Febrero', employees: 52, hours: 4160, salary: 8320000, factories: 7 },
    { month: 'Mar', monthFull: 'Marzo', employees: 48, hours: 3840, salary: 7680000, factories: 7 },
    { month: 'Abr', monthFull: 'Abril', employees: 61, hours: 4880, salary: 9760000, factories: 8 },
    { month: 'May', monthFull: 'Mayo', employees: 58, hours: 4640, salary: 9280000, factories: 8 },
    { month: 'Jun', monthFull: 'Junio', employees: stats.totalEmployees, hours: 5200, salary: 10400000, factories: stats.totalFactories },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Demo Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center gap-4 px-4">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
              <span className="text-white font-bold text-lg">U</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold">UNS Dashboard Demo</h1>
              <p className="text-xs text-muted-foreground">Componentes Shadcn UI</p>
            </div>
          </div>

          <div className="flex-1" />

          {/* Search */}
          <div className="relative hidden md:flex w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar..." className="pl-9" />
          </div>

          {/* Theme Toggle */}
          <Button variant="ghost" size="icon" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
              3
            </Badge>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-6 space-y-8">
        {/* Welcome Banner */}
        <div className="rounded-lg border bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
              <svg className="h-6 w-6 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold">¡Dashboard Moderno Activado!</h2>
              <p className="text-sm text-muted-foreground">
                Todos los componentes Shadcn UI instalados y funcionando
              </p>
            </div>
          </div>
        </div>

        {/* Page Header */}
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard Demo</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Vista previa de los componentes modernos sin autenticación
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Candidatos"
            value={stats.totalCandidates}
            description={`${stats.pendingCandidates} pendientes de aprobación`}
            icon={Users}
            trend={{ value: 12, isPositive: true }}
          />
          <MetricCard
            title="Empleados Activos"
            value={stats.activeEmployees}
            description={`${stats.totalEmployees} total en sistema`}
            icon={UserCheck}
            trend={{ value: 8, isPositive: true }}
          />
          <MetricCard
            title="Fábricas Activas"
            value={stats.totalFactories}
            description="Clientes en operación"
            icon={Building2}
            trend={{ value: 3, isPositive: true }}
          />
          <MetricCard
            title="Asistencias (Mes)"
            value={stats.totalTimerCards}
            description="Registros de タイムカード"
            icon={Clock}
            trend={{ value: 5, isPositive: false }}
          />
        </div>

        {/* Charts and Components Section */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <StatsChart data={chartData} />
          </div>
        </div>

        {/* Component Showcase */}
        <Card>
          <CardHeader>
            <CardTitle>Componentes Instalados</CardTitle>
            <CardDescription>12 componentes Shadcn UI listos para usar</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="ui" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="ui">Componentes UI</TabsTrigger>
                <TabsTrigger value="dashboard">Componentes Dashboard</TabsTrigger>
              </TabsList>
              <TabsContent value="ui" className="space-y-4 mt-4">
                <div className="grid gap-4 md:grid-cols-3">
                  {[
                    'Avatar', 'Badge', 'Button', 'Card', 'Dropdown Menu',
                    'Input', 'Scroll Area', 'Select', 'Separator',
                    'Table', 'Tabs', 'Theme Switcher'
                  ].map((comp) => (
                    <div key={comp} className="flex items-center gap-2 p-3 rounded-lg border bg-muted/50">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span className="text-sm font-medium">{comp}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="dashboard" className="space-y-4 mt-4">
                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    { name: 'Sidebar', desc: 'Navegación colapsable' },
                    { name: 'Header', desc: 'Búsqueda y notificaciones' },
                    { name: 'MetricCard', desc: 'Métricas con trends' },
                    { name: 'StatsChart', desc: 'Gráficos Recharts' },
                    { name: 'DataTable', desc: 'Tablas TanStack' },
                  ].map((comp) => (
                    <div key={comp.name} className="flex items-start gap-3 p-4 rounded-lg border">
                      <div className="h-2 w-2 rounded-full bg-blue-500 mt-2" />
                      <div>
                        <p className="font-medium">{comp.name}</p>
                        <p className="text-sm text-muted-foreground">{comp.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Button Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Botones y Variantes</CardTitle>
            <CardDescription>Ejemplos de componentes interactivos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
            <Separator />
            <div className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/50">
          <CardHeader>
            <CardTitle className="text-blue-900 dark:text-blue-100">
              Cómo ver el Dashboard Completo
            </CardTitle>
          </CardHeader>
          <CardContent className="text-blue-800 dark:text-blue-200 space-y-2">
            <p>Para ver el dashboard completo con sidebar y todas las funcionalidades:</p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Ir a <code className="px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded">http://localhost:3000/login</code></li>
              <li>Iniciar sesión con: <code className="px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded">admin / admin123</code></li>
              <li>Serás redirigido automáticamente al dashboard moderno</li>
            </ol>
            <p className="pt-2 text-sm">
              <strong>Esta página (/demo)</strong> es solo para previsualizar componentes sin autenticación.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
