import Image from "next/image";
import { Montserrat } from "next/font/google";
import {
  CircleCheckBig,
  Headset,
  ShieldCheck,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

const aboutSans = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const WIRE_FRAME_SRC = "/images/about/oms-mep-wireframe-white.png.png";

type AboutOmsProps = {
  locale: Locale;
  dict: Dictionary;
};

type ProofPointKey = "experience" | "engineers" | "quality" | "support";

const proofPointOrder: { key: ProofPointKey; Icon: LucideIcon }[] = [
  { key: "experience", Icon: ShieldCheck },
  { key: "engineers", Icon: UsersRound },
  { key: "quality", Icon: CircleCheckBig },
  { key: "support", Icon: Headset },
];

export function AboutOms({ dict }: AboutOmsProps) {
  const copy = dict.home.about;

  return (
    <section
      id="about"
      className={`oms-about-oms ${aboutSans.variable}`}
      aria-labelledby="oms-about-oms-heading"
    >
      <Container className="oms-about-oms-inner">
        <div className="oms-about-oms-content">
          <p className="oms-about-oms-eyebrow">{copy.eyebrow}</p>
          <h2 id="oms-about-oms-heading" className="oms-about-oms-title">
            <span className="oms-about-oms-title-line">{copy.titleLine1}</span>
            <span className="oms-about-oms-title-line oms-about-oms-title-line-combined">
              {copy.titleLine2}{" "}
              <span className="oms-about-oms-title-accent">{copy.titleAccent}</span>
            </span>
          </h2>
          <p className="oms-about-oms-body">{copy.body}</p>

          <ul className="oms-about-oms-proof">
            {proofPointOrder.map((item) => {
              const point = copy.proofPoints[item.key];
              const Icon = item.Icon;

              return (
                <li key={item.key} className="oms-about-oms-proof-item">
                  <span className="oms-about-oms-proof-icon">
                    <Icon aria-hidden strokeWidth={1.8} />
                  </span>
                  <span className="oms-about-oms-proof-text">
                    <span className="oms-about-oms-proof-line">
                      {point.line1}
                    </span>
                    <span className="oms-about-oms-proof-line">
                      {point.line2}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="oms-about-oms-visual" aria-hidden="true">
          <Image
            src={WIRE_FRAME_SRC}
            alt=""
            fill
            sizes="(min-width: 1024px) 42vw, 100vw"
            className="oms-about-oms-wireframe"
            priority={false}
          />
        </div>
      </Container>
    </section>
  );
}
