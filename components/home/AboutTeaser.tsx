import { Container } from "@/components/ui/Container";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/path";

type AboutTeaserProps = {
  locale: Locale;
  dict: Dictionary;
};

export function AboutTeaser({ locale, dict }: AboutTeaserProps) {
  const aboutHref = localizedHref(locale, "/about");

  return (
    <section className="oms-about" aria-labelledby="oms-about-heading">
      <Container className="oms-about-inner">
        <div className="oms-about-copy">
          <div className="oms-about-rule" aria-hidden="true" />
          <p className="oms-about-eyebrow">{dict.home.about.eyebrow}</p>
          <h2 id="oms-about-heading" className="oms-about-title">
            <span className="oms-about-title-line">
              {dict.home.about.titleLine1}
            </span>
            <span className="oms-about-title-line">
              {dict.home.about.titleLine2}
            </span>
          </h2>
          <p className="oms-about-body">{dict.home.about.body}</p>
          <div className="oms-about-actions">
            <PrimaryButton href={aboutHref}>{dict.home.about.cta}</PrimaryButton>
          </div>
        </div>
        <div className="oms-about-plate" aria-hidden="true">
          <span className="oms-about-plate-grid" />
          <span className="oms-about-plate-frame" />
          <span className="oms-about-plate-axis oms-about-plate-axis-x" />
          <span className="oms-about-plate-axis oms-about-plate-axis-y" />
          <span className="oms-about-plate-cut" />
          <span className="oms-about-plate-core" />
        </div>
      </Container>
    </section>
  );
}
