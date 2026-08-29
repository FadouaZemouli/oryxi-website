import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/config";
import { pagePaths } from "@/lib/seo/config";
import { languageAlternates, localeUrl } from "@/lib/seo/metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.flatMap((locale) =>
    Object.values(pagePaths).map((path) => ({
      url: localeUrl(locale, path),
      alternates: {
        languages: languageAlternates(path),
      },
    })),
  );
}
