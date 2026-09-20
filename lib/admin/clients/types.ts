export const CLIENT_STATUSES = ["active", "inactive"] as const;

export type ClientStatus = (typeof CLIENT_STATUSES)[number];

export type AdminClient = {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  sort_order: number;
  published: boolean;
  created_at: string | null;
  updated_at: string | null;
  contact_person: string | null;
  email: string | null;
  phone: string | null;
  status: ClientStatus;
  notes: string | null;
  project_count: number;
};

export type ClientWritePayload = {
  name: string;
  logo_url: string | null;
  website_url: string | null;
  sort_order: number;
  published: boolean;
  contact_person: string | null;
  email: string | null;
  phone: string | null;
  status: ClientStatus;
  notes: string | null;
};

export type ClientLinkedProject = {
  id: string;
  title_en: string;
  project_status: "ongoing" | "completed";
  published: boolean;
};

export const CLIENT_SELECT =
  "id, name, logo_url, website_url, sort_order, published, created_at, updated_at, contact_person, email, phone, status, notes";

export const CLIENT_LINKED_PROJECT_SELECT =
  "id, title_en, project_status, published";
