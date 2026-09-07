import {
  Fan,
  Flame,
  Gauge,
  HardHat,
  Settings,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

type ServiceNavKey =
  | "mep"
  | "electromechanical"
  | "engineering"
  | "hvac"
  | "fire"
  | "amc";

const SERVICE_NAV_ITEMS: {
  key: ServiceNavKey;
  href: string;
  Icon: LucideIcon;
}[] = [
  { key: "mep", href: "#mep-services", Icon: Gauge },
  { key: "electromechanical", href: "#electromechanical-services", Icon: Settings },
  { key: "engineering", href: "#engineering-services", Icon: HardHat },
  { key: "hvac", href: "#hvac-systems", Icon: Fan },
  { key: "fire", href: "#qcdd-services", Icon: Flame },
  { key: "amc", href: "#amc-contracts", Icon: Wrench },
];

type ServicesNavProps = {
  dict: Dictionary;
};

export function ServicesNav({ dict }: ServicesNavProps) {
  const copy = dict.servicesPage.nav;

  return (
    <div className="oms-services-nav-wrap">
      <Container className="oms-services-nav-container">
        <nav
          id="services-nav"
          className="oms-services-nav"
          aria-label={copy.ariaLabel}
        >
          <ul className="oms-services-nav-list">
            {SERVICE_NAV_ITEMS.map(({ key, href, Icon }) => (
              <li key={key} className="oms-services-nav-item">
                <a href={href} className="oms-services-nav-link">
                  <Icon
                    className="oms-services-nav-icon"
                    aria-hidden="true"
                    strokeWidth={1.75}
                  />
                  <span className="oms-services-nav-title">{copy.items[key]}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </div>
  );
}
