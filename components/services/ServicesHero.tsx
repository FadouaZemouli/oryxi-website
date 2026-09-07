import Image from "next/image";
import { Montserrat } from "next/font/google";
import { Container } from "@/components/ui/Container";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

const servicesHeroSans = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const HERO_IMAGE_SRC = "/images/Services/services-hero-engineers.png";

type ServicesHeroProps = {
  locale: Locale;
  dict: Dictionary;
};

export function ServicesHero({ locale, dict }: ServicesHeroProps) {
  const copy = dict.servicesPage.hero;

  return (
    <section
      className={`oms-services-hero ${servicesHeroSans.variable}`}
      aria-labelledby="oms-services-hero-heading"
      data-locale={locale}
    >
      <div className="oms-services-hero-media" aria-hidden="true">
        <Image
          src={HERO_IMAGE_SRC}
          alt=""
          fill
          priority
          sizes="100vw"
          className="oms-services-hero-image"
        />
        <div className="oms-services-hero-overlay" />
      </div>

      <Container className="oms-services-hero-inner">
        <div className="oms-services-hero-copy">
          <p className="oms-services-hero-eyebrow">{copy.eyebrow}</p>
          <h1 id="oms-services-hero-heading" className="oms-services-hero-title">
            <span className="oms-services-hero-title-line">{copy.titleLine1}</span>
            <span className="oms-services-hero-title-line oms-services-hero-title-accent">
              {copy.titleAccent}
            </span>
          </h1>
          <p className="oms-services-hero-supporting">{copy.supporting}</p>
          <a href="#services-nav" className="oms-services-hero-cta">
            {copy.cta}
            <span className="oms-services-hero-cta-arrow" aria-hidden="true">
              →
            </span>
          </a>
        </div>
      </Container>
    </section>
  );
}
