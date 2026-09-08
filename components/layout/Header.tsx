"use client";

import { useLayoutEffect, useState } from "react";
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
import {
  applyHeaderPathAttributes,
  isHomePath,
} from "@/lib/layout/header-state";
import {
  LOGO_DESKTOP_MQ,
  LOGO_ORIGIN_SELECTOR,
  LOGO_REDUCED_MOTION_MQ,
  LOGO_SLOT_SELECTOR,
  consumeRememberedScroll,
  clearRememberedScroll,
  measureLogoTravel,
  setLogoTravelOwned,
  syncLogoScrollProgress,
} from "@/lib/layout/logo-travel";
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

export function Header({ locale, dict }: HeaderProps) {
  const pathname = normalizePathname(usePathname());
  const [menuOpen, setMenuOpen] = useState(false);
  const homeHref = localizedHref(locale, "/");
  const quoteHref = localizedHref(locale, "/request-quote");

  useLayoutEffect(() => {
    const root = document.documentElement;
    const isHome = isHomePath(pathname, locale);
    const reduceQuery = window.matchMedia(LOGO_REDUCED_MOTION_MQ);
    const desktopQuery = window.matchMedia(LOGO_DESKTOP_MQ);
    const visualViewport = window.visualViewport;
    const observer = new ResizeObserver(() => {
      onReflow();
    });
    const attrObserver = new MutationObserver(onReflow);

    let cancelled = false;
    let scrollRaf = 0;
    let reflowRaf = 0;
    let bootRaf = 0;
    let pendingRaf = 0;
    let pendingAttempts = 0;
    let observedOrigin: Element | null = null;
    let observedSlot: Element | null = null;
    let observedMain: Element | null = null;

    setLogoTravelOwned(true);
    consumeRememberedScroll();
    applyHeaderPathAttributes(pathname, locale);

    const bindMeasuredSlots = () => {
      const origin = document.querySelector(LOGO_ORIGIN_SELECTOR);
      const slot = document.querySelector(LOGO_SLOT_SELECTOR);
      const main = document.querySelector("main");

      if (
        origin === observedOrigin &&
        slot === observedSlot &&
        main === observedMain
      ) {
        return;
      }

      observer.disconnect();
      observedOrigin = origin;
      observedSlot = slot;
      observedMain = main;

      if (origin) {
        observer.observe(origin);
      }
      if (slot) {
        observer.observe(slot);
      }
      if (main) {
        observer.observe(main);
      }
    };

    const applyLogoTravel = () => {
      if (cancelled) {
        return;
      }

      consumeRememberedScroll();
      applyHeaderPathAttributes(pathname, locale);
      syncLogoScrollProgress(root, isHome);
      const result = measureLogoTravel(root);
      bindMeasuredSlots();

      if (result === "pending" && pendingAttempts < 16) {
        pendingAttempts += 1;
        if (!pendingRaf) {
          pendingRaf = window.requestAnimationFrame(() => {
            pendingRaf = 0;
            applyLogoTravel();
          });
        }
        return;
      }

      if (result === "applied") {
        pendingAttempts = 0;
      }
    };

    const onScroll = () => {
      if (scrollRaf) {
        return;
      }

      scrollRaf = window.requestAnimationFrame(() => {
        syncLogoScrollProgress(root, isHome);
        scrollRaf = 0;
      });
    };

    function onReflow() {
      if (reflowRaf) {
        return;
      }

      reflowRaf = window.requestAnimationFrame(() => {
        applyLogoTravel();
        reflowRaf = 0;
      });
    }

    applyLogoTravel();
    bootRaf = window.requestAnimationFrame(() => {
      if (cancelled) {
        return;
      }

      consumeRememberedScroll();
      applyLogoTravel();
      bootRaf = window.requestAnimationFrame(() => {
        if (cancelled) {
          return;
        }

        consumeRememberedScroll();
        applyLogoTravel();
        clearRememberedScroll();
        bootRaf = 0;
      });
    });

    reduceQuery.addEventListener("change", onReflow);
    desktopQuery.addEventListener("change", onReflow);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onReflow, { passive: true });
    window.addEventListener("orientationchange", onReflow);
    window.addEventListener("pageshow", applyLogoTravel);
    window.addEventListener("popstate", applyLogoTravel);
    window.addEventListener("load", applyLogoTravel);
    visualViewport?.addEventListener("resize", onReflow);
    attrObserver.observe(root, {
      attributes: true,
      attributeFilter: ["dir", "lang"],
    });
    bindMeasuredSlots();

    document.fonts?.ready
      .then(() => {
        if (!cancelled) {
          onReflow();
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      setLogoTravelOwned(false);

      if (scrollRaf) {
        window.cancelAnimationFrame(scrollRaf);
      }
      if (reflowRaf) {
        window.cancelAnimationFrame(reflowRaf);
      }
      if (bootRaf) {
        window.cancelAnimationFrame(bootRaf);
      }
      if (pendingRaf) {
        window.cancelAnimationFrame(pendingRaf);
      }

      reduceQuery.removeEventListener("change", onReflow);
      desktopQuery.removeEventListener("change", onReflow);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onReflow);
      window.removeEventListener("orientationchange", onReflow);
      window.removeEventListener("pageshow", applyLogoTravel);
      window.removeEventListener("popstate", applyLogoTravel);
      window.removeEventListener("load", applyLogoTravel);
      visualViewport?.removeEventListener("resize", onReflow);
      observer.disconnect();
      attrObserver.disconnect();
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
