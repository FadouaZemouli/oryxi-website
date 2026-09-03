import { Montserrat } from "next/font/google";
import { AboutAutoplayVideo } from "@/components/about/AboutAutoplayVideo";
import { Container } from "@/components/ui/Container";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

const whoWeAreSans = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const STORY_VIDEO_SRC = "/videos/about/about-story.mp4";

type WhoWeAreProps = {
  dict: Dictionary;
};

export function WhoWeAre({ dict }: WhoWeAreProps) {
  const copy = dict.aboutPage.whoWeAre;

  return (
    <section
      className={`oms-about-who ${whoWeAreSans.variable}`}
      aria-labelledby="oms-about-who-heading"
    >
      <Container className="oms-about-who-inner">
        <div className="oms-about-who-copy">
          <p className="oms-about-who-eyebrow">{copy.eyebrow}</p>
          <h2 id="oms-about-who-heading" className="oms-about-who-title">
            <span className="oms-about-who-title-line">{copy.titleLine1}</span>
            <span className="oms-about-who-title-line">
              {copy.titleLine2Lead}
              {copy.titleLine2Lead ? " " : null}
              <span className="oms-about-who-title-accent">
                {copy.titleAccent}
              </span>
            </span>
          </h2>
          <div className="oms-about-who-body">
            {copy.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div className="oms-about-who-visual" aria-hidden="true">
          <div className="oms-about-who-frame">
            <AboutAutoplayVideo
              src={STORY_VIDEO_SRC}
              className="oms-about-who-video"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
