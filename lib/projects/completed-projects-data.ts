import type { ProjectDetail, LocalizedText } from "@/lib/projects/projects-data";

const CATEGORY_PROJECT: LocalizedText = {
  en: "PROJECT",
  ar: "مشروع",
};

const LOCATION_DOHA: LocalizedText = {
  en: "Doha, Qatar",
  ar: "الدوحة، قطر",
};

const LOCATION_PEARL: LocalizedText = {
  en: "The Pearl, Qatar",
  ar: "اللؤلؤة، قطر",
};

const LOCATION_LUSAIL: LocalizedText = {
  en: "Lusail, Qatar",
  ar: "لوسيل، قطر",
};

const GEWAN_ISLAND_LOCATIONS: readonly LocalizedText[] = [
  { en: "Crystal 1", ar: "كريستال 1" },
  { en: "Crystal 2", ar: "كريستال 2" },
  { en: "Crystal 3", ar: "كريستال 3" },
  { en: "Crystal 4", ar: "كريستال 4" },
  { en: "Crystal 5", ar: "كريستال 5" },
  { en: "Crystal 6", ar: "كريستال 6" },
  { en: "Crystal 7", ar: "كريستال 7" },
  { en: "Crystal 8", ar: "كريستال 8" },
  { en: "Crystal 9", ar: "كريستال 9" },
  { en: "Promenade 6A", ar: "بروميناد 6A" },
  { en: "Promenade 6B", ar: "بروميناد 6B" },
  { en: "Promenade 6C", ar: "بروميناد 6C" },
  { en: "Promenade 7A", ar: "بروميناد 7A" },
  { en: "Promenade 7B", ar: "بروميناد 7B" },
];

function completedImage(filename: string): string {
  return `/images/projects/completed/${filename}`;
}

