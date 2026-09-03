import Image from "next/image";
import { Montserrat } from "next/font/google";
import { Container } from "@/components/ui/Container";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/path";

const ctaSans = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const ABOUT_CTA_IMAGE = "/images/footer/oms-fire-system-wide.jpg";

type AboutCtaProps = {
  locale: Locale;
  dict: Dictionary;
};

export function AboutCta({ locale, dict }: AboutCtaProps) {
  const copy = dict.aboutPage.cta;
  const quoteHref = localizedHref(locale, "/request-quote");
  const contactHref = localizedHref(locale, "/contact");

  return (
    <section
      className={`oms-about-cta ${ctaSans.variable}`}
      aria-labelledby="oms-about-cta-heading"
    >
      <div className="oms-about-cta-media" aria-hidden="true">
        <Image
          src={ABOUT_CTA_IMAGE}
          alt=""
          fill
          sizes="100vw"
          className="oms-about-cta-image"
        />
        <div className="oms-about-cta-overlay" />
      </div>

      <Container className="oms-about-cta-inner">
        <h2 id="oms-about-cta-heading" className="oms-about-cta-title">
          {copy.title}
        </h2>
        <p className="oms-about-cta-supporting">{copy.supporting}</p>
        <div className="oms-about-cta-actions">
          <PrimaryButton href={quoteHref}>{copy.quoteCta}</PrimaryButton>
          <SecondaryButton href={contactHref} tone="onDark">
            {copy.contactCta}
          </SecondaryButton>
        </div>
      </Container>
    </section>
  );
}