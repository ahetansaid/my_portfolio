"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { fadeUp, stagger, slideInLeft, slideInRight } from "@/lib/motion";

type TimelineItem = { id: number; year: string; title: string; description: string };
type Value = { id: number; title: string; description: string };

const FORMATION_KEYS = ["epitech", "esep", "ceg"] as const;

const CERTIFICATES_META = [
  { icon: "🏆", key: "blockchain", issuer: "Africa Blockchain Institute", year: "2024" },
  { icon: "🌐", key: "icann", issuer: "ICANN", year: "2024" },
  { icon: "📡", key: "marketing", issuer: "D-CLiC OIF", year: "" },
  { icon: "💬", key: "communication", issuer: "Smart Africa Digital Academy", year: "" },
  { icon: "🖥️", key: "hardware", issuer: "Cisco Academy", year: "" },
  { icon: "🔒", key: "cyber", issuer: "Cisco Academy", year: "" },
  { icon: "🧠", key: "ai", issuer: "FRIARE", year: "" },
  { icon: "🛡", key: "cybersecUni", issuer: "UMontréal FAS-CYBERSEC", year: "" },
] as const;

const LANGUAGES_META = [
  { key: "french", levelKey: "fluent", stars: 5 },
  { key: "yoruba", levelKey: "fluent", stars: 5 },
  { key: "english", levelKey: "intermediate", stars: 3 },
] as const;

const INTERESTS_META = [
  { emoji: "🤝", key: "volunteer", detailKey: "volunteerDetail" },
  { emoji: "🌐", key: "governance", detailKey: "governanceDetail" },
  { emoji: "🎾", key: "tennis" },
  { emoji: "🏃", key: "running" },
  { emoji: "⚽", key: "football" },
  { emoji: "✏️", key: "drawing" },
  { emoji: "🎨", key: "art" },
  { emoji: "🍳", key: "cooking" },
  { emoji: "🌍", key: "traditions" },
] as const;

