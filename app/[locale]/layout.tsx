import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_Arabic } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { localeDir, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocaleParam } from "@/lib/i18n/locale-param";
import { ogImage, siteName } from "@/lib/seo/config";
import { ogLocale } from "@/lib/seo/metadata";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoArabic = Noto_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
});

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: LocaleLayoutProps): Promise<Metadata> {
  const locale = await getLocaleParam(params);
  const dict = getDictionary(locale);

  return {
    title: dict.meta.home,
    description: dict.meta.siteDescription,
    openGraph: {
      type: "website",
      siteName,
      locale: ogLocale(locale),
      images: [ogImage],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const locale = await getLocaleParam(params);
  const dict = getDictionary(locale);
  const dir = localeDir(locale);

  return (
    <html
      lang={locale}
      dir={dir}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${notoArabic.variable} h-full antialiased ${
        locale === "ar" ? "font-[family-name:var(--font-arabic)]" : ""
      }`}
    >
      <body className="min-h-full flex flex-col bg-oms-white text-oms-dark">
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var l=${JSON.stringify(locale)};var p=location.pathname.replace(/\\/$/,"")||"/";var r=document.documentElement;r.setAttribute("data-oms-header",p==="/"+l?"home":"inner");r.setAttribute("data-oms-path",p);})();`,
          }}
        />
        <Header locale={locale} dict={dict} />
        {children}
        <Footer locale={locale} dict={dict} />
      </body>
    </html>
  );
}
