"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import type { Locale } from "@/lib/i18n/config";

export type MobileNavLink = {
  href: string;
  label: string;
};

export type MobileNavItem =
  | { type: "link"; href: string; label: string }
  | {
      type: "group";
      label: string;
      children: readonly MobileNavLink[];
    };

type MobileNavProps = {
  open: boolean;
  onClose: () => void;
  items: readonly MobileNavItem[];
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
            if (item.type === "group") {
              return (
                <li key={item.label} className="py-1">
                  <p className="pt-2 pb-1 text-sm font-semibold text-oms-burgundy">
                    {item.label}
                  </p>
                  <ul className="border-s border-oms-gray/60 ps-4">
                    {item.children.map((child) => {
                      const isActive = pathname === child.href;

                      return (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            onClick={onClose}
                            className={`block py-2.5 text-base ${
                              isActive
                                ? "font-semibold text-oms-burgundy"
                                : "font-medium text-oms-dark"
                            }`}
                          >
                            {child.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              );
            }

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
