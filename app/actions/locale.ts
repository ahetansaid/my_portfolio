"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { LOCALES, type Locale } from "@/i18n/request";

const COOKIE_NAME = "NEXT_LOCALE";
const ONE_YEAR = 60 * 60 * 24 * 365;

export async function setLocaleAction(locale: Locale) {
  if (!(LOCALES as readonly string[]).includes(locale)) {
    throw new Error(`Invalid locale: ${locale}`);
  }

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, locale, {
    path: "/",
    maxAge: ONE_YEAR,
    sameSite: "lax",
  });

  revalidatePath("/", "layout");
}
