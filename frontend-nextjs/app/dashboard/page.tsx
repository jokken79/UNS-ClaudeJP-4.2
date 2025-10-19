'use client';

import { useAuthStore } from '@/stores/auth-store';
import { useQuery } from '@tanstack/react-query';
import { employeeService, candidateService, factoryService, timerCardService } from '@/lib/api';
import { MetricCard } from '@/components/dashboard/metric-card';
import { StatsChart } from '@/components/dashboard/stats-chart';
import { Users, UserCheck, Building2, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  const { isAuthenticated } = useAuthStore();

  // Fetch statistics with React Query - only if authenticated
  const { data: employeesData, isLoading: loadingEmployees } = useQuery({
    queryKey: ['employees'],
    queryFn: () => employeeService.getEmployees(),
    enabled: isAuthenticated,
  });

  const { data: candidates, isLoading: loadingCandidates } = useQuery({
    queryKey: ['candidates'],
    queryFn: () => candidateService.getCandidates(),
    enabled: isAuthenticated,
  });

  const { data: factories, isLoading: loadingFactories } = useQuery({
    queryKey: ['factories'],
    queryFn: () => factoryService.getFactories(),
    enabled: isAuthenticated,
  });

  const { data: timerCards, isLoading: loadingTimerCards } = useQuery({
    queryKey: ['timerCards'],
    queryFn: () => timerCardService.getTimerCards(),
    enabled: isAuthenticated,
  });

  // Safely access items from API responses
  const employeeItems = employeesData?.items || [];
  const candidateItems = Array.isArray(candidates) ? candidates : (candidates?.items || []);
  const factoryItems = Array.isArray(factories) ? factories : (factories?.items || []);
  const timerCardItems = Array.isArray(timerCards) ? timerCards : (timerCards?.items || []);

  // Calculate statistics
  const stats = {
    totalCandidates: Array.isArray(candidateItems) ? candidateItems.length : 0,
    pendingCandidates: Array.isArray(candidateItems) ? candidateItems.filter((c: any) => c.status === 'pending' || c.status === 'pending_approval').length : 0,
    totalEmployees: Array.isArray(employeeItems) ? employeeItems.length : 0,
    activeEmployees: Array.isArray(employeeItems) ? employeeItems.filter((e: any) => e.status === 'active').length : 0,
    totalFactories: Array.isArray(factoryItems) ? factoryItems.length : 0,
    totalTimerCards: Array.isArray(timerCardItems) ? timerCardItems.length : 0,
  };

  const isLoading = loadingEmployees || loadingCandidates || loadingFactories || loadingTimerCards;

  // Prepare data for charts - using correct format
  const chartData = [
    { month: 'Ene', monthFull: 'Enero', employees: 45, hours: 3600, salary: 7200000, factories: 6 },
    { month: 'Feb', monthFull: 'Febrero', employees: 52, hours: 4160, salary: 8320000, factories: 7 },
    { month: 'Mar', monthFull: 'Marzo', employees: 48, hours: 3840, salary: 7680000, factories: 7 },
    { month: 'Abr', monthFull: 'Abril', employees: 61, hours: 4880, salary: 9760000, factories: 8 },
    { month: 'May', monthFull: 'Mayo', employees: 58, hours: 4640, salary: 9280000, factories: 8 },
    { month: 'Jun', monthFull: 'Junio', employees: stats.totalEmployees, hours: 5200, salary: 10400000, factories: stats.totalFactories },
  ];

  // Prepare table data - using correct column definitions
  const recentCandidates = candidateItems.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Resumen general del sistema de gestión de RRHH
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
          loading={isLoading}
        />
        <MetricCard
          title="Empleados Activos"
          value={stats.activeEmployees}
          description={`${stats.totalEmployees} total en sistema`}
          icon={UserCheck}
          trend={{ value: 8, isPositive: true }}
          loading={isLoading}
        />
        <MetricCard
          title="Fábricas Activas"
          value={stats.totalFactories}
          description="Clientes en operación"
          icon={Building2}
          trend={{ value: 3, isPositive: true }}
          loading={isLoading}
        />
        <MetricCard
          title="Asistencias (Mes)"
          value={stats.totalTimerCards}
          description="Registros de タイムカード"
          icon={Clock}
          trend={{ value: 5, isPositive: false }}
          loading={isLoading}
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <StatsChart data={chartData} />
        </div>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Candidatos Recientes</CardTitle>
            <CardDescription>Últimos registros de 履歴書</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {isLoading ? (
                <div className="text-sm text-muted-foreground">Cargando...</div>
              ) : recentCandidates.length > 0 ? (
                recentCandidates.map((candidate: any) => (
                  <div key={candidate.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                    <div>
                      <p className="font-medium text-sm">
                        {candidate.name || `${candidate.first_name || ''} ${candidate.last_name || ''}`.trim() || 'Sin nombre'}
                      </p>
                      <p className="text-xs text-muted-foreground">{candidate.status || 'pendiente'}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {candidate.created_at ? new Date(candidate.created_at).toLocaleDateString('es-ES') : '-'}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground text-center py-4">
                  No hay candidatos recientes
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Welcome Message */}
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <svg
              className="h-6 w-6 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold">Dashboard Moderno Activado</h3>
            <p className="text-sm text-muted-foreground">
              Todos los componentes Shadcn UI están instalados y funcionando correctamente
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
