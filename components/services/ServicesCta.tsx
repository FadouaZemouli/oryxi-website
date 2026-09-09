import Image from "next/image";
import Link from "next/link";
import { Montserrat } from "next/font/google";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { localizedContactFormHref } from "@/lib/i18n/path";

const servicesCtaSans = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const CTA_IMAGE_SRC = "/images/Services/cta/qatar-towers-cta.png";

type ServicesCtaProps = {
  locale: Locale;
  dict: Dictionary;
};

export function ServicesCta({ locale, dict }: ServicesCtaProps) {
  const copy = dict.servicesPage.cta;
  const quoteHref = localizedContactFormHref(locale);

  return (
    <section
      id="services-cta"
      className={`oms-services-cta ${servicesCtaSans.variable}`}
      aria-labelledby="oms-services-cta-heading"
      data-locale={locale}
    >
      <div className="oms-services-cta-layout">
        <div className="oms-services-cta-media">
          <Image
            src={CTA_IMAGE_SRC}
            alt={copy.imageAlt}
            fill
            sizes="(max-width: 1023px) 100vw, 55vw"
            className="oms-services-cta-image"
            priority={false}
          />
          <div className="oms-services-cta-transition" aria-hidden="true" />
        </div>

        <div className="oms-services-cta-content">
          <p className="oms-services-cta-eyebrow">{copy.eyebrow}</p>
          <h2 id="oms-services-cta-heading" className="oms-services-cta-title">
            <span className="oms-services-cta-title-line">{copy.titleLine1}</span>
            <span className="oms-services-cta-title-line">{copy.titleLine2}</span>
          </h2>
          <span className="oms-services-cta-rule" aria-hidden="true" />
          <p className="oms-services-cta-supporting">{copy.supporting}</p>
          <Link href={quoteHref} className="oms-services-cta-button">
            <span>{copy.cta}</span>
            <span className="oms-services-cta-button-arrow" aria-hidden="true">
              {copy.ctaArrow}
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
