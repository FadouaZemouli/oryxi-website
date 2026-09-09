import { isLocale, type Locale } from "@/lib/i18n/config";

export const CONTACT_FORM_PATH = "/contact#contact-form";

export function localizedHref(locale: Locale, path: string): string {
  if (path === "/") {
    return `/${locale}`;
  }

  return `/${locale}${path}`;
}

export function localizedContactFormHref(locale: Locale): string {
  return localizedHref(locale, CONTACT_FORM_PATH);
}

export function switchLocalePath(pathname: string, nextLocale: Locale): string {
  const segments = pathname.split("/");
  const current = segments[1];

  if (current && isLocale(current)) {
    segments[1] = nextLocale;
    const nextPath = segments.join("/");
    return nextPath === "" ? `/${nextLocale}` : nextPath;
  }

  if (pathname === "/") {
    return `/${nextLocale}`;
  }

  return `/${nextLocale}${pathname}`;
}
