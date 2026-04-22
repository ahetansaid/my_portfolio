import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  title: {
    default: "Backoffice",
    template: "%s · Backoffice",
  },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  return <AdminShell adminEmail={session?.email ?? null}>{children}</AdminShell>;
}
