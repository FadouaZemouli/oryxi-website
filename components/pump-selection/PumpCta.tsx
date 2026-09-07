import Image from "next/image";
import Link from "next/link";
import { Montserrat } from "next/font/google";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/path";

const ctaSans = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const CTA_IMAGE_SRC = "/images/pump-selection/cta/oms-engineering-cta.png";

type PumpCtaProps = {
  locale: Locale;
  dict: Dictionary;
};

export function PumpCta({ locale, dict }: PumpCtaProps) {
  const copy = dict.pumpSelectionPage.cta;
  const quoteHref = localizedHref(locale, "/request-quote");

  return (
    <section
      className={`oms-pump-cta ${ctaSans.variable}`}
      aria-labelledby="oms-pump-cta-heading"
    >
      <div className="oms-pump-cta-layout">
        <div className="oms-pump-cta-media">
          <Image
            src={CTA_IMAGE_SRC}
            alt={copy.imageAlt}
            fill
            sizes="(max-width: 767px) 100vw, 56vw"
            className="oms-pump-cta-image"
          />
          <div className="oms-pump-cta-transition" aria-hidden="true" />
        </div>

        <div className="oms-pump-cta-content">
          <span className="oms-pump-cta-accent" aria-hidden="true" />
          <p className="oms-pump-cta-eyebrow">{copy.eyebrow}</p>
          <h2 id="oms-pump-cta-heading" className="oms-pump-cta-title">
            <span className="oms-pump-cta-title-line">{copy.titleLine1}</span>
            <span className="oms-pump-cta-title-line">{copy.titleLine2}</span>
          </h2>
          <p className="oms-pump-cta-body">{copy.body}</p>
          <Link href={quoteHref} className="oms-pump-cta-button">
            <span>{copy.cta}</span>
            <span className="oms-pump-cta-button-arrow" aria-hidden="true">
              {copy.ctaArrow}
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
