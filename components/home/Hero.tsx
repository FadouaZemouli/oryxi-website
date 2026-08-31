import Image from "next/image";
import Link from "next/link";
import { ExpertiseStrip } from "@/components/home/ExpertiseStrip";
import { Container } from "@/components/ui/Container";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/path";

const HERO_ART = {
  src: "/images/hero/hero-fire-pump.png",
  width: 1484,
  height: 1060,
} as const;

const HERO_LOGO = {
  src: "/logos/oms-logo-transparent.png",
  width: 1672,
  height: 941,
} as const;

type HeroProps = {
  locale: Locale;
  dict: Dictionary;
};

export function Hero({ locale, dict }: HeroProps) {
  const homeHref = localizedHref(locale, "/");
  const servicesHref = localizedHref(locale, "/services");
  const quoteHref = localizedHref(locale, "/request-quote");

  return (
    <section className="oms-hero" aria-labelledby="oms-home-heading">
      <div className="oms-hero-canvas" aria-hidden="true" />

      <Container className="oms-hero-inner">
        <div className="oms-hero-layout">
          <div className="oms-hero-copy">
            <div className="oms-hero-brand">
              <Link href={homeHref} className="oms-hero-brand-link">
                <Image
                  src={HERO_LOGO.src}
                  alt="ORYXI Maintenance Services"
                  width={HERO_LOGO.width}
                  height={HERO_LOGO.height}
                  priority
                  sizes="(min-width: 1440px) 500px, (min-width: 1280px) 460px, 420px"
                  className="oms-hero-brand-mark"
                />
              </Link>
            </div>

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
              <span className="oms-hero-title-line oms-hero-title-accent">
                {dict.home.hero.titleLine2}
              </span>
              <span className="oms-hero-title-line">
                {dict.home.hero.titleLine3}
              </span>
              <span className="oms-hero-title-line">
                {dict.home.hero.titleLine4}
              </span>
            </h1>
            <p className="oms-hero-supporting">{dict.home.hero.supporting}</p>
            <div className="oms-hero-actions">
              <PrimaryButton href={servicesHref} className="oms-hero-cta">
                {dict.home.hero.ctaServices}
                <span className="oms-hero-cta-arrow" aria-hidden="true">
                  →
                </span>
              </PrimaryButton>
              <SecondaryButton href={quoteHref} className="oms-hero-cta">
                {dict.nav.requestQuote}
                <span className="oms-hero-cta-arrow" aria-hidden="true">
                  →
                </span>
              </SecondaryButton>
            </div>
          </div>

          <div className="oms-hero-visual">
            <Image
              src={HERO_ART.src}
              alt={dict.home.hero.artLabel}
              width={HERO_ART.width}
              height={HERO_ART.height}
              priority
              sizes="(min-width: 1024px) 64vw, 100vw"
              className="oms-hero-art"
            />
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
