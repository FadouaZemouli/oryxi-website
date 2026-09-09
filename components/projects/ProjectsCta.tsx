import Image from "next/image";
import { Montserrat } from "next/font/google";
import { Container } from "@/components/ui/Container";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { localizedContactFormHref, localizedHref } from "@/lib/i18n/path";

const ctaSans = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const PROJECTS_CTA_IMAGE = "/images/projects/cta/projects-cta-background.png";

type ProjectsCtaProps = {
  locale: Locale;
  dict: Dictionary;
};

export function ProjectsCta({ locale, dict }: ProjectsCtaProps) {
  const copy = dict.projectsPage.cta;
  const quoteHref = localizedContactFormHref(locale);
  const contactHref = localizedHref(locale, "/contact");

  return (
    <section
      className={`${ctaSans.variable} oms-projects-cta`}
      aria-labelledby="oms-projects-cta-heading"
    >
      <div className="oms-projects-cta-media" aria-hidden="true">
        <Image
          src={PROJECTS_CTA_IMAGE}
          alt=""
          fill
          sizes="100vw"
          className="oms-projects-cta-image"
          style={{
            objectFit: "cover",
            objectPosition: "center center",
            transform: "none",
          }}
        />
        <div className="oms-projects-cta-overlay" />
      </div>

      <Container className="oms-projects-cta-inner">
        <div
          className="oms-projects-cta-copy"
          dir={locale === "ar" ? "rtl" : "ltr"}
        >
          <p className="oms-projects-cta-eyebrow">{copy.eyebrow}</p>
          <h2 id="oms-projects-cta-heading" className="oms-projects-cta-heading">
            {copy.titleLead}
            <span className="oms-projects-cta-accent">{copy.titleAccent}</span>
            {copy.titleTrail}
          </h2>
          <p className="oms-projects-cta-description">{copy.description}</p>
          <div className="oms-projects-cta-actions">
            <PrimaryButton href={quoteHref}>{copy.quoteCta}</PrimaryButton>
            <SecondaryButton href={contactHref} tone="onDark">
              {copy.contactCta}
            </SecondaryButton>
          </div>
        </div>
      </Container>
    </section>
  );
}
