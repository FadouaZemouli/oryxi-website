"use client";

import Image from "next/image";
import { Montserrat } from "next/font/google";
import { useCallback, useState } from "react";
import { Container } from "@/components/ui/Container";
import { ProjectDetailModal } from "@/components/projects/ProjectDetailModal";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { projectCardImage } from "@/lib/projects/public-project-image";
import type { ProjectDetail } from "@/lib/projects/projects-data";

const ongoingSans = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

type OngoingProjectsProps = {
  locale: Locale;
  dict: Dictionary;
  projects: readonly ProjectDetail[];
};

function viewLabel(template: string, name: string): string {
  return template.replace("{name}", name);
}

export function OngoingProjects({ locale, dict, projects }: OngoingProjectsProps) {
  const copy = dict.projectsPage.ongoing;
  const heroCopy = dict.projectsPage.hero;
  const [modalIndex, setModalIndex] = useState<number | null>(null);

  const openProject = useCallback((index: number) => {
    setModalIndex(index);
  }, []);

  const closeModal = useCallback(() => {
    setModalIndex(null);
  }, []);

  const goPrev = useCallback(() => {
    setModalIndex((current) =>
      current == null ? current : projects.length === 0 ? null : ((current - 1) % projects.length + projects.length) % projects.length,
    );
  }, [projects.length]);

  const goNext = useCallback(() => {
    setModalIndex((current) =>
      current == null ? current : projects.length === 0 ? null : ((current + 1) % projects.length + projects.length) % projects.length,
    );
  }, [projects.length]);

  const activeProject =
    modalIndex == null ? null : (projects[modalIndex] ?? null);

  return (
    <section
      className={`${ongoingSans.variable} oms-ongoing`}
      aria-labelledby="oms-ongoing-heading"
    >
      <Container className="oms-ongoing-inner">
        <div className="oms-ongoing-copy" dir={locale === "ar" ? "rtl" : "ltr"}>
          <p className="oms-ongoing-eyebrow">{copy.eyebrow}</p>
          <h2 id="oms-ongoing-heading" className="oms-ongoing-heading">
            {copy.heading}
          </h2>
          <p className="oms-ongoing-intro">{copy.intro}</p>
        </div>

        <div className="oms-ongoing-grid">
          {projects.map((project, index) => {
            const name = project.name[locale];
            const image = projectCardImage(project.image, project.gallery);

            return (
              <button
                key={project.id}
                type="button"
                className="oms-ongoing-card"
                aria-label={viewLabel(copy.viewLabel, name)}
                onClick={() => openProject(index)}
              >
                <span className="oms-ongoing-card-media">
                  <Image
                    src={image}
                    unoptimized={image.startsWith("https://")}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    draggable={false}
                    className="oms-ongoing-card-image"
                  />
                  <span className="oms-ongoing-card-overlay" aria-hidden="true" />
                  <span className="oms-ongoing-card-caption">
                    <span className="oms-ongoing-card-title">{name}</span>
                    <span className="oms-ongoing-card-view" aria-hidden="true">
                      <span>{copy.view}</span>
                      <span className="oms-ongoing-card-view-arrow">
                        {copy.viewArrow}
                      </span>
                    </span>
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </Container>

      <ProjectDetailModal
        locale={locale}
        copy={heroCopy}
        project={activeProject}
        open={modalIndex != null}
        onClose={closeModal}
        onPrev={goPrev}
        onNext={goNext}
        titleId="oms-ongoing-modal-title"
        counterLabel={
          modalIndex == null
            ? undefined
            : `${String(modalIndex + 1).padStart(2, "0")} / ${String(projects.length).padStart(2, "0")}`
        }
      />
    </section>
  );
}
