import {
  CLIENT_STATUSES,
  type ClientStatus,
  type ClientWritePayload,
} from "@/lib/admin/clients/types";

export type ClientFormState = {
  error: string | null;
  success: string | null;
  id: string | null;
};

export const emptyClientFormState: ClientFormState = {
  error: null,
  success: null,
  id: null,
};

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function isClientStatus(value: string): value is ClientStatus {
  return (CLIENT_STATUSES as readonly string[]).includes(value);
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isUsableWebsiteUrl(value: string) {
  if (value.startsWith("/")) {
    return false;
  }

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isUsableLogoUrl(value: string) {
  if (value.startsWith("/")) {
    return true;
  }

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function normalizeWebsiteUrl(value: string) {
  if (!value) {
    return { ok: true as const, value: null };
  }

  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  if (!isUsableWebsiteUrl(withProtocol)) {
    return {
      ok: false as const,
      error: "Website must be a valid http or https URL.",
    };
  }

  return { ok: true as const, value: withProtocol };
}

export function parseClientForm(formData: FormData):
  | { ok: true; payload: ClientWritePayload }
  | { ok: false; error: string } {
  const name = readString(formData, "name");
  const websiteRaw = readString(formData, "website_url");
  const logo = readString(formData, "logo_url");
  const contactPerson = readString(formData, "contact_person");
  const email = readString(formData, "email");
  const phone = readString(formData, "phone");
  const statusRaw = readString(formData, "status") || "active";
  const sortRaw = readString(formData, "sort_order");
  const notes = readString(formData, "notes");
  const published = formData.get("published") === "on";

  if (!name) {
    return { ok: false, error: "Company name is required." };
  }

  if (email && !isValidEmail(email)) {
    return { ok: false, error: "Enter a valid email address." };
  }

  const website = normalizeWebsiteUrl(websiteRaw);
  if (!website.ok) {
    return { ok: false, error: website.error };
  }

  if (logo && !isUsableLogoUrl(logo)) {
    return { ok: false, error: "Logo must be a valid URL or site path." };
  }

  if (!isClientStatus(statusRaw)) {
    return { ok: false, error: "Select a valid client status." };
  }

  const sortOrder = sortRaw === "" ? 0 : Number(sortRaw);
  if (!Number.isInteger(sortOrder)) {
    return { ok: false, error: "Display order must be a whole number." };
  }

  return {
    ok: true,
    payload: {
      name,
      logo_url: logo || null,
      website_url: website.value,
      sort_order: sortOrder,
      published,
      contact_person: contactPerson || null,
      email: email || null,
      phone: phone || null,
      status: statusRaw,
      notes: notes || null,
    },
  };
}

export function formatClientError(message: string | undefined) {
  const text = (message ?? "").toLowerCase();

  if (text.includes("row-level security") || text.includes("permission")) {
    return "You do not have permission to change clients.";
  }

  if (text.includes("column") && text.includes("does not exist")) {
    return "The clients table is missing an expected field. No database changes were made from the app.";
  }

  return "Unable to save this client. Please try again.";
}

export function formatClientDeleteError(message: string | undefined) {
  const text = (message ?? "").toLowerCase();

  if (text.includes("row-level security") || text.includes("permission")) {
    return "You do not have permission to delete clients.";
  }

  if (
    text.includes("foreign key") ||
    text.includes("violates") ||
    text.includes("still referenced")
  ) {
    return "This client is linked to projects and cannot be deleted.";
  }

  if (text.includes("column") && text.includes("does not exist")) {
    return "The clients table is missing an expected field. No database changes were made from the app.";
  }

  return "Unable to delete this client. Please try again.";
}
