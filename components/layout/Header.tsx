"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
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

const TRAVELING_LOGO = {
  src: "/logos/oms-logo-transparent.png",
  width: 1672,
  height: 941,
} as const;

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
  // Path sync and logo-travel listeners share one effect so the dependency
  // array size/order never changes across renders or Fast Refresh.
  useEffect(() => {
    syncHeaderPathAttributes(pathname, locale);

    const root = document.documentElement;
    const range = 280;
    const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktopQuery = window.matchMedia("(min-width: 1024px)");
    let raf = 0;

    const measureLogoTravel = () => {
      const logo = document.querySelector<HTMLElement>(".oms-hero-brand-link");
      const slot = document.querySelector<HTMLElement>(".oms-header-logo-link");
      const canTravel =
        root.dataset.omsHeader === "home" &&
        desktopQuery.matches &&
        logo !== null &&
        slot !== null;

      if (!canTravel || !logo || !slot) {
        root.style.setProperty("--oms-logo-dx", "0px");
        root.style.setProperty("--oms-logo-dy", "0px");
        return;
      }

      const previousTransform = logo.style.transform;
      logo.style.transform = "none";
      const start = logo.getBoundingClientRect();
      const end = slot.getBoundingClientRect();
      logo.style.transform = previousTransform;

      if (start.width < 1 || end.width < 1) {
        root.style.setProperty("--oms-logo-dx", "0px");
        root.style.setProperty("--oms-logo-dy", "0px");
        return;
      }

      root.style.setProperty(
        "--oms-logo-dx",
        `${(end.left - start.left).toFixed(2)}px`,
      );
      root.style.setProperty(
        "--oms-logo-dy",
        `${(end.top - start.top).toFixed(2)}px`,
      );
    };

    const syncScroll = () => {
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

    const onScroll = () => {
      if (raf) {
        return;
      }

      raf = window.requestAnimationFrame(() => {
        syncScroll();
        raf = 0;
      });
    };

    const onReflow = () => {
      measureLogoTravel();
      syncScroll();
    };

    measureLogoTravel();
    syncScroll();

    reduceQuery.addEventListener("change", onReflow);
    desktopQuery.addEventListener("change", onReflow);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onReflow, { passive: true });

    const slot = document.querySelector(".oms-header-logo-link");
    const observer = new ResizeObserver(onReflow);
    observer.observe(root);
    if (slot) {
      observer.observe(slot);
    }

    return () => {
      if (raf) {
        window.cancelAnimationFrame(raf);
      }

      reduceQuery.removeEventListener("change", onReflow);
      desktopQuery.removeEventListener("change", onReflow);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onReflow);
      observer.disconnect();
    };
  }, [pathname, locale]);

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
    <header className="oms-site-header sticky top-0 z-50 overflow-visible border-b">
      <Link href={homeHref} className="oms-hero-brand-link">
        <Image
          src={TRAVELING_LOGO.src}
          alt="ORYXI Maintenance Services"
          width={TRAVELING_LOGO.width}
          height={TRAVELING_LOGO.height}
          priority
          sizes="(min-width: 1440px) 500px, (min-width: 1280px) 460px, 420px"
          className="oms-hero-brand-mark"
        />
      </Link>
      <Container className="oms-site-header-bar relative flex items-center justify-between gap-3">
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
