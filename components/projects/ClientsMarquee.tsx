import Image from "next/image";
import { Montserrat } from "next/font/google";
import { Container } from "@/components/ui/Container";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { CLIENT_LOGOS, type ClientLogo } from "@/lib/projects/clients-data";

const clientsSans = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

type ClientsMarqueeProps = {
  locale: Locale;
  dict: Dictionary;
};

function LogoGroup({
  logos,
  locale,
  decorative,
}: {
  logos: readonly ClientLogo[];
  locale: Locale;
  decorative?: boolean;
}) {
  return (
    <ul
      className="oms-clients-group"
      aria-hidden={decorative ? true : undefined}
    >
      {logos.map((logo) => (
        <li key={`${logo.id}${decorative ? "-loop" : ""}`} className="oms-clients-logo">
          <Image
            src={logo.src}
            alt={decorative ? "" : logo.alt[locale]}
            width={logo.width}
            height={logo.height}
            sizes="220px"
            loading="eager"
            unoptimized={logo.unoptimized === true}
            className="oms-clients-logo-image"
            style={{
              objectFit: "contain",
              objectPosition: "center",
              transform: "none",
              backgroundColor: "transparent",
            }}
          />
        </li>
      ))}
    </ul>
  );
}

export function ClientsMarquee({ locale, dict }: ClientsMarqueeProps) {
  const copy = dict.projectsPage.clients;

  return (
    <section
      className={`${clientsSans.variable} oms-clients`}
      aria-labelledby="oms-clients-heading"
    >
      <Container className="oms-clients-inner">
        <div
          className="oms-clients-copy"
          dir={locale === "ar" ? "rtl" : "ltr"}
        >
          <p className="oms-clients-eyebrow">{copy.eyebrow}</p>
          <h2 id="oms-clients-heading" className="oms-clients-heading">
            {copy.heading}
          </h2>
          <p className="oms-clients-intro">{copy.intro}</p>
        </div>
      </Container>

      <div className="oms-clients-marquee" dir="ltr">
        <div className="oms-clients-track">
          <LogoGroup logos={CLIENT_LOGOS} locale={locale} />
          <LogoGroup logos={CLIENT_LOGOS} locale={locale} decorative />
        </div>
      </div>
    </section>
  );
}
