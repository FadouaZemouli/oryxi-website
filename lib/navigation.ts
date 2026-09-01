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
  { path: "/emergency-service", key: "emergencyService" },
  { path: null, key: "pumpSolutions" },
] as const;

export type PrimaryNavItemKey = (typeof primaryNavItems)[number]["key"];
export type FooterQuickLinkKey = (typeof footerQuickLinkItems)[number]["key"];
export type FooterServiceItemKey = (typeof footerServiceItems)[number]["key"];
