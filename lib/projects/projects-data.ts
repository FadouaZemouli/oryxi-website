import type { Locale } from "@/lib/i18n/config";

export type ProjectId =
  | "qanat-quartier"
  | "gewan-island"
  | "madina-centrale"
  | "regency-residence-tower"
  | "rkh-doha-metro";

export type LocalizedText = Record<Locale, string>;

export type ProjectDetail = {
  id: string;
  image: string;
  name: LocalizedText;
  category: LocalizedText;
  location: LocalizedText;
  description?: LocalizedText;
  imageAlt: LocalizedText;
  scopeItems?: readonly (string | LocalizedText)[];
  locationDetail?: string | LocalizedText;
  stationLocations?: readonly LocalizedText[];
  projectLocations?: readonly (string | LocalizedText)[];
  systems?: LocalizedText | readonly (string | LocalizedText)[];
};

export type ProjectRecord = ProjectDetail & {
  id: ProjectId;
  framing: "square" | "balanced" | "wide";
  objectPosition: string;
  objectPositionMobile: string;
  description: LocalizedText;
};

export const PROJECTS_HERO_AUTOPLAY_MS = 4000;
export const PROJECTS_HERO_TRANSITION_MS = 650;

export const PROJECTS_GENERIC_DESCRIPTION: LocalizedText = {
  en: "Explore this OMS project and learn more about the delivered solutions.",
  ar: "استكشف هذا المشروع من مشاريع OMS وتعرّف على المزيد حول الحلول المقدمة.",
};

export const PROJECTS_HERO_PROJECTS: readonly ProjectRecord[] = [
  {
    id: "qanat-quartier",
    image: "/images/projects/hero/qanat-quartier.png",
    framing: "square",
    objectPosition: "center 46%",
    objectPositionMobile: "center 48%",
    name: {
      en: "Qanat Quartier",
      ar: "قناة كارتييه",
    },
    category: {
      en: "PROJECT",
      ar: "مشروع",
    },
    location: {
      en: "Doha, Qatar",
      ar: "الدوحة، قطر",
    },
    description: PROJECTS_GENERIC_DESCRIPTION,
    imageAlt: {
      en: "Qanat Quartier canal and architecture in Doha, Qatar",
      ar: "قناة كارتييه في الدوحة، قطر",
    },
  },
  {
    id: "gewan-island",
    image: "/images/projects/hero/gewan-island.png",
    framing: "wide",
    objectPosition: "center 42%",
    objectPositionMobile: "center 46%",
    name: {
      en: "Gewan Island",
      ar: "جزيرة جيوان",
    },
    category: {
      en: "PROJECT",
      ar: "مشروع",
    },
    location: {
      en: "Doha, Qatar",
      ar: "الدوحة، قطر",
    },
    description: PROJECTS_GENERIC_DESCRIPTION,
    imageAlt: {
      en: "Gewan Island pedestrian plaza in Doha, Qatar",
      ar: "جزيرة جيوان في الدوحة، قطر",
    },
  },
  {
    id: "madina-centrale",
    image: "/images/projects/hero/madina-centrale.png",
    framing: "balanced",
    objectPosition: "center 42%",
    objectPositionMobile: "center 46%",
    name: {
      en: "Madina Centrale",
      ar: "مدينة سنترال",
    },
    category: {
      en: "PROJECT",
      ar: "مشروع",
    },
    location: {
      en: "Doha, Qatar",
      ar: "الدوحة، قطر",
    },
    description: PROJECTS_GENERIC_DESCRIPTION,
    imageAlt: {
      en: "Madina Centrale plaza in Doha, Qatar",
      ar: "مدينة سنترال في الدوحة، قطر",
    },
  },
  {
    id: "regency-residence-tower",
    image: "/images/projects/hero/regency-residence-tower.png",
    framing: "balanced",
    objectPosition: "center 18%",
    objectPositionMobile: "center 22%",
    name: {
      en: "Regency Residence Tower",
      ar: "برج ريجنسي ريزيدنس",
    },
    category: {
      en: "RESIDENTIAL",
      ar: "سكني",
    },
    location: {
      en: "Doha, Qatar",
      ar: "الدوحة، قطر",
    },
    description: PROJECTS_GENERIC_DESCRIPTION,
    imageAlt: {
      en: "Regency Residence Tower in Doha, Qatar",
      ar: "برج ريجنسي ريزيدنس في الدوحة، قطر",
    },
  },
  {
    id: "rkh-doha-metro",
    image: "/images/projects/hero/rkh-doha-metro.png",
    framing: "square",
    objectPosition: "center 42%",
    objectPositionMobile: "center 40%",
    name: {
      en: "RKH Doha Metro",
      ar: "مترو الدوحة RKH",
    },
    category: {
      en: "INFRASTRUCTURE",
      ar: "بنية تحتية",
    },
    location: {
      en: "Doha, Qatar",
      ar: "الدوحة، قطر",
    },
    description: PROJECTS_GENERIC_DESCRIPTION,
    imageAlt: {
      en: "RKH Doha Metro station in Doha, Qatar",
      ar: "محطة مترو الدوحة RKH في الدوحة، قطر",
    },
  },
] as const;

export const PROJECTS_HERO_COUNT = PROJECTS_HERO_PROJECTS.length;

export function normalizeProjectIndex(index: number): number {
  return ((index % PROJECTS_HERO_COUNT) + PROJECTS_HERO_COUNT) % PROJECTS_HERO_COUNT;
}

export function projectIndexFromHash(hash: string): number | null {
  const id = hash.startsWith("#") ? hash.slice(1) : hash;
  const index = PROJECTS_HERO_PROJECTS.findIndex((project) => project.id === id);
  return index >= 0 ? index : null;
}

export function formatProjectCounter(index: number): string {
  const current = String(index + 1).padStart(2, "0");
  const total = String(PROJECTS_HERO_COUNT).padStart(2, "0");
  return `${current} / ${total}`;
}

export function syncProjectHash(index: number): void {
  const project = PROJECTS_HERO_PROJECTS[index];
  if (!project || typeof window === "undefined") {
    return;
  }

  const nextHash = `#${project.id}`;
  if (window.location.hash === nextHash) {
    return;
  }

  const url = `${window.location.pathname}${window.location.search}${nextHash}`;
  window.history.replaceState(null, "", url);
}

export function clearProjectHash(): void {
  if (typeof window === "undefined" || !window.location.hash) {
    return;
  }

  const url = `${window.location.pathname}${window.location.search}`;
  window.history.replaceState(null, "", url);
}
