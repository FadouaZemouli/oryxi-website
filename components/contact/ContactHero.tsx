import Image from "next/image";
import { Montserrat } from "next/font/google";
import { Container } from "@/components/ui/Container";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

const contactHeroSans = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const HERO_IMAGE_SRC = "/images/contact/contact-hero.png";

type ContactHeroProps = {
  locale: Locale;
  dict: Dictionary;
};

export function ContactHero({ locale, dict }: ContactHeroProps) {
  const copy = dict.contactPage.hero;

  return (
    <section
      className={`oms-contact-hero ${contactHeroSans.variable}`}
      aria-labelledby="oms-contact-hero-heading"
      data-locale={locale}
    >
      <div className="oms-contact-hero-media" aria-hidden="true">
        <Image
          src={HERO_IMAGE_SRC}
          alt=""
          fill
          priority
          sizes="100vw"
          className="oms-contact-hero-image"
        />
        <div className="oms-contact-hero-overlay" />
      </div>

      <Container className="oms-contact-hero-inner">
        <div className="oms-contact-hero-copy">
          <p className="oms-contact-hero-eyebrow">{copy.eyebrow}</p>
          <h1 id="oms-contact-hero-heading" className="oms-contact-hero-title">
            <span className="oms-contact-hero-title-lead">{copy.titleLead}</span>
            {copy.titleLead ? " " : null}
            <span className="oms-contact-hero-title-accent">{copy.titleAccent}</span>
          </h1>
          <p className="oms-contact-hero-description">{copy.description}</p>
        </div>

        <p className="oms-contact-hero-statement">
          {copy.statement.map((line) => (
            <span key={line} className="oms-contact-hero-statement-line">
              {line}
            </span>
          ))}
        </p>
      </Container>
    </section>
  );
}
