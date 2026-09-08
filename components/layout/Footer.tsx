import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { FooterHashLink } from "@/components/layout/FooterHashLink";
import { SiteLogo } from "@/components/layout/SiteLogo";
import { Container } from "@/components/ui/Container";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/path";
import {
  footerCompanyItems,
  footerServicesColumnItems,
  footerSupportItems,
} from "@/lib/navigation";

type FooterProps = {
  locale: Locale;
  dict: Dictionary;
};

export function Footer({ locale, dict }: FooterProps) {
  const homeHref = localizedHref(locale, "/");
  const year = new Date().getFullYear();
  const contact = dict.footer.contactDetails;
  const columns = dict.footer.columns;

  return (
    <footer className="oms-footer mt-auto">
      <Container className="oms-footer-grid">
        <div className="oms-footer-column oms-footer-brand-column">
          <Link href={homeHref} className="inline-block">
            <SiteLogo surface="onDark" className="h-12 w-auto" sizes="180px" />
          </Link>
          <p className="oms-footer-brand-summary">{dict.footer.brandSummary}</p>
          <div className="oms-footer-partner">
            <hr className="oms-footer-partner-divider" aria-hidden="true" />
            <p className="oms-footer-partner-label">{dict.footer.partnerLabel}</p>
            <Image
              src="/images/partners/peerless-pump-logo.png"
              alt="Peerless Pump"
              width={1881}
              height={836}
              className="oms-footer-partner-logo"
              sizes="(max-width: 1023px) 180px, 180px"
            />
          </div>
        </div>

        <nav
          className="oms-footer-column"
          aria-label={dict.footer.company}
        >
          <p className="oms-footer-heading">{dict.footer.company}</p>
          <ul className="oms-footer-list">
            {footerCompanyItems.map((item) => (
              <li key={item.key}>
                <Link
                  href={localizedHref(locale, item.path)}
                  className="oms-footer-link"
                >
                  {columns.company[item.key]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav
          className="oms-footer-column"
          aria-label={dict.footer.services}
        >
          <p className="oms-footer-heading">{dict.footer.services}</p>
          <ul className="oms-footer-list">
            {footerServicesColumnItems.map((item) => (
              <li key={item.key}>
                <FooterHashLink
                  href={localizedHref(locale, item.path)}
                  className="oms-footer-link"
                >
                  {columns.services[item.key]}
                </FooterHashLink>
              </li>
            ))}
          </ul>
        </nav>

        <nav className="oms-footer-column" aria-label={dict.footer.support}>
          <p className="oms-footer-heading">{dict.footer.support}</p>
          <ul className="oms-footer-list">
            {footerSupportItems.map((item) => {
              const href = localizedHref(locale, item.path);
              const LinkComponent = item.path.includes("#")
                ? FooterHashLink
                : Link;

              return (
                <li key={item.key}>
                  <LinkComponent href={href} className="oms-footer-link">
                    {columns.support[item.key]}
                  </LinkComponent>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="oms-footer-column">
          <p className="oms-footer-heading">{dict.footer.contact}</p>
          <ul className="oms-footer-list oms-footer-contact-list">
            <li className="oms-footer-contact-item">
              <MapPin
                className="oms-footer-contact-icon"
                strokeWidth={1.8}
                aria-hidden="true"
              />
              <span>{dict.footer.location}</span>
            </li>
            <li className="oms-footer-contact-item">
              <Phone
                className="oms-footer-contact-icon"
                strokeWidth={1.8}
                aria-hidden="true"
              />
              <a
                href={`tel:${contact.phoneTel}`}
                className="oms-footer-link oms-ltr-value"
              >
                {contact.phone}
              </a>
            </li>
            <li className="oms-footer-contact-item">
              <Mail
                className="oms-footer-contact-icon"
                strokeWidth={1.8}
                aria-hidden="true"
              />
              <a
                href={`mailto:${contact.email}`}
                className="oms-footer-link oms-ltr-value"
              >
                {contact.email}
              </a>
            </li>
          </ul>
        </div>
      </Container>

      <div className="oms-footer-bottom">
        <Container className="oms-footer-bottom-inner">
          <p className="oms-footer-copyright">
            {dict.footer.copyright.replace("{year}", String(year))}
          </p>
          <div className="oms-footer-legal">
            <span className="oms-footer-legal-item">
              {dict.footer.legal.privacy}
            </span>
            <span className="oms-footer-legal-item">
              {dict.footer.legal.terms}
            </span>
          </div>
        </Container>
      </div>
    </footer>
  );
}
