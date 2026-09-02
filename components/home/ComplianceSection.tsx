import Image from "next/image";
import Link from "next/link";
import {
  CircleCheckBig,
  HardHat,
  Leaf,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/path";

const QCDD_LOGO_SRC = "/images/compliance/qcdd-logo.png.png";
const ISO_9001_BADGE_SRC = "/images/compliance/iso-9001-certified.png.png";

type ComplianceSectionProps = {
  locale: Locale;
  dict: Dictionary;
};

type IsoBadgeKey = "iso9001" | "iso14001" | "iso45001";

const isoBadges: { key: IsoBadgeKey; Icon: LucideIcon }[] = [
  { key: "iso9001", Icon: CircleCheckBig },
  { key: "iso14001", Icon: Leaf },
  { key: "iso45001", Icon: HardHat },
];

export function ComplianceSection({ locale, dict }: ComplianceSectionProps) {
  const copy = dict.home.compliance;
  const qcddHref = localizedHref(locale, "/about#qcdd");
  const isoHref = localizedHref(locale, "/about#iso-certifications");

  return (
    <section
      id="compliance"
      className="oms-compliance"
      aria-labelledby="oms-compliance-eyebrow"
    >
      <Container className="oms-compliance-inner">
        <p id="oms-compliance-eyebrow" className="oms-compliance-eyebrow">
          {copy.eyebrow}
        </p>

        <div className="oms-compliance-card">
          <article className="oms-compliance-block oms-compliance-block--qcdd">
            <div className="oms-compliance-feature">
              <span className="oms-compliance-feature-media">
                <Image
                  src={QCDD_LOGO_SRC}
                  alt={copy.qcdd.imageAlt}
                  width={140}
                  height={140}
                  className="oms-compliance-feature-image"
                />
              </span>
              <div className="oms-compliance-feature-copy">
                <h2 className="oms-compliance-block-title">{copy.qcdd.title}</h2>
                <p className="oms-compliance-block-body">{copy.qcdd.body}</p>
                <Link href={qcddHref} className="oms-compliance-cta">
                  {copy.qcdd.cta}
                  <span className="oms-compliance-cta-arrow" aria-hidden="true">
                    →
                  </span>
                </Link>
              </div>
            </div>
          </article>

          <article className="oms-compliance-block oms-compliance-block--iso">
            <div className="oms-compliance-feature">
              <span className="oms-compliance-feature-media">
                <Image
                  src={ISO_9001_BADGE_SRC}
                  alt={copy.iso.imageAlt}
                  width={140}
                  height={140}
                  className="oms-compliance-feature-image"
                />
              </span>
              <div className="oms-compliance-feature-copy">
                <h2 className="oms-compliance-block-title">{copy.iso.title}</h2>
                <p className="oms-compliance-block-body">{copy.iso.body}</p>
                <Link href={isoHref} className="oms-compliance-cta">
                  {copy.iso.cta}
                  <span className="oms-compliance-cta-arrow" aria-hidden="true">
                    →
                  </span>
                </Link>
              </div>
            </div>
          </article>

          <ul id="iso-standards" className="oms-compliance-badges">
            {isoBadges.map((badge) => {
              const badgeCopy = copy.badges[badge.key];
              const Icon = badge.Icon;

              return (
                <li key={badge.key} className="oms-compliance-badge">
                  <span className="oms-compliance-badge-icon" aria-hidden="true">
                    <Icon strokeWidth={1.8} />
                  </span>
                  <span className="oms-compliance-badge-copy">
                    <span className="oms-compliance-badge-code">
                      {badgeCopy.code}
                    </span>
                    <span className="oms-compliance-badge-label">
                      {badgeCopy.label}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
    </section>
  );
}
