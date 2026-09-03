import type { Metadata } from "next";
import { AboutCta } from "@/components/about/AboutCta";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutNumbers } from "@/components/about/AboutNumbers";
import { IsoCertification } from "@/components/about/IsoCertification";
import { OurValues } from "@/components/about/OurValues";
import { QcddCompliance } from "@/components/about/QcddCompliance";
import { WhoWeAre } from "@/components/about/WhoWeAre";
import { WhyOms } from "@/components/about/WhyOms";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocaleParam } from "@/lib/i18n/locale-param";
import { buildPageMetadata } from "@/lib/seo/metadata";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await getLocaleParam(params);
  return buildPageMetadata(locale, "about");
}

export default async function AboutPage({ params }: Props) {
  const locale = await getLocaleParam(params);
  const dict = getDictionary(locale);

  return (
    <main className="flex-1 bg-oms-white">
      <AboutHero dict={dict} />
      <WhoWeAre dict={dict} />
      <AboutNumbers dict={dict} />
      <OurValues dict={dict} />
      <QcddCompliance dict={dict} />
      <IsoCertification dict={dict} />
      <WhyOms dict={dict} />
      <AboutCta locale={locale} dict={dict} />
    </main>
  );
}
