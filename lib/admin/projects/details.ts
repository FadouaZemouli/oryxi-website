import type {
  ProjectDetails,
  ProjectDetailsItem,
  ProjectDetailsSection,
} from "@/lib/admin/projects/types";

export type ProjectDetailsPresetId = "locations" | "stations" | "systems";

export const PROJECT_DETAIL_PRESETS: Record<
  ProjectDetailsPresetId,
  { key: string; label_en: string; label_ar: string }
> = {
  locations: {
    key: "locations",
    label_en: "Project Locations",
    label_ar: "مواقع المشروع",
  },
  stations: {
    key: "stations",
    label_en: "Metro & Tram Locations",
    label_ar: "مواقع المترو والترام",
  },
  systems: {
    key: "systems",
    label_en: "Systems / Areas Covered",
    label_ar: "الأنظمة / المناطق المشمولة",
  },
};

export const PROJECT_DETAILS_LIMITS = {
  key: 40,
  label: 80,
  item: 160,
  maxSections: 20,
  maxItems: 50,
} as const;

const SECTION_KEY_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const QCDD_YEAR_PATTERN = /^[0-9]{4}([–-][0-9]{4})?$/;

function asTrimmedString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function normalizeQcddYear(value: string) {
  return value.trim().replace(/^([0-9]{4})-([0-9]{4})$/, "$1–$2");
}

export function parseQcddYear(
  value: unknown,
): { ok: true; value: string | null } | { ok: false; error: string } {
  const raw = asTrimmedString(value);
  if (!raw) {
    return { ok: true, value: null };
  }

  const normalized = normalizeQcddYear(raw);
  if (!QCDD_YEAR_PATTERN.test(normalized)) {
    return {
      ok: false,
      error: "QCDD certificate year must be a year such as 2026 or a range such as 2024–2025.",
    };
  }

  return { ok: true, value: normalized };
}

function parseItem(value: unknown): ProjectDetailsItem | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const record = value as Record<string, unknown>;
  const en = asTrimmedString(record.en);
  const ar = asTrimmedString(record.ar);

  if (!en || !ar) {
    return null;
  }

  if (
    en.length > PROJECT_DETAILS_LIMITS.item ||
    ar.length > PROJECT_DETAILS_LIMITS.item
  ) {
    return null;
  }

  return { en, ar };
}

function parseSection(value: unknown): ProjectDetailsSection | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const record = value as Record<string, unknown>;
  const key = asTrimmedString(record.key).toLowerCase();
  const label_en = asTrimmedString(record.label_en);
  const label_ar = asTrimmedString(record.label_ar);

  if (
    !key ||
    key.length > PROJECT_DETAILS_LIMITS.key ||
    !SECTION_KEY_PATTERN.test(key) ||
    !label_en ||
    !label_ar ||
    label_en.length > PROJECT_DETAILS_LIMITS.label ||
    label_ar.length > PROJECT_DETAILS_LIMITS.label ||
    !Array.isArray(record.items) ||
    record.items.length === 0 ||
    record.items.length > PROJECT_DETAILS_LIMITS.maxItems
  ) {
    return null;
  }

  const items = record.items
    .map((item) => parseItem(item))
    .filter((item): item is ProjectDetailsItem => Boolean(item));

  if (items.length === 0 || items.length !== record.items.length) {
    return null;
  }

  return { key, label_en, label_ar, items };
}

export function readProjectDetails(value: unknown): ProjectDetails {
  if (value == null || value === "") {
    return [];
  }

  let raw: unknown = value;
  if (typeof value === "string") {
    try {
      raw = JSON.parse(value);
    } catch {
      return [];
    }
  }

  if (!Array.isArray(raw)) {
    return [];
  }

  return raw
    .map((section) => parseSection(section))
    .filter((section): section is ProjectDetailsSection => Boolean(section));
}

export function parseProjectDetailsInput(
  value: unknown,
): { ok: true; value: ProjectDetails } | { ok: false; error: string } {
  if (value == null || value === "") {
    return { ok: true, value: [] };
  }

  let raw: unknown = value;
  if (typeof value === "string") {
    try {
      raw = JSON.parse(value);
    } catch {
      return { ok: false, error: "Project details could not be saved." };
    }
  }

  if (!Array.isArray(raw)) {
    return { ok: false, error: "Project details could not be saved." };
  }

  if (raw.length === 0) {
    return { ok: true, value: [] };
  }

  if (raw.length > PROJECT_DETAILS_LIMITS.maxSections) {
    return {
      ok: false,
      error: "Too many project detail sections. Remove some before saving.",
    };
  }

  const sections: ProjectDetails = [];
  const keys = new Set<string>();

  for (const entry of raw) {
    const section = parseSection(entry);
    if (!section) {
      return {
        ok: false,
        error:
          "Complete each project details section with English and Arabic labels and items, or remove the section.",
      };
    }

    if (keys.has(section.key)) {
      return {
        ok: false,
        error: "Each project details section needs a unique key.",
      };
    }

    keys.add(section.key);
    sections.push(section);
  }

  return { ok: true, value: sections };
}

export function sectionTypeFromKey(key: string): ProjectDetailsPresetId | "custom" {
  if (key === "locations" || key === "stations" || key === "systems") {
    return key;
  }

  return "custom";
}
