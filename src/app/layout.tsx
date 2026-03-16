import "./globals.css"; // Certifique-se que o ficheiro globals.css está nesta mesma pasta

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}