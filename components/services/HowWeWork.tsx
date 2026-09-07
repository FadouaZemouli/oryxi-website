import Image from "next/image";
import { Montserrat } from "next/font/google";
import {
  HardHat,
  Search,
  Settings,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

const howWeWorkSans = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const MEP_LINES_SRC = "/images/Services/how-we-work-mep-lines.png";

type HowWeWorkProps = {
  locale: Locale;
  dict: Dictionary;
};

type StepKey = "assess" | "engineer" | "deliver" | "support";

const STEP_ORDER: { key: StepKey; number: string; Icon: LucideIcon }[] = [
  { key: "assess", number: "01", Icon: Search },
  { key: "engineer", number: "02", Icon: Settings },
  { key: "deliver", number: "03", Icon: HardHat },
  { key: "support", number: "04", Icon: Wrench },
];

export function HowWeWork({ locale, dict }: HowWeWorkProps) {
  const copy = dict.servicesPage.howWeWork;

  return (
    <section
      id="how-we-work"
      className={`oms-how-we-work ${howWeWorkSans.variable}`}
      aria-labelledby="oms-how-we-work-heading"
      data-locale={locale}
    >
      <div className="oms-how-we-work-mep" aria-hidden="true">
        <Image
          src={MEP_LINES_SRC}
          alt=""
          width={1774}
          height={887}
          sizes="(min-width: 1024px) 62vw, (min-width: 640px) 52vw, 1px"
          className="oms-how-we-work-mep-image"
          priority={false}
          unoptimized
        />
      </div>

      <Container className="oms-how-we-work-inner">
        <header className="oms-how-we-work-header">
          <p className="oms-how-we-work-eyebrow">{copy.eyebrow}</p>
          <h2 id="oms-how-we-work-heading" className="oms-how-we-work-title">
            <span className="oms-how-we-work-title-line">{copy.titleLine1}</span>
            <span className="oms-how-we-work-title-line">{copy.titleLine2}</span>
          </h2>
          <p className="oms-how-we-work-supporting">{copy.supporting}</p>
        </header>

        <ol className="oms-how-we-work-steps">
          {STEP_ORDER.map(({ key, number, Icon }) => {
            const step = copy.steps[key];

            return (
              <li key={key} className="oms-how-we-work-step">
                <span className="oms-how-we-work-number" aria-hidden="true">
                  {number}
                </span>

                <div className="oms-how-we-work-node-wrap" aria-hidden="true">
                  <span className="oms-how-we-work-node" />
                </div>

                <span className="oms-how-we-work-icon" aria-hidden="true">
                  <Icon strokeWidth={1.5} />
                </span>

                <span className="oms-how-we-work-accent" aria-hidden="true" />

                <h3 className="oms-how-we-work-step-title">{step.title}</h3>
                <p className="oms-how-we-work-step-description">
                  {step.description}
                </p>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
