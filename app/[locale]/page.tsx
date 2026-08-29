import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocaleParam } from "@/lib/i18n/locale-param";
import { localizedHref } from "@/lib/i18n/path";
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
    <main className="flex-1">
      <Container className="py-12 sm:py-16">
        <SectionHeading
          title={dict.home.title}
          description={dict.home.description}
        />

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Card title={dict.home.sharedLayoutTitle}>
            {dict.home.sharedLayoutBody}
          </Card>
          <Card title={dict.home.brandComponentsTitle}>
            {dict.home.brandComponentsBody}
          </Card>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <PrimaryButton href={localizedHref(locale, "/request-quote")}>
            {dict.nav.requestQuote}
          </PrimaryButton>
          <SecondaryButton href={localizedHref(locale, "/about")}>
            {dict.nav.about}
          </SecondaryButton>
        </div>
      </Container>
    </main>
  );
}
