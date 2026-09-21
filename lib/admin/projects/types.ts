export const PROJECT_STATUSES = ["ongoing", "completed"] as const;

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export type ProjectDetailsItem = {
  en: string;
  ar: string;
};

export type ProjectDetailsSection = {
  key: string;
  label_en: string;
  label_ar: string;
  items: ProjectDetailsItem[];
};

export type ProjectDetails = ProjectDetailsSection[];

export type ProjectClientOption = {
  id: string;
  name: string;
  status: "active" | "inactive";
};

export type AdminProject = {
  id: string;
  slug: string;
  title_en: string;
  title_ar: string;
  location_en: string;
  location_ar: string;
  scope_en: string;
  scope_ar: string;
  project_status: ProjectStatus;
  cover_image_url: string | null;
  gallery: unknown;
  sort_order: number;
  published: boolean;
  qcdd_year: string | null;
  project_details: ProjectDetails;
  client_id: string | null;
  client_name: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type ProjectWritePayload = {
  slug: string;
  title_en: string;
  title_ar: string;
  location_en: string;
  location_ar: string;
  scope_en: string;
  scope_ar: string;
  project_status: ProjectStatus;
  cover_image_url: string | null;
  gallery: string[];
  sort_order: number;
  published: boolean;
  qcdd_year: string | null;
  project_details: ProjectDetails;
  client_id: string | null;
};

export const PROJECT_SELECT =
  "id, slug, title_en, title_ar, location_en, location_ar, scope_en, scope_ar, project_status, cover_image_url, gallery, sort_order, published, qcdd_year, project_details, client_id, created_at, updated_at";
