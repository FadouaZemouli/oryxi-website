import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n/config";
import { locales } from "@/lib/i18n/config";
import { getDictionary, type Dictionary } from "@/lib/i18n/get-dictionary";
import { localizedHref } from "@/lib/i18n/path";
import {
  ogImage,
  pagePaths,
  siteName,
  siteOrigin,
  type PageKey,
} from "@/lib/seo/config";

export function absoluteUrl(pathname: string): string {
  return `${siteOrigin}${pathname}`;
}

export function localeUrl(locale: Locale, path: string): string {
  return absoluteUrl(localizedHref(locale, path));
}

export function languageAlternates(path: string) {
  const en = localeUrl("en", path);
  const ar = localeUrl("ar", path);

  return {
    en,
    ar,
    "x-default": en,
  };
}

export function ogLocale(locale: Locale): string {
  return locale === "ar" ? "ar_QA" : "en_QA";
}

function pageDescription(dict: Dictionary, page: PageKey): string {
  if (page === "home") {
    return dict.meta.siteDescription;
  }

  if (page === "about") {
    return dict.meta.aboutDescription;
  }

  if (page === "qcddServices") {
    return dict.meta.qcddServicesDescription;
  }

  return dict.placeholder.metaDescription;
}

export function buildPageMetadata(
  locale: Locale,
  page: PageKey,
): Metadata {
  const dict = getDictionary(locale);
  const path = pagePaths[page];
  const canonical = localeUrl(locale, path);
  const title = dict.meta[page];
  const description = pageDescription(dict, page);
  const languages = languageAlternates(path);
  const alternateLocale = locales
    .filter((item) => item !== locale)
    .map((item) => ogLocale(item));

  return {
    title,
    description,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      type: "website",
      siteName,
      locale: ogLocale(locale),
      alternateLocale,
      url: canonical,
      title,
      description,
      images: [ogImage],
    },
  };
}
