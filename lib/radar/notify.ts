import nodemailer from "nodemailer";
import { prisma } from "@/lib/db";
import type { Opportunity } from "@prisma/client";

export function emailConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

function getTransport() {
  if (!emailConfigured()) return null;
  const port = Number(process.env.SMTP_PORT) || 587;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

function fmtDate(d: Date | null) {
  if (!d) return null;
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "numeric" }).format(d);
}

const CAT: Record<string, string> = {
  scholarship: "Bourse", fellowship: "Fellowship", job: "Emploi", internship: "Stage",
  conference: "Conférence", training: "Formation", volunteering: "Bénévolat", grant: "Financement", call: "Appel",
};

function card(o: Opportunity & { source: { name: string } }, base: string): string {
  const deadline = fmtDate(o.deadline);
  const meta = [o.org, o.location, o.source.name].filter(Boolean).join(" · ");
  return `
  <table role="presentation" width="100%" style="border:1px solid #e5e7eb;border-radius:12px;margin:0 0 14px;border-collapse:separate">
    <tr><td style="padding:16px">
      <div style="font:700 12px system-ui;color:#16a34a">${o.stream === "smart_ports" ? "🚢 SMART PORTS" : "🌍 GÉNÉRAL"} · score ${o.fitScore ?? "?"}/100 · ${CAT[o.category] ?? o.category}${deadline ? ` · ⏳ ${deadline}` : ""}</div>
      <div style="font:700 16px system-ui;margin:6px 0 2px"><a href="${o.url}" style="color:#111827;text-decoration:none">${o.title}</a></div>
      <div style="font:400 12px system-ui;color:#6b7280">${meta}</div>
      ${o.summary ? `<div style="font:400 14px system-ui;color:#374151;margin-top:8px">${o.summary}</div>` : ""}
      ${o.whyNow ? `<div style="font:400 13px system-ui;color:#6b7280;margin-top:6px"><b>Pourquoi maintenant :</b> ${o.whyNow}</div>` : ""}
      ${o.recommendedAction ? `<div style="font:400 13px system-ui;color:#6b7280;margin-top:2px"><b>Action :</b> ${o.recommendedAction}</div>` : ""}
      <div style="margin-top:10px"><a href="${o.url}" style="font:600 13px system-ui;color:#16a34a">Voir l'opportunité →</a></div>
    </td></tr>
  </table>`;
}

function renderEmail(items: (Opportunity & { source: { name: string } })[], base: string): string {
  return `<div style="max-width:640px;margin:0 auto;padding:8px">
    <div style="font:800 20px system-ui;color:#111827">📡 Career Radar</div>
    <div style="font:400 13px system-ui;color:#6b7280;margin:4px 0 18px">${items.length} opportunité(s) pertinente(s) détectée(s), classées par pertinence avec ton profil Smart Ports.</div>
    ${items.map((o) => card(o, base)).join("")}
    <div style="font:400 12px system-ui;color:#9ca3af;margin-top:18px">Tableau de bord complet : <a href="${base}/admin/radar" style="color:#16a34a">${base}/admin/radar</a></div>
  </div>`;
}

/**
 * Envoie une alerte email pour les opportunités scorées, au-dessus du seuil de fit,
 * pas encore notifiées. Regroupe en un seul email (anti-rafale) et marque notifiedAt.
 */
export async function notifyPending(opts: { cap?: number } = {}) {
  const cap = opts.cap ?? 12;
  const transport = getTransport();
  const to = process.env.RADAR_NOTIFY_EMAIL || process.env.EMAIL_FROM || process.env.SMTP_USER;
  if (!transport || !to) return { sent: 0, reason: "email non configuré" as const };

  const profile = await prisma.radarProfile.findUnique({ where: { id: 1 } });
  const threshold = profile?.fitThreshold ?? 70;

  const pending = await prisma.opportunity.findMany({
    where: {
      notifiedAt: null,
      scoredAt: { not: null },
      fitScore: { gte: threshold },
      status: { not: "dismissed" },
    },
    orderBy: [{ fitScore: "desc" }],
    take: cap,
    include: { source: { select: { name: true } } },
  });
  if (pending.length === 0) return { sent: 0 };

  const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const subject =
    pending.length === 1
      ? `🎯 Opportunité (${pending[0].fitScore}/100) — ${pending[0].title.slice(0, 70)}`
      : `🎯 ${pending.length} nouvelles opportunités pertinentes — Career Radar`;

  await transport.sendMail({
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to,
    subject,
    html: renderEmail(pending, base),
  });

  await prisma.opportunity.updateMany({
    where: { id: { in: pending.map((p) => p.id) } },
    data: { notifiedAt: new Date() },
  });
  await prisma.digestRun.create({ data: { kind: "instant", itemCount: pending.length, status: "sent" } });

  return { sent: pending.length };
}

/** Test de configuration : envoie un email de vérification. */
export async function sendTestEmail() {
  const transport = getTransport();
  const to = process.env.RADAR_NOTIFY_EMAIL || process.env.EMAIL_FROM || process.env.SMTP_USER;
  if (!transport || !to) throw new Error("Email non configuré (SMTP_*)");
  await transport.sendMail({
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to,
    subject: "✅ Career Radar — test de configuration email",
    html: `<div style="font:400 15px system-ui">Ton radar est bien configuré pour t'envoyer les alertes d'opportunités. 🎯</div>`,
  });
  return { to };
}
