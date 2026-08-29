export const navItems = [
  { path: "/", key: "home" },
  { path: "/about", key: "about" },
  { path: "/services", key: "services" },
  { path: "/projects", key: "projects" },
  { path: "/amc-contracts", key: "amcContracts" },
  { path: "/emergency-service", key: "emergencyService" },
  { path: "/contact", key: "contact" },
] as const;

export type NavItemKey = (typeof navItems)[number]["key"];
