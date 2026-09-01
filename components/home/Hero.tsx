import Image from "next/image";
import { Montserrat } from "next/font/google";
import { ExpertiseStrip } from "@/components/home/ExpertiseStrip";
import { Container } from "@/components/ui/Container";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/path";

const heroSans = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const HERO_VISUAL = {
  en: "/images/hero/oms-hero-engineering-team.png.png",
  ar: "/images/hero/oms-hero-engineering-team-ar.png.png",
} as const;

type HeroProps = {
  locale: Locale;
  dict: Dictionary;
};

export function Hero({ locale, dict }: HeroProps) {
  const servicesHref = localizedHref(locale, "/services");
  const quoteHref = localizedHref(locale, "/request-quote");

  return (
    <section
      className={`oms-hero ${heroSans.variable}`}
      aria-labelledby="oms-home-heading"
    >
      <div className="oms-hero-visual" aria-hidden="true">
        <Image
          src={HERO_VISUAL[locale]}
          alt=""
          fill
          priority
          sizes="(max-width: 767px) 1400px, 100vw"
          className="oms-hero-visual-image"
        />
      </div>

      <Container className="oms-hero-inner">
        <div className="oms-hero-layout">
          <div className="oms-hero-copy">
            <div className="oms-hero-brand" aria-hidden="true" />

            <p className="oms-hero-eyebrow">
              <span className="oms-hero-eyebrow-lead">
                {dict.home.hero.eyebrowLead}
              </span>
              <span className="oms-hero-eyebrow-trail">
                {dict.home.hero.eyebrowTrail}
              </span>
            </p>
            <h1 id="oms-home-heading" className="oms-hero-title">
              <span className="oms-hero-title-line">
                {dict.home.hero.titleLine1}
              </span>
              {dict.home.hero.titleLine2 ? (
                <span className="oms-hero-title-line">
                  {dict.home.hero.titleLine2}
                </span>
              ) : null}
              <span className="oms-hero-title-line">
                {dict.home.hero.titleLine3}
                {dict.home.hero.titleLine3 ? " " : null}
                <span className="oms-hero-title-accent">
                  {dict.home.hero.titleAccent}
                </span>
              </span>
              {dict.home.hero.titleLine4 ? (
                <span className="oms-hero-title-line">
                  {dict.home.hero.titleLine4}
                </span>
              ) : null}
            </h1>
            <p className="oms-hero-supporting">{dict.home.hero.supporting}</p>
            <div className="oms-hero-actions">
              <PrimaryButton href={servicesHref} className="oms-hero-cta">
                {dict.home.hero.ctaServices}
                <span className="oms-hero-cta-arrow" aria-hidden="true">
                  →
                </span>
              </PrimaryButton>
              <SecondaryButton
                href={quoteHref}
                tone="onDark"
                className="oms-hero-cta"
              >
                {dict.home.hero.ctaQuote}
                <span className="oms-hero-cta-arrow" aria-hidden="true">
                  →
                </span>
              </SecondaryButton>
            </div>
          </div>
        </div>
      </Container>

      <div className="oms-hero-indicator" aria-hidden="true">
        <span>01</span>
        <span className="oms-hero-indicator-line" />
        <span>30</span>
      </div>

      <ExpertiseStrip locale={locale} dict={dict} />
    </section>
  );
}