export const COMPLETED_PROJECTS: readonly ProjectDetail[] = [
  {
    id: "abraj-quartier-01",
    image: completedImage("abraj-quartier-01.jpg"),
    name: {
      en: "Abraj Quartier-01",
      ar: "أبراج كارتييه-01",
    },
    category: CATEGORY_PROJECT,
    location: LOCATION_DOHA,
    scopeItems: [
      {
        en: "Consultancy services to obtain Civil Defense approval for large-scale projects.",
        ar: "خدمات استشارية للحصول على اعتماد الدفاع المدني للمشاريع الكبيرة.",
      },
      {
        en: "UDC Tower.",
        ar: "برج UDC.",
      },
    ],
    imageAlt: {
      en: "Abraj Quartier-01 in Doha, Qatar",
      ar: "أبراج كارتييه-01 في الدوحة، قطر",
    },
  },
  {
    id: "al-faisal-tower",
    image: completedImage("al-faisal-tower.jpg"),
    name: {
      en: "Al Faisal Tower",
      ar: "برج الفيصل",
    },
    category: CATEGORY_PROJECT,
    location: LOCATION_DOHA,
    scopeItems: [
      {
        en: "AMC Agreement.",
        ar: "اتفاقية عقد صيانة سنوي (AMC).",
      },
    ],
    imageAlt: {
      en: "Al Faisal Tower in Doha, Qatar",
      ar: "برج الفيصل في الدوحة، قطر",
    },
  },
  {
    id: "fg-mall",
    image: completedImage("fg-mall.jpg"),
    name: {
      en: "FG Mall",
      ar: "إف جي مول",
    },
    category: CATEGORY_PROJECT,
    location: LOCATION_DOHA,
    scopeItems: [
      {
        en: "Consultancy services to obtain Civil Defense Certificate.",
        ar: "خدمات استشارية للحصول على شهادة الدفاع المدني.",
      },
      {
        en: "ACMV test for smoke fans at Floresta Galleria Mall.",
        ar: "اختبار مراوح الدخان لنظام ACMV في فلوريستا جاليريا مول.",
      },
    ],
    imageAlt: {
      en: "FG Mall in Doha, Qatar",
      ar: "إف جي مول في الدوحة، قطر",
    },
  },
  {
    id: "le-boulevard",
    image: completedImage("le-boulevard.jpg"),
    name: {
      en: "Le Boulevard",
      ar: "لو بوليفارد",
    },
    category: CATEGORY_PROJECT,
    location: LOCATION_DOHA,
    scopeItems: [
      {
        en: "Consultancy services to obtain Civil Defense certification.",
        ar: "خدمات استشارية للحصول على شهادة الدفاع المدني.",
      },
    ],
    imageAlt: {
      en: "Le Boulevard in Doha, Qatar",
      ar: "لو بوليفارد في الدوحة، قطر",
    },
  },
  {
    id: "national-planning-council",
    image: completedImage("national-planning-council.jpeg"),
    name: {
      en: "National Planning Council",
      ar: "المجلس الوطني للتخطيط",
    },
    category: CATEGORY_PROJECT,
    location: LOCATION_DOHA,
    scopeItems: [
      {
        en: "Consultancy services to obtain Civil Defense Certificate.",
        ar: "خدمات استشارية للحصول على شهادة الدفاع المدني.",
      },
    ],
    systems: [
      {
        en: "Passive Fire Safety System",
        ar: "نظام السلامة من الحريق السلبي",
      },
      {
        en: "Fire Fighting System",
        ar: "نظام مكافحة الحريق",
      },
      {
        en: "Fire Alarm System",
        ar: "نظام إنذار الحريق",
      },
      {
        en: "ACMV",
        ar: "نظام ACMV",
      },
      {
        en: "EPSS",
        ar: "نظام EPSS",
      },
      {
        en: "Lift / Elevator",
        ar: "المصاعد",
      },
    ],
    imageAlt: {
      en: "National Planning Council in Doha, Qatar",
      ar: "المجلس الوطني للتخطيط في الدوحة، قطر",
    },
  },
  {
    id: "ruzgar-hospital-the-pearl",
    image: completedImage("ruzgar-hospital-the-pearl.jpeg"),
    name: {
      en: "Ruzgar Hospital, The Pearl",
      ar: "مستشفى روزغار، اللؤلؤة",
    },
    category: CATEGORY_PROJECT,
    location: LOCATION_PEARL,
    scopeItems: [
      {
        en: "Consultancy services to obtain Civil Defense Certificate.",
        ar: "خدمات استشارية للحصول على شهادة الدفاع المدني.",
      },
    ],
    imageAlt: {
      en: "Ruzgar Hospital at The Pearl, Qatar",
      ar: "مستشفى روزغار في اللؤلؤة، قطر",
    },
  },
  {
    id: "al-ezz-tower-4",
    image: completedImage("al-ezz-tower-4.jpg"),
    name: {
      en: "Al Ezz Tower 4",
      ar: "برج العز 4",
    },
    category: CATEGORY_PROJECT,
    location: LOCATION_DOHA,
    scopeItems: [
      {
        en: "Supervision services for renewal of the building QCDD certification.",
        ar: "خدمات إشراف لتجديد شهادة QCDD للمبنى.",
      },
    ],
    imageAlt: {
      en: "Al Ezz Tower 4 in Doha, Qatar",
      ar: "برج العز 4 في الدوحة، قطر",
    },
  },
  {
    id: "al-khaleej-tower",
    image: completedImage("al-khaleej-tower.jpg"),
    name: {
      en: "Al Khaleej Tower",
      ar: "برج الخليج",
    },
    category: CATEGORY_PROJECT,
    location: LOCATION_DOHA,
    locationDetail: {
      en: "Two Locations: Location 1 and Location 9",
      ar: "الموقع 1 / الموقع 9",
    },
    scopeItems: [
      {
        en: "Consultancy services to obtain Civil Defense Approval.",
        ar: "خدمات استشارية للحصول على اعتماد الدفاع المدني.",
      },
    ],
    imageAlt: {
      en: "Al Khaleej Tower in Doha, Qatar",
      ar: "برج الخليج في الدوحة، قطر",
    },
  },
  {
    id: "dolphin-tower",
    image: completedImage("dolphin-tower.jpg"),
    name: {
      en: "Dolphin Tower",
      ar: "برج دولفين",
    },
    category: CATEGORY_PROJECT,
    location: LOCATION_DOHA,
    scopeItems: [
      {
        en: "Consultancy services to obtain Civil Defense Certificate.",
        ar: "خدمات استشارية للحصول على شهادة الدفاع المدني.",
      },
    ],
    imageAlt: {
      en: "Dolphin Tower in Doha, Qatar",
      ar: "برج دولفين في الدوحة، قطر",
    },
  },
  {
    id: "gewan-island",
    image: completedImage("gewan-island.jpg"),
    name: {
      en: "Gewan Island",
      ar: "جزيرة جيوان",
    },
    category: CATEGORY_PROJECT,
    location: LOCATION_LUSAIL,
    scopeItems: [
      {
        en: "Design modification and consultancy services for 15 buildings and 1 car park.",
        ar: "أعمال تعديل التصميم وخدمات استشارية لـ 15 مبنى وموقف سيارات واحد.",
      },
      {
        en: "Architectural design modification.",
        ar: "تعديل التصميم المعماري.",
      },
      {
        en: "Fire Safety system design modification.",
        ar: "تعديل تصميم نظام السلامة من الحريق.",
      },
      {
        en: "Fire Fighting system design modification.",
        ar: "تعديل تصميم نظام مكافحة الحريق.",
      },
      {
        en: "Fire Alarm system design modification.",
        ar: "تعديل تصميم نظام إنذار الحريق.",
      },
    ],
    projectLocations: GEWAN_ISLAND_LOCATIONS,
    imageAlt: {
      en: "Gewan Island pedestrian plaza in Lusail, Qatar",
      ar: "جزيرة جيوان في لوسيل، قطر",
    },
  },
  {
    id: "madina-central",
    image: completedImage("madina-centrale.jpg"),
    name: {
      en: "Madina Central",
      ar: "مدينة سنترال",
    },
    category: CATEGORY_PROJECT,
    location: LOCATION_PEARL,
    scopeItems: [
      {
        en: "Consultancy services for renewal of Civil Defense certification for residential buildings.",
        ar: "خدمات استشارية لتجديد شهادة الدفاع المدني للمباني السكنية.",
      },
    ],
    projectLocations: ["MC5", "MC8", "GV23"],
    imageAlt: {
      en: "Madina Central in Doha, Qatar",
      ar: "مدينة سنترال في الدوحة، قطر",
    },
  },
  {
    id: "regency-residence-tower",
    image: completedImage("regency-residence-tower.jpg"),
    name: {
      en: "Regency Residence Tower",
      ar: "برج ريجنسي ريزيدنس",
    },
    category: CATEGORY_PROJECT,
    location: LOCATION_DOHA,
    scopeItems: [
      {
        en: "Annual Maintenance Contract for ventilation system.",
        ar: "عقد صيانة سنوي لنظام التهوية.",
      },
      {
        en: "Annual Maintenance Contract for fire suppression system.",
        ar: "عقد صيانة سنوي لنظام إخماد الحريق.",
      },
      {
        en: "Consultancy services to obtain Civil Defense Certificate.",
        ar: "خدمات استشارية للحصول على شهادة الدفاع المدني.",
      },
    ],
    imageAlt: {
      en: "Regency Residence Tower in Doha, Qatar",
      ar: "برج ريجنسي ريزيدنس في الدوحة، قطر",
    },
  },
  {
    id: "porto-arabia-tower-3",
    image: completedImage("porto-arabia-tower-3.jpg"),
    name: {
      en: "Porto Arabia Tower 3",
      ar: "برج بورتو أرابيا 3",
    },
    category: CATEGORY_PROJECT,
    location: LOCATION_PEARL,
    scopeItems: [
      {
        en: "Consultancy services to obtain Civil Defense Certificate.",
        ar: "خدمات استشارية للحصول على شهادة الدفاع المدني.",
      },
      {
        en: "TPOC Project.",
        ar: "مشروع TPOC.",
      },
    ],
    imageAlt: {
      en: "Porto Arabia Tower 3 at The Pearl, Qatar",
      ar: "برج بورتو أرابيا 3 في اللؤلؤة، قطر",
    },
  },
] as const;

export const COMPLETED_PROJECTS_COUNT = COMPLETED_PROJECTS.length;

export function normalizeCompletedIndex(index: number): number {
  return (
    ((index % COMPLETED_PROJECTS_COUNT) + COMPLETED_PROJECTS_COUNT) %
    COMPLETED_PROJECTS_COUNT
  );
}
