import "./globals.css";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Hajime Manager",
  description: "Biblioteca Técnica de Judo - Clube de Judo Hajime",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/logo-hajime-biblioteca.png",
    apple: "/icons/logo-hajime-biblioteca.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Hajime Manager",
  },
};

export const viewport: Viewport = {
  themeColor: "#0055A4",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <head>
        {/* Fallback para garantir que o ícone do iPhone funciona bem */}
        <link rel="apple-touch-icon" href="/icons/logo-hajime-biblioteca.png" />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}