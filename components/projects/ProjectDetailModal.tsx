"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useRef, type KeyboardEvent, type MouseEvent } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { LocalizedText, ProjectDetail } from "@/lib/projects/projects-data";

type ModalProject = ProjectDetail & {
  completionYear?: LocalizedText | string;
};

type ProjectDetailModalProps = {
  locale: Locale;
  copy: Dictionary["projectsPage"]["hero"];
  project: ProjectDetail | null;
  open: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  titleId?: string;
  counterLabel?: string;
};

function readLocalized(
  value: LocalizedText | string | undefined,
  locale: Locale,
): string {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    return value.trim();
  }

  return (value[locale] ?? "").trim();
}

function readListItems(
  value: readonly (string | LocalizedText)[] | undefined,
  locale: Locale,
): string[] {
  if (!value) {
    return [];
  }

  return value
    .map((item) => readLocalized(item, locale))
    .filter(Boolean);
}

export function ProjectDetailModal({
  locale,
  copy,
  project,
  open,
  onClose,
  onPrev,
  onNext,
  titleId = "oms-projects-modal-title",
  counterLabel,
}: ProjectDetailModalProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const detail = project as ModalProject | null;

  useEffect(() => {
    const node = dialogRef.current;
    if (!node) {
      return;
    }

    if (open && !node.open) {
      node.showModal();
    } else if (!open && node.open) {
      node.close();
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const html = document.documentElement;
    const { body } = document;
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    return () => {
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
    };
  }, [open]);

  const onDialogClose = () => {
    if (open) {
      onClose();
    }
  };

  const onDialogClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const onDialogKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      if (locale === "ar") {
        onPrev();
      } else {
        onNext();
      }
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      if (locale === "ar") {
        onNext();
      } else {
        onPrev();
      }
    }
  };

  const PrevIcon = locale === "ar" ? ChevronRight : ChevronLeft;
  const NextIcon = locale === "ar" ? ChevronLeft : ChevronRight;
  const labels =
    locale === "ar"
      ? {
          location: "الموقع",
          year: "سنة الإنجاز",
        }
      : {
          location: "Location",
          year: "Completion Year",
        };

  const category = detail ? readLocalized(detail.category, locale) : "";
  const name = detail ? readLocalized(detail.name, locale) : "";
  const location = detail ? readLocalized(detail.location, locale) : "";
  const locationDetail = detail
    ? readLocalized(detail.locationDetail, locale)
    : "";
  const description = detail ? readLocalized(detail.description, locale) : "";
  const completionYear = detail ? readLocalized(detail.completionYear, locale) : "";
  const systems = detail
    ? Array.isArray(detail.systems)
      ? readListItems(detail.systems, locale)
      : (() => {
          const text = readLocalized(
            detail.systems as LocalizedText | undefined,
            locale,
          );
          return text ? [text] : [];
        })()
    : [];
  const scopeItems = detail ? readListItems(detail.scopeItems, locale) : [];
  const stationLocations = detail
    ? readListItems(detail.stationLocations, locale)
    : [];
  const projectLocations = detail
    ? readListItems(detail.projectLocations, locale)
    : [];
  const showDescription = Boolean(description) && scopeItems.length === 0;
  const hasFacts = Boolean(location || locationDetail || completionYear);

  return (
    <dialog
      ref={dialogRef}
      className="oms-projects-modal"
      aria-labelledby={detail ? titleId : undefined}
      aria-label={copy.modalLabel}
      onClose={onDialogClose}
      onClick={onDialogClick}
      onKeyDown={onDialogKeyDown}
    >
      {detail ? (
        <div className="oms-projects-modal-panel" dir={locale === "ar" ? "rtl" : "ltr"}>
          <div className="oms-projects-modal-media">
            <Image
              src={detail.image}
              alt={detail.imageAlt[locale]}
              fill
              sizes="(min-width: 1200px) 72.5rem, 100vw"
              className="oms-projects-modal-image"
              style={{
                objectFit: "contain",
                objectPosition: "center",
                transform: "none",
              }}
            />

            <button
              type="button"
              className="oms-projects-modal-close"
              aria-label={copy.closeLabel}
              onClick={onClose}
            >
              <X aria-hidden="true" strokeWidth={1.75} />
            </button>

            <button
              type="button"
              className="oms-projects-modal-arrow oms-projects-modal-arrow--prev"
              aria-label={copy.prevLabel}
              onClick={onPrev}
            >
              <PrevIcon aria-hidden="true" strokeWidth={1.75} />
            </button>
            <button
              type="button"
              className="oms-projects-modal-arrow oms-projects-modal-arrow--next"
              aria-label={copy.nextLabel}
              onClick={onNext}
            >
              <NextIcon aria-hidden="true" strokeWidth={1.75} />
            </button>

            {counterLabel ? (
              <p className="oms-projects-modal-counter">{counterLabel}</p>
            ) : null}
          </div>

          <div className="oms-projects-modal-body">
            <div className="oms-projects-modal-intro">
              <div className="oms-projects-modal-heading">
                {category ? (
                  <p className="oms-projects-modal-eyebrow">{category}</p>
                ) : null}
                <h2 id={titleId} className="oms-projects-modal-title">
                  {name}
                </h2>
              </div>

              {hasFacts ? (
                <dl className="oms-projects-modal-facts">
                  {location || locationDetail ? (
                    <div className="oms-projects-modal-fact">
                      <dt>{labels.location}</dt>
                      {location ? <dd>{location}</dd> : null}
                      {locationDetail ? (
                        <dd className="oms-projects-modal-location-detail">
                          {locationDetail}
                        </dd>
                      ) : null}
                    </div>
                  ) : null}
                  {completionYear ? (
                    <div className="oms-projects-modal-fact">
                      <dt>{labels.year}</dt>
                      <dd>{completionYear}</dd>
                    </div>
                  ) : null}
                </dl>
              ) : null}
            </div>

            <div
              className={`oms-projects-modal-content${
                systems.length > 0 && showDescription
                  ? " oms-projects-modal-content--split"
                  : ""
              }`}
            >
              {showDescription ? (
                <p className="oms-projects-modal-description">{description}</p>
              ) : null}

              {scopeItems.length > 0 ? (
                <div className="oms-projects-modal-scope">
                  <p className="oms-projects-modal-scope-label">{copy.scopeHeading}</p>
                  <ul className="oms-projects-modal-scope-list">
                    {scopeItems.map((item, index) => (
                      <li key={`${index}-${item}`}>{item}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {stationLocations.length > 0 ? (
                <div className="oms-projects-modal-stations">
                  <p className="oms-projects-modal-stations-label">
                    {copy.metroLocationsHeading}
                  </p>
                  <ul className="oms-projects-modal-stations-list">
                    {stationLocations.map((station, index) => (
                      <li key={`${index}-${station}`}>{station}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {projectLocations.length > 0 ? (
                <div className="oms-projects-modal-stations">
                  <p className="oms-projects-modal-stations-label">
                    {copy.projectLocationsHeading}
                  </p>
                  <ul className="oms-projects-modal-stations-list">
                    {projectLocations.map((item, index) => (
                      <li key={`${index}-${item}`}>{item}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {systems.length > 0 ? (
                <div className="oms-projects-modal-systems">
                  <p className="oms-projects-modal-systems-label">
                    {copy.systemsHeading}
                  </p>
                  <ul className="oms-projects-modal-systems-list">
                    {systems.map((system) => (
                      <li key={system}>{system}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </dialog>
  );
}
