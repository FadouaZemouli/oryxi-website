export const LOGO_TRAVEL_RANGE_PX = 280;
export const LOGO_ORIGIN_SELECTOR = ".oms-hero-brand";
export const LOGO_SLOT_SELECTOR = ".oms-header-logo-link";
export const LOGO_DESKTOP_MQ = "(min-width: 1024px)";
export const LOGO_REDUCED_MOTION_MQ = "(prefers-reduced-motion: reduce)";

const OWNED_KEY = "__OMS_LOGO_TRAVEL_OWNED__";

let rememberedScrollY: number | null = null;

declare global {
  interface Window {
    __OMS_HEADER_PRELOAD__?: boolean;
    __OMS_LOGO_TRAVEL_OWNED__?: boolean;
  }
}

export function setLogoTravelOwned(owned: boolean) {
  window[OWNED_KEY] = owned;
}

export function rememberScrollForLocaleSwitch() {
  rememberedScrollY = readScrollY();
}

export function consumeRememberedScroll() {
  if (rememberedScrollY == null) {
    return;
  }

  window.scrollTo(0, rememberedScrollY);
}

export function clearRememberedScroll() {
  rememberedScrollY = null;
}

export function readScrollY() {
  return window.scrollY || document.documentElement.scrollTop || 0;
}

export function resetLogoTravel(root: HTMLElement) {
  root.style.setProperty("--oms-logo-dx", "0px");
  root.style.setProperty("--oms-logo-dy", "0px");
  root.style.removeProperty("--oms-logo-x");
  root.style.removeProperty("--oms-logo-y");
}

export function syncLogoScrollProgress(root: HTMLElement, isHome: boolean) {
  const y = readScrollY();
  let reduce = false;

  try {
    reduce = window.matchMedia(LOGO_REDUCED_MOTION_MQ).matches;
  } catch {
    reduce = false;
  }

  const progress = reduce
    ? y > 8
      ? 1
      : 0
    : Math.min(1, Math.max(0, y / LOGO_TRAVEL_RANGE_PX));

  root.dataset.omsScrolled = progress > 0.08 ? "true" : "false";

  if (isHome) {
    root.style.setProperty("--oms-logo-progress", progress.toFixed(4));
  } else {
    root.style.removeProperty("--oms-logo-progress");
  }

  return progress;
}

export function measureLogoTravel(root: HTMLElement): "applied" | "pending" | "idle" {
  let desktop = false;

  try {
    desktop = window.matchMedia(LOGO_DESKTOP_MQ).matches;
  } catch {
    desktop = false;
  }

  const isHome = root.dataset.omsHeader === "home";

  if (!isHome || !desktop) {
    resetLogoTravel(root);
    return "idle";
  }

  const origin = document.querySelector<HTMLElement>(LOGO_ORIGIN_SELECTOR);
  const slot = document.querySelector<HTMLElement>(LOGO_SLOT_SELECTOR);

  if (!origin || !slot) {
    return "pending";
  }

  const start = origin.getBoundingClientRect();
  const end = slot.getBoundingClientRect();

  if (start.width < 1 || start.height < 1 || end.width < 1 || end.height < 1) {
    return "pending";
  }

  const startTop = start.top + readScrollY();
  const startInline =
    root.dir === "rtl" ? root.clientWidth - start.right : start.left;

  root.style.setProperty("--oms-logo-x", `${startInline.toFixed(2)}px`);
  root.style.setProperty("--oms-logo-y", `${startTop.toFixed(2)}px`);
  root.style.setProperty("--oms-logo-dx", `${(end.left - start.left).toFixed(2)}px`);
  root.style.setProperty("--oms-logo-dy", `${(end.top - startTop).toFixed(2)}px`);

  return "applied";
}
