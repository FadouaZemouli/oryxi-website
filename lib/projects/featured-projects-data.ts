export type FeaturedProjectKey =
  | "qanatQuartier"
  | "alEzzTower4"
  | "gewanIsland"
  | "rkhDohaMetro"
  | "alKhaleejTower"
  | "regencyResidenceTower"
  | "dolphinTower"
  | "madinaCentrale"
  | "portoArabiaTower3";

export type FeaturedProjectLocationKey = "doha" | "lusail" | "thePearl";

export const FEATURED_PROJECT_IMAGES: Record<FeaturedProjectKey, string> = {
  alEzzTower4: "/images/projects/al-ezz-tower-4.jpg",
  dolphinTower: "/images/projects/dolphin-tower.jpg",
  gewanIsland: "/images/projects/gewan-island.jpg",
  madinaCentrale: "/images/projects/madina-centrale.jpg",
  qanatQuartier: "/images/projects/qanat-quartier.jpg",
  regencyResidenceTower: "/images/projects/regency-residence-tower.jpg",
  rkhDohaMetro: "/images/projects/rkh-doha-metro.jpg",
  alKhaleejTower: "/images/projects/al-khaleej-tower.jpg",
  portoArabiaTower3: "/images/projects/porto-arabia-tower-3.jpg",
};

export const FEATURED_PROJECT_CARD_GROUPS: FeaturedProjectKey[][] = [
  ["qanatQuartier", "alEzzTower4", "gewanIsland"],
  ["rkhDohaMetro", "alKhaleejTower", "regencyResidenceTower"],
  ["dolphinTower", "madinaCentrale", "portoArabiaTower3"],
];

export const FEATURED_PROJECT_ROTATION_MS = 5500;
export const FEATURED_PROJECT_STAGGER_MS = 800;
