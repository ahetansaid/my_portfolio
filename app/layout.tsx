import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Syne } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
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
    default: "Mohamed Saïd AHETAN — Full Stack & Systems Integrator",
    template: "%s · Mohamed Saïd AHETAN",
  },
  description:
    "I build business systems that don't break: SaaS, ERP, document management, fleet management. 10+ projects shipped to production.",
  keywords: [
    "systems integrator",
    "full-stack developer",
    "Next.js",
    "ERP",
    "GED",
    "DGMS",
    "SaaS",
    "Afrique francophone",
    "consultant tech",
    "intégrateur système",
    "développeur full-stack",
  ],
  authors: [{ name: "Mohamed Saïd AHETAN" }],
  creator: "Mohamed Saïd AHETAN",
  openGraph: {
    type: "website",
    url: BASE_URL,
    title: "Mohamed Saïd AHETAN — Full Stack & Systems Integrator",
    description:
      "I build business systems that don't break: SaaS, ERP, document management, fleet management. 10+ projects shipped.",
    siteName: "Mohamed Saïd AHETAN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mohamed Saïd AHETAN — Systems Builder",
    description: "10+ SaaS shipped. They run in production.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${GeistSans.variable} ${GeistMono.variable} ${syne.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col font-sans antialiased text-[hsl(var(--color-foreground))] bg-[hsl(var(--color-surface))]">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider>{children}</ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
