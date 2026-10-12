import "./globals.css";

export const metadata = {
  title: "mon-saas-pro",
  description: "mon-saas-pro Cloud Solutions - Garoua",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}