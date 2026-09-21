import { siteOrigin } from "@/lib/seo/config";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Oryxi Maintenance Services",
  alternateName: "OMS",
  url: siteOrigin,
  telephone: "+974 4039 7445",
  email: "marketing@oms.com.qa",
  logo: `${siteOrigin}/logos/oms-logo.png`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Doha",
    addressCountry: "QA",
  },
} as const;

export function OrganizationJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(organizationJsonLd),
      }}
    />
  );
}
