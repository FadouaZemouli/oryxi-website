import type { Metadata } from "next";
import { QuoteRequestForm } from "@/components/quote/QuoteRequestForm";
import { Container } from "@/components/ui/Container";
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
    <main className="flex-1">
      <Container className="py-12 sm:py-16">
        <header className="text-start">
          <h1 className="text-2xl font-semibold tracking-tight text-oms-dark sm:text-3xl">
            {dict.quote.title}
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-oms-dark/80">
            {dict.quote.description}
          </p>
        </header>
        <QuoteRequestForm copy={dict.quote} />
      </Container>
    </main>
  );
}
