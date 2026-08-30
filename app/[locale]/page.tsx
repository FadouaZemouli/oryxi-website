import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
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
      {/* Phase 1 scaffold — replace with components/home/* in Phase 2 */}
      <Container className="oms-section">
        <header className="text-start">
          <h1 className="text-2xl font-semibold tracking-tight text-oms-dark sm:text-3xl">
            {dict.home.title}
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-oms-dark/80">
            {dict.home.description}
          </p>
        </header>

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
