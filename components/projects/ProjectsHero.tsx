"use client";

import Image from "next/image";
import { Montserrat } from "next/font/google";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { Container } from "@/components/ui/Container";
import { ProjectDetailModal } from "@/components/projects/ProjectDetailModal";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { useCarouselAutoplay } from "@/lib/carousel/use-carousel-autoplay";
import {
  PROJECTS_HERO_AUTOPLAY_MS,
  PROJECTS_HERO_PROJECTS,
  PROJECTS_HERO_TRANSITION_MS,
  clearProjectHash,
  formatProjectCounter,
  normalizeProjectIndex,
  projectIndexFromHash,
  syncProjectHash,
} from "@/lib/projects/projects-data";

const projectsHeroSans = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

type ProjectsHeroProps = {
  locale: Locale;
  dict: Dictionary;
};

export function ProjectsHero({ locale, dict }: ProjectsHeroProps) {
  const copy = dict.projectsPage.hero;
  const headingId = useId();
  const viewTriggerRef = useRef<HTMLButtonElement | null>(null);
  const restoreFocusRef = useRef(false);

  const [activeIndex, setActiveIndex] = useState(0);
  const [timerEpoch, setTimerEpoch] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  const goTo = useCallback((nextIndex: number, options?: { resetTimer?: boolean }) => {
    setActiveIndex(normalizeProjectIndex(nextIndex));
    if (options?.resetTimer) {
      setTimerEpoch((value) => value + 1);
    }
  }, []);

  const goNext = useCallback(() => {
    goTo(activeIndex + 1, { resetTimer: true });
  }, [activeIndex, goTo]);

  const goPrev = useCallback(() => {
    goTo(activeIndex - 1, { resetTimer: true });
  }, [activeIndex, goTo]);

  const selectSlide = useCallback(
    (index: number) => {
      goTo(index, { resetTimer: true });
    },
    [goTo],
  );

  const openModal = useCallback(() => {
    restoreFocusRef.current = true;
    setModalOpen(true);
    syncProjectHash(activeIndex);
  }, [activeIndex]);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setTimerEpoch((value) => value + 1);
    clearProjectHash();
  }, []);

  const modalPrev = useCallback(() => {
    const nextIndex = normalizeProjectIndex(activeIndex - 1);
    setActiveIndex(nextIndex);
    setTimerEpoch((value) => value + 1);
    syncProjectHash(nextIndex);
  }, [activeIndex]);

  const modalNext = useCallback(() => {
    const nextIndex = normalizeProjectIndex(activeIndex + 1);
    setActiveIndex(nextIndex);
    setTimerEpoch((value) => value + 1);
    syncProjectHash(nextIndex);
  }, [activeIndex]);

  const {
    prefersReducedMotion,
    onPointerEnter,
    onPointerLeave,
    onPointerCancel,
  } = useCarouselAutoplay({
    intervalMs: PROJECTS_HERO_AUTOPLAY_MS,
    enabled: !modalOpen,
    resetKey: timerEpoch,
    onAdvance: () => {
      setActiveIndex((current) => normalizeProjectIndex(current + 1));
    },
  });

  useEffect(() => {
    const syncFromHash = () => {
      const index = projectIndexFromHash(window.location.hash);
      if (index == null) {
        return;
      }

      setActiveIndex(index);
      setTimerEpoch((value) => value + 1);
      setModalOpen(true);
    };

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => {
      window.removeEventListener("hashchange", syncFromHash);
    };
  }, []);

  useEffect(() => {
    if (modalOpen || !restoreFocusRef.current) {
      return;
    }

    restoreFocusRef.current = false;
    viewTriggerRef.current?.focus();
  }, [modalOpen]);

  const onHeroKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (modalOpen) {
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      if (locale === "ar") {
        goPrev();
      } else {
        goNext();
      }
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      if (locale === "ar") {
        goNext();
      } else {
        goPrev();
      }
    }
  };

  const activeProject = PROJECTS_HERO_PROJECTS[activeIndex];
  const counterLabel = formatProjectCounter(activeIndex);
  const transitionMs = prefersReducedMotion ? 0 : PROJECTS_HERO_TRANSITION_MS;
  const PrevIcon = locale === "ar" ? ChevronRight : ChevronLeft;
  const NextIcon = locale === "ar" ? ChevronLeft : ChevronRight;

  return (
    <section
      className={`oms-projects-hero ${projectsHeroSans.variable}`}
      aria-roledescription="carousel"
      aria-labelledby={headingId}
      aria-label={copy.carouselLabel}
      data-locale={locale}
      tabIndex={0}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onPointerCancel={onPointerCancel}
      onKeyDown={onHeroKeyDown}
    >
      <h1 id={headingId} className="sr-only">
        {dict.nav.projects}
      </h1>

      <div className="oms-projects-hero-slides">
        {PROJECTS_HERO_PROJECTS.map((project, index) => {
          const isActive = index === activeIndex;

          return (
            <div
              key={project.id}
              className={`oms-projects-hero-slide oms-projects-hero-slide--${project.id}${
                isActive ? " oms-projects-hero-slide--active" : ""
              }`}
              data-framing={project.framing}
              role="group"
              aria-roledescription="slide"
              aria-label={`${formatProjectCounter(index)} — ${project.name[locale]}`}
              aria-hidden={!isActive}
              style={{
                transitionDuration: `${transitionMs}ms`,
                ["--oms-hero-pos" as string]: project.objectPosition,
                ["--oms-hero-pos-mobile" as string]: project.objectPositionMobile,
              }}
            >
              <div className="oms-projects-hero-media">
                <Image
                  src={project.image}
                  alt={isActive ? project.imageAlt[locale] : ""}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  draggable={false}
                  className="oms-projects-hero-image"
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="oms-projects-hero-overlay" aria-hidden="true" />

      <Container className="oms-projects-hero-inner">
        {activeProject ? (
          <div className="oms-projects-hero-copy" dir={locale === "ar" ? "rtl" : "ltr"}>
            <p className="oms-projects-hero-eyebrow">{copy.eyebrow}</p>
            <h2 className="oms-projects-hero-title">{activeProject.name[locale]}</h2>
            <p className="oms-projects-hero-meta">
              <span>{activeProject.category[locale]}</span>
              <span aria-hidden="true"> | </span>
              <span>{activeProject.location[locale]}</span>
            </p>
            <p className="oms-projects-hero-statement">
              {activeProject.description[locale]}
            </p>
            <button
              ref={viewTriggerRef}
              type="button"
              className="oms-projects-hero-view"
              onClick={openModal}
            >
              <span>{copy.viewProject}</span>
              <span className="oms-projects-hero-view-arrow" aria-hidden="true">
                {copy.viewProjectArrow}
              </span>
            </button>
          </div>
        ) : null}
      </Container>

      <button
        type="button"
        className="oms-projects-hero-arrow oms-projects-hero-arrow--prev"
        aria-label={copy.prevLabel}
        onClick={goPrev}
      >
        <PrevIcon aria-hidden="true" strokeWidth={1.75} />
      </button>

      <button
        type="button"
        className="oms-projects-hero-arrow oms-projects-hero-arrow--next"
        aria-label={copy.nextLabel}
        onClick={goNext}
      >
        <NextIcon aria-hidden="true" strokeWidth={1.75} />
      </button>

      <p className="oms-projects-hero-counter" aria-live="polite" aria-atomic="true">
        {counterLabel}
      </p>

      <div className="oms-projects-hero-dots" role="group" aria-label={copy.dotsLabel}>
        {PROJECTS_HERO_PROJECTS.map((project, index) => {
          const isActive = index === activeIndex;

          return (
            <button
              key={project.id}
              type="button"
              className={`oms-projects-hero-dot${
                isActive ? " oms-projects-hero-dot--active" : ""
              }`}
              aria-current={isActive ? "true" : undefined}
              aria-label={`${formatProjectCounter(index)} — ${project.name[locale]}`}
              onClick={() => selectSlide(index)}
            />
          );
        })}
      </div>

      <ProjectDetailModal
        locale={locale}
        copy={copy}
        project={activeProject ?? null}
        open={modalOpen}
        onClose={closeModal}
        onPrev={modalPrev}
        onNext={modalNext}
        counterLabel={counterLabel}
      />
    </section>
  );
}
