import type { Metadata } from "next";
import { AboutOms } from "@/components/home/AboutOms";
import { CoreServices } from "@/components/home/CoreServices";
import { Hero } from "@/components/home/Hero";
import { ComplianceSection } from "@/components/home/ComplianceSection";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { OmsInNumbers } from "@/components/home/OmsInNumbers";
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
      <CoreServices locale={locale} dict={dict} />
      <AboutOms locale={locale} dict={dict} />
      <OmsInNumbers locale={locale} dict={dict} />
      <ComplianceSection locale={locale} dict={dict} />
      <FeaturedProjects locale={locale} dict={dict} />
    </main>
  );
}
