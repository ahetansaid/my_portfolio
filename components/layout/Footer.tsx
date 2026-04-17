import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface-muted))]/50">
      <div className="container-tight py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[hsl(var(--color-accent))] to-[hsl(var(--color-accent-warm))] text-sm font-bold text-white">
                M
              </span>
              <span className="font-display font-semibold text-[hsl(var(--color-foreground))]">
                Mohamed Saïd AHETAN
              </span>
            </div>
            <p className="mt-3 text-sm text-[hsl(var(--color-muted))]">
              Intégrateur SI & développeur full-stack. Je construis des systèmes métier qui tournent.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-[hsl(var(--color-foreground))]">
              Navigation
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/projects", label: "Projets" },
                { href: "/services", label: "Services" },
                { href: "/about", label: "À propos" },
                { href: "/skills", label: "Compétences" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[hsl(var(--color-muted))] hover:text-[hsl(var(--color-accent))] transition">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Pour qui */}
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-[hsl(var(--color-foreground))]">
              Pour qui
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/recruiter" className="text-[hsl(var(--color-muted))] hover:text-[hsl(var(--color-accent))] transition">
                  Recruteurs
                </Link>
              </li>
              <li>
                <Link href="/booking" className="text-[hsl(var(--color-muted))] hover:text-[hsl(var(--color-accent))] transition">
                  Prendre un RDV
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[hsl(var(--color-muted))] hover:text-[hsl(var(--color-accent))] transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-[hsl(var(--color-foreground))]">
              Réseaux
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://github.com/ahetansaid"
                  target="_blank"
                  rel="noopener"
                  className="text-[hsl(var(--color-muted))] hover:text-[hsl(var(--color-accent))] transition"
                >
                  GitHub →
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com/in/mohamed-saïd-ahetan"
                  target="_blank"
                  rel="noopener"
                  className="text-[hsl(var(--color-muted))] hover:text-[hsl(var(--color-accent))] transition"
                >
                  LinkedIn →
                </a>
              </li>
              <li>
                <a
                  href="mailto:saidahetan@gmail.com"
                  className="text-[hsl(var(--color-muted))] hover:text-[hsl(var(--color-accent))] transition"
                >
                  Email direct →
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-[hsl(var(--color-surface-muted))] pt-6 text-center text-xs text-[hsl(var(--color-muted))]">
          © {year} Mohamed Saïd AHETAN. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
