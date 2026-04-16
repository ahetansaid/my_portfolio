import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Syne } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Mohamed Saïd AHETAN — Intégrateur SI & Dev Full-Stack",
    template: "%s · Mohamed Saïd AHETAN",
  },
  description:
    "Je construis des systèmes métier qui ne cassent pas : SaaS, ERP, GED, gestion de flotte. 10+ projets livrés pour des organisations en production.",
  keywords: [
    "intégrateur système",
    "développeur full-stack",
    "Next.js",
    "ERP",
    "GED",
    "DGMS",
    "SaaS",
    "Afrique francophone",
    "consultant tech",
  ],
  authors: [{ name: "Mohamed Saïd AHETAN" }],
  creator: "Mohamed Saïd AHETAN",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: BASE_URL,
    title: "Mohamed Saïd AHETAN — Intégrateur SI & Dev Full-Stack",
    description:
      "Je construis des systèmes métier qui ne cassent pas : SaaS, ERP, GED, gestion de flotte. 10+ projets livrés.",
    siteName: "Mohamed Saïd AHETAN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mohamed Saïd AHETAN — Intégrateur SI",
    description: "10+ projets SaaS livrés. Ils tournent en production.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
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
      className={`${GeistSans.variable} ${GeistMono.variable} ${syne.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col font-sans antialiased text-[hsl(var(--color-foreground))] bg-[hsl(var(--color-surface))]">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
