import { SHOWCASE_SLIDES, type ShowcaseSlideKey } from "@/lib/services/showcase-data";
import { CONTACT_FORM_PATH } from "@/lib/i18n/path";

export const primaryNavItems = [
  { path: "/", key: "home" },
  { path: "/about", key: "about" },
  { path: "/services", key: "services" },
  { path: "/pump-selection", key: "pumpSelection" },
  { path: "/projects", key: "projects" },
  { path: "/contact", key: "contact" },
] as const;

export const footerQuickLinkItems = [
  { path: "/", key: "home" },
  { path: "/about", key: "about" },
  { path: "/services", key: "services" },
  { path: "/projects", key: "projects" },
  { path: "/contact", key: "contact" },
] as const;

export const footerServiceItems = [
  { path: "/services", key: "engineeringServices" },
  { path: "/services", key: "fireLifeSafety" },
  { path: "/qcdd-services", key: "qcddServices" },
  { path: "/amc-contracts", key: "amcContractsFooter" },
  { path: null, key: "pumpSolutions" },
] as const;

export const footerCompanyItems = [
  { path: "/about", key: "aboutOms" },
  { path: "/projects", key: "projects" },
] as const;

function servicesShowcasePath(key: ShowcaseSlideKey) {
  const slide = SHOWCASE_SLIDES.find((item) => item.key === key);
  return `/services#${slide?.hash ?? key}`;
}

export const footerServicesColumnItems = [
  { path: servicesShowcasePath("mep"), key: "mep" },
  { path: servicesShowcasePath("electromechanical"), key: "electromechanical" },
  { path: servicesShowcasePath("engineering"), key: "engineering" },
  { path: servicesShowcasePath("hvac"), key: "hvac" },
  { path: servicesShowcasePath("qcdd"), key: "qcdd" },
] as const;

export const footerSupportItems = [
  { path: servicesShowcasePath("amc"), key: "amcContracts" },
  { path: CONTACT_FORM_PATH, key: "requestQuote" },
  { path: "/contact", key: "contact" },
] as const;

export type PrimaryNavItemKey = (typeof primaryNavItems)[number]["key"];
export type FooterQuickLinkKey = (typeof footerQuickLinkItems)[number]["key"];
export type FooterServiceItemKey = (typeof footerServiceItems)[number]["key"];
export type FooterCompanyItemKey = (typeof footerCompanyItems)[number]["key"];
export type FooterServicesColumnItemKey =
  (typeof footerServicesColumnItems)[number]["key"];
export type FooterSupportItemKey = (typeof footerSupportItems)[number]["key"];
