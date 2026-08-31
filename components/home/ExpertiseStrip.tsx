import Link from "next/link";
import { Container } from "@/components/ui/Container";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/path";

type ExpertiseStripProps = {
  locale: Locale;
  dict: Dictionary;
};

const expertiseItems = [
  { key: "fireFightingSystems", path: "/services" },
  { key: "fireAlarmSystems", path: "/services" },
  { key: "engineeringServices", path: "/services" },
  { key: "electromechanicalMaintenance", path: "/services" },
] as const;

export function ExpertiseStrip({ locale, dict }: ExpertiseStripProps) {
  return (
    <div
      className="oms-expertise"
      role="region"
      aria-label={dict.home.expertise.label}
    >
      <Container className="oms-expertise-inner">
        <ul className="oms-expertise-list">
          {expertiseItems.map((item, index) => {
            const label = dict.home.expertise.items[item.key];
            const indexLabel = String(index + 1).padStart(2, "0");

            return (
              <li key={item.key} className="oms-expertise-item">
                <span className="oms-expertise-index" aria-hidden="true">
                  {indexLabel}
                </span>
                <Link
                  href={localizedHref(locale, item.path)}
                  className="oms-expertise-label oms-expertise-link"
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </div>
  );
}
