import Image from "next/image";
import { Montserrat } from "next/font/google";
import { Container } from "@/components/ui/Container";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

const qcddSans = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const QCDD_LOGO_SRC = "/images/compliance/qcdd-logo.png.png";

type QcddComplianceProps = {
  dict: Dictionary;
};

export function QcddCompliance({ dict }: QcddComplianceProps) {
  const copy = dict.aboutPage.qcdd;

  return (
    <section
      id="qcdd-compliance"
      className={`oms-about-qcdd ${qcddSans.variable}`}
      aria-labelledby="oms-about-qcdd-heading"
    >
      <div id="qcdd" className="oms-about-anchor" aria-hidden="true" />
      <Container className="oms-about-qcdd-inner">
        <div className="oms-about-qcdd-media">
          <Image
            src={QCDD_LOGO_SRC}
            alt={copy.imageAlt}
            width={160}
            height={160}
            className="oms-about-qcdd-image"
          />
        </div>
        <div className="oms-about-qcdd-copy">
          <p className="oms-about-qcdd-eyebrow">{copy.eyebrow}</p>
          <h2 id="oms-about-qcdd-heading" className="oms-about-qcdd-title">
            {copy.title}
          </h2>
          <div className="oms-about-qcdd-body">
            {copy.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
