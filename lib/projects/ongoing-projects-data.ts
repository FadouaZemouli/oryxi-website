import type { ProjectDetail, LocalizedText } from "@/lib/projects/projects-data";

const CATEGORY_PROJECT: LocalizedText = {
  en: "PROJECT",
  ar: "مشروع",
};

const CATEGORY_INFRASTRUCTURE: LocalizedText = {
  en: "INFRASTRUCTURE",
  ar: "بنية تحتية",
};

const LOCATION_DOHA: LocalizedText = {
  en: "Doha, Qatar",
  ar: "الدوحة، قطر",
};

const LOCATION_PEARL: LocalizedText = {
  en: "The Pearl, Qatar",
  ar: "اللؤلؤة، قطر",
};

function ongoingImage(filename: string): string {
  return `/images/projects/ongoing/${filename
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/")}`;
}

const RKH_STATION_LOCATIONS: readonly LocalizedText[] = [
  { en: "Al Shaqab", ar: "الشقب" },
  { en: "Al Rayyan Al Qadeem", ar: "الريان القديم" },
  { en: "Al Messila", ar: "المسيلة" },
  { en: "Hamad Hospital", ar: "مستشفى حمد" },
  { en: "The White Palace", ar: "القصر الأبيض" },
  { en: "Al Mansoura", ar: "المنصورة" },
  { en: "Umm Ghuwailina", ar: "أم غويلينة" },
  { en: "Hamad International Airport", ar: "مطار حمد الدولي" },
  { en: "Legtaifiya", ar: "لقطيفية" },
  { en: "Qatar University", ar: "جامعة قطر" },
  { en: "Education City", ar: "المدينة التعليمية" },
  { en: "Qatar National Library", ar: "مكتبة قطر الوطنية" },
  { en: "Lusail", ar: "لوسيل" },
  { en: "Al Bidda", ar: "البدع" },
  { en: "Ras Bu Abboud", ar: "راس بو عبود" },
  { en: "Msheireb", ar: "مشيرب" },
  { en: "Al Riffa", ar: "الرفاع" },
  { en: "Qatar National Museum", ar: "متحف قطر الوطني" },
  { en: "Al Sadd", ar: "السد" },
  { en: "Bin Mahmoud", ar: "بن محمود" },
  { en: "Souq Waqif", ar: "سوق واقف" },
  { en: "Al Wakra", ar: "الوكرة" },
  { en: "Ras Bu Fontas", ar: "راس بو فنطاس" },
  { en: "Al Matar Al Qadeem", ar: "المطار القديم" },
  { en: "Al Doha Al Jadida", ar: "الدوحة الجديدة" },
  { en: "Oqba Ibn Nafie", ar: "عقبة بن نافع" },
  { en: "Al Qassar", ar: "القصار" },
  { en: "Katara", ar: "كتارا" },
  { en: "Corniche", ar: "الكورنيش" },
  { en: "West Bay", ar: "الخليج الغربي" },
  { en: "DECC", ar: "مركز الدوحة للمعارض والمؤتمرات (DECC)" },
  { en: "Downtown Lusail", ar: "وسط مدينة لوسيل" },
  { en: "Marina South", ar: "مارينا الجنوب" },
  { en: "Marina Central", ar: "مارينا سنترال" },
  { en: "Yacht Club", ar: "نادي اليخوت" },
];

