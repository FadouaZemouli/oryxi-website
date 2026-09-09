import Image from "next/image";
import { Montserrat } from "next/font/google";
import {
  BarChart3,
  Cog,
  Handshake,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

const contactValuesSans = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const VALUES_IMAGE_SRC = "/images/contact/contact-values-background.png";

type ContactValuesProps = {
  locale: Locale;
  dict: Dictionary;
};

type ValueKey = "safety" | "partnerships" | "excellence" | "growth";

const VALUE_ITEMS: { key: ValueKey; Icon: LucideIcon }[] = [
  { key: "safety", Icon: ShieldCheck },
  { key: "partnerships", Icon: Handshake },
  { key: "excellence", Icon: Cog },
  { key: "growth", Icon: BarChart3 },
];

export function ContactValues({ locale, dict }: ContactValuesProps) {
  const copy = dict.contactPage.values;

  return (
    <section
      className={`oms-contact-values ${contactValuesSans.variable}`}
      aria-labelledby="oms-contact-values-heading"
      data-locale={locale}
    >
      <div className="oms-contact-values-media" aria-hidden="true">
        <Image
          src={VALUES_IMAGE_SRC}
          alt=""
          fill
          sizes="100vw"
          className="oms-contact-values-image"
        />
        <div className="oms-contact-values-overlay" />
      </div>

      <Container className="oms-contact-values-inner">
        <div className="oms-contact-values-layout">
          <div className="oms-contact-values-statement">
            <h2
              id="oms-contact-values-heading"
              className="oms-contact-values-title"
            >
              {copy.lines.map((line) => (
                <span key={line} className="oms-contact-values-title-line">
                  {line}
                </span>
              ))}
            </h2>
            <span className="oms-contact-values-rule" aria-hidden="true" />
          </div>

          <ul className="oms-contact-values-list">
            {VALUE_ITEMS.map(({ key, Icon }) => (
              <li key={key} className="oms-contact-values-item">
                <span className="oms-contact-values-icon" aria-hidden="true">
                  <Icon strokeWidth={1.65} />
                </span>
                <p className="oms-contact-values-label">{copy.items[key]}</p>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
