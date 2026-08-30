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

  return (
    <footer className="mt-auto border-t border-oms-charcoal bg-oms-dark text-oms-white">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        <div>
          <Link href={homeHref} className="inline-block">
            <SiteLogo
              surface="onDark"
              className="h-12 w-auto"
              sizes="180px"
            />
          </Link>
          <p className="mt-5 text-sm font-medium tracking-wide text-oms-white">
            ORYXI Maintenance Services
          </p>
          <p className="mt-3 max-w-xs text-sm leading-6 text-oms-muted">
            {dict.footer.summary}
          </p>
        </div>

        <nav aria-label={dict.footer.quickLinks}>
          <p className="text-xs font-semibold tracking-[0.14em] uppercase text-oms-burgundy">
            {dict.footer.quickLinks}
          </p>
          <ul className="mt-5 space-y-2.5">
            {footerQuickLinkItems.map((item) => (
              <li key={item.key}>
                <Link
                  href={localizedHref(locale, item.path)}
                  className="text-sm text-oms-white transition-colors hover:text-oms-burgundy"
                >
                  {dict.nav[item.key]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label={dict.footer.services}>
          <p className="text-xs font-semibold tracking-[0.14em] uppercase text-oms-burgundy">
            {dict.footer.services}
          </p>
          <ul className="mt-5 space-y-2.5">
            {footerServiceItems.map((item) => {
              const label = dict.footer.serviceLabels[item.key];

              if (item.path === null) {
                return (
                  <li key={item.key}>
                    <span className="text-sm text-oms-muted">{label}</span>
                  </li>
                );
              }

              return (
                <li key={item.key}>
                  <Link
                    href={localizedHref(locale, item.path)}
                    className="text-sm text-oms-white transition-colors hover:text-oms-burgundy"
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div>
          <p className="text-xs font-semibold tracking-[0.14em] uppercase text-oms-burgundy">
            {dict.footer.contact}
          </p>
          <p className="mt-5 text-sm leading-6 text-oms-muted">
            {dict.footer.contactPlaceholder}
          </p>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="py-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              {/* Official Peerless mark slot — text placeholder until approved asset. */}
              <p className="text-xs font-semibold tracking-[0.18em] uppercase text-oms-muted">
                {dict.footer.peerless.eyebrow}
              </p>
              <p className="mt-3 text-lg font-semibold tracking-[0.12em] text-oms-white uppercase">
                {dict.footer.peerless.brand}
              </p>
              <p className="mt-2 text-sm text-oms-muted">
                {dict.footer.peerless.tagline}
              </p>
            </div>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {peerlessLabels.map((label) => (
                <li
                  key={label}
                  className="text-xs tracking-[0.08em] text-oms-muted uppercase"
                >
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </div>

      <div className="border-t border-white/10">
        <Container className="py-4">
          <p className="text-xs text-oms-muted">
            {dict.footer.copyright.replace("{year}", String(year))}
          </p>
        </Container>
      </div>
    </footer>
  );
}
