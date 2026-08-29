import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/ui/PagePlaceholder";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocaleParam } from "@/lib/i18n/locale-param";
import { buildPageMetadata } from "@/lib/seo/metadata";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await getLocaleParam(params);
  return buildPageMetadata(locale, "requestQuote");
}

export default async function RequestQuotePage({ params }: Props) {
  const locale = await getLocaleParam(params);
  const dict = getDictionary(locale);

  return (
    <PagePlaceholder
      title={dict.nav.requestQuote}
      description={dict.placeholder.description}
      comingSoon={dict.placeholder.comingSoon}
    />
  );
}
