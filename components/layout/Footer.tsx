import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/path";
import { navItems } from "@/lib/navigation";

type FooterProps = {
  locale: Locale;
  dict: Dictionary;
};

export function Footer({ locale, dict }: FooterProps) {
  const homeHref = localizedHref(locale, "/");
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-oms-dark bg-oms-dark text-oms-white">
      <Container className="grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <Link href={homeHref} className="inline-block bg-oms-white px-3 py-2">
            <Image
              src="/logos/oms-logo.png"
              alt="ORYXI Maintenance Services"
              width={913}
              height={600}
              className="h-12 w-auto"
            />
          </Link>
          <p className="mt-4 text-sm font-medium">ORYXI Maintenance Services</p>
          <p className="mt-2 text-sm leading-6 text-oms-gray">{dict.footer.tagline}</p>
        </div>

        <nav aria-label={dict.footer.pages}>
          <p className="text-sm font-semibold tracking-wide uppercase text-oms-gray">
            {dict.footer.pages}
          </p>
          <ul className="mt-4 space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={localizedHref(locale, item.path)}
                  className="text-sm text-oms-white transition-colors hover:text-oms-gray"
                >
                  {dict.nav[item.key]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="text-sm font-semibold tracking-wide uppercase text-oms-gray">
            {dict.footer.contact}
          </p>
          <p className="mt-4 text-sm leading-6 text-oms-gray">
            {dict.footer.contactPlaceholder}
          </p>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="py-4">
          <p className="text-xs text-oms-gray">
            {dict.footer.copyright.replace("{year}", String(year))}
          </p>
        </Container>
      </div>
    </footer>
  );
}
