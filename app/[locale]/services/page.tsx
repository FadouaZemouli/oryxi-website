import type { Metadata } from "next";
import { HowWeWork } from "@/components/services/HowWeWork";
import { ServicesCta } from "@/components/services/ServicesCta";
import { ServicesHero } from "@/components/services/ServicesHero";
import { ServicesNav } from "@/components/services/ServicesNav";
import { ServicesShowcase } from "@/components/services/ServicesShowcase";
import { WhyChooseOms } from "@/components/services/WhyChooseOms";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocaleParam } from "@/lib/i18n/locale-param";
import { buildPageMetadata } from "@/lib/seo/metadata";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await getLocaleParam(params);
  return buildPageMetadata(locale, "services");
}

export default async function ServicesPage({ params }: Props) {
  const locale = await getLocaleParam(params);
  const dict = getDictionary(locale);

  return (
    <main className="oms-services-page flex-1 bg-oms-white">
      <div className="oms-services-stage">
        <ServicesHero locale={locale} dict={dict} />
        <ServicesNav dict={dict} />
      </div>

      <ServicesShowcase locale={locale} dict={dict} />
      <HowWeWork locale={locale} dict={dict} />
      <WhyChooseOms locale={locale} dict={dict} />
      <ServicesCta locale={locale} dict={dict} />
    </main>
  );
}
