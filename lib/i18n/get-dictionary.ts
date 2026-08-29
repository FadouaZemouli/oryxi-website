import type { Locale } from "@/lib/i18n/config";
import { ar } from "@/lib/i18n/dictionaries/ar";
import { en } from "@/lib/i18n/dictionaries/en";

export type Dictionary = typeof en;

export function getDictionary(locale: Locale): Dictionary {
  return locale === "ar" ? ar : en;
}
