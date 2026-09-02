"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import {
  FEATURED_PROJECT_CARD_GROUPS,
  FEATURED_PROJECT_IMAGES,
  FEATURED_PROJECT_ROTATION_MS,
  FEATURED_PROJECT_STAGGER_MS,
  type FeaturedProjectKey,
  type FeaturedProjectLocationKey,
} from "@/lib/projects/featured-projects-data";

type FeaturedProjectsGridProps = {
  dict: Dictionary;
};

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => {
      mediaQuery.removeEventListener("change", updatePreference);
    };
  }, []);

  return prefersReducedMotion;
}

export function FeaturedProjectsGrid({ dict }: FeaturedProjectsGridProps) {
  const copy = dict.home.featuredProjects;
  const prefersReducedMotion = usePrefersReducedMotion();
  const timeoutRefs = useRef<number[]>([]);
  const [indices, setIndices] = useState(() =>
    FEATURED_PROJECT_CARD_GROUPS.map(() => 0),
  );
  const [animateCards, setAnimateCards] = useState(() =>
    FEATURED_PROJECT_CARD_GROUPS.map(() => false),
  );

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const intervalId = window.setInterval(() => {
      FEATURED_PROJECT_CARD_GROUPS.forEach((_, cardIndex) => {
        const timeoutId = window.setTimeout(() => {
          setIndices((current) =>
            current.map((value, index) =>
              index === cardIndex ? (value + 1) % 3 : value,
            ),
          );
          setAnimateCards((current) =>
            current.map((value, index) => (index === cardIndex ? true : value)),
          );
        }, cardIndex * FEATURED_PROJECT_STAGGER_MS);

        timeoutRefs.current.push(timeoutId);
      });
    }, FEATURED_PROJECT_ROTATION_MS);

    return () => {
      window.clearInterval(intervalId);
      timeoutRefs.current.forEach((timeoutId) => {
        window.clearTimeout(timeoutId);
      });
      timeoutRefs.current = [];
    };
  }, [prefersReducedMotion]);

  return (
    <ul className="oms-featured-projects-grid">
      {FEATURED_PROJECT_CARD_GROUPS.map((group, cardIndex) => {
        const projectKey = group[indices[cardIndex] ?? 0];
        const project = copy.items[projectKey];
        const location =
          copy.locations[project.locationKey as FeaturedProjectLocationKey];
        const qcddLine = `${copy.qcddPrefix} • ${project.qcddYear}`;

        return (
          <li key={cardIndex} className="oms-featured-projects-item">
            <article className="oms-featured-project-card">
              <div
                key={`${cardIndex}-${projectKey}`}
                className={
                  animateCards[cardIndex] && !prefersReducedMotion
                    ? "oms-featured-project-card-content oms-featured-project-card-content--animate"
                    : "oms-featured-project-card-content"
                }
              >
                <div className="oms-featured-project-media">
                  <Image
                    src={FEATURED_PROJECT_IMAGES[projectKey as FeaturedProjectKey]}
                    alt={project.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 30vw, (min-width: 768px) 44vw, 100vw"
                    className="oms-featured-project-image"
                  />
                </div>
                <div className="oms-featured-project-body">
                  <h3 className="oms-featured-project-name">{project.name}</h3>
                  <p className="oms-featured-project-location">{location}</p>
                  <p className="oms-featured-project-qcdd">{qcddLine}</p>
                </div>
              </div>
            </article>
          </li>
        );
      })}
    </ul>
  );
}
