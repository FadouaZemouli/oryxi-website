import { Montserrat } from "next/font/google";
import {
  Layers3,
  Handshake,
  Headset,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

const whySans = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

type WhyOmsProps = {
  dict: Dictionary;
};

type PointKey =
  | "engineering"
  | "capability"
  | "support"
  | "relationships";

const pointOrder: { key: PointKey; Icon: LucideIcon }[] = [
  { key: "engineering", Icon: Wrench },
  { key: "capability", Icon: Layers3 },
  { key: "support", Icon: Headset },
  { key: "relationships", Icon: Handshake },
];

export function WhyOms({ dict }: WhyOmsProps) {
  const copy = dict.aboutPage.whyOms;

  return (
    <section
      className={`oms-about-why ${whySans.variable}`}
      aria-labelledby="oms-about-why-heading"
    >
      <Container className="oms-about-why-inner">
        <header className="oms-about-why-header">
          <p className="oms-about-why-eyebrow">{copy.eyebrow}</p>
          <h2 id="oms-about-why-heading" className="oms-about-why-title">
            {copy.title}
          </h2>
        </header>

        <ul className="oms-about-why-grid">
          {pointOrder.map((item) => {
            const point = copy.points[item.key];
            const Icon = item.Icon;

            return (
              <li key={item.key} className="oms-about-why-point">
                <span className="oms-about-why-icon" aria-hidden="true">
                  <Icon strokeWidth={1.8} />
                </span>
                <div className="oms-about-why-point-content">
                  <h3 className="oms-about-why-point-title">{point.title}</h3>
                  <p className="oms-about-why-point-body">{point.description}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
