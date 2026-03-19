import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Portfolio | Intégrateur Systèmes — Développeur, ERP, DGMS",
    template: "%s | Portfolio",
  },
  description:
    "Portfolio professionnel : intégration de systèmes, développement, ERP, gestion de flotte. Découvrez mes projets et compétences.",
  keywords: ["intégrateur système", "développeur", "ERP", "GPS management", "DGMS"],
  openGraph: {
    title: "Portfolio | Intégrateur Systèmes",
    description: "Vitrine professionnelle — projets, compétences et contact.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="min-h-screen flex flex-col font-sans antialiased text-[hsl(var(--color-foreground))] bg-[hsl(var(--color-surface))]">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
