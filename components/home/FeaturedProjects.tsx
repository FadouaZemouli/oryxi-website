import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { FeaturedProjectsGrid } from "@/components/home/FeaturedProjectsGrid";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/path";

type FeaturedProjectsProps = {
  locale: Locale;
  dict: Dictionary;
};

export function FeaturedProjects({ locale, dict }: FeaturedProjectsProps) {
  const copy = dict.home.featuredProjects;
  const projectsHref = localizedHref(locale, "/projects");

  return (
    <section
      id="featured-projects"
      className="oms-featured-projects"
      aria-labelledby="oms-featured-projects-heading"
    >
      <Container className="oms-featured-projects-inner">
        <header className="oms-featured-projects-header">
          <h2
            id="oms-featured-projects-heading"
            className="oms-featured-projects-title"
          >
            {copy.eyebrow}
          </h2>
          <Link href={projectsHref} className="oms-featured-projects-cta">
            {copy.viewAll}
            <span className="oms-featured-projects-cta-arrow" aria-hidden="true">
              →
            </span>
          </Link>
        </header>

        <FeaturedProjectsGrid dict={dict} />
      </Container>
    </section>
  );
}
