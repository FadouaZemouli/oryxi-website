import Image from "next/image";
import { Montserrat } from "next/font/google";
import {
  CircleCheckBig,
  HardHat,
  Leaf,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

const isoSans = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const ISO_9001_BADGE_SRC = "/images/compliance/iso-9001-certified.png.png";

type IsoStandardKey = "iso9001" | "iso14001" | "iso45001";

const isoStandardIcons: Record<IsoStandardKey, LucideIcon> = {
  iso9001: CircleCheckBig,
  iso14001: Leaf,
  iso45001: HardHat,
};

type IsoCertificationProps = {
  dict: Dictionary;
};

export function IsoCertification({ dict }: IsoCertificationProps) {
  const copy = dict.aboutPage.iso;

  return (
    <section
      id="iso-certification"
      className={`oms-about-iso ${isoSans.variable}`}
      aria-labelledby="oms-about-iso-heading"
    >
      <div
        id="iso-certifications"
        className="oms-about-anchor"
        aria-hidden="true"
      />
      <Container className="oms-about-iso-inner">
        <div className="oms-about-iso-copy">
          <p className="oms-about-iso-eyebrow">{copy.eyebrow}</p>
          <h2 id="oms-about-iso-heading" className="oms-about-iso-title">
            <span className="oms-about-iso-title-line">{copy.titleLine1}</span>
            <span className="oms-about-iso-title-line">
              {copy.titleLine2Lead}
              {copy.titleLine2Lead ? " " : null}
              <span className="oms-about-iso-title-accent">
                {copy.titleAccent}
              </span>
            </span>
          </h2>
          <p className="oms-about-iso-body">{copy.body}</p>

          <ul className="oms-about-iso-standards">
            {copy.standards.map((standard) => {
              const Icon = isoStandardIcons[standard.key as IsoStandardKey];

              return (
                <li key={standard.key} className="oms-about-iso-standard">
                  <span className="oms-about-iso-standard-top">
                    <span className="oms-about-iso-standard-index">
                      {standard.index}
                    </span>
                    {Icon ? (
                      <span
                        className="oms-about-iso-standard-icon"
                        aria-hidden="true"
                      >
                        <Icon strokeWidth={1.8} size={26} />
                      </span>
                    ) : null}
                  </span>
                  <p className="oms-about-iso-standard-code">{standard.code}</p>
                  <p className="oms-about-iso-standard-label">
                    {standard.label}
                  </p>
                  {standard.certificateNo ? (
                    <p className="oms-about-iso-standard-number">
                      {standard.certificateNo}
                    </p>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="oms-about-iso-media">
          <Image
            src={ISO_9001_BADGE_SRC}
            alt={copy.imageAlt}
            width={180}
            height={180}
            className="oms-about-iso-image"
          />
        </div>
      </Container>
    </section>
  );
}
