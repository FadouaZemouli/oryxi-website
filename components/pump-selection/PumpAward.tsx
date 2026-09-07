import Image from "next/image";
import { Montserrat } from "next/font/google";
import { Award, Cog, Handshake, type LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/Container";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

const awardSans = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const AWARD_IMAGE_SRC =
  "/images/pump-selection/peerless-business-partner-award.png";

type PumpAwardProps = {
  dict: Dictionary;
};

type AwardHighlightKey = "reliability" | "expertise" | "partnership";

const awardHighlights: { key: AwardHighlightKey; Icon: LucideIcon }[] = [
  { key: "reliability", Icon: Award },
  { key: "expertise", Icon: Cog },
  { key: "partnership", Icon: Handshake },
];

export function PumpAward({ dict }: PumpAwardProps) {
  const copy = dict.pumpSelectionPage.award;

  return (
    <section
      className={`oms-pump-award ${awardSans.variable}`}
      aria-labelledby="oms-pump-award-heading"
    >
      <Container className="oms-pump-award-inner">
        <div className="oms-pump-award-panel">
          <div className="oms-pump-award-visual">
            <span className="oms-pump-award-glow" aria-hidden="true" />
            <Image
              src={AWARD_IMAGE_SRC}
              alt={copy.imageAlt}
              width={1122}
              height={1402}
              className="oms-pump-award-image"
              sizes="(max-width: 767px) 78vw, (max-width: 1023px) 42vw, 34vw"
            />
          </div>

          <div className="oms-pump-award-copy">
            <span className="oms-pump-award-accent" aria-hidden="true" />
            <p className="oms-pump-award-eyebrow">{copy.eyebrow}</p>
            <h2 id="oms-pump-award-heading" className="oms-pump-award-heading">
              {copy.heading}
            </h2>
            <p className="oms-pump-award-statement">
              <span className="oms-pump-award-statement-line">
                {copy.statementLine1}
              </span>
              <span className="oms-pump-award-statement-line">
                {copy.statementLine2}
              </span>
            </p>
            <p className="oms-pump-award-body">{copy.body}</p>

            <ul className="oms-pump-award-highlights">
              {awardHighlights.map((item) => {
                const Icon = item.Icon;

                return (
                  <li key={item.key} className="oms-pump-award-highlight">
                    <span
                      className="oms-pump-award-highlight-icon"
                      aria-hidden="true"
                    >
                      <Icon strokeWidth={1.5} />
                    </span>
                    <span className="oms-pump-award-highlight-label">
                      {copy.highlights[item.key]}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
