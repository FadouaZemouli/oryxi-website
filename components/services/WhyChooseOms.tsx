import { Montserrat } from "next/font/google";
import {
  Gem,
  ShieldCheck,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

const whyChooseSans = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

type WhyChooseOmsProps = {
  locale: Locale;
  dict: Dictionary;
};

type ReasonKey = "compliance" | "team" | "quality" | "partnership";

const REASON_ORDER: { key: ReasonKey; number: string; Icon: LucideIcon }[] = [
  { key: "compliance", number: "01", Icon: ShieldCheck },
  { key: "team", number: "02", Icon: Users },
  { key: "quality", number: "03", Icon: Gem },
  { key: "partnership", number: "04", Icon: TrendingUp },
];

export function WhyChooseOms({ locale, dict }: WhyChooseOmsProps) {
  const copy = dict.servicesPage.whyChooseOms;

  return (
    <section
      id="why-choose-oms"
      className={`oms-why-choose ${whyChooseSans.variable}`}
      aria-labelledby="oms-why-choose-heading"
      data-locale={locale}
    >
      <Container className="oms-why-choose-inner">
        <header className="oms-why-choose-header">
          <div className="oms-why-choose-heading-block">
            <p className="oms-why-choose-eyebrow">{copy.eyebrow}</p>
            <h2 id="oms-why-choose-heading" className="oms-why-choose-title">
              <span className="oms-why-choose-title-line">{copy.titleLine1}</span>
              <span className="oms-why-choose-title-line">{copy.titleLine2}</span>
            </h2>
          </div>
          <p className="oms-why-choose-intro">{copy.intro}</p>
        </header>

        <ul className="oms-why-choose-reasons">
          {REASON_ORDER.map(({ key, number, Icon }) => {
            const reason = copy.reasons[key];

            return (
              <li key={key} className="oms-why-choose-reason">
                <span className="oms-why-choose-number" aria-hidden="true">
                  {number}
                </span>
                <span className="oms-why-choose-icon" aria-hidden="true">
                  <Icon strokeWidth={1.5} />
                </span>
                <h3 className="oms-why-choose-reason-title">{reason.title}</h3>
                <p className="oms-why-choose-reason-description">
                  {reason.description}
                </p>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
