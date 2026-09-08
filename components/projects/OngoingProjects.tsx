"use client";

import Image from "next/image";
import { Montserrat } from "next/font/google";
import { useCallback, useState } from "react";
import { Container } from "@/components/ui/Container";
import { ProjectDetailModal } from "@/components/projects/ProjectDetailModal";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import {
  ONGOING_PROJECTS,
  ONGOING_PROJECTS_COUNT,
  normalizeOngoingIndex,
} from "@/lib/projects/ongoing-projects-data";

const ongoingSans = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

type OngoingProjectsProps = {
  locale: Locale;
  dict: Dictionary;
};

function viewLabel(template: string, name: string): string {
  return template.replace("{name}", name);
}

export function OngoingProjects({ locale, dict }: OngoingProjectsProps) {
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
      current == null ? current : normalizeOngoingIndex(current - 1),
    );
  }, []);

  const goNext = useCallback(() => {
    setModalIndex((current) =>
      current == null ? current : normalizeOngoingIndex(current + 1),
    );
  }, []);

  const activeProject =
    modalIndex == null ? null : (ONGOING_PROJECTS[modalIndex] ?? null);

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
          {ONGOING_PROJECTS.map((project, index) => {
            const name = project.name[locale];

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
                    src={project.image}
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
            : `${String(modalIndex + 1).padStart(2, "0")} / ${String(ONGOING_PROJECTS_COUNT).padStart(2, "0")}`
        }
      />
    </section>
  );
}
