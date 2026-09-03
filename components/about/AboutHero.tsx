import { Montserrat } from "next/font/google";
import { AboutAutoplayVideo } from "@/components/about/AboutAutoplayVideo";
import { Container } from "@/components/ui/Container";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

const aboutHeroSans = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const HERO_VIDEO_SRC = "/videos/about/about-hero.mp4";

type AboutHeroProps = {
  dict: Dictionary;
};

export function AboutHero({ dict }: AboutHeroProps) {
  const copy = dict.aboutPage.hero;

  return (
    <section
      className={`oms-about-hero ${aboutHeroSans.variable}`}
      aria-labelledby="oms-about-hero-heading"
    >
      <div className="oms-about-hero-media" aria-hidden="true">
        <AboutAutoplayVideo
          src={HERO_VIDEO_SRC}
          className="oms-about-hero-video"
        />
        <div className="oms-about-hero-overlay" />
      </div>

      <Container className="oms-about-hero-inner">
        <p className="oms-about-hero-eyebrow">{copy.eyebrow}</p>
        <h1 id="oms-about-hero-heading" className="oms-about-hero-title">
          <span className="oms-about-hero-title-line">{copy.titleLine1}</span>
          <span className="oms-about-hero-title-line">
            {copy.titleLine2Lead}
            {copy.titleLine2Lead ? " " : null}
            <span className="oms-about-hero-title-accent">
              {copy.titleAccent}
            </span>
            {copy.titleLine2Trail ? ` ${copy.titleLine2Trail}` : null}
          </span>
        </h1>
        <p className="oms-about-hero-supporting">{copy.supporting}</p>
      </Container>
    </section>
  );
}
