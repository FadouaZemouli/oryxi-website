"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { DesktopNav } from "@/components/layout/DesktopNav";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { MobileNav } from "@/components/layout/MobileNav";
import { Container } from "@/components/ui/Container";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/path";
import { navItems } from "@/lib/navigation";

type HeaderProps = {
  locale: Locale;
  dict: Dictionary;
};

export function Header({ locale, dict }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const homeHref = localizedHref(locale, "/");
  const quoteHref = localizedHref(locale, "/request-quote");
  const items = navItems.map((item) => ({
    href: localizedHref(locale, item.path),
    label: dict.nav[item.key],
  }));

  return (
    <header className="sticky top-0 z-50 border-b border-oms-gray/70 bg-oms-white">
      <Container className="relative z-50 flex items-center justify-between gap-3 bg-oms-white py-3">
        <Link
          href={homeHref}
          className="shrink-0"
          onClick={() => setMenuOpen(false)}
        >
          <Image
            src="/logos/oms-logo.png"
            alt="ORYXI Maintenance Services"
            width={913}
            height={600}
            className="h-10 w-auto sm:h-12"
            priority
          />
        </Link>

        <DesktopNav items={items} ariaLabel={dict.header.primaryNav} />

        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher locale={locale} labels={dict.language} />
          <PrimaryButton
            href={quoteHref}
            className="px-3 py-2 text-xs sm:px-4 sm:py-2.5 sm:text-sm"
          >
            {dict.nav.requestQuote}
          </PrimaryButton>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center border border-oms-gray text-oms-dark lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? dict.header.closeMenu : dict.header.openMenu}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span aria-hidden="true" className="flex flex-col gap-1.5">
              <span
                className={`block h-0.5 w-5 bg-oms-dark transition ${menuOpen ? "translate-y-2 rotate-45" : ""}`}
              />
              <span
                className={`block h-0.5 w-5 bg-oms-dark transition ${menuOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`block h-0.5 w-5 bg-oms-dark transition ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`}
              />
            </span>
          </button>
        </div>
      </Container>
      <MobileNav
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        items={items}
        quoteHref={quoteHref}
        quoteLabel={dict.nav.requestQuote}
        locale={locale}
        languageLabels={dict.language}
        closeLabel={dict.header.closeMenu}
        navLabel={dict.header.primaryNav}
      />
    </header>
  );
}
