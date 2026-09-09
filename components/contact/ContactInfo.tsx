import { Montserrat } from "next/font/google";
import {
  ArrowRight,
  Briefcase,
  Mail,
  MapPin,
  Phone,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { OMS_GOOGLE_MAPS_URL } from "@/lib/contact/oms-maps";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

const contactInfoSans = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

type ContactInfoProps = {
  locale: Locale;
  dict: Dictionary;
};

type InfoKey = "call" | "email" | "visit" | "work";

const INFO_CARDS: { key: InfoKey; Icon: LucideIcon }[] = [
  { key: "call", Icon: Phone },
  { key: "email", Icon: Mail },
  { key: "visit", Icon: MapPin },
  { key: "work", Icon: Briefcase },
];

export function ContactInfo({ locale, dict }: ContactInfoProps) {
  const copy = dict.contactPage.info;
  const directionsArrow = locale === "ar" ? "←" : "→";

  return (
    <section
      className={`oms-contact-info ${contactInfoSans.variable}`}
      aria-label={copy.ariaLabel}
      data-locale={locale}
    >
      <Container className="oms-contact-info-inner">
        <ul className="oms-contact-info-grid">
          {INFO_CARDS.map(({ key, Icon }) => {
            const card = copy.cards[key];
            const href = "href" in card ? card.href : undefined;
            const ltrValue = key === "call" || key === "email";
            const directionsLabel =
              "directionsLabel" in card ? card.directionsLabel : undefined;

            const body = (
              <>
                <span className="oms-contact-info-icon" aria-hidden="true">
                  <Icon strokeWidth={1.6} />
                </span>
                <p className="oms-contact-info-eyebrow">{card.eyebrow}</p>
                <p
                  className="oms-contact-info-value"
                  dir={ltrValue ? "ltr" : undefined}
                >
                  {card.value}
                </p>
                <p className="oms-contact-info-supporting">{card.supporting}</p>
                {directionsLabel ? (
                  <a
                    className="oms-contact-info-directions"
                    href={OMS_GOOGLE_MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${directionsLabel} ${directionsArrow}`}
                  >
                    <span>{directionsLabel}</span>
                    <ArrowRight
                      className="oms-contact-info-directions-arrow"
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                    <span className="sr-only">{directionsArrow}</span>
                  </a>
                ) : null}
              </>
            );

            return (
              <li key={key} className="oms-contact-info-item">
                {href ? (
                  <a className="oms-contact-info-card" href={href}>
                    {body}
                  </a>
                ) : (
                  <div className="oms-contact-info-card">{body}</div>
                )}
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
