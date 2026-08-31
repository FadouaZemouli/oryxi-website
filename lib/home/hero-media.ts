import { existsSync } from "node:fs";
import path from "node:path";

export type HeroMediaKind = "image" | "video";

export type HeroMediaItem = {
  id: string;
  kind: HeroMediaKind;
  src: string;
  /** Heavy assets stay out of the DOM until current, previous, or next. */
  deferLoad?: boolean;
};

/**
 * Hero-only OMS field media. Do not reuse these paths in Expertise cards.
 * Crop is applied in CSS via `[data-oms-hero-slide]`.
 */
export const HERO_MEDIA_CATALOG: readonly HeroMediaItem[] = [
  {
    id: "team-briefing-02",
    kind: "image",
    src: "/images/hero/oms-team-briefing-02.jpg",
  },
  {
    id: "field-operations-02",
    kind: "video",
    src: "/video/hero/oms-field-operations-02.mp4",
  },
  {
    id: "foam-testing",
    kind: "image",
    src: "/images/hero/oms-foam-testing.jpg",
  },
  {
    id: "field-operations-03",
    kind: "video",
    src: "/video/hero/oms-field-operations-03.mp4",
  },
  {
    id: "smoke-testing",
    kind: "image",
    src: "/images/hero/oms-smoke-testing.jpg",
  },
  {
    id: "field-operations-01",
    kind: "video",
    src: "/video/hero/oms-field-operations-01.mp4",
    deferLoad: true,
  },
  {
    id: "team-briefing-01",
    kind: "image",
    src: "/images/hero/oms-team-briefing-01.jpg",
  },
];

function publicFileExists(publicPath: string): boolean {
  const segments = publicPath.replace(/^\//, "").split("/");
  return existsSync(path.join(process.cwd(), "public", ...segments));
}

export function getHeroPlaylist(): HeroMediaItem[] {
  return HERO_MEDIA_CATALOG.filter((item) => publicFileExists(item.src));
}
