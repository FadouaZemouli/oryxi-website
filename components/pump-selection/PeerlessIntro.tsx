import Image from "next/image";
import { Montserrat } from "next/font/google";
import { Cog, ShieldCheck, UsersRound, type LucideIcon } from "lucide-react";
import { PeerlessWorldMap } from "@/components/pump-selection/PeerlessWorldMap";
import { Container } from "@/components/ui/Container";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

const introSans = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const PEERLESS_LOGO_SRC = "/images/partners/peerless-pump-logo.png";

type PeerlessIntroProps = {
  dict: Dictionary;
};

type IntroPointKey = "experience" | "reliability" | "presence";

const introPoints: { key: IntroPointKey; Icon: LucideIcon }[] = [
  { key: "experience", Icon: Cog },
  { key: "reliability", Icon: ShieldCheck },
  { key: "presence", Icon: UsersRound },
];

export function PeerlessIntro({ dict }: PeerlessIntroProps) {
  const copy = dict.pumpSelectionPage.intro;

  return (
    <section
      className={`oms-peerless-intro ${introSans.variable}`}
      aria-labelledby="oms-peerless-intro-heading"
    >
      <Container className="oms-peerless-intro-inner">
        <div className="oms-peerless-intro-copy">
          <div className="oms-peerless-intro-kicker">
            <span className="oms-peerless-intro-accent" aria-hidden="true" />
            <p className="oms-peerless-intro-eyebrow">{copy.eyebrow}</p>
          </div>

          <h2 id="oms-peerless-intro-heading" className="oms-peerless-intro-heading">
            {copy.heading}
          </h2>

          <p className="oms-peerless-intro-statement">
            <span className="oms-peerless-intro-statement-line">
              {copy.statementLine1}
            </span>
            <span className="oms-peerless-intro-statement-line">
              {copy.statementLine2}
            </span>
          </p>

          <p className="oms-peerless-intro-paragraph">{copy.paragraph}</p>
        </div>

        <div className="oms-peerless-intro-visual">
          <PeerlessWorldMap />

          <ul className="oms-peerless-intro-points">
            {introPoints.map((item) => {
              const Icon = item.Icon;

              return (
                <li key={item.key} className="oms-peerless-intro-point">
                  <span className="oms-peerless-intro-point-icon" aria-hidden="true">
                    <Icon strokeWidth={1.5} />
                  </span>
                  <span className="oms-peerless-intro-point-label">
                    {copy.points[item.key]}
                  </span>
                </li>
              );
            })}
          </ul>

          <div className="oms-peerless-intro-brand">
            <Image
              src={PEERLESS_LOGO_SRC}
              alt={copy.logoAlt}
              width={1881}
              height={836}
              className="oms-peerless-intro-logo"
              sizes="(max-width: 767px) 200px, 248px"
            />
            <p className="oms-peerless-intro-caption">{copy.logoCaption}</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
