import { Montserrat } from "next/font/google";
import {
  BadgeCheck,
  CircleCheckBig,
  ClipboardCheck,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

const valuesSans = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

type OurValuesProps = {
  dict: Dictionary;
};

type ValueKey = "safety" | "excellence" | "reliability" | "quality";

const valueOrder: { key: ValueKey; Icon: LucideIcon; index: string }[] = [
  { key: "safety", Icon: ShieldCheck, index: "01" },
  { key: "excellence", Icon: BadgeCheck, index: "02" },
  { key: "reliability", Icon: CircleCheckBig, index: "03" },
  { key: "quality", Icon: ClipboardCheck, index: "04" },
];

export function OurValues({ dict }: OurValuesProps) {
  const copy = dict.aboutPage.values;

  return (
    <section
      className={`oms-about-values ${valuesSans.variable}`}
      aria-labelledby="oms-about-values-heading"
    >
      <Container className="oms-about-values-inner">
        <header className="oms-about-values-header">
          <p className="oms-about-values-eyebrow">{copy.eyebrow}</p>
          <h2 id="oms-about-values-heading" className="oms-about-values-title">
            {copy.title}
          </h2>
        </header>

        <ul className="oms-about-values-grid">
          {valueOrder.map((item) => {
            const value = copy.items[item.key];
            const Icon = item.Icon;

            return (
              <li key={item.key} className="oms-about-values-item">
                <span className="oms-about-values-icon" aria-hidden="true">
                  <Icon strokeWidth={1.8} />
                </span>
                <span className="oms-about-values-divider" aria-hidden="true" />
                <div className="oms-about-values-content">
                  <span className="oms-about-values-index" aria-hidden="true">
                    {item.index}
                  </span>
                  <h3 className="oms-about-values-item-title">{value.title}</h3>
                  <p className="oms-about-values-item-body">{value.description}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
