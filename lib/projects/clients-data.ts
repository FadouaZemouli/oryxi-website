import type { LocalizedText } from "@/lib/projects/projects-data";

export type ClientLogo = {
  id: string;
  name: string;
  src: string;
  width: number;
  height: number;
  alt: LocalizedText;
  unoptimized?: boolean;
};

function clientImage(filename: string): string {
  return encodeURI(`/images/clients/${filename}`);
}

function logoAlt(name: string): LocalizedText {
  return {
    en: `${name} logo`,
    ar: `شعار ${name}`,
  };
}

export const CLIENT_LOGOS: readonly ClientLogo[] = [
  {
    id: "aba-and-partners",
    name: "ABA & Partners",
    src: clientImage("aba-and-partners-logo.png"),
    width: 2172,
    height: 724,
    alt: logoAlt("ABA & Partners"),
  },
  {
    id: "cbq",
    name: "CBQ",
    src: clientImage("CBQ Logo.png"),
    width: 1552,
    height: 525,
    alt: logoAlt("CBQ"),
  },
  {
    id: "dig",
    name: "DIG",
    src: clientImage("dig-logo.png"),
    width: 2042,
    height: 770,
    alt: logoAlt("DIG"),
  },
  {
    id: "kbn",
    name: "KBN",
    src: clientImage("kbn-logo.png"),
    width: 5588,
    height: 3300,
    alt: logoAlt("KBN"),
  },
  {
    id: "naffco",
    name: "NAFFCO",
    src: clientImage("naffco-logo.png"),
    width: 1536,
    height: 1024,
    alt: logoAlt("NAFFCO"),
  },
  {
    id: "rkh",
    name: "RKH",
    src: clientImage("rkh-logo.png"),
    width: 3516,
    height: 4534,
    alt: logoAlt("RKH"),
  },
  {
    id: "the-pearl-qatar",
    name: "The Pearl Qatar",
    src: clientImage("the-pearl-qatar-logo.png"),
    width: 287,
    height: 300,
    alt: logoAlt("The Pearl Qatar"),
  },
  {
    id: "udc",
    name: "UDC",
    src: clientImage("udc-logo.png"),
    width: 1042,
    height: 1042,
    alt: logoAlt("UDC"),
  },
  {
    id: "al-deera",
    name: "Al Deera Commercial Real Estate",
    src: clientImage("al-deera-real-estate-logo.png"),
    width: 2172,
    height: 724,
    alt: logoAlt("Al Deera Commercial Real Estate"),
  },
  {
    id: "le-park",
    name: "Le Park",
    src: clientImage("le-park-logo.png"),
    width: 2172,
    height: 724,
    alt: logoAlt("Le Park"),
    unoptimized: true,
  },
  {
    id: "waseef",
    name: "Waseef",
    src: clientImage("waseef-logo.png"),
    width: 1536,
    height: 1024,
    alt: logoAlt("Waseef"),
  },
  {
    id: "cgb",
    name: "CGB",
    src: clientImage("cgb-logo.png"),
    width: 1536,
    height: 1024,
    alt: logoAlt("CGB"),
    unoptimized: true,
  },
  {
    id: "al-asmakh-fm",
    name: "Al Asmakh FM",
    src: clientImage("al-asmakh-fm-logo.png"),
    width: 1134,
    height: 1387,
    alt: logoAlt("Al Asmakh FM"),
    unoptimized: true,
  },
  {
    id: "national-planning-council",
    name: "National Planning Council",
    src: clientImage("national-planning-council-logo.png"),
    width: 1910,
    height: 823,
    alt: logoAlt("National Planning Council"),
  },
];
