"use client";

import { useState } from "react";
import { PROJECT_DETAIL_PRESETS } from "@/lib/admin/projects/details";
import type { ProjectDetails } from "@/lib/admin/projects/types";
import { slugifyProjectTitle } from "@/lib/admin/projects/helpers";

type SectionType = "locations" | "stations" | "systems" | "custom";

type EditorItem = {
  id: string;
  en: string;
  ar: string;
};

type EditorSection = {
  id: string;
  type: SectionType;
  key: string;
  label_en: string;
  label_ar: string;
  items: EditorItem[];
};

function newId() {
  return crypto.randomUUID();
}

function toEditorSections(details: ProjectDetails): EditorSection[] {
  return details.map((section) => ({
    id: newId(),
    type: section.key === "locations" || section.key === "stations" || section.key === "systems"
      ? section.key
      : "custom",
    key: section.key,
    label_en: section.label_en,
    label_ar: section.label_ar,
    items: section.items.map((item) => ({
      id: newId(),
      en: item.en,
      ar: item.ar,
    })),
  }));
}

function createSection(type: SectionType = "locations"): EditorSection {
  if (type === "custom") {
    return {
      id: newId(),
      type,
      key: "",
      label_en: "",
      label_ar: "",
      items: [{ id: newId(), en: "", ar: "" }],
    };
  }

  const preset = PROJECT_DETAIL_PRESETS[type];
  return {
    id: newId(),
    type,
    key: preset.key,
    label_en: preset.label_en,
    label_ar: preset.label_ar,
    items: [{ id: newId(), en: "", ar: "" }],
  };
}

function moveItem<T>(list: T[], index: number, offset: number) {
  const nextIndex = index + offset;
  if (nextIndex < 0 || nextIndex >= list.length) {
    return list;
  }

  const next = [...list];
  const [item] = next.splice(index, 1);
  if (!item) {
    return list;
  }

  next.splice(nextIndex, 0, item);
  return next;
}

