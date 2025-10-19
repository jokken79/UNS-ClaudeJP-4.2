'use client';

import { useAuthStore } from '@/stores/auth-store';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import { employeeService, candidateService, factoryService, timerCardService } from '@/lib/api';

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuthStore();

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

  const handleLogout = () => {
    logout();
    toast.success('Sesión cerrada correctamente');
    router.push('/login');
  };

  const isLoading = loadingEmployees || loadingCandidates || loadingFactories || loadingTimerCards;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">UNS</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                    Dashboard
                  </h1>
                  <p className="mt-1 text-sm text-gray-600">
                    Bienvenido, <span className="font-semibold text-purple-600">{user?.username || 'Usuario'}</span>
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        <div className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 shadow-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-bold text-green-900">
                ¡Next.js 15 funcionando correctamente!
              </h3>
              <p className="mt-1 text-sm text-green-700">
                Dashboard con datos en tiempo real del backend • UNS-ClaudeJP 3.1
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Candidates Card */}
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-purple-100">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-shrink-0 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 shadow-lg">
                  <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                {stats.pendingCandidates > 0 && (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full">
                    {stats.pendingCandidates} pendientes
                  </span>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Candidatos (履歴書)</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
                  {isLoading ? (
                    <span className="inline-block animate-pulse">...</span>
                  ) : (
                    stats.totalCandidates
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Employees Card */}
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-blue-100">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-shrink-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 shadow-lg">
                  <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                {stats.activeEmployees > 0 && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">
                    {stats.activeEmployees} activos
                  </span>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Empleados (派遣社員)</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                  {isLoading ? (
                    <span className="inline-block animate-pulse">...</span>
                  ) : (
                    stats.totalEmployees
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Factories Card */}
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-green-100">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-shrink-0 bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 shadow-lg">
                  <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Fábricas (派遣先)</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                  {isLoading ? (
                    <span className="inline-block animate-pulse">...</span>
                  ) : (
                    stats.totalFactories
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Timer Cards */}
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-yellow-100">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-shrink-0 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-4 shadow-lg">
                  <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Asistencias (タイムカード)</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-700 bg-clip-text text-transparent">
                  {isLoading ? (
                    <span className="inline-block animate-pulse">...</span>
                  ) : (
                    stats.totalTimerCards
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Migration Status */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              Estado de la Migración
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">✓ Autenticación & Login</span>
                <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                  100%
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">✓ Dashboard con datos reales</span>
                <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                  100%
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">⏳ Candidates (4 páginas)</span>
                <span className="px-3 py-1 bg-gray-200 text-gray-700 text-xs font-bold rounded-full">
                  0%
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">⏳ Employees (3 páginas)</span>
                <span className="px-3 py-1 bg-gray-200 text-gray-700 text-xs font-bold rounded-full">
                  0%
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">⏳ Otros módulos (17 páginas)</span>
                <span className="px-3 py-1 bg-gray-200 text-gray-700 text-xs font-bold rounded-full">
                  0%
                </span>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">Progreso Total</span>
                  <span className="text-sm font-bold text-purple-600">40%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-500 h-3 rounded-full transition-all duration-500" style={{ width: '40%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              Acciones Rápidas
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/candidates')}
                className="w-full p-4 bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-lg border border-purple-200 transition-all duration-200 text-left group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="text-white font-bold">履</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Ver Candidatos</p>
                      <p className="text-xs text-gray-600">{stats.totalCandidates} registrados</p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-purple-600 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>

              <button
                onClick={() => router.push('/employees')}
                className="w-full p-4 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-lg border border-blue-200 transition-all duration-200 text-left group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="text-white font-bold">派</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Ver Empleados</p>
                      <p className="text-xs text-gray-600">{stats.totalEmployees} en sistema</p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>

              <button
                onClick={() => router.push('/factories')}
                className="w-full p-4 bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 rounded-lg border border-green-200 transition-all duration-200 text-left group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="text-white font-bold">工</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Ver Fábricas</p>
                      <p className="text-xs text-gray-600">{stats.totalFactories} clientes</p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-green-600 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>

              <button
                onClick={() => router.push('/timer-cards')}
                className="w-full p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 hover:from-yellow-100 hover:to-yellow-200 rounded-lg border border-yellow-200 transition-all duration-200 text-left group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="text-white font-bold">勤</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Ver Asistencias</p>
                      <p className="text-xs text-gray-600">{stats.totalTimerCards} registros</p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-yellow-600 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
