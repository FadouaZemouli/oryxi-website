import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
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
  return buildPageMetadata(locale, "qcddServices");
}

export default async function QcddServicesPage({ params }: Props) {
  const locale = await getLocaleParam(params);
  const dict = getDictionary(locale);
  const quoteHref = localizedHref(locale, "/request-quote");
  const whoWeSupport = [
    dict.qcdd.buildings,
    dict.qcdd.towers,
    dict.qcdd.warehouses,
    dict.qcdd.otherFacilities,
  ];
  const howWeSupport = [
    dict.qcdd.applicationSupport,
    dict.qcdd.documentationSupport,
    dict.qcdd.processFollowUp,
    dict.qcdd.certificateCoordination,
  ];

  return (
    <main className="flex-1">
      <Container className="py-12 sm:py-16">
        <header className="text-start">
          <h1 className="text-2xl font-semibold tracking-tight text-oms-dark sm:text-3xl">
            {dict.qcdd.title}
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-oms-dark/80">
            {dict.qcdd.intro}
          </p>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-oms-dark/70">
            {dict.qcdd.issuerNote}
          </p>
        </header>

        <section className="mt-12" aria-label={dict.qcdd.whoTitle}>
          <SectionHeading title={dict.qcdd.whoTitle} />
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {whoWeSupport.map((item) => (
              <li key={item}>
                <Card title={item} />
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12" aria-label={dict.qcdd.howTitle}>
          <SectionHeading title={dict.qcdd.howTitle} />
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {howWeSupport.map((item) => (
              <li key={item}>
                <Card title={item} />
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-10">
          <PrimaryButton href={quoteHref}>{dict.qcdd.cta}</PrimaryButton>
        </div>
      </Container>
    </main>
  );
}
