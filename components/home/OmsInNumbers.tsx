import { Montserrat } from "next/font/google";
import {
  Building2,
  CalendarDays,
  Headset,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

const numbersSans = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

type OmsInNumbersProps = {
  locale: Locale;
  dict: Dictionary;
};

type MetricKey = "experience" | "projects" | "clients" | "support";

const metricOrder: { key: MetricKey; Icon: LucideIcon }[] = [
  { key: "experience", Icon: CalendarDays },
  { key: "projects", Icon: Building2 },
  { key: "clients", Icon: UsersRound },
  { key: "support", Icon: Headset },
];

export function OmsInNumbers({ dict }: OmsInNumbersProps) {
  const copy = dict.home.numbers;

  return (
    <section
      id="numbers"
      className={`oms-numbers ${numbersSans.variable}`}
      aria-labelledby="oms-numbers-heading"
    >
      <Container className="oms-numbers-inner">
        <header className="oms-numbers-header">
          <p className="oms-numbers-eyebrow">{copy.eyebrow}</p>
          <span className="oms-numbers-accent" aria-hidden="true" />
          <h2 id="oms-numbers-heading" className="oms-numbers-title">
            <span className="oms-numbers-title-line">{copy.titleLine1}</span>
            <span className="oms-numbers-title-line oms-numbers-title-accent">
              {copy.titleLine2}
            </span>
          </h2>
          <p className="oms-numbers-body">{copy.body}</p>
        </header>

        <ul className="oms-numbers-grid">
          {metricOrder.map((item) => {
            const metric = copy.metrics[item.key];
            const Icon = item.Icon;

            return (
              <li key={item.key} className="oms-numbers-stat">
                <span className="oms-numbers-icon">
                  <Icon aria-hidden strokeWidth={1.85} />
                </span>
                <span className="oms-numbers-value">{metric.value}</span>
                <span className="oms-numbers-label">{metric.label}</span>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
