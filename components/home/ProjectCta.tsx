import Image from "next/image";
import Link from "next/link";
import {
  FilePenLine,
  Mail,
  Phone,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/path";

const PROJECT_CTA_IMAGE = "/images/footer/oms-fire-system-wide.jpg";

type ProjectCtaProps = {
  locale: Locale;
  dict: Dictionary;
};

type ActionConfig = {
  key: "quote" | "call" | "email";
  Icon: LucideIcon;
  className: string;
  href: string;
  external?: boolean;
};

export function ProjectCta({ locale, dict }: ProjectCtaProps) {
  const copy = dict.home.projectCta;
  const contact = dict.footer.contactDetails;
  const quoteHref = localizedHref(locale, "/request-quote");

  const actions: ActionConfig[] = [
    {
      key: "quote",
      Icon: FilePenLine,
      className: "oms-project-cta-action oms-project-cta-action--quote",
      href: quoteHref,
    },
    {
      key: "call",
      Icon: Phone,
      className: "oms-project-cta-action oms-project-cta-action--call",
      href: `tel:${contact.phoneTel}`,
      external: true,
    },
    {
      key: "email",
      Icon: Mail,
      className: "oms-project-cta-action oms-project-cta-action--email",
      href: `mailto:${contact.email}`,
      external: true,
    },
  ];

  return (
    <section
      id="project-cta"
      className="oms-project-cta"
      aria-labelledby="oms-project-cta-heading"
    >
      <div className="oms-project-cta-media" aria-hidden="true">
        <Image
          src={PROJECT_CTA_IMAGE}
          alt=""
          fill
          priority
          sizes="100vw"
          className="oms-project-cta-image"
        />
        <div className="oms-project-cta-overlay" />
      </div>

      <Container className="oms-project-cta-inner">
        <div className="oms-project-cta-layout">
          <div className="oms-project-cta-copy">
            <h2 id="oms-project-cta-heading" className="oms-project-cta-title">
              <span className="oms-project-cta-title-line">
                {copy.titleLead}{" "}
                <span className="oms-project-cta-title-accent">
                  {copy.titleAccent}
                </span>
              </span>
              <span className="oms-project-cta-title-line">{copy.titleTrail}</span>
            </h2>
            <span className="oms-project-cta-title-rule" aria-hidden="true" />
            <p className="oms-project-cta-supporting">{copy.supporting}</p>
          </div>

          <div className="oms-project-cta-actions">
            {actions.map((action) => {
              const Icon = action.Icon;

              const content = (() => {
                if (action.key === "quote") {
                  const actionCopy = copy.actions.quote;
                  return (
                    <>
                      <span className="oms-project-cta-action-icon" aria-hidden="true">
                        <Icon strokeWidth={1.8} />
                      </span>
                      <span className="oms-project-cta-action-copy oms-project-cta-action-copy--quote">
                        <span className="oms-project-cta-action-label">
                          <span>{actionCopy.line1}</span>
                          <span>{actionCopy.line2}</span>
                        </span>
                        <span
                          className="oms-project-cta-action-rule"
                          aria-hidden="true"
                        />
                      </span>
                      <span
                        className="oms-project-cta-action-arrow oms-project-cta-action-arrow--quote"
                        aria-hidden="true"
                      >
                        →
                      </span>
                    </>
                  );
                }

                const actionCopy = copy.actions[action.key];
                return (
                  <>
                    <span className="oms-project-cta-action-icon" aria-hidden="true">
                      <Icon strokeWidth={1.8} />
                    </span>
                    <span className="oms-project-cta-action-body">
                      <span className="oms-project-cta-action-heading">
                        {actionCopy.heading}
                      </span>
                      <span
                        className="oms-project-cta-action-rule"
                        aria-hidden="true"
                      />
                    </span>
                    <span className="oms-project-cta-action-footer">
                      <span className="oms-project-cta-action-detail oms-ltr-value">
                        {action.key === "call" ? contact.phone : contact.email}
                      </span>
                    </span>
                  </>
                );
              })();

              if (action.external) {
                return (
                  <a
                    key={action.key}
                    href={action.href}
                    className={action.className}
                  >
                    {content}
                  </a>
                );
              }

              return (
                <Link
                  key={action.key}
                  href={action.href}
                  className={action.className}
                >
                  {content}
                </Link>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
