"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp, stagger, slideInLeft, slideInRight } from "@/lib/motion";

type TimelineItem = { id: number; year: string; title: string; description: string };
type Value = { id: number; title: string; description: string };

const FORMATIONS = [
  {
    year: "2024 — présent",
    school: "Epitech Bénin",
    degree: "Coding Academy — Développeur Full Stack",
    detail: "Formation intensive par projet. Next.js, React, TypeScript, architectures scalables, DevOps.",
  },
  {
    year: "2021 — 2024",
    school: "ESEP — Le Berger",
    degree: "Licence Pro Systèmes Informatiques & Logiciels",
    detail: "Génie logiciel, bases de données, développement web. Premiers projets en PHP/Laravel/MySQL.",
  },
  {
    year: "2019 — 2020",
    school: "CEG Akpakpa-Centre",
    degree: "Baccalauréat Série C (Sciences & Techniques)",
    detail: "Bac scientifique — maths, physique, biologie.",
  },
];

const CERTIFICATES = [
  { icon: "🏆", title: "Lauréat Défi des Innovateurs Blockchain", issuer: "Africa Blockchain Institute", year: "2024" },
  { icon: "📡", title: "Marketing Numérique", issuer: "D-CLiC OIF", year: "" },
  { icon: "💬", title: "Communication sur Internet", issuer: "Smart Africa Digital Academy", year: "" },
  { icon: "🖥️", title: "Computer Hardware Basics", issuer: "Cisco Academy", year: "" },
  { icon: "🔒", title: "Introduction to Cybersecurity", issuer: "Cisco Academy", year: "" },
  { icon: "🧠", title: "IA & Métaheuristiques / Programmation par contraintes", issuer: "FRIARE", year: "" },
  { icon: "🛡", title: "Cybersécurité en milieu universitaire", issuer: "UMontréal FAS-CYBERSEC", year: "" },
];

const LANGUAGES = [
  { name: "Français", level: "Courant", stars: 5 },
  { name: "Yoruba", level: "Courant", stars: 5 },
  { name: "Anglais", level: "Intermédiaire", stars: 3 },
];

const INTERESTS = [
  { emoji: "🤝", label: "Bénévole", detail: "Turritopsis AISBL" },
  { emoji: "🏃", label: "Footing" },
  { emoji: "⚽", label: "Football" },
  { emoji: "✏️", label: "Dessin architectural" },
  { emoji: "🎨", label: "Art" },
  { emoji: "🍳", label: "Cuisine" },
  { emoji: "🌍", label: "Traditions" },
];

