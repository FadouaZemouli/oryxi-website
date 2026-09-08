export type ShowcaseSlideKey =
  | "mep"
  | "electromechanical"
  | "engineering"
  | "hvac"
  | "qcdd"
  | "amc";

export type ShowcaseSlide = {
  key: ShowcaseSlideKey;
  hash: string;
  image: string;
};

export const SHOWCASE_AUTOPLAY_MS = 4000;
export const SHOWCASE_TRANSITION_MS = 650;
export const SHOWCASE_SWIPE_THRESHOLD_PX = 48;

export const SHOWCASE_SLIDES: readonly ShowcaseSlide[] = [
  {
    key: "mep",
    hash: "mep-services",
    image: "/images/Services/showcase/01-mep-services.png",
  },
  {
    key: "electromechanical",
    hash: "electromechanical-services",
    image: "/images/Services/showcase/02-electromechanical-services.png",
  },
  {
    key: "engineering",
    hash: "engineering-services",
    image: "/images/Services/showcase/03-engineering-services.png",
  },
  {
    key: "hvac",
    hash: "hvac-systems",
    image: "/images/Services/showcase/04-hvac-systems.png",
  },
  {
    key: "qcdd",
    hash: "qcdd-services",
    image: "/images/Services/showcase/05-qcdd-consultation-services.png",
  },
  {
    key: "amc",
    hash: "amc-contracts",
    image: "/images/Services/showcase/06-amc-services.png",
  },
] as const;

export const SHOWCASE_SLIDE_COUNT = SHOWCASE_SLIDES.length;

export function showcaseIndexFromHash(hash: string): number | null {
  const id = hash.startsWith("#") ? hash.slice(1) : hash;
  const index = SHOWCASE_SLIDES.findIndex((slide) => slide.hash === id);
  return index >= 0 ? index : null;
}

export function formatShowcaseCounter(index: number): string {
  const current = String(index + 1).padStart(2, "0");
  const total = String(SHOWCASE_SLIDE_COUNT).padStart(2, "0");
  return `${current} / ${total}`;
}

export function formatShowcaseSelectorNumber(index: number): string {
  return String(index + 1).padStart(2, "0");
}

export function syncShowcaseHash(index: number): void {
  const slide = SHOWCASE_SLIDES[index];
  if (!slide || typeof window === "undefined") {
    return;
  }

  const nextHash = `#${slide.hash}`;
  if (window.location.hash === nextHash) {
    return;
  }

  const url = `${window.location.pathname}${window.location.search}${nextHash}`;
  window.history.replaceState(null, "", url);
}
