import Image from "next/image";
import { Montserrat } from "next/font/google";
import { SmoothHashLink } from "@/components/pump-selection/SmoothHashLink";
import { Container } from "@/components/ui/Container";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/path";

const pumpHeroSans = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const HERO_IMAGE_SRC = "/images/pump-selection/peerless-pump-hero.png";
const HERO_IMAGE_SRC_AR = "/images/pump-selection/peerless-pump-hero-ar.png";

type PumpSelectionHeroProps = {
  locale: Locale;
  dict: Dictionary;
};

export function PumpSelectionHero({ locale, dict }: PumpSelectionHeroProps) {
  const copy = dict.pumpSelectionPage.hero;
  const quoteHref = localizedHref(locale, "/request-quote");
  const heroImageSrc = locale === "ar" ? HERO_IMAGE_SRC_AR : HERO_IMAGE_SRC;

  return (
    <section
      className={`oms-pump-hero ${pumpHeroSans.variable}`}
      aria-labelledby="oms-pump-hero-heading"
      data-locale={locale}
    >
      <div className="oms-pump-hero-media">
        <Image
          src={heroImageSrc}
          alt={copy.imageAlt}
          fill
          priority
          sizes="100vw"
          className="oms-pump-hero-image"
        />
        <div className="oms-pump-hero-overlay" aria-hidden="true" />
      </div>

      <Container className="oms-pump-hero-inner">
        <div className="oms-pump-hero-copy">
          <p className="oms-pump-hero-eyebrow">{copy.eyebrow}</p>
          <span className="oms-pump-hero-rule" aria-hidden="true" />

          <h1 id="oms-pump-hero-heading" className="oms-pump-hero-title">
            <span className="oms-pump-hero-title-line">{copy.titleLine1}</span>
            <span className="oms-pump-hero-title-line">{copy.titleLine2}</span>
            <span className="oms-pump-hero-title-line oms-pump-hero-title-accent">
              {copy.titleAccent}
            </span>
          </h1>

          <p className="oms-pump-hero-supporting">{copy.supporting}</p>

          <div className="oms-pump-hero-actions">
            <SmoothHashLink
              href="#pump-products"
              className="oms-pump-hero-cta oms-pump-hero-cta-primary"
            >
              {copy.primaryCta}
              <span className="oms-pump-hero-cta-arrow" aria-hidden="true">
                →
              </span>
            </SmoothHashLink>

            <SecondaryButton
              href={quoteHref}
              tone="onDark"
              className="oms-pump-hero-cta oms-pump-hero-cta-secondary"
            >
              {copy.secondaryCta}
            </SecondaryButton>
          </div>
        </div>
      </Container>
    </section>
  );
}