export function AboutClient({
  timeline,
  values,
}: {
  timeline: TimelineItem[];
  values: Value[];
}) {
  return (
    <div className="relative">
      {/* HERO ÉDITORIAL */}
      <section className="relative overflow-hidden border-b border-[hsl(var(--color-surface-muted))]">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-0 top-0 h-[400px] w-[600px] rounded-full bg-[hsl(var(--color-accent))] opacity-[0.10] blur-[140px]" />
          <div className="absolute right-0 top-40 h-[400px] w-[400px] rounded-full bg-[hsl(var(--color-accent-warm))] opacity-[0.10] blur-[120px]" />
        </div>

        <div className="container-tight pt-20 pb-16 sm:pt-28 sm:pb-20">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-16 lg:items-start"
          >
            {/* LEFT — Profil */}
            <div>
              <motion.div
                variants={fadeUp}
                className="mb-4 inline-flex items-center gap-2 rounded-full border border-[hsl(var(--color-electric))]/30 bg-[hsl(var(--color-electric))]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[hsl(var(--color-electric))]"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--color-electric))]" />
                Qui suis-je
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="font-display text-5xl font-extrabold leading-[0.95] tracking-tight text-[hsl(var(--color-foreground))] sm:text-6xl lg:text-7xl"
              >
                Mohamed Saïd{" "}
                <span className="text-gradient">AHETAN</span>.
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="mt-3 text-xl font-medium text-[hsl(var(--color-muted))]"
              >
                Développeur Full Stack · Intégrateur Systèmes · Cotonou 🇧🇯
              </motion.p>

              <motion.p
                variants={fadeUp}
                className="mt-8 max-w-2xl text-lg leading-relaxed text-[hsl(var(--color-foreground))]"
              >
                Je code depuis l&apos;adolescence et je construis aujourd&apos;hui des systèmes qui{" "}
                <strong>tournent en production pour de vrais utilisateurs</strong>. Mon terrain
                de jeu : l&apos;intégration SI, le full-stack TypeScript, et les SaaS pour
                l&apos;Afrique francophone.
              </motion.p>

              <motion.p
                variants={fadeUp}
                className="mt-4 max-w-2xl text-base leading-relaxed text-[hsl(var(--color-muted))]"
              >
                Ce qui me motive : résoudre des problèmes métier concrets avec du code propre.
                Pas les démos parfaites qui cassent en prod — les systèmes qui tiennent 6 mois
                après le déploiement, sans qu&apos;on m&apos;appelle à 2h du matin.
              </motion.p>

              <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
                <a href="mailto:saidahetan@gmail.com" className="btn-cta">
                  ✉ Envoyer un email
                </a>
                <Link href="/booking" className="btn-outline">
                  Prendre RDV
                </Link>
              </motion.div>
            </div>

            {/* RIGHT — Carte contact compact */}
            <motion.aside
              variants={fadeUp}
              className="rounded-3xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] p-6 shadow-lg sm:p-8"
            >
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[hsl(var(--color-accent))] via-[hsl(var(--color-accent-warm))] to-[hsl(var(--color-electric))] font-display text-2xl font-bold text-white shadow-[0_0_24px_rgba(163,230,53,0.35)]">
                  MA
                </div>
                <div>
                  <div className="font-display text-lg font-bold text-[hsl(var(--color-foreground))]">
                    Contact direct
                  </div>
                  <div className="text-xs text-[hsl(var(--color-muted))]">
                    Réponse sous 24h
                  </div>
                </div>
              </div>

              <ul className="space-y-3 text-sm">
                <ContactLine
                  icon="✉"
                  label="Email"
                  value="saidahetan@gmail.com"
                  href="mailto:saidahetan@gmail.com"
                />
                <ContactLine
                  icon="📞"
                  label="Téléphone"
                  value="+229 90 20 06 21"
                  href="tel:+22990200621"
                />
                <ContactLine icon="📍" label="Localisation" value="Cotonou, Bénin" />
                <ContactLine
                  icon="💼"
                  label="LinkedIn"
                  value="@mohamed-saïd-ahetan"
                  href="https://linkedin.com/in/mohamed-saïd-ahetan"
                />
                <ContactLine
                  icon="⚡"
                  label="GitHub"
                  value="@ahetansaid"
                  href="https://github.com/ahetansaid"
                />
              </ul>
            </motion.aside>
          </motion.div>
        </div>
      </section>

      {/* PARCOURS (TIMELINE) */}
      {timeline.length > 0 && (
        <section className="section-padding border-b border-[hsl(var(--color-surface-muted))]">
          <div className="container-tight">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12 max-w-2xl"
            >
              <div className="mb-3 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[hsl(var(--color-accent))]">
                <span className="h-px w-8 bg-[hsl(var(--color-accent))]" />
                01 · Parcours
              </div>
              <h2 className="font-display text-3xl font-extrabold text-[hsl(var(--color-foreground))] sm:text-5xl">
                D&apos;où je viens, où je vais.
              </h2>
            </motion.div>

            <div className="relative border-l-2 border-dashed border-[hsl(var(--color-surface-muted))] pl-8 md:pl-12">
              {timeline.map((item, i) => (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  className="relative mb-10 last:mb-0"
                >
                  <motion.span
                    whileHover={{ scale: 1.2 }}
                    className="absolute -left-[2.9rem] top-1 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-[hsl(var(--color-accent))] via-[hsl(var(--color-accent-warm))] to-[hsl(var(--color-electric))] shadow-lg md:-left-[3.7rem]"
                  >
                    <span className="h-2 w-2 rounded-full bg-white" />
                  </motion.span>
                  <div className="font-mono text-xs uppercase tracking-widest text-[hsl(var(--color-accent))]">
                    {item.year}
                  </div>
                  <h3 className="mt-1 font-display text-lg font-bold text-[hsl(var(--color-foreground))] sm:text-xl">
                    {item.title}
                  </h3>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[hsl(var(--color-muted))]">
                    {item.description}
                  </p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FORMATIONS */}
      <section className="section-padding border-b border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface-muted))]/40">
        <div className="container-tight">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 max-w-2xl"
          >
            <div className="mb-3 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[hsl(var(--color-accent-warm))]">
              <span className="h-px w-8 bg-[hsl(var(--color-accent-warm))]" />
              02 · Formations
            </div>
            <h2 className="font-display text-3xl font-extrabold text-[hsl(var(--color-foreground))] sm:text-5xl">
              Apprendre, toujours.
            </h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid gap-5 md:grid-cols-3"
          >
            {FORMATIONS.map((f) => (
              <motion.div
                key={f.school}
                variants={fadeUp}
                className="group rounded-2xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="font-mono text-[11px] uppercase tracking-widest text-[hsl(var(--color-accent-warm))]">
                  {f.year}
                </div>
                <h3 className="mt-2 font-display text-base font-bold text-[hsl(var(--color-foreground))]">
                  {f.degree}
                </h3>
                <p className="mt-1 text-sm font-semibold text-[hsl(var(--color-accent))]">
                  {f.school}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-[hsl(var(--color-muted))]">
                  {f.detail}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CERTIFICATS & LANGUES — 2 colonnes */}
      <section className="section-padding border-b border-[hsl(var(--color-surface-muted))]">
        <div className="container-tight grid gap-12 lg:grid-cols-[2fr_1fr]">
          {/* CERTIFICATS */}
          <motion.div
            variants={slideInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="mb-6 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[hsl(var(--color-electric))]">
              <span className="h-px w-8 bg-[hsl(var(--color-electric))]" />
              03 · Certifications & Distinctions
            </div>
            <h2 className="mb-8 font-display text-3xl font-extrabold text-[hsl(var(--color-foreground))] sm:text-4xl">
              Ce que j&apos;ai validé.
            </h2>
            <motion.ul
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-3"
            >
              {CERTIFICATES.map((c, i) => (
                <motion.li
                  key={i}
                  variants={fadeUp}
                  className="flex items-start gap-4 rounded-xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] p-4 transition hover:border-[hsl(var(--color-accent))]/40"
                >
                  <span className="text-2xl">{c.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-display font-bold text-[hsl(var(--color-foreground))]">
                      {c.title}
                    </div>
                    <div className="mt-0.5 text-xs text-[hsl(var(--color-muted))]">
                      {c.issuer}
                      {c.year && ` · ${c.year}`}
                    </div>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* LANGUES */}
          <motion.div
            variants={slideInRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="self-start"
          >
            <div className="mb-6 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[hsl(var(--color-accent-warm))]">
              <span className="h-px w-8 bg-[hsl(var(--color-accent-warm))]" />
              04 · Langues
            </div>
            <h2 className="mb-8 font-display text-3xl font-extrabold text-[hsl(var(--color-foreground))] sm:text-4xl">
              Je parle.
            </h2>
            <div className="space-y-4 rounded-2xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] p-6">
              {LANGUAGES.map((l) => (
                <div key={l.name}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="font-display font-bold text-[hsl(var(--color-foreground))]">
                      {l.name}
                    </span>
                    <span className="text-xs text-[hsl(var(--color-muted))]">{l.level}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[hsl(var(--color-surface-muted))]">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(l.stars / 5) * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full bg-gradient-to-r from-[hsl(var(--color-accent))] to-[hsl(var(--color-accent-warm))]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* VALEURS */}
      {values.length > 0 && (
        <section className="section-padding border-b border-[hsl(var(--color-surface-muted))] bg-gradient-to-br from-[hsl(var(--color-accent))]/5 via-transparent to-[hsl(var(--color-accent-warm))]/5">
          <div className="container-tight">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12 max-w-2xl"
            >
              <div className="mb-3 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[hsl(var(--color-accent))]">
                <span className="h-px w-8 bg-[hsl(var(--color-accent))]" />
                05 · Valeurs
              </div>
              <h2 className="font-display text-3xl font-extrabold text-[hsl(var(--color-foreground))] sm:text-5xl">
                Ce qui guide mon travail.
              </h2>
            </motion.div>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
            >
              {values.map((v) => (
                <motion.div
                  key={v.id}
                  variants={fadeUp}
                  className="rounded-2xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] p-6 shadow-sm"
                >
                  <h3 className="font-display font-bold text-[hsl(var(--color-foreground))]">
                    {v.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[hsl(var(--color-muted))]">
                    {v.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* CENTRES D'INTÉRÊT */}
      <section className="section-padding border-b border-[hsl(var(--color-surface-muted))]">
        <div className="container-tight">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 max-w-2xl"
          >
            <div className="mb-3 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[hsl(var(--color-electric))]">
              <span className="h-px w-8 bg-[hsl(var(--color-electric))]" />
              06 · Hors du code
            </div>
            <h2 className="font-display text-3xl font-extrabold text-[hsl(var(--color-foreground))] sm:text-5xl">
              Ce que je suis aussi.
            </h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-wrap gap-3"
          >
            {INTERESTS.map((i) => (
              <motion.div
                key={i.label}
                variants={fadeUp}
                whileHover={{ y: -4, scale: 1.04 }}
                className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] px-5 py-3 shadow-sm transition hover:border-[hsl(var(--color-accent))]/40 hover:shadow-md"
              >
                <span className="text-xl">{i.emoji}</span>
                <span className="font-display font-semibold text-[hsl(var(--color-foreground))]">
                  {i.label}
                </span>
                {i.detail && (
                  <span className="text-xs text-[hsl(var(--color-muted))]">· {i.detail}</span>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="section-padding">
        <div className="container-tight">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl border border-[hsl(var(--color-surface-muted))] bg-gradient-to-br from-[hsl(var(--color-accent))]/10 via-[hsl(var(--color-surface))] to-[hsl(var(--color-accent-warm))]/10 p-10 text-center sm:p-16"
          >
            <h2 className="font-display text-3xl font-extrabold text-[hsl(var(--color-foreground))] sm:text-5xl">
              Prêt à construire quelque chose ensemble ?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[hsl(var(--color-muted))] sm:text-lg">
              30 minutes suffisent pour cadrer un projet. Gratuit, sans engagement, direct.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/booking" className="btn-cta">
                📅 Réserver 30 min
              </Link>
              <Link href="/projects" className="btn-outline">
                Voir mes réalisations
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function ContactLine({
  icon,
  label,
  value,
  href,
}: {
  icon: string;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <>
      <span className="text-base shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-[hsl(var(--color-muted))]">
          {label}
        </div>
        <div className="truncate font-medium text-[hsl(var(--color-foreground))]">{value}</div>
      </div>
    </>
  );

  if (href) {
    return (
      <li>
        <a
          href={href}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noopener" : undefined}
          className="flex items-center gap-3 rounded-lg p-2 -m-2 transition hover:bg-[hsl(var(--color-surface-muted))]"
        >
          {content}
        </a>
      </li>
    );
  }
  return (
    <li className="flex items-center gap-3 p-2 -m-2">
      {content}
    </li>
  );
}
