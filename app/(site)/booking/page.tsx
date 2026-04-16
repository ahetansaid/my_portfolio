import type { Metadata } from "next";
import { BookingForm } from "@/components/booking/BookingForm";

export const metadata: Metadata = {
  title: "Prendre un rendez-vous",
  description:
    "Réservons 30 minutes pour discuter de votre projet. Gratuit, sans engagement.",
};

export default function BookingPage() {
  return (
    <div className="section-padding">
      <div className="container-tight grid gap-12 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <h1 className="font-display text-4xl font-bold tracking-tight text-[hsl(var(--color-foreground))] sm:text-5xl">
            Prenons 30 minutes
          </h1>
          <p className="mt-4 text-lg text-[hsl(var(--color-muted))]">
            Gratuit, sans engagement. On discute de votre projet, de vos contraintes, et je vous dis
            franchement si je peux vous aider.
          </p>

          <div className="mt-10 space-y-5">
            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--color-accent))]/10 text-lg">
                💬
              </div>
              <div>
                <h3 className="font-semibold text-[hsl(var(--color-foreground))]">On parle de votre projet</h3>
                <p className="text-sm text-[hsl(var(--color-muted))]">
                  Contexte, objectifs, contraintes — tout ce qui m&apos;aide à comprendre votre besoin.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--color-accent))]/10 text-lg">
                🎯
              </div>
              <div>
                <h3 className="font-semibold text-[hsl(var(--color-foreground))]">Je vous donne mon avis franc</h3>
                <p className="text-sm text-[hsl(var(--color-muted))]">
                  Faisable ou pas, dans quels délais, à quel budget. Pas de bullshit.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--color-accent))]/10 text-lg">
                📋
              </div>
              <div>
                <h3 className="font-semibold text-[hsl(var(--color-foreground))]">On décide ensemble</h3>
                <p className="text-sm text-[hsl(var(--color-muted))]">
                  Si ça colle, on passe à une phase de cadrage. Sinon, je vous oriente vers mieux.
                </p>
              </div>
            </div>
          </div>
        </div>

        <BookingForm />
      </div>
    </div>
  );
}
