import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { BookingForm } from "@/components/booking/BookingForm";

export const metadata: Metadata = {
  title: "Prendre un rendez-vous",
  description:
    "Réservons 30 minutes pour discuter de votre projet. Gratuit, sans engagement.",
};

export default async function BookingPage() {
  const t = await getTranslations("bookingPage");

  return (
    <div className="section-padding">
      <div className="container-tight grid gap-12 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <h1 className="font-display text-4xl font-bold tracking-tight text-[hsl(var(--color-foreground))] sm:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-4 text-lg text-[hsl(var(--color-muted))]">
            {t("subtitle")}
          </p>

          <div className="mt-10 space-y-5">
            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--color-accent))]/10 text-lg">
                💬
              </div>
              <div>
                <h3 className="font-semibold text-[hsl(var(--color-foreground))]">{t("feature1Title")}</h3>
                <p className="text-sm text-[hsl(var(--color-muted))]">
                  {t("feature1Text")}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--color-accent))]/10 text-lg">
                🎯
              </div>
              <div>
                <h3 className="font-semibold text-[hsl(var(--color-foreground))]">{t("feature2Title")}</h3>
                <p className="text-sm text-[hsl(var(--color-muted))]">
                  {t("feature2Text")}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--color-accent))]/10 text-lg">
                📋
              </div>
              <div>
                <h3 className="font-semibold text-[hsl(var(--color-foreground))]">{t("feature3Title")}</h3>
                <p className="text-sm text-[hsl(var(--color-muted))]">
                  {t("feature3Text")}
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
