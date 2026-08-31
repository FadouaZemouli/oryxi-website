import type { Metadata } from "next";
import { AboutTeaser } from "@/components/home/AboutTeaser";
import { Hero } from "@/components/home/Hero";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocaleParam } from "@/lib/i18n/locale-param";
import { buildPageMetadata } from "@/lib/seo/metadata";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await getLocaleParam(params);
  return buildPageMetadata(locale, "home");
}

export default async function Home({ params }: Props) {
  const locale = await getLocaleParam(params);
  const dict = getDictionary(locale);

  return (
    <main className="flex-1 bg-oms-white">
      <Hero locale={locale} dict={dict} />
      <AboutTeaser locale={locale} dict={dict} />
    </main>
  );
}
