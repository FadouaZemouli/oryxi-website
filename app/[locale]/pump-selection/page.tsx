import type { Metadata } from "next";
import { PeerlessIntro } from "@/components/pump-selection/PeerlessIntro";
import { PumpAward } from "@/components/pump-selection/PumpAward";
import { PumpCta } from "@/components/pump-selection/PumpCta";
import { PumpProducts } from "@/components/pump-selection/PumpProducts";
import { PumpSelectionHero } from "@/components/pump-selection/PumpSelectionHero";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocaleParam } from "@/lib/i18n/locale-param";
import { buildPageMetadata } from "@/lib/seo/metadata";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await getLocaleParam(params);
  return buildPageMetadata(locale, "pumpSelection");
}

export default async function PumpSelectionPage({ params }: Props) {
  const locale = await getLocaleParam(params);
  const dict = getDictionary(locale);

  return (
    <main className="oms-pump-selection-page flex-1 bg-oms-white">
      <PumpSelectionHero locale={locale} dict={dict} />
      <PeerlessIntro dict={dict} />
      <PumpProducts dict={dict} />
      <PumpAward dict={dict} />
      <PumpCta locale={locale} dict={dict} />
    </main>
  );
}
