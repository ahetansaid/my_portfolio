"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";
import { ToasterProvider, useToast } from "./Toaster";

function Shell({ adminEmail, children }: { adminEmail: string | null; children: React.ReactNode }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      toast.info("Déconnecté.");
    } finally {
      router.push("/admin/login");
      router.refresh();
    }
  };

  return (
    <div className="flex min-h-screen bg-[hsl(var(--color-surface-muted))]/50">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
        adminEmail={adminEmail}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] px-4 lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Ouvrir la navigation"
            className="rounded-lg p-2 text-[hsl(var(--color-foreground))] hover:bg-[hsl(var(--color-surface-muted))]"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <span className="font-display text-sm font-bold text-[hsl(var(--color-foreground))]">
            Backoffice
          </span>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-8 sm:py-10">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

function ConditionalShell({
  adminEmail,
  children,
}: {
  adminEmail: string | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  if (pathname === "/admin/login") return <>{children}</>;
  return <Shell adminEmail={adminEmail}>{children}</Shell>;
}

export function AdminShell({
  adminEmail,
  children,
}: {
  adminEmail: string | null;
  children: React.ReactNode;
}) {
  return (
    <ToasterProvider>
      <ConditionalShell adminEmail={adminEmail}>{children}</ConditionalShell>
    </ToasterProvider>
  );
}
