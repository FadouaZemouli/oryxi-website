"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import type { Locale } from "@/lib/i18n/config";

type NavLink = {
  href: string;
  label: string;
};

type MobileNavProps = {
  open: boolean;
  onClose: () => void;
  items: readonly NavLink[];
  quoteHref: string;
  quoteLabel: string;
  locale: Locale;
  languageLabels: {
    label: string;
    en: string;
    ar: string;
  };
  closeLabel: string;
  navLabel: string;
};

export function MobileNav({
  open,
  onClose,
  items,
  quoteHref,
  quoteLabel,
  locale,
  languageLabels,
  closeLabel,
  navLabel,
}: MobileNavProps) {
  const pathname = usePathname();

  return (
    <div className={`lg:hidden ${open ? "" : "hidden"}`}>
      <button
        type="button"
        className="fixed inset-0 z-40 bg-oms-dark/40"
        aria-label={closeLabel}
        onClick={onClose}
      />
      <nav
        id="mobile-navigation"
        aria-label={navLabel}
        className="relative z-50 border-t border-oms-gray/60 bg-oms-white"
      >
        <ul className="flex flex-col px-4 py-4 sm:px-6">
          {items.map((item) => {
            const isActive = pathname === item.href;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={`block py-3 text-base ${
                    isActive
                      ? "font-semibold text-oms-burgundy"
                      : "font-medium text-oms-dark"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="flex flex-col gap-4 border-t border-oms-gray/60 px-4 py-4 sm:px-6">
          <LanguageSwitcher locale={locale} labels={languageLabels} />
          <PrimaryButton href={quoteHref} className="w-full">
            {quoteLabel}
          </PrimaryButton>
        </div>
      </nav>
    </div>
  );
}
