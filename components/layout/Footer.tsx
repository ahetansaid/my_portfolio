import Link from "next/link";

const navLinks = [
  { href: "/about", label: "À propos" },
  { href: "/projects", label: "Projets" },
  { href: "/skills", label: "Compétences" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface-muted))]/50">
      <div className="container-tight section-padding">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-display text-sm font-semibold text-[hsl(var(--color-foreground))]">
              Portfolio — Intégrateur Systèmes
            </p>
            <p className="mt-1 text-sm text-[hsl(var(--color-muted))]">
              © {year}. Tous droits réservés.
            </p>
          </div>
          <ul className="flex flex-wrap gap-6">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-sm text-[hsl(var(--color-muted))] transition-colors hover:text-[hsl(var(--color-accent))]"
                >
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/contact"
                className="text-sm font-medium text-[hsl(var(--color-accent))] hover:underline"
              >
                Me contacter
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
