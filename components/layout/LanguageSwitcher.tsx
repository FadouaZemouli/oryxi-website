"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { switchLocalePath } from "@/lib/i18n/path";
import type { Locale } from "@/lib/i18n/config";

type LanguageSwitcherProps = {
  locale: Locale;
  labels: {
    label: string;
    en: string;
    ar: string;
  };
};

export function LanguageSwitcher({ locale, labels }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const nextLocale: Locale = locale === "en" ? "ar" : "en";
  const href = switchLocalePath(pathname, nextLocale);
  const label = nextLocale === "en" ? labels.en : labels.ar;

  return (
    <nav aria-label={labels.label}>
      <Link
        href={href}
        hrefLang={nextLocale}
        lang={nextLocale}
        className="text-sm font-medium text-oms-dark whitespace-nowrap hover:text-oms-burgundy"
      >
        {label}
      </Link>
    </nav>
  );
}
