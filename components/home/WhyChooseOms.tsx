import {
  ClipboardCheck,
  Clock3,
  Handshake,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

type WhyChooseOmsProps = {
  locale: Locale;
  dict: Dictionary;
};

type ProofPointKey = "safety" | "expertise" | "partner" | "delivery";

const proofPointOrder: { key: ProofPointKey; Icon: LucideIcon }[] = [
  { key: "safety", Icon: ShieldCheck },
  { key: "expertise", Icon: ClipboardCheck },
  { key: "partner", Icon: Handshake },
  { key: "delivery", Icon: Clock3 },
];

export function WhyChooseOms({ dict }: WhyChooseOmsProps) {
  const copy = dict.home.whyChooseOms;

  return (
    <section
      id="why-choose-oms"
      className="oms-why-choose"
      aria-labelledby="oms-why-choose-heading"
    >
      <Container className="oms-why-choose-inner">
        <div className="oms-why-choose-band">
          <div className="oms-why-choose-main">
            <h2 id="oms-why-choose-heading" className="oms-why-choose-title">
              {copy.eyebrow}
            </h2>

            <ul className="oms-why-choose-points">
              {proofPointOrder.map((item) => {
                const point = copy.proofPoints[item.key];
                const Icon = item.Icon;

                return (
                  <li key={item.key} className="oms-why-choose-point">
                    <span className="oms-why-choose-point-icon" aria-hidden="true">
                      <Icon strokeWidth={1.8} />
                    </span>
                    <span className="oms-why-choose-point-copy">
                      <span className="oms-why-choose-point-title">
                        {point.title}
                      </span>
                      <span className="oms-why-choose-point-description">
                        {point.description}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
