import Link from "next/link";
import { SiteLogo } from "@/components/layout/SiteLogo";
import { Container } from "@/components/ui/Container";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/path";
import {
  footerQuickLinkItems,
  footerServiceItems,
} from "@/lib/navigation";

type FooterProps = {
  locale: Locale;
  dict: Dictionary;
};

export function Footer({ locale, dict }: FooterProps) {
  const homeHref = localizedHref(locale, "/");
  const year = new Date().getFullYear();
  const peerlessLabels = [
    dict.footer.peerless.firePumps,
    dict.footer.peerless.spareParts,
    dict.footer.peerless.maintenance,
    dict.footer.peerless.technicalSupport,
  ];
  const contact = dict.footer.contactDetails;

  return (
    <footer className="oms-footer mt-auto">
      <Container className="oms-footer-grid">
        <div>
          <Link href={homeHref} className="inline-block">
            <SiteLogo surface="default" className="h-12 w-auto" sizes="180px" />
          </Link>
          <p className="oms-footer-brand">ORYXI Maintenance Services</p>
          <p className="oms-footer-summary">{dict.footer.summary}</p>
        </div>

        <nav aria-label={dict.footer.quickLinks}>
          <p className="oms-footer-heading">{dict.footer.quickLinks}</p>
          <ul className="oms-footer-list">
            {footerQuickLinkItems.map((item) => (
              <li key={item.key}>
                <Link
                  href={localizedHref(locale, item.path)}
                  className="oms-footer-link"
                >
                  {dict.nav[item.key]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label={dict.footer.services}>
          <p className="oms-footer-heading">{dict.footer.services}</p>
          <ul className="oms-footer-list">
            {footerServiceItems.map((item) => {
              const label = dict.footer.serviceLabels[item.key];

              if (item.path === null) {
                return (
                  <li key={item.key}>
                    <span className="oms-footer-static">{label}</span>
                  </li>
                );
              }

              return (
                <li key={item.key}>
                  <Link
                    href={localizedHref(locale, item.path)}
                    className="oms-footer-link"
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div>
          <p className="oms-footer-heading">{dict.footer.contact}</p>
          <ul className="oms-footer-list">
            <li>
              <a
                href={`tel:${contact.phoneTel}`}
                className="oms-footer-link oms-ltr-value"
              >
                {contact.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${contact.email}`}
                className="oms-footer-link oms-ltr-value"
              >
                {contact.email}
              </a>
            </li>
            <li>
              <a
                href={contact.websiteHref}
                className="oms-footer-link oms-ltr-value"
                rel="noopener noreferrer"
              >
                {contact.website}
              </a>
            </li>
          </ul>
        </div>
      </Container>

      <div className="oms-footer-peerless">
        <Container>
          <div className="oms-footer-peerless-row">
            <div>
              {/* Official Peerless mark slot — text placeholder until approved asset. */}
              <p className="oms-footer-peerless-eyebrow">
                {dict.footer.peerless.eyebrow}
              </p>
              <p className="oms-footer-peerless-brand">
                {dict.footer.peerless.brand}
              </p>
              <p className="oms-footer-peerless-tagline">
                {dict.footer.peerless.tagline}
              </p>
            </div>
            <ul className="oms-footer-peerless-tags">
              {peerlessLabels.map((label) => (
                <li key={label}>{label}</li>
              ))}
            </ul>
          </div>
        </Container>
      </div>

      <div className="oms-footer-copyright">
        <Container>
          <p>{dict.footer.copyright.replace("{year}", String(year))}</p>
        </Container>
      </div>
    </footer>
  );
}
