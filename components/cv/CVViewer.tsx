"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";

type Files = { fr: string; en: string };

export function CVViewer({ files }: { files: Files }) {
  const locale = useLocale() as "fr" | "en";
  const t = useTranslations("cvPage");
  const [selectedLocale, setSelectedLocale] = useState<"fr" | "en">(locale);
  const [fileExists, setFileExists] = useState<boolean | null>(null);

  const currentFile = files[selectedLocale];

  // Check if the PDF file exists
  useEffect(() => {
    let active = true;
    setFileExists(null);
    fetch(currentFile, { method: "HEAD" })
      .then((res) => {
        if (active) setFileExists(res.ok);
      })
      .catch(() => {
        if (active) setFileExists(false);
      });
    return () => {
      active = false;
    };
  }, [currentFile]);

  return (
    <div className="relative">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-[hsl(var(--color-surface-muted))]">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-[20%] top-0 h-[320px] w-[480px] rounded-full bg-[hsl(var(--color-accent))] opacity-[0.10] blur-[120px]" />
          <div className="absolute right-[15%] top-20 h-[280px] w-[360px] rounded-full bg-[hsl(var(--color-accent-warm))] opacity-[0.08] blur-[110px]" />
        </div>

        <div className="container-tight pt-16 pb-10 sm:pt-24 sm:pb-14">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[hsl(var(--color-electric))]/30 bg-[hsl(var(--color-electric))]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[hsl(var(--color-electric))]">
                <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--color-electric))]" />
                {t("badge")}
              </div>
              <h1 className="font-display text-4xl font-extrabold tracking-tight text-[hsl(var(--color-foreground))] sm:text-5xl lg:text-6xl">
                {t("title")}
              </h1>
              <p className="mt-3 max-w-2xl text-[hsl(var(--color-muted))]">
                {t("description")}
              </p>
            </div>

            {/* Language selector */}
            <div className="flex flex-col items-start gap-2 sm:items-end">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[hsl(var(--color-muted))]">
                {t("version")}
              </span>
              <div className="relative inline-flex items-center rounded-full border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] p-1">
                {(["fr", "en"] as const).map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => setSelectedLocale(loc)}
                    className="relative rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition"
                  >
                    {selectedLocale === loc && (
                      <motion.span
                        layoutId="cv-locale-indicator"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-[hsl(var(--color-accent))] via-[hsl(var(--color-accent-warm))] to-[hsl(var(--color-electric))]"
                      />
                    )}
                    <span
                      className={`relative z-10 ${
                        selectedLocale === loc ? "text-white" : "text-[hsl(var(--color-muted))]"
                      }`}
                    >
                      {loc.toUpperCase()}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={currentFile}
              target="_blank"
              rel="noopener"
              className="btn-cta group"
            >
              <span>📄 {t("openInTab")}</span>
              <span className="transition-transform group-hover:translate-x-1">↗</span>
            </a>
            <a
              href={currentFile}
              download
              className="btn-outline group"
            >
              <span>⬇ {t("download")}</span>
            </a>
            <Link href="/recruiter" className="btn-outline">
              {t("backToRecruiter")}
            </Link>
          </div>
        </div>
      </section>

      {/* PDF VIEWER */}
      <section className="section-padding">
        <div className="container-tight">
          {fileExists === false ? (
            <MissingFileNotice file={currentFile} locale={selectedLocale} t={t} />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative overflow-hidden rounded-3xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] shadow-2xl"
            >
              {/* Toolbar */}
              <div className="flex items-center justify-between border-b border-[hsl(var(--color-surface-muted))] bg-gradient-to-br from-[hsl(var(--color-accent))]/5 to-[hsl(var(--color-accent-warm))]/5 px-6 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-red-400" />
                    <span className="h-3 w-3 rounded-full bg-yellow-400" />
                    <span className="h-3 w-3 rounded-full bg-green-400" />
                  </div>
                  <span className="ml-3 font-mono text-xs text-[hsl(var(--color-muted))]">
                    CV · {selectedLocale.toUpperCase()}
                  </span>
                </div>
                <a
                  href={currentFile}
                  target="_blank"
                  rel="noopener"
                  className="text-xs font-semibold text-[hsl(var(--color-accent))] hover:underline"
                >
                  {t("fullScreen")} ↗
                </a>
              </div>

              {/* Viewer */}
              {fileExists === null ? (
                <div className="flex h-[800px] items-center justify-center">
                  <div className="animate-pulse text-sm text-[hsl(var(--color-muted))]">
                    {t("loading")}
                  </div>
                </div>
              ) : (
                <iframe
                  key={currentFile}
                  src={`${currentFile}#toolbar=0&navpanes=0`}
                  title={`CV ${selectedLocale.toUpperCase()}`}
                  className="h-[80vh] w-full border-0 sm:h-[900px]"
                />
              )}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}

function MissingFileNotice({
  file,
  locale,
  t,
}: {
  file: string;
  locale: "fr" | "en";
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <div className="rounded-3xl border-2 border-dashed border-[hsl(var(--color-accent-warm))]/40 bg-[hsl(var(--color-accent-warm))]/5 p-10 text-center sm:p-16">
      <div className="mb-4 text-5xl">📄</div>
      <h2 className="font-display text-xl font-extrabold text-[hsl(var(--color-foreground))] sm:text-2xl">
        {t("missing.title", { locale: locale.toUpperCase() })}
      </h2>
      <p className="mx-auto mt-3 max-w-lg text-sm text-[hsl(var(--color-muted))]">
        {t("missing.instructions")}
      </p>
      <div className="mx-auto mt-6 max-w-md rounded-xl bg-[hsl(var(--color-surface-muted))] p-4 text-left font-mono text-xs text-[hsl(var(--color-foreground))]">
        <div className="text-[hsl(var(--color-muted))]">{t("missing.path")}</div>
        <div className="mt-1 font-bold">public{file}</div>
      </div>
    </div>
  );
}
