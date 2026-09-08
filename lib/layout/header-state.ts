import type { Locale } from "@/lib/i18n/config";

/** Inner routes whose first band is a tucked dark Hero under the sticky header. */
export const INNER_HERO_PATHS = [
  "/about",
  "/services",
  "/pump-selection",
  "/projects",
] as const;

export function localePathSuffix(pathname: string, locale: Locale) {
  const prefix = `/${locale}`;

  if (pathname === prefix) {
    return "/";
  }

  if (pathname.startsWith(`${prefix}/`)) {
    return pathname.slice(prefix.length);
  }

  return pathname;
}

export function isHomePath(pathname: string, locale: Locale) {
  return localePathSuffix(pathname, locale) === "/";
}

export function isInnerHeroPath(pathname: string, locale: Locale) {
  const suffix = localePathSuffix(pathname, locale);
  return (INNER_HERO_PATHS as readonly string[]).includes(suffix);
}

export function applyHeaderPathAttributes(pathname: string, locale: Locale) {
  const root = document.documentElement;
  root.dataset.omsHeader = isHomePath(pathname, locale) ? "home" : "inner";
  root.dataset.omsPath = pathname;
  root.dataset.omsHero = isInnerHeroPath(pathname, locale) ? "true" : "false";
}
