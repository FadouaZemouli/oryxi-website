import { Container } from "@/components/ui/Container";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/path";

type HeroProps = {
  locale: Locale;
  dict: Dictionary;
};

export function Hero({ locale, dict }: HeroProps) {
  const servicesHref = localizedHref(locale, "/services");
  const quoteHref = localizedHref(locale, "/request-quote");

  return (
    <section className="oms-hero" aria-labelledby="oms-home-heading">
      <Container className="oms-hero-inner">
        <div className="oms-hero-frame">
          <div className="oms-hero-copy">
            <div className="oms-hero-rule" aria-hidden="true" />
            <h1 id="oms-home-heading" className="oms-hero-title">
              <span className="oms-hero-title-line">
                {dict.home.hero.titleLine1}
              </span>
              <span className="oms-hero-title-line">
                {dict.home.hero.titleLine2}
              </span>
            </h1>
            <p className="oms-hero-supporting">{dict.home.hero.supporting}</p>
            <div className="oms-hero-actions">
              <SecondaryButton tone="onDark" href={servicesHref}>
                {dict.home.hero.ctaServices}
              </SecondaryButton>
              <PrimaryButton href={quoteHref}>
                {dict.nav.requestQuote}
              </PrimaryButton>
            </div>
          </div>
        </div>
      </Container>
      <div className="oms-hero-schematic" aria-hidden="true">
        <span className="oms-hero-schematic-ring oms-hero-schematic-ring-outer" />
        <span className="oms-hero-schematic-ring oms-hero-schematic-ring-mid" />
        <span className="oms-hero-schematic-ring oms-hero-schematic-ring-inner" />
        <span className="oms-hero-schematic-arc" />
        <span className="oms-hero-schematic-axis oms-hero-schematic-axis-x" />
        <span className="oms-hero-schematic-axis oms-hero-schematic-axis-y" />
        <span className="oms-hero-schematic-core" />
      </div>
    </section>
  );
}
