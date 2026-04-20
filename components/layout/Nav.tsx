"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AvailabilityBanner } from "@/components/ui/AvailabilityBanner";
import { LocaleSwitcher } from "@/components/ui/LocaleSwitcher";

const LINKS = [
  { href: "/", key: "home", num: "01" },
  { href: "/projects", key: "projects", num: "02" },
  { href: "/playground", key: "playground", num: "03" },
  { href: "/services", key: "services", num: "04" },
  { href: "/about", key: "about", num: "05" },
  { href: "/recruiter", key: "recruiter", num: "06" },
  { href: "/contact", key: "contact", num: "07" },
] as const;

export function Nav() {
  const pathname = usePathname();
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Scroll detection for compact header
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when sidebar is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {/* TOP BAR — minimaliste */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 z-40 w-full"
      >
        <div
          className={`mx-auto flex items-center justify-between transition-all duration-500 ${
            scrolled
              ? "mt-3 max-w-6xl rounded-2xl border border-white/10 bg-[rgba(15,15,22,0.85)] px-5 py-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.25)] backdrop-blur-xl"
              : "border-b border-white/5 bg-[rgba(15,15,22,0.65)] px-6 py-4 backdrop-blur-lg"
          }`}
        >
          {/* LOGO */}
          <Link href="/" className="group flex items-center gap-2.5 shrink-0">
            <motion.span
              whileHover={{ rotate: 180, scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[hsl(var(--color-accent))] via-[hsl(var(--color-accent-warm))] to-[hsl(var(--color-electric))] font-display text-sm font-bold text-white shadow-[0_0_20px_rgba(163,230,53,0.35)]"
            >
              M
            </motion.span>
            <div className="hidden sm:block">
              <div className="font-display text-base font-bold leading-none tracking-tight text-white">
                AHETAN
              </div>
              <div className="mt-0.5 text-[10px] uppercase tracking-[0.2em] text-white/50">
                {t("role")}
              </div>
            </div>
          </Link>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Locale switcher */}
            <LocaleSwitcher variant="dark" />

            {/* Desktop: "Book a call" quick CTA */}
            <Link
              href="/booking"
              className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-[hsl(var(--color-electric))]/50 bg-[hsl(var(--color-electric))]/10 px-4 py-2 text-xs font-bold text-[hsl(var(--color-electric))] transition-all hover:bg-[hsl(var(--color-electric))] hover:text-[hsl(var(--color-electric-foreground))] hover:shadow-[0_0_24px_rgba(163,230,53,0.6)]"
            >
              <motion.span
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 1.6, repeat: Infinity }}
                className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--color-electric))]"
              />
              {t("booking")}
            </Link>

            {/* TOGGLE — ouvre le sidebar */}
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label={t("openMenu")}
              className="group relative flex h-11 items-center gap-2.5 rounded-full border border-white/15 bg-white/5 pl-4 pr-3 transition-all hover:border-[hsl(var(--color-electric))]/50 hover:bg-[hsl(var(--color-electric))]/10"
            >
              <span className="hidden text-xs font-bold uppercase tracking-wider text-white/80 group-hover:text-[hsl(var(--color-electric))] sm:inline">
                {t("menu")}
              </span>
              <div className="flex h-7 w-7 flex-col items-center justify-center gap-[5px] rounded-full bg-white/10 group-hover:bg-[hsl(var(--color-electric))]/20">
                <span className="block h-[2px] w-3.5 rounded bg-white transition-all group-hover:bg-[hsl(var(--color-electric))] group-hover:w-4" />
                <span className="block h-[2px] w-2.5 rounded bg-white/70 transition-all group-hover:bg-[hsl(var(--color-electric))] group-hover:w-4" />
              </div>
            </button>
          </div>
        </div>
      </motion.header>

      {/* SIDEBAR — slide depuis la droite */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />

            {/* Sidebar panel */}
            <motion.aside
              key="sidebar"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 260 }}
              className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col overflow-y-auto border-l border-white/10 bg-gradient-to-br from-[rgba(15,15,22,0.98)] via-[rgba(20,15,30,0.98)] to-[rgba(15,15,22,0.98)] shadow-[-20px_0_60px_rgba(0,0,0,0.5)] backdrop-blur-xl"
            >
              {/* Decorative glow */}
              <div className="pointer-events-none absolute -left-20 top-1/3 h-96 w-96 rounded-full bg-[hsl(var(--color-electric))] opacity-10 blur-[120px]" />
              <div className="pointer-events-none absolute -right-10 bottom-0 h-72 w-72 rounded-full bg-[hsl(var(--color-accent))] opacity-10 blur-[100px]" />

              {/* Header du sidebar */}
              <div className="relative flex items-center justify-between border-b border-white/10 px-8 py-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[hsl(var(--color-accent))] via-[hsl(var(--color-accent-warm))] to-[hsl(var(--color-electric))] font-display text-base font-bold text-white shadow-[0_0_24px_rgba(163,230,53,0.4)]">
                    M
                  </span>
                  <div>
                    <div className="font-display text-lg font-bold leading-none text-white">
                      AHETAN
                    </div>
                    <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/50">
                      {t("role")}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  aria-label={t("closeMenu")}
                  className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:border-[hsl(var(--color-electric))]/50 hover:bg-[hsl(var(--color-electric))]/10"
                >
                  <svg
                    className="h-4 w-4 text-white transition group-hover:rotate-90 group-hover:text-[hsl(var(--color-electric))]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Availability banner */}
              <div className="relative px-8 pt-6">
                <AvailabilityBanner />
              </div>

              {/* NAV LINKS */}
              <nav className="relative flex-1 px-8 py-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/40">
                    Navigation
                  </span>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </div>

                <ul className="space-y-1">
                  {LINKS.map((link, i) => {
                    const active =
                      link.href === "/"
                        ? pathname === "/"
                        : pathname === link.href || pathname.startsWith(link.href + "/");

                    return (
                      <motion.li
                        key={link.href}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 + i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <Link
                          href={link.href}
                          onClick={() => setOpen(false)}
                          className={`group relative flex items-center gap-5 overflow-hidden rounded-2xl px-4 py-4 transition-all ${
                            active
                              ? "bg-[hsl(var(--color-electric))]/15 shadow-[inset_0_0_0_1px_rgba(163,230,53,0.3)]"
                              : "hover:bg-white/5"
                          }`}
                        >
                          {/* Numéro */}
                          <span
                            className={`font-mono text-xs font-semibold transition ${
                              active ? "text-[hsl(var(--color-electric))]" : "text-white/30 group-hover:text-white/60"
                            }`}
                          >
                            {link.num}
                          </span>

                          {/* Label */}
                          <span
                            className={`flex-1 font-display text-2xl font-bold tracking-tight transition ${
                              active
                                ? "text-[hsl(var(--color-electric))]"
                                : "text-white/70 group-hover:text-white"
                            }`}
                          >
                            {t(link.key)}
                          </span>

                          {/* Arrow */}
                          <motion.span
                            animate={active ? { x: [0, 4, 0] } : {}}
                            transition={active ? { duration: 1.5, repeat: Infinity } : {}}
                            className={`text-xl transition ${
                              active ? "text-[hsl(var(--color-electric))]" : "text-white/30 group-hover:translate-x-1 group-hover:text-white"
                            }`}
                          >
                            →
                          </motion.span>
                        </Link>
                      </motion.li>
                    );
                  })}
                </ul>

                {/* CTA section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="mt-8"
                >
                  <Link
                    href="/booking"
                    onClick={() => setOpen(false)}
                    className="group flex items-center justify-center gap-2 rounded-2xl bg-[hsl(var(--color-electric))] px-6 py-4 font-display text-base font-bold text-[hsl(var(--color-electric-foreground))] shadow-[0_0_32px_rgba(163,230,53,0.4)] transition-all hover:shadow-[0_0_48px_rgba(163,230,53,0.6)] hover:-translate-y-0.5"
                  >
                    <motion.span
                      animate={{ rotate: [0, 15, -10, 15, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                    >
                      ⚡
                    </motion.span>
                    {t("booking")}
                    <span className="transition group-hover:translate-x-1">→</span>
                  </Link>
                </motion.div>
              </nav>

              {/* FOOTER du sidebar */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.4 }}
                className="relative border-t border-white/10 px-8 py-6"
              >
                <div className="mb-4 flex items-center gap-3">
                  <a
                    href="https://github.com/ahetansaid"
                    target="_blank"
                    rel="noopener"
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/70 transition hover:border-[hsl(var(--color-electric))]/50 hover:bg-[hsl(var(--color-electric))]/10 hover:text-[hsl(var(--color-electric))]"
                    aria-label="GitHub"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                    </svg>
                  </a>
                  <a
                    href="https://linkedin.com/in/mohamed-said-ahetan"
                    target="_blank"
                    rel="noopener"
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/70 transition hover:border-[hsl(var(--color-electric))]/50 hover:bg-[hsl(var(--color-electric))]/10 hover:text-[hsl(var(--color-electric))]"
                    aria-label="LinkedIn"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                  <div className="ml-auto">
                    <ThemeToggle />
                  </div>
                </div>
                <p className="text-center text-[10px] text-white/30">
                  © 2026 · Mohamed Saïd AHETAN · Tous droits réservés
                </p>
              </motion.div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