export const ONGOING_PROJECTS: readonly ProjectDetail[] = [
  {
    id: "al-mutaidah-towers",
    image: ongoingImage("al-mutaidah-towers.jpg"),
    name: {
      en: "Al Mutaidah Towers",
      ar: "أبراج المتحدة",
    },
    category: CATEGORY_PROJECT,
    location: LOCATION_DOHA,
    scopeItems: [
      {
        en: "Consultation services to obtain and renew QCDD certification for Al Mutaidah Tower.",
        ar: "خدمات استشارية للحصول على شهادة الدفاع المدني وتجديدها لبرج المتحدة.",
      },
    ],
    imageAlt: {
      en: "Al Mutaidah Towers in Doha, Qatar",
      ar: "أبراج المتحدة في الدوحة، قطر",
    },
  },
  {
    id: "qanat-quartier",
    image: ongoingImage("qanat-quartier.jpg"),
    name: {
      en: "Qanat Quartier",
      ar: "قناة كارتييه",
    },
    category: CATEGORY_PROJECT,
    location: LOCATION_PEARL,
    locationDetail: {
      en: "Multiple Locations: QQ1, QQ2, QQ3, QQ7, QQ6B, QQ5B",
      ar: "مواقع متعددة: QQ1، QQ2، QQ3، QQ7، QQ6B، QQ5B",
    },
    scopeItems: [
      {
        en: "Fire Alarm & Fire Fighting rectification works for QCDD approval.",
        ar: "أعمال تصحيح لأنظمة إنذار الحريق ومكافحة الحريق لاعتماد الدفاع المدني.",
      },
    ],
    imageAlt: {
      en: "Qanat Quartier at The Pearl, Qatar",
      ar: "قناة كارتييه في اللؤلؤة، قطر",
    },
  },
  {
    id: "porto-arabia-2a",
    image: ongoingImage("Porto Arabia 2A, The Pearl.webp"),
    name: {
      en: "Porto Arabia 2A, The Pearl",
      ar: "بورتو أرابيا 2A، اللؤلؤة",
    },
    category: CATEGORY_PROJECT,
    location: LOCATION_PEARL,
    scopeItems: [
      {
        en: "Civil Defense Building License Certificate preparation & submission",
        ar: "إعداد وتقديم شهادة ترخيص مبنى الدفاع المدني.",
      },
      {
        en: "Clean Agent Fire Extinguishing System Integrity Test",
        ar: "اختبار سلامة نظام إطفاء الحريق بالغاز النظيف.",
      },
      {
        en: "Foam Conductivity Test",
        ar: "اختبار موصلية الرغوة.",
      },
      {
        en: "Sound Level Test",
        ar: "اختبار مستوى الصوت.",
      },
      {
        en: "Lux Level Reading Test",
        ar: "اختبار قياس مستوى الإضاءة.",
      },
      {
        en: "Ventilation System testing, including staircase & lift lobby pressurization and basement smoke test",
        ar: "اختبار نظام التهوية، بما في ذلك ضغط السلالم وردهات المصاعد واختبار دخان القبو.",
      },
      {
        en: "TPA Building License Certification",
        ar: "اعتماد ترخيص المبنى TPA.",
      },
    ],
    imageAlt: {
      en: "Porto Arabia 2A at The Pearl, Qatar",
      ar: "بورتو أرابيا 2A في اللؤلؤة، قطر",
    },
  },
  {
    id: "beverly-hills-tower",
    image: ongoingImage("Beverly Hills Tower.jpg"),
    name: {
      en: "Beverly Hills Tower",
      ar: "برج بيفرلي هيلز",
    },
    category: CATEGORY_PROJECT,
    location: LOCATION_DOHA,
    scopeItems: [
      {
        en: "Fire Alarm & Fire Fighting System – Passive Fire Safety System",
        ar: "نظام إنذار الحريق ومكافحة الحريق – نظام السلامة من الحريق السلبي.",
      },
      {
        en: "Fire Alarm & Fire Fighting System – Fire Sealant",
        ar: "نظام إنذار الحريق ومكافحة الحريق – مانع تسرب الحريق.",
      },
      {
        en: "Fire Alarm & Fire Fighting System",
        ar: "نظام إنذار الحريق ومكافحة الحريق.",
      },
      {
        en: "Fire Alarm & Fire Fighting System – Smoke Control System (ACMV)",
        ar: "نظام إنذار الحريق ومكافحة الحريق – نظام التحكم بالدخان (ACMV).",
      },
      {
        en: "Consultancy services to obtain Civil Defense Certificate",
        ar: "خدمات استشارية للحصول على شهادة الدفاع المدني.",
      },
    ],
    imageAlt: {
      en: "Beverly Hills Tower in Doha, Qatar",
      ar: "برج بيفرلي هيلز في الدوحة، قطر",
    },
  },
  {
    id: "al-asmakh-complex",
    image: ongoingImage("Al Asmakh Complex Industrial Area.jpg"),
    name: {
      en: "Al Asmakh Complex Industrial Area",
      ar: "مجمع الأصمخ – المنطقة الصناعية",
    },
    category: CATEGORY_PROJECT,
    location: LOCATION_DOHA,
    scopeItems: [
      {
        en: "Consultancy services to obtain Civil Defense certification.",
        ar: "خدمات استشارية للحصول على شهادة الدفاع المدني.",
      },
      {
        en: "Fire Fighting services.",
        ar: "خدمات مكافحة الحريق.",
      },
      {
        en: "Fire Alarm services.",
        ar: "خدمات إنذار الحريق.",
      },
    ],
    imageAlt: {
      en: "Al Asmakh Complex in the Industrial Area, Doha, Qatar",
      ar: "مجمع الأصمخ – المنطقة الصناعية في الدوحة، قطر",
    },
  },
  {
    id: "rivera-gardens",
    image: ongoingImage("Rivera Gardens.webp"),
    name: {
      en: "Riviera Gardens",
      ar: "حدائق ريفيرا",
    },
    category: CATEGORY_PROJECT,
    location: LOCATION_DOHA,
    scopeItems: [
      {
        en: "Annual Maintenance Contract (AMC) services.",
        ar: "عقد صيانة سنوي (AMC).",
      },
    ],
    imageAlt: {
      en: "Riviera Gardens in Doha, Qatar",
      ar: "حدائق ريفيرا في الدوحة، قطر",
    },
  },
  {
    id: "rivera-residence",
    image: ongoingImage("Rivera Residence.jpg"),
    name: {
      en: "Riviera Residence",
      ar: "ريفيرا ريزيدنس",
    },
    category: CATEGORY_PROJECT,
    location: LOCATION_DOHA,
    scopeItems: [
      {
        en: "Annual Maintenance Contract (AMC) services.",
        ar: "عقد صيانة سنوي (AMC).",
      },
    ],
    imageAlt: {
      en: "Riviera Residence in Doha, Qatar",
      ar: "ريفيرا ريزيدنس في الدوحة، قطر",
    },
  },
  {
    id: "rkh-doha-metro",
    image: ongoingImage("rkh-doha-metro.jpg"),
    name: {
      en: "RKH Doha Metro",
      ar: "مترو الدوحة RKH",
    },
    category: CATEGORY_INFRASTRUCTURE,
    location: LOCATION_DOHA,
    scopeItems: [
      {
        en: "Consultancy services to obtain Civil Defense certification for multiple metro and tram station locations.",
        ar: "خدمات استشارية للحصول على شهادة الدفاع المدني لعدة مواقع من محطات المترو والترام.",
      },
    ],
    stationLocations: RKH_STATION_LOCATIONS,
    imageAlt: {
      en: "RKH Doha Metro station in Doha, Qatar",
      ar: "محطة مترو الدوحة RKH في الدوحة، قطر",
    },
  },
] as const;

export const ONGOING_PROJECTS_COUNT = ONGOING_PROJECTS.length;

export function normalizeOngoingIndex(index: number): number {
  return ((index % ONGOING_PROJECTS_COUNT) + ONGOING_PROJECTS_COUNT) % ONGOING_PROJECTS_COUNT;
}
