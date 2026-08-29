export const siteOrigin = "https://oms.com.qa";
export const siteName = "ORYXI Maintenance Services";

export const ogImage = {
  url: "/logos/oms-logo.png",
  width: 913,
  height: 600,
  alt: siteName,
} as const;

export const pagePaths = {
  home: "/",
  about: "/about",
  services: "/services",
  projects: "/projects",
  amcContracts: "/amc-contracts",
  emergencyService: "/emergency-service",
  contact: "/contact",
  requestQuote: "/request-quote",
} as const;

export type PageKey = keyof typeof pagePaths;