export function ProjectDetailsEditor({
  initialDetails,
}: {
  initialDetails: ProjectDetails;
}) {
  const [sections, setSections] = useState(() => toEditorSections(initialDetails));

  function updateSection(id: string, patch: Partial<EditorSection>) {
    setSections((current) =>
      current.map((section) => (section.id === id ? { ...section, ...patch } : section)),
    );
  }

  function changeType(id: string, type: SectionType) {
    setSections((current) =>
      current.map((section) => {
        if (section.id !== id) {
          return section;
        }

        if (type === "custom") {
          return {
            ...section,
            type,
            key: section.key && !(section.key in PROJECT_DETAIL_PRESETS)
              ? section.key
              : slugifyProjectTitle(section.label_en) || "",
          };
        }

        const preset = PROJECT_DETAIL_PRESETS[type];
        return {
          ...section,
          type,
          key: preset.key,
          label_en: preset.label_en,
          label_ar: preset.label_ar,
        };
      }),
    );
  }

  function updateItem(
    sectionId: string,
    itemId: string,
    patch: Partial<EditorItem>,
  ) {
    setSections((current) =>
      current.map((section) => {
        if (section.id !== sectionId) {
          return section;
        }

        return {
          ...section,
          items: section.items.map((item) =>
            item.id === itemId ? { ...item, ...patch } : item,
          ),
        };
      }),
    );
  }

  const payload = sections.map((section) => ({
    key:
      section.type === "custom"
        ? slugifyProjectTitle(section.key || section.label_en)
        : section.key,
    label_en: section.label_en,
    label_ar: section.label_ar,
    items: section.items.map((item) => ({
      en: item.en,
      ar: item.ar,
    })),
  }));

  return (
    <div className="oms-admin-details">
      <input
        type="hidden"
        name="project_details"
        value={JSON.stringify(payload)}
      />

      {sections.length === 0 ? (
        <p className="oms-admin-field-hint oms-admin-details-empty">
          No structured details yet. Most projects do not need this.
        </p>
      ) : null}

      {sections.map((section, sectionIndex) => (
        <article
          key={section.id}
          className="oms-admin-details-card"
          aria-label={`Project details section ${sectionIndex + 1}`}
        >
          <div className="oms-admin-details-card-head">
            <div className="oms-admin-field">
              <label className="oms-admin-label" htmlFor={`details-type-${section.id}`}>
                Section Type
              </label>
              <select
                id={`details-type-${section.id}`}
                className="oms-admin-input"
                value={section.type}
                onChange={(event) =>
                  changeType(section.id, event.target.value as SectionType)
                }
              >
                <option value="locations">Locations</option>
                <option value="stations">Stations</option>
                <option value="systems">Systems</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            <div className="oms-admin-details-move">
              <button
                className="oms-admin-media-button"
                type="button"
                disabled={sectionIndex === 0}
                onClick={() => setSections((current) => moveItem(current, sectionIndex, -1))}
              >
                Up
              </button>
              <button
                className="oms-admin-media-button"
                type="button"
                disabled={sectionIndex === sections.length - 1}
                onClick={() => setSections((current) => moveItem(current, sectionIndex, 1))}
              >
                Down
              </button>
              <button
                className="oms-admin-media-button oms-admin-media-button-danger"
                type="button"
                onClick={() =>
                  setSections((current) =>
                    current.filter((item) => item.id !== section.id),
                  )
                }
              >
                Remove Section
              </button>
            </div>
          </div>

          <div className="oms-admin-form-grid">
            {section.type === "custom" ? (
              <div className="oms-admin-field">
                <label className="oms-admin-label" htmlFor={`details-key-${section.id}`}>
                  Section Key
                </label>
                <input
                  id={`details-key-${section.id}`}
                  className="oms-admin-input"
                  value={section.key}
                  onChange={(event) =>
                    updateSection(section.id, { key: event.target.value })
                  }
                  placeholder="building-codes"
                />
              </div>
            ) : null}
            <div className="oms-admin-field">
              <label className="oms-admin-label" htmlFor={`details-label-en-${section.id}`}>
                English Label
              </label>
              <input
                id={`details-label-en-${section.id}`}
                className="oms-admin-input"
                value={section.label_en}
                onChange={(event) =>
                  updateSection(section.id, { label_en: event.target.value })
                }
              />
            </div>
            <div className="oms-admin-field">
              <label className="oms-admin-label" htmlFor={`details-label-ar-${section.id}`}>
                Arabic Label
              </label>
              <input
                id={`details-label-ar-${section.id}`}
                className="oms-admin-input"
                dir="rtl"
                value={section.label_ar}
                onChange={(event) =>
                  updateSection(section.id, { label_ar: event.target.value })
                }
              />
            </div>
          </div>

          <div className="oms-admin-details-items">
            <p className="oms-admin-details-items-label">Items</p>
            {section.items.map((item, itemIndex) => (
              <div key={item.id} className="oms-admin-details-item">
                <input
                  className="oms-admin-input"
                  value={item.en}
                  aria-label={`English item ${itemIndex + 1}`}
                  placeholder="English"
                  onChange={(event) =>
                    updateItem(section.id, item.id, { en: event.target.value })
                  }
                />
                <input
                  className="oms-admin-input"
                  dir="rtl"
                  value={item.ar}
                  aria-label={`Arabic item ${itemIndex + 1}`}
                  placeholder="العربية"
                  onChange={(event) =>
                    updateItem(section.id, item.id, { ar: event.target.value })
                  }
                />
                <div className="oms-admin-details-item-actions">
                  <button
                    className="oms-admin-media-button"
                    type="button"
                    disabled={itemIndex === 0}
                    onClick={() =>
                      setSections((current) =>
                        current.map((entry) =>
                          entry.id === section.id
                            ? {
                                ...entry,
                                items: moveItem(entry.items, itemIndex, -1),
                              }
                            : entry,
                        ),
                      )
                    }
                  >
                    Up
                  </button>
                  <button
                    className="oms-admin-media-button"
                    type="button"
                    disabled={itemIndex === section.items.length - 1}
                    onClick={() =>
                      setSections((current) =>
                        current.map((entry) =>
                          entry.id === section.id
                            ? {
                                ...entry,
                                items: moveItem(entry.items, itemIndex, 1),
                              }
                            : entry,
                        ),
                      )
                    }
                  >
                    Down
                  </button>
                  <button
                    className="oms-admin-media-button oms-admin-media-button-danger"
                    type="button"
                    onClick={() =>
                      setSections((current) =>
                        current.map((entry) =>
                          entry.id === section.id
                            ? {
                                ...entry,
                                items: entry.items.filter(
                                  (row) => row.id !== item.id,
                                ),
                              }
                            : entry,
                        ),
                      )
                    }
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <button
              className="oms-admin-media-button"
              type="button"
              onClick={() =>
                setSections((current) =>
                  current.map((entry) =>
                    entry.id === section.id
                      ? {
                          ...entry,
                          items: [...entry.items, { id: newId(), en: "", ar: "" }],
                        }
                      : entry,
                  ),
                )
              }
            >
              + Add Item
            </button>
          </div>
        </article>
      ))}

      <button
        className="oms-admin-media-button oms-admin-media-button-primary"
        type="button"
        onClick={() => setSections((current) => [...current, createSection()])}
      >
        + Add Section
      </button>
    </div>
  );
}
