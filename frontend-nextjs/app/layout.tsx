import type { Metadata } from "next";
import { Inter, Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-noto-sans-jp",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "JPUNS - Sistema de Gestión de RRHH",
    template: "%s | JPUNS"
  },
  description: "Sistema de gestión de recursos humanos para empresas japonesas",
  keywords: ["RRHH", "gestión", "empleados", "candidatos", "recursos humanos"],
  authors: [{ name: "JPUNS Team" }],
  creator: "JPUNS",
  openGraph: {
    type: "website",
    locale: "es_ES",
    alternateLocale: "ja_JP",
    url: "https://jpuns.com",
    title: "JPUNS - Sistema de Gestión de RRHH",
    description: "Sistema de gestión de recursos humanos para empresas japonesas",
    siteName: "JPUNS",
  },
  twitter: {
    card: "summary_large_image",
    title: "JPUNS - Sistema de Gestión de RRHH",
    description: "Sistema de gestión de recursos humanos para empresas japonesas",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} ${notoSansJP.variable} font-sans antialiased`} suppressHydrationWarning>
        <Providers>
          <div className="absolute top-4 right-4 z-50">
            <ThemeSwitcher />
          </div>
          {children}
        </Providers>
      </body>
    </html>
  );
}

