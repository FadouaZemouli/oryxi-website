"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n/config";
import { switchLocalePath } from "@/lib/i18n/path";

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

  return (
    <nav aria-label={labels.label} className="flex items-center gap-2 text-sm">
      {locales.map((item, index) => {
        const href = switchLocalePath(pathname, item);
        const isActive = item === locale;

        return (
          <span key={item} className="flex items-center gap-2">
            {index > 0 ? (
              <span aria-hidden="true" className="text-oms-gray">
                |
              </span>
            ) : null}
            <Link
              href={href}
              hrefLang={item}
              lang={item}
              aria-current={isActive ? "true" : undefined}
              className={
                isActive
                  ? "font-semibold text-oms-burgundy"
                  : "font-medium text-oms-dark hover:text-oms-burgundy"
              }
            >
              {item === "en" ? labels.en : labels.ar}
            </Link>
          </span>
        );
      })}
    </nav>
  );
}
