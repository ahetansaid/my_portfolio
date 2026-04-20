import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CVViewer } from "@/components/cv/CVViewer";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("cvPage");
  return {
    title: t("title"),
    description: t("description"),
  };
}

const CV_FILES = {
  fr: "/cv-mohamed-said-ahetan-fr.pdf",
  en: "/cv-mohamed-said-ahetan-en.pdf",
} as const;

export default async function CVPage() {
  return <CVViewer files={CV_FILES} />;
}
