import { Container } from "@/components/ui/Container";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

type ExpertiseStripProps = {
  locale: Locale;
  dict: Dictionary;
};

type CredibilityKey = "safety" | "reliability" | "expertise";

const credibilityItems: {
  key: CredibilityKey;
  icon: "shield" | "gear" | "target";
}[] = [
  { key: "safety", icon: "shield" },
  { key: "reliability", icon: "gear" },
  { key: "expertise", icon: "target" },
];

function CredibilityIcon({
  name,
}: {
  name: "shield" | "gear" | "target";
}) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
    focusable: false as const,
  };

  if (name === "shield") {
    return (
      <svg {...common}>
        <path d="M12 3.2 5.4 5.7v5.4c0 4.15 2.7 7.25 6.6 8.9 3.9-1.65 6.6-4.75 6.6-8.9V5.7L12 3.2Z" />
        <path d="M9.2 12.15 11.1 14l3.7-4.2" />
      </svg>
    );
  }

  if (name === "gear") {
    return (
      <svg {...common}>
        <path d="M9.99 5.24 10.13 1.62h3.74l.14 3.62 1.34.56 2.67-2.46 2.64 2.64-2.46 2.67.56 1.34 3.62.14v3.74l-3.62.14-.56 1.34 2.46 2.67-2.64 2.64-2.67-2.46-1.34.56-.14 3.62h-3.74l-.14-3.62-1.34-.56-2.67 2.46-2.64-2.64 2.46-2.67-.56-1.34-3.62-.14v-3.74l3.62-.14.56-1.34-2.46-2.67 2.64-2.64 2.67 2.46z" />
        <circle cx="12" cy="12" r="4.35" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="7.2" />
      <circle cx="12" cy="12" r="3.15" />
      <path d="M12 2.6v2.4M12 19v2.4M2.6 12h2.4M19 12h2.4" />
    </svg>
  );
}

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

            return (
              <li key={item.key} className="oms-expertise-item">
                <span className="oms-expertise-icon">
                  <CredibilityIcon name={item.icon} />
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
