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

const CV_URLS = {
  fr: "/api/documents/cv-fr",
  en: "/api/documents/cv-en",
} as const;

export default async function CVPage() {
  return <CVViewer files={CV_URLS} />;
}
