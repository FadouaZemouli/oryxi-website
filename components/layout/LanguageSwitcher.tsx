"use client";

import Link from "next/link";
import { switchLocalePath } from "@/lib/i18n/path";
import { rememberScrollForLocaleSwitch } from "@/lib/layout/logo-travel";
import type { Locale } from "@/lib/i18n/config";

type LanguageSwitcherProps = {
  locale: Locale;
  labels: {
    label: string;
    en: string;
    ar: string;
  };
  pathname: string;
};

export function LanguageSwitcher({
  locale,
  labels,
  pathname,
}: LanguageSwitcherProps) {
  const nextLocale: Locale = locale === "en" ? "ar" : "en";
  const href = switchLocalePath(pathname, nextLocale);
  const label = nextLocale === "en" ? labels.en : labels.ar;

  return (
    <nav aria-label={labels.label}>
      <Link
        href={href}
        hrefLang={nextLocale}
        lang={nextLocale}
        scroll={false}
        onClick={rememberScrollForLocaleSwitch}
        className="oms-header-lang text-sm font-medium whitespace-nowrap transition-colors hover:text-oms-burgundy"
      >
        {label}
      </Link>
    </nav>
  );
}
