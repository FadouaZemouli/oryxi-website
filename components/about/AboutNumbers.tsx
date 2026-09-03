import { Montserrat } from "next/font/google";
import { Container } from "@/components/ui/Container";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

const numbersSans = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

type AboutNumbersProps = {
  dict: Dictionary;
};

type MetricKey = "experience" | "projects" | "clients" | "support";

const metricOrder: MetricKey[] = [
  "experience",
  "projects",
  "clients",
  "support",
];

export function AboutNumbers({ dict }: AboutNumbersProps) {
  const copy = dict.aboutPage.numbers;

  return (
    <section
      className={`oms-about-numbers ${numbersSans.variable}`}
      aria-label={copy.ariaLabel}
    >
      <Container className="oms-about-numbers-inner">
        <ul className="oms-about-numbers-grid">
          {metricOrder.map((key) => {
            const metric = copy.metrics[key];

            return (
              <li key={key} className="oms-about-numbers-stat">
                <span className="oms-about-numbers-value">{metric.value}</span>
                <span className="oms-about-numbers-label">{metric.label}</span>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
