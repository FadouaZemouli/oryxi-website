import {
  Crosshair,
  Settings,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

type ExpertiseStripProps = {
  locale: Locale;
  dict: Dictionary;
};

type CredibilityKey = "safety" | "reliability" | "expertise";

const credibilityItems: { key: CredibilityKey; Icon: LucideIcon }[] = [
  { key: "safety", Icon: ShieldCheck },
  { key: "reliability", Icon: Settings },
  { key: "expertise", Icon: Crosshair },
];

export function ExpertiseStrip({ dict }: ExpertiseStripProps) {
  return (
    <div
      className="oms-expertise"
      role="region"
      aria-label={dict.home.expertise.label}
    >
      <Container className="oms-expertise-inner">
        <ul className="oms-expertise-list">
          {credibilityItems.map((item, index) => {
            const copy = dict.home.expertise.items[item.key];
            const indexLabel = String(index + 1).padStart(2, "0");
            const Icon = item.Icon;

            return (
              <li key={item.key} className="oms-expertise-item">
                <span className="oms-expertise-icon">
                  <Icon aria-hidden strokeWidth={1.8} />
                </span>
                <div className="oms-expertise-copy">
                  <span className="oms-expertise-index" aria-hidden="true">
                    {indexLabel}
                  </span>
                  <h3 className="oms-expertise-title">{copy.title}</h3>
                  <p className="oms-expertise-text">{copy.description}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </div>
  );
}
