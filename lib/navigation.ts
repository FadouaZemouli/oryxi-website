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

export const footerServicesColumnItems = [
  { path: "/services", key: "mep" },
  { path: "/services", key: "electromechanical" },
  { path: "/services", key: "engineering" },
  { path: "/services", key: "hvac" },
  { path: "/qcdd-services", key: "qcdd" },
] as const;

export const footerSupportItems = [
  { path: "/services#amc-contracts", key: "amcContracts" },
  { path: "/request-quote", key: "requestQuote" },
  { path: "/contact", key: "contact" },
] as const;

export type PrimaryNavItemKey = (typeof primaryNavItems)[number]["key"];
export type FooterQuickLinkKey = (typeof footerQuickLinkItems)[number]["key"];
export type FooterServiceItemKey = (typeof footerServiceItems)[number]["key"];
export type FooterCompanyItemKey = (typeof footerCompanyItems)[number]["key"];
export type FooterServicesColumnItemKey =
  (typeof footerServicesColumnItems)[number]["key"];
export type FooterSupportItemKey = (typeof footerSupportItems)[number]["key"];
