"use client";

import Image from "next/image";
import { Montserrat } from "next/font/google";
import { useCallback, useState } from "react";
import { Container } from "@/components/ui/Container";
import { ProjectDetailModal } from "@/components/projects/ProjectDetailModal";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import {
  COMPLETED_PROJECTS,
  COMPLETED_PROJECTS_COUNT,
  normalizeCompletedIndex,
} from "@/lib/projects/completed-projects-data";

const completedSans = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

type CompletedProjectsProps = {
  locale: Locale;
  dict: Dictionary;
};

function viewLabel(template: string, name: string): string {
  return template.replace("{name}", name);
}

export function CompletedProjects({ locale, dict }: CompletedProjectsProps) {
  const copy = dict.projectsPage.completed;
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
      current == null ? current : normalizeCompletedIndex(current - 1),
    );
  }, []);

  const goNext = useCallback(() => {
    setModalIndex((current) =>
      current == null ? current : normalizeCompletedIndex(current + 1),
    );
  }, []);

  const activeProject =
    modalIndex == null ? null : (COMPLETED_PROJECTS[modalIndex] ?? null);

  const firstRow = COMPLETED_PROJECTS.slice(0, 4);
  const secondRow = COMPLETED_PROJECTS.slice(4, 8);
  const thirdRow = COMPLETED_PROJECTS.slice(8, 11);
  const fourthRow = COMPLETED_PROJECTS.slice(11);

  const renderCard = (project: (typeof COMPLETED_PROJECTS)[number], index: number) => {
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
            sizes="(min-width: 1200px) 25vw, (min-width: 768px) 50vw, 100vw"
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
  };

  return (
    <section
      className={`${completedSans.variable} oms-completed`}
      aria-labelledby="oms-completed-heading"
    >
      <Container className="oms-completed-inner">
        <div className="oms-completed-copy" dir={locale === "ar" ? "rtl" : "ltr"}>
          <p className="oms-completed-eyebrow">{copy.eyebrow}</p>
          <h2 id="oms-completed-heading" className="oms-completed-heading">
            {copy.heading}
          </h2>
          <p className="oms-completed-intro">{copy.intro}</p>
        </div>

        <div className="oms-completed-grid">
          <div className="oms-completed-row oms-completed-row--four">
            {firstRow.map((project, index) => renderCard(project, index))}
          </div>
          <div className="oms-completed-row oms-completed-row--four">
            {secondRow.map((project, index) => renderCard(project, index + 4))}
          </div>
          <div className="oms-completed-row oms-completed-row--three">
            {thirdRow.map((project, index) => renderCard(project, index + 8))}
          </div>
          <div className="oms-completed-row oms-completed-row--two">
            {fourthRow.map((project, index) => renderCard(project, index + 11))}
          </div>
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
        titleId="oms-completed-modal-title"
        counterLabel={
          modalIndex == null
            ? undefined
            : `${String(modalIndex + 1).padStart(2, "0")} / ${String(COMPLETED_PROJECTS_COUNT).padStart(2, "0")}`
        }
      />
    </section>
  );
}
