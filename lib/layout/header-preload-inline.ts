import { INNER_HERO_PATHS } from "@/lib/layout/header-state";
import { LOGO_TRAVEL_RANGE_PX } from "@/lib/layout/logo-travel";

export function getHeaderPreloadScript() {
  return `(function(){
  if (window.__OMS_HEADER_PRELOAD__) return;
  window.__OMS_HEADER_PRELOAD__ = true;
  var heroes = ${JSON.stringify(INNER_HERO_PATHS)};
  var range = ${LOGO_TRAVEL_RANGE_PX};
  var r = document.documentElement;
  var sRaf = 0;
  var rRaf = 0;
  function owned() {
    return window.__OMS_LOGO_TRAVEL_OWNED__ === true;
  }
  function path() {
    return location.pathname.replace(/\\/$/, "") || "/";
  }
  function localeFromPath() {
    var p = path();
    var slash = p.indexOf("/", 1);
    var seg = slash === -1 ? p.slice(1) : p.slice(1, slash);
    return seg === "ar" || seg === "en" ? seg : "";
  }
  function home() {
    var loc = localeFromPath();
    return loc !== "" && path() === "/" + loc;
  }
  function innerHero() {
    var loc = localeFromPath();
    if (!loc) return false;
    var p = path();
    var prefix = "/" + loc;
    if (p === prefix) return false;
    var rest = p.slice(prefix.length);
    for (var i = 0; i < heroes.length; i++) if (rest === heroes[i]) return true;
    return false;
  }
  function y() {
    return window.scrollY || r.scrollTop || 0;
  }
  function syncPath() {
    r.setAttribute("data-oms-header", home() ? "home" : "inner");
    r.setAttribute("data-oms-path", path());
    r.setAttribute("data-oms-hero", innerHero() ? "true" : "false");
  }
  function syncScroll() {
    syncPath();
    var yv = y();
    var reduce = false;
    try { reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}
    var p = reduce ? (yv > 8 ? 1 : 0) : Math.min(1, Math.max(0, yv / range));
    if (home()) r.style.setProperty("--oms-logo-progress", p.toFixed(4));
    else r.style.removeProperty("--oms-logo-progress");
    r.setAttribute("data-oms-scrolled", p > 0.08 ? "true" : "false");
  }
  function measure() {
    if (!home()) {
      r.style.setProperty("--oms-logo-dx", "0px");
      r.style.setProperty("--oms-logo-dy", "0px");
      r.style.removeProperty("--oms-logo-x");
      r.style.removeProperty("--oms-logo-y");
      return;
    }
    try { if (!window.matchMedia("(min-width: 1024px)").matches) return; } catch (e) { return; }
    var origin = document.querySelector(".oms-hero-brand");
    var slot = document.querySelector(".oms-header-logo-link");
    if (!origin || !slot) return;
    var start = origin.getBoundingClientRect();
    var end = slot.getBoundingClientRect();
    if (start.width < 1 || start.height < 1 || end.width < 1 || end.height < 1) return;
    var startTop = start.top + y();
    var startInline = r.dir === "rtl" ? r.clientWidth - start.right : start.left;
    r.style.setProperty("--oms-logo-x", startInline.toFixed(2) + "px");
    r.style.setProperty("--oms-logo-y", startTop.toFixed(2) + "px");
    r.style.setProperty("--oms-logo-dx", (end.left - start.left).toFixed(2) + "px");
    r.style.setProperty("--oms-logo-dy", (end.top - startTop).toFixed(2) + "px");
  }
  function apply() {
    if (owned()) return;
    syncScroll();
    measure();
  }
  function onScroll() {
    if (owned()) return;
    if (sRaf) return;
    sRaf = requestAnimationFrame(function () {
      syncScroll();
      sRaf = 0;
    });
  }
  function onReflow() {
    if (owned()) return;
    if (rRaf) return;
    rRaf = requestAnimationFrame(function () {
      apply();
      rRaf = 0;
    });
  }
  syncPath();
  apply();
  document.addEventListener("DOMContentLoaded", apply);
  window.addEventListener("pageshow", apply);
  window.addEventListener("pagehide", function () {
    window.__OMS_LOGO_TRAVEL_OWNED__ = false;
  });
  window.addEventListener("load", apply);
  window.addEventListener("popstate", apply);
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onReflow, { passive: true });
})();`;
}
