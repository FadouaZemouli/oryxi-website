"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DesktopNav, type DesktopNavItem } from "@/components/layout/DesktopNav";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { MobileNav, type MobileNavItem } from "@/components/layout/MobileNav";
import { SiteLogo } from "@/components/layout/SiteLogo";
import { Container } from "@/components/ui/Container";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/path";
import { primaryNavItems } from "@/lib/navigation";

type HeaderProps = {
  locale: Locale;
  dict: Dictionary;
};

function normalizePathname(pathname: string) {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }

  return pathname;
}

function syncHeaderPathAttributes(pathname: string, locale: Locale) {
  const root = document.documentElement;
  const isHome = pathname === `/${locale}`;
  root.dataset.omsHeader = isHome ? "home" : "inner";
  root.dataset.omsPath = pathname;
}

export function Header({ locale, dict }: HeaderProps) {
  const pathname = normalizePathname(usePathname());
  const [menuOpen, setMenuOpen] = useState(false);
  const homeHref = localizedHref(locale, "/");
  const quoteHref = localizedHref(locale, "/request-quote");

  // Keep React markup pathname-stable for chrome classes. Sync document
  // attributes after mount / on client navigations for CSS variants.
  useEffect(() => {
    syncHeaderPathAttributes(pathname, locale);
  }, [pathname, locale]);

  useEffect(() => {
    const range = 180;
    const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const syncScroll = () => {
      const root = document.documentElement;
      const y = window.scrollY;
      const reduce = reduceQuery.matches;
      const progress = reduce
        ? y > 8
          ? 1
          : 0
        : Math.min(1, Math.max(0, y / range));

      root.dataset.omsScrolled = progress > 0.08 ? "true" : "false";
      root.style.setProperty("--oms-logo-progress", progress.toFixed(4));
    };

    syncScroll();
    reduceQuery.addEventListener("change", syncScroll);
    window.addEventListener("scroll", syncScroll, { passive: true });
    return () => {
      reduceQuery.removeEventListener("change", syncScroll);
      window.removeEventListener("scroll", syncScroll);
    };
  }, []);

  const navItems: DesktopNavItem[] = primaryNavItems.map((item) => {
    const label =
      item.key === "about"
        ? dict.header.navAbout
        : item.key === "contact"
          ? dict.header.navContact
          : dict.nav[item.key];

    return {
      href: localizedHref(locale, item.path),
      label,
    };
  });

  const mobileItems: MobileNavItem[] = navItems;

  return (
    <header className="oms-site-header sticky top-0 z-50 border-b">
      <Container className="oms-site-header-bar relative z-50 flex items-center justify-between gap-3">
        <Link
          href={homeHref}
          className="oms-header-logo-link shrink-0"
          onClick={() => setMenuOpen(false)}
        >
          <SiteLogo
            surface="header"
            priority
            sizes="180px"
            className="oms-header-logo"
          />
        </Link>

        <div className="oms-header-tools flex items-center gap-2 sm:gap-3 lg:gap-6">
          <DesktopNav
            items={navItems}
            ariaLabel={dict.header.primaryNav}
            pathname={pathname}
          />

          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSwitcher
              locale={locale}
              labels={dict.language}
              pathname={pathname}
            />
            <PrimaryButton
              href={quoteHref}
              className="px-3 py-2 text-xs sm:px-4 sm:py-2.5 sm:text-sm"
            >
              {dict.nav.requestQuote}
            </PrimaryButton>
            <button
              type="button"
              className="oms-header-menu-btn inline-flex h-10 w-10 items-center justify-center border lg:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              aria-label={menuOpen ? dict.header.closeMenu : dict.header.openMenu}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span aria-hidden="true" className="flex flex-col gap-1.5">
                <span
                  className={`oms-header-menu-icon block h-0.5 w-5 transition ${menuOpen ? "translate-y-2 rotate-45" : ""}`}
                />
                <span
                  className={`oms-header-menu-icon block h-0.5 w-5 transition ${menuOpen ? "opacity-0" : ""}`}
                />
                <span
                  className={`oms-header-menu-icon block h-0.5 w-5 transition ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`}
                />
              </span>
            </button>
          </div>
        </div>
      </Container>
      <MobileNav
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        items={mobileItems}
        quoteHref={quoteHref}
        quoteLabel={dict.nav.requestQuote}
        locale={locale}
        languageLabels={dict.language}
        closeLabel={dict.header.closeMenu}
        navLabel={dict.header.primaryNav}
        pathname={pathname}
      />
    </header>
  );
}
