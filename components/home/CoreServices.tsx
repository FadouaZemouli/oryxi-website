import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/path";

type CoreServicesProps = {
  locale: Locale;
  dict: Dictionary;
};

type CoreServiceKey =
  | "mep"
  | "electromechanical"
  | "engineering"
  | "hvac";

const coreServiceItems: {
  key: CoreServiceKey;
  src: string;
}[] = [
  {
    key: "mep",
    src: "/images/Services/mep-services.png.png",
  },
  {
    key: "electromechanical",
    src: "/images/Services/electromechanical-services.png.png",
  },
  {
    key: "engineering",
    src: "/images/Services/engineering-services.png.png",
  },
  {
    key: "hvac",
    src: "/images/Services/hvac-services.png.png",
  },
];

export function CoreServices({ locale, dict }: CoreServicesProps) {
  const servicesHref = localizedHref(locale, "/services");
  const copy = dict.home.coreServices;

  return (
    <section
      id="services"
      className="oms-core"
      aria-labelledby="oms-core-heading"
    >
      <Container className="oms-core-inner">
        <header className="oms-core-header">
          <div className="oms-core-heading-block">
            <p className="oms-core-eyebrow">{copy.eyebrow}</p>
            <h2 id="oms-core-heading" className="oms-core-title">
              <span className="oms-core-title-line">{copy.titleLine1}</span>
              <span className="oms-core-title-line oms-core-title-accent">
                {copy.titleLine2}
              </span>
            </h2>
          </div>
          <div className="oms-core-intro">
            <p className="oms-core-supporting">{copy.supporting}</p>
            <Link href={servicesHref} className="oms-core-cta">
              {copy.viewAll}
              <span className="oms-core-cta-arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </header>

        <ul className="oms-core-grid">
          {coreServiceItems.map((item) => {
            const itemCopy = copy.items[item.key];

            return (
              <li key={item.key} className="oms-core-item">
                <Link href={servicesHref} className="oms-core-card">
                  <span className="oms-core-card-media">
                    <Image
                      src={item.src}
                      alt={itemCopy.imageAlt}
                      fill
                      sizes="(min-width: 1280px) 22vw, (min-width: 768px) 44vw, 100vw"
                      className="oms-core-card-image"
                    />
                  </span>
                  <span className="oms-core-card-body">
                    <span className="oms-core-card-title">
                      <span className="oms-core-card-title-lead">
                        {itemCopy.titleLine1}
                      </span>
                      {itemCopy.titleLine2 ? (
                        <span className="oms-core-card-title-trail">
                          {itemCopy.titleLine2}
                        </span>
                      ) : null}
                    </span>
                    <span className="oms-core-card-text">
                      {itemCopy.description}
                    </span>
                    <span className="oms-core-card-arrow" aria-hidden="true">
                      →
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
