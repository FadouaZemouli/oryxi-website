export const serviceNavItems = [
  { path: "/services", key: "servicesOverview" },
  { path: "/qcdd-services", key: "qcddServicesMenu" },
  { path: "/amc-contracts", key: "amcContracts" },
  { path: "/emergency-service", key: "emergencyService" },
] as const;

export const primaryNavItems = [
  { path: "/", key: "home" },
  { path: "/about", key: "about" },
  { path: "/services", key: "services", children: serviceNavItems },
  { path: "/projects", key: "projects" },
  { path: "/contact", key: "contact" },
] as const;

export const footerNavItems = [
  { path: "/", key: "home" },
  { path: "/about", key: "about" },
  { path: "/services", key: "services" },
  { path: "/qcdd-services", key: "qcddServices" },
  { path: "/projects", key: "projects" },
  { path: "/amc-contracts", key: "amcContracts" },
  { path: "/emergency-service", key: "emergencyService" },
  { path: "/contact", key: "contact" },
] as const;

export type ServiceNavItemKey = (typeof serviceNavItems)[number]["key"];
export type PrimaryNavItemKey = (typeof primaryNavItems)[number]["key"];
export type FooterNavItemKey = (typeof footerNavItems)[number]["key"];
