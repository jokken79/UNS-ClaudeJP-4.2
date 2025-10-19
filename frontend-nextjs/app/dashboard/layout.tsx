import { Sidebar } from '@/components/dashboard/sidebar';
import { Header } from '@/components/dashboard/header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-muted/10">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-6 space-y-6">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t bg-background px-6 py-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>© 2025 UNS HRApp - Sistema de RRHH para agencias japonesas</p>
            <div className="flex items-center gap-4">
              <a href="/privacy" className="hover:text-foreground transition-colors">
                Privacidad
              </a>
              <a href="/terms" className="hover:text-foreground transition-colors">
                Términos
              </a>
              <a href="/support" className="hover:text-foreground transition-colors">
                Soporte
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
