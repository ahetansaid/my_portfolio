import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";

export const metadata: Metadata = { title: "Dashboard" };

export const dynamic = "force-dynamic";

function formatRelative(date: Date) {
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "à l'instant";
  if (minutes < 60) return `il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `il y a ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `il y a ${days} j`;
  return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

const availabilityLabels: Record<string, { label: string; color: string; dot: string }> = {
  available: { label: "Disponible", color: "text-emerald-700 bg-emerald-50 border-emerald-200", dot: "bg-emerald-500" },
  on_mission: { label: "En mission", color: "text-amber-700 bg-amber-50 border-amber-200", dot: "bg-amber-500" },
  unavailable: { label: "Indisponible", color: "text-red-700 bg-red-50 border-red-200", dot: "bg-red-500" },
};

export default async function AdminDashboardPage() {
  const [
    projects,
    projectsPublished,
    technologies,
    services,
    testimonials,
    testimonialsPublished,
    playground,
    messages,
    messagesUnread,
    bookings,
    bookingsPending,
    skillItems,
    documents,
    availability,
    recentMessages,
    recentBookings,
    recentProjects,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { isPublished: true } }),
    prisma.technology.count(),
    prisma.service.count(),
    prisma.testimonial.count(),
    prisma.testimonial.count({ where: { isPublished: true } }),
    prisma.playgroundItem.count(),
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { isRead: false } }),
    prisma.booking.count(),
    prisma.booking.count({ where: { status: "pending" } }),
    prisma.skillItem.count(),
    prisma.document.count(),
    prisma.availabilityStatus.findFirst(),
    prisma.contactMessage.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, email: true, subject: true, createdAt: true, isRead: true },
    }),
    prisma.booking.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, topic: true, status: true, createdAt: true, company: true },
    }),
    prisma.project.findMany({
      take: 5,
      orderBy: { updatedAt: "desc" },
      select: { id: true, name: true, slug: true, isPublished: true, updatedAt: true },
    }),
  ]);

  const availMeta = availability
    ? availabilityLabels[availability.status] ?? availabilityLabels.available
    : availabilityLabels.available;

  const kpis: {
    label: string;
    value: string | number;
    hint: string;
    href: string;
    accent: "indigo" | "warm" | "lime" | "emerald";
    urgent?: boolean;
  }[] = [
    {
      label: "Projets",
      value: projects,
      hint: `${projectsPublished} publié${projectsPublished !== 1 ? "s" : ""}`,
      href: "/admin/projects",
      accent: "indigo",
    },
    {
      label: "Messages non lus",
      value: messagesUnread,
      hint: `${messages} au total`,
      href: "/admin/messages",
      accent: "warm",
      urgent: messagesUnread > 0,
    },
    {
      label: "RDV en attente",
      value: bookingsPending,
      hint: `${bookings} demande${bookings !== 1 ? "s" : ""}`,
      href: "/admin/bookings",
      accent: "warm",
      urgent: bookingsPending > 0,
    },
    {
      label: "Témoignages",
      value: testimonials,
      hint: `${testimonialsPublished} publié${testimonialsPublished !== 1 ? "s" : ""}`,
      href: "/admin/testimonials",
      accent: "lime",
    },
  ];

  const secondaryKpis = [
    { label: "Technologies", value: technologies, href: "/admin/technologies" },
    { label: "Services", value: services, href: "/admin/services" },
    { label: "Playground", value: playground, href: "/admin/playground" },
    { label: "Compétences", value: skillItems, href: "/admin/skills" },
    { label: "Documents", value: documents, href: "/admin/documents" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-[hsl(var(--color-foreground))]">
            Tableau de bord
          </h1>
          <p className="mt-1 text-sm text-[hsl(var(--color-muted))]">
            Vue d&apos;ensemble du portfolio.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/projects"
            className="inline-flex items-center gap-2 rounded-lg bg-[hsl(var(--color-accent-warm))] px-4 py-2 text-sm font-semibold text-[hsl(var(--color-accent-warm-foreground))] shadow-sm transition hover:opacity-90"
          >
            + Nouveau projet
          </Link>
          <Link
            href="/admin/settings"
            className="inline-flex items-center gap-2 rounded-lg border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] px-4 py-2 text-sm font-semibold text-[hsl(var(--color-foreground))] transition hover:border-[hsl(var(--color-accent))]/50"
          >
            ⚙ Paramètres
          </Link>
        </div>
      </div>

      {/* Availability banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex h-2.5 w-2.5 shrink-0 animate-pulse rounded-full ${availMeta.dot}`}
          />
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[hsl(var(--color-muted))]">
              Disponibilité publique
            </p>
            <p className="text-sm font-semibold text-[hsl(var(--color-foreground))]">
              {availMeta.label}
              {availability?.message ? (
                <span className="ml-2 font-normal text-[hsl(var(--color-muted))]">
                  — {availability.message}
                </span>
              ) : null}
            </p>
          </div>
        </div>
        <Link
          href="/admin/settings"
          className="text-xs font-semibold text-[hsl(var(--color-accent))] hover:underline"
        >
          Modifier →
        </Link>
      </div>

      {/* Primary KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </div>

      {/* Secondary stats */}
      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {secondaryKpis.map((k) => (
          <Link
            key={k.label}
            href={k.href}
            className="rounded-xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] px-4 py-3 shadow-sm transition hover:border-[hsl(var(--color-accent))]/40"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--color-muted))]">
              {k.label}
            </p>
            <p className="mt-0.5 text-xl font-bold text-[hsl(var(--color-foreground))]">
              {k.value}
            </p>
          </Link>
        ))}
      </div>

      {/* Recent activity */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* Recent messages */}
        <section className="rounded-xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] shadow-sm">
          <div className="flex items-center justify-between border-b border-[hsl(var(--color-surface-muted))] px-5 py-3">
            <h2 className="font-display font-semibold text-[hsl(var(--color-foreground))]">
              Derniers messages
            </h2>
            <Link
              href="/admin/messages"
              className="text-xs font-semibold text-[hsl(var(--color-accent))] hover:underline"
            >
              Tout voir →
            </Link>
          </div>
          <ul className="divide-y divide-[hsl(var(--color-surface-muted))]">
            {recentMessages.length === 0 && (
              <li className="px-5 py-6 text-center text-sm text-[hsl(var(--color-muted))]">
                Aucun message.
              </li>
            )}
            {recentMessages.map((m) => (
              <li key={m.id} className="flex items-start gap-3 px-5 py-3">
                <span
                  className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                    m.isRead ? "bg-transparent border border-[hsl(var(--color-muted))]" : "bg-[hsl(var(--color-accent-warm))]"
                  }`}
                  aria-hidden="true"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="truncate text-sm font-medium text-[hsl(var(--color-foreground))]">
                      {m.name}
                    </p>
                    <span className="shrink-0 text-[11px] text-[hsl(var(--color-muted))]">
                      {formatRelative(m.createdAt)}
                    </span>
                  </div>
                  <p className="truncate text-xs text-[hsl(var(--color-muted))]">
                    {m.subject ? m.subject + " · " : ""}
                    {m.email}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Recent bookings */}
        <section className="rounded-xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] shadow-sm">
          <div className="flex items-center justify-between border-b border-[hsl(var(--color-surface-muted))] px-5 py-3">
            <h2 className="font-display font-semibold text-[hsl(var(--color-foreground))]">
              Derniers rendez-vous
            </h2>
            <Link
              href="/admin/bookings"
              className="text-xs font-semibold text-[hsl(var(--color-accent))] hover:underline"
            >
              Tout voir →
            </Link>
          </div>
          <ul className="divide-y divide-[hsl(var(--color-surface-muted))]">
            {recentBookings.length === 0 && (
              <li className="px-5 py-6 text-center text-sm text-[hsl(var(--color-muted))]">
                Aucune demande de rendez-vous.
              </li>
            )}
            {recentBookings.map((b) => (
              <li key={b.id} className="flex items-start gap-3 px-5 py-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="truncate text-sm font-medium text-[hsl(var(--color-foreground))]">
                      {b.name}
                      {b.company ? (
                        <span className="ml-1 font-normal text-[hsl(var(--color-muted))]">
                          · {b.company}
                        </span>
                      ) : null}
                    </p>
                    <span className="shrink-0 text-[11px] text-[hsl(var(--color-muted))]">
                      {formatRelative(b.createdAt)}
                    </span>
                  </div>
                  <p className="mt-0.5 flex items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        b.status === "pending"
                          ? "bg-amber-50 text-amber-700"
                          : b.status === "confirmed"
                          ? "bg-emerald-50 text-emerald-700"
                          : b.status === "cancelled"
                          ? "bg-red-50 text-red-700"
                          : "bg-[hsl(var(--color-accent))]/10 text-[hsl(var(--color-accent))]"
                      }`}
                    >
                      {b.status}
                    </span>
                    <span className="truncate text-xs text-[hsl(var(--color-muted))]">{b.topic}</span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Recent projects (wide) */}
        <section className="rounded-xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between border-b border-[hsl(var(--color-surface-muted))] px-5 py-3">
            <h2 className="font-display font-semibold text-[hsl(var(--color-foreground))]">
              Projets récemment mis à jour
            </h2>
            <Link
              href="/admin/projects"
              className="text-xs font-semibold text-[hsl(var(--color-accent))] hover:underline"
            >
              Gérer →
            </Link>
          </div>
          <ul className="divide-y divide-[hsl(var(--color-surface-muted))]">
            {recentProjects.length === 0 && (
              <li className="px-5 py-6 text-center text-sm text-[hsl(var(--color-muted))]">
                Aucun projet.
              </li>
            )}
            {recentProjects.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-4 px-5 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[hsl(var(--color-foreground))]">
                    {p.name}
                  </p>
                  <p className="truncate text-xs text-[hsl(var(--color-muted))]">/{p.slug}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      p.isPublished
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-[hsl(var(--color-surface-muted))] text-[hsl(var(--color-muted))]"
                    }`}
                  >
                    {p.isPublished ? "Publié" : "Brouillon"}
                  </span>
                  <span className="text-[11px] text-[hsl(var(--color-muted))]">
                    {formatRelative(p.updatedAt)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

function KpiCard({
  label,
  value,
  hint,
  href,
  accent,
  urgent,
}: {
  label: string;
  value: string | number;
  hint: string;
  href: string;
  accent: "indigo" | "warm" | "lime" | "emerald";
  urgent?: boolean;
}) {
  const accentMap: Record<string, string> = {
    indigo: "from-[hsl(var(--color-accent))] to-[hsl(var(--color-accent))]/60",
    warm: "from-[hsl(var(--color-accent-warm))] to-[hsl(var(--color-accent-warm))]/60",
    lime: "from-[hsl(var(--color-electric))] to-[hsl(var(--color-electric))]/60",
    emerald: "from-emerald-500 to-emerald-400",
  };

  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] p-5 shadow-sm transition hover:border-[hsl(var(--color-accent))]/40 hover:shadow-md"
    >
      <div
        className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accentMap[accent]}`}
        aria-hidden="true"
      />
      <p className="text-xs font-bold uppercase tracking-wider text-[hsl(var(--color-muted))]">
        {label}
      </p>
      <div className="mt-2 flex items-baseline gap-2">
        <p
          className={`font-display text-3xl font-black ${
            urgent
              ? "text-[hsl(var(--color-accent-warm))]"
              : "text-[hsl(var(--color-foreground))]"
          }`}
        >
          {value}
        </p>
        {urgent ? (
          <span className="rounded-full bg-[hsl(var(--color-accent-warm))]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[hsl(var(--color-accent-warm))]">
            à traiter
          </span>
        ) : null}
      </div>
      <p className="mt-1 text-xs text-[hsl(var(--color-muted))]">{hint}</p>
    </Link>
  );
}