export function AboutClient({
  timeline,
  values,
}: {
  timeline: TimelineItem[];
  values: Value[];
}) {
  const t = useTranslations("aboutPage");
  const tFormations = useTranslations("aboutPage.formations");
  const tCertificates = useTranslations("aboutPage.certificates");
  const tLanguages = useTranslations("aboutPage.languages");
  const tInterests = useTranslations("aboutPage.interests");

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
                {t("badge")}
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
                {t("roleLabel")}
              </motion.p>

              <motion.p
                variants={fadeUp}
                className="mt-8 max-w-2xl text-lg leading-relaxed text-[hsl(var(--color-foreground))]"
              >
                {t("profile1")}{" "}
                <strong>{t("profileStrong")}</strong>
                {t("profile2")}
              </motion.p>

              <motion.p
                variants={fadeUp}
                className="mt-4 max-w-2xl text-base leading-relaxed text-[hsl(var(--color-muted))]"
              >
                {t("motivation")}
              </motion.p>

              <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
                <a href="mailto:saidahetan@gmail.com" className="btn-cta">
                  {t("ctaEmail")}
                </a>
                <Link href="/booking" className="btn-outline">
                  {t("ctaBooking")}
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
                    {t("contactTitle")}
                  </div>
                  <div className="text-xs text-[hsl(var(--color-muted))]">
                    {t("contactSubtitle")}
                  </div>
                </div>
              </div>

              <ul className="space-y-3 text-sm">
                <ContactLine
                  icon="✉"
                  label={t("contactEmail")}
                  value="saidahetan@gmail.com"
                  href="mailto:saidahetan@gmail.com"
                />
                <ContactLine
                  icon="📞"
                  label={t("contactPhone")}
                  value="+229 90 20 06 21"
                  href="tel:+22990200621"
                />
                <ContactLine icon="📍" label={t("contactLocation")} value={t("contactLocationValue")} />
                <ContactLine
                  icon="💼"
                  label={t("contactLinkedin")}
                  value="@mohamed-saïd-ahetan"
                  href="https://linkedin.com/in/mohamed-saïd-ahetan"
                />
                <ContactLine
                  icon="⚡"
                  label={t("contactGithub")}
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
                {t("journeyBadge")}
              </div>
              <h2 className="font-display text-3xl font-extrabold text-[hsl(var(--color-foreground))] sm:text-5xl">
                {t("journeyTitle")}
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
              {t("formationsBadge")}
            </div>
            <h2 className="font-display text-3xl font-extrabold text-[hsl(var(--color-foreground))] sm:text-5xl">
              {t("formationsTitle")}
            </h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid gap-6 md:grid-cols-3"
          >
            {FORMATION_KEYS.map((fKey, i) => (
              <motion.div
                key={fKey}
                variants={fadeUp}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="group relative overflow-hidden rounded-3xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] p-7 shadow-sm transition-shadow hover:shadow-2xl"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[hsl(var(--color-accent))] via-[hsl(var(--color-accent-warm))] to-[hsl(var(--color-electric))] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="pointer-events-none absolute -right-2 -top-4 font-display text-9xl font-extrabold leading-none text-[hsl(var(--color-accent))]/[0.06] transition-colors duration-500 group-hover:text-[hsl(var(--color-accent-warm))]/[0.12]">
                  0{i + 1}
                </div>

                <div className="pointer-events-none absolute -inset-x-8 -bottom-16 h-40 rounded-full bg-[hsl(var(--color-accent))]/20 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative">
                  <div className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[hsl(var(--color-accent-warm))]">
                    {tFormations(`${fKey}.year`)}
                  </div>
                  <h3 className="mt-3 font-display text-lg font-extrabold leading-tight text-[hsl(var(--color-foreground))]">
                    {tFormations(`${fKey}.degree`)}
                  </h3>
                  <div className="mt-2 inline-flex items-center gap-1.5 text-sm font-bold text-[hsl(var(--color-accent))]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--color-accent))]" />
                    {tFormations(`${fKey}.school`)}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-[hsl(var(--color-muted))]">
                    {tFormations(`${fKey}.detail`)}
                  </p>
                </div>
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
              {t("certsBadge")}
            </div>
            <h2 className="mb-8 font-display text-3xl font-extrabold text-[hsl(var(--color-foreground))] sm:text-4xl">
              {t("certsTitle")}
            </h2>
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid gap-4 sm:grid-cols-2"
            >
              {CERTIFICATES_META.map((c, i) => {
                const tones = [
                  "from-[hsl(var(--color-accent))]/15 to-[hsl(var(--color-accent))]/0",
                  "from-[hsl(var(--color-accent-warm))]/15 to-[hsl(var(--color-accent-warm))]/0",
                  "from-[hsl(var(--color-electric))]/15 to-[hsl(var(--color-electric))]/0",
                ];
                const iconBg = [
                  "bg-[hsl(var(--color-accent))]/15 text-[hsl(var(--color-accent))]",
                  "bg-[hsl(var(--color-accent-warm))]/15 text-[hsl(var(--color-accent-warm))]",
                  "bg-[hsl(var(--color-electric))]/15 text-[hsl(var(--color-electric))]",
                ];
                const tone = tones[i % 3];
                const ib = iconBg[i % 3];

                return (
                  <motion.div
                    key={c.key}
                    variants={fadeUp}
                    whileHover={{ y: -4, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300, damping: 22 }}
                    className="group relative overflow-hidden rounded-2xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] p-5 shadow-sm transition-shadow hover:shadow-xl"
                  >
                    <div
                      className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${tone} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                    />

                    <div className="relative flex items-start gap-4">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl ${ib} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[-8deg]`}
                      >
                        {c.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-display text-sm font-extrabold leading-tight text-[hsl(var(--color-foreground))]">
                          {tCertificates(c.key)}
                        </div>
                        <div className="mt-1.5 flex items-center gap-2 text-[11px] text-[hsl(var(--color-muted))]">
                          <span className="font-semibold uppercase tracking-wider">
                            {c.issuer}
                          </span>
                          {c.year && (
                            <>
                              <span className="text-[hsl(var(--color-surface-muted))]">•</span>
                              <span className="font-mono text-[hsl(var(--color-accent))]">
                                {c.year}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
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
              {t("languagesBadge")}
            </div>
            <h2 className="mb-8 font-display text-3xl font-extrabold text-[hsl(var(--color-foreground))] sm:text-4xl">
              {t("languagesTitle")}
            </h2>
            <div className="space-y-4 rounded-2xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] p-6">
              {LANGUAGES_META.map((l) => (
                <div key={l.key}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="font-display font-bold text-[hsl(var(--color-foreground))]">
                      {tLanguages(l.key)}
                    </span>
                    <span className="text-xs text-[hsl(var(--color-muted))]">{tLanguages(l.levelKey)}</span>
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
                {t("valuesBadge")}
              </div>
              <h2 className="font-display text-3xl font-extrabold text-[hsl(var(--color-foreground))] sm:text-5xl">
                {t("valuesTitle")}
              </h2>
            </motion.div>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
            >
              {values.map((v, i) => {
                const accents = [
                  { dot: "bg-[hsl(var(--color-accent))]", text: "text-[hsl(var(--color-accent))]", bar: "from-[hsl(var(--color-accent))] to-transparent" },
                  { dot: "bg-[hsl(var(--color-accent-warm))]", text: "text-[hsl(var(--color-accent-warm))]", bar: "from-[hsl(var(--color-accent-warm))] to-transparent" },
                  { dot: "bg-[hsl(var(--color-electric))]", text: "text-[hsl(var(--color-electric))]", bar: "from-[hsl(var(--color-electric))] to-transparent" },
                  { dot: "bg-[hsl(var(--color-accent))]", text: "text-[hsl(var(--color-accent))]", bar: "from-[hsl(var(--color-accent))] to-transparent" },
                ];
                const acc = accents[i % 4];
                return (
                  <motion.div
                    key={v.id}
                    variants={fadeUp}
                    whileHover={{ y: -6 }}
                    transition={{ type: "spring", stiffness: 300, damping: 22 }}
                    className="group relative overflow-hidden rounded-3xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] p-6 shadow-sm transition-shadow hover:shadow-2xl"
                  >
                    <div className={`absolute inset-y-0 left-0 w-1 bg-gradient-to-b ${acc.bar}`} />

                    <div className={`pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full ${acc.dot} opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-20`} />

                    <div className="relative">
                      <div className="flex items-center gap-2.5">
                        <span className={`flex h-8 w-8 items-center justify-center rounded-full ${acc.dot}/10 font-mono text-xs font-extrabold ${acc.text}`}>
                          0{i + 1}
                        </span>
                        <span className={`h-px flex-1 bg-gradient-to-r ${acc.bar}`} />
                      </div>
                      <h3 className="mt-5 font-display text-lg font-extrabold leading-tight text-[hsl(var(--color-foreground))]">
                        {v.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-[hsl(var(--color-muted))]">
                        {v.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
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
              {t("interestsBadge")}
            </div>
            <h2 className="font-display text-3xl font-extrabold text-[hsl(var(--color-foreground))] sm:text-5xl">
              {t("interestsTitle")}
            </h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-wrap gap-3"
          >
            {INTERESTS_META.map((i) => (
              <motion.div
                key={i.key}
                variants={fadeUp}
                whileHover={{ y: -4, scale: 1.04 }}
                className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] px-5 py-3 shadow-sm transition hover:border-[hsl(var(--color-accent))]/40 hover:shadow-md"
              >
                <span className="text-xl">{i.emoji}</span>
                <span className="font-display font-semibold text-[hsl(var(--color-foreground))]">
                  {tInterests(i.key)}
                </span>
                {"detailKey" in i && i.detailKey && (
                  <span className="text-xs text-[hsl(var(--color-muted))]">· {tInterests(i.detailKey)}</span>
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
              {t("finalCtaTitle")}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[hsl(var(--color-muted))] sm:text-lg">
              {t("finalCtaSubtitle")}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/booking" className="btn-cta">
                {t("finalCtaPrimary")}
              </Link>
              <Link href="/projects" className="btn-outline">
                {t("finalCtaSecondary")}
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
